<?php
    include_once __DIR__ . "/db.php";
    class User {
        static function makeRandStr($length) {
            $str = array_merge(range('a', 'z'), range('0', '9'), range('A', 'Z'));
            $r_str = null;
            for ($i = 0; $i < $length; $i++) {
                $r_str .= $str[rand(0, count($str) - 1)];
            }
            return $r_str;
        }

        static function b64_encode($value) {
            $v = base64_encode($value);
            return str_replace(array('+', '/', '='), array('_', '-', ''), $v);
        }

        static function sign($b64header, $b64payload) {
            $key = openssl_pkey_get_private(base64_decode($_ENV['JWT_PRIVATE_KEY']));
            $raw_token = $b64header . "." . $b64payload;

            $signature = "";
            openssl_sign($raw_token, $signature, $key, OPENSSL_ALGO_SHA256);

            return User::b64_encode($signature);
        }

        static function hasValidSignature($jwt) {
            $jwt_data = explode(".", $jwt);
            if (count($jwt_data) != 3) return false;

            $header_b64 = $jwt_data[0];
            $payload_b64 = $jwt_data[1];
            $signature = $jwt_data[2];

            $header = json_decode(base64_decode($header_b64));

            if ($header == null) return false;
            if ($header->{"alg"} !== "RS256") return false;
    
            return ($signature === User::sign($header_b64, $payload_b64));
        }

        static function generateID() {
            $id = NULL;
            do {
                $id = User::makeRandStr(18);
            } while(User::getUserInfo($id) != NULL);
            return $id;
        }
        
        static function generateToken($id, $type) {
            $header = [
                "alg"=>"RS256",
                "type"=>"JWT"
            ];

            // アクセストークン($type = access)の有効期限は15分
            // リフレッシュトークン($type = refresh)の有効期限は7日間
            // TODO: 直す
            $cur = time();
            $exp = $cur + (($type === "refresh") ? (7 * 24 * 60 * 60) : (70 * 15 * 60));

            $payload = [
                "id"=>User::makeRandStr(30),
                "iat"=>$cur,
                "exp"=>$exp,
                "type"=>$type,
                "user"=>$id
            ];

            $header_b64 = User::b64_encode(json_encode($header));
            $payload_b64 = User::b64_encode(json_encode($payload));
            $signature = User::sign($header_b64, $payload_b64);
            
            return $header_b64 . "." . $payload_b64 . "." . $signature;
        }

        static function getUser($token) {
            $jwt_data = explode(".", $token);
            if (count($jwt_data) != 3) return false;

            $payload = json_decode(base64_decode($jwt_data[1]), true);

            return $payload['user'];
        }

        static function checkAccessToken($token) {
            if(!User::hasValidSignature($token)) return false;

            $jwt_data = explode(".", $token);
            $payload = json_decode(base64_decode($jwt_data[1]), true);
            if($payload['type'] !== "access") return false;
            $exp = intval($payload['exp']);
            if($exp < time()) return false;

            $link = DB::connect();
            $q = mysqli_query($link, "SELECT count(token_id) as cnt FROM RevokedTokens WHERE token_type='access' and token_id='" . mysqli_real_escape_string($link, $payload['id']) . "';");
            if(!$q) return false;

            $row1 = mysqli_fetch_assoc($q);
            return intval($row1['cnt']) <= 0;
        }

        static function checkRefreshToken($token) {
            if(!User::hasValidSignature($token)) return false;

            $jwt_data = explode(".", $token);
            $payload = json_decode(base64_decode($jwt_data[1]), true);
            if($payload['type'] !== "refresh") return false;
            $exp = intval($payload['exp']);
            if($exp < time()) return false;

            $link = DB::connect();
            $q = mysqli_query($link, "SELECT count(token_id) as cnt FROM RevokedTokens WHERE token_type='refresh' and token_id='" . mysqli_real_escape_string($link, $payload['id']) . "';");
            if(!$q) return false;

            $row1 = mysqli_fetch_assoc($q);
            return intval($row1['cnt']) <= 0;
        }

        static function isUserExists($id) {
            $link = DB::connect();
            $q = mysqli_query($link, "SELECT count(user_id) as cnt FROM Users WHERE user_id='" . mysqli_real_escape_string($link, $id) . "';");
            if(!$q) return true;

            $r = mysqli_fetch_assoc($q);
            return intval($r['cnt']) > 0;
        }

        static function getUserInfo($id, $no_deleted = false) {
            $link = DB::connect();
            $q = mysqli_query($link, "SELECT Users.id, Users.auth_provider, Profiles.name, Profiles.bio, Profiles.user_rank FROM Users, Profiles WHERE Users.id = Profiles.id AND Users.id='" . mysqli_real_escape_string($link, $id) . "';");
            if(!$q) return NULL;

            $row = mysqli_fetch_assoc($q);
            if(!$row) {
                return NULL;
            }

            if($no_deleted && $row['auth_provider'] == 'deleted') {
                return NULL;
            }

            return array(
                "id"=>$id,
                "name"=>$row["name"],
                "bio"=>$row["bio"],
                "rank"=>intval($row["user_rank"])
            );
        }
        
        static function createUser($id, $pass, $name, $rank) {
            $link = DB::connect();
            $uid = User::generateID();
            $hash = password_hash($pass, PASSWORD_BCRYPT, [ 'cost'=>12 ]);
            $q = mysqli_query($link, "INSERT INTO Users (id, user_id, pass_hash, auth_provider) VALUES ('" . mysqli_real_escape_string($link, $uid) . "', '" . mysqli_real_escape_string($link, $id) . "', '" . mysqli_real_escape_string($link, $hash) . "', 'local')");
            if(!$q) return NULL;
            $q = mysqli_query($link, "INSERT INTO Profiles (id, name, bio, user_rank) VALUES ('" . mysqli_real_escape_string($link, $uid) . "', '" . mysqli_real_escape_string($link, $name) . "', '', " . mysqli_real_escape_string($link, $rank) . ")");
            if(!$q) return NULL;
            return $id;
        }

        // Authenticate with password
        //   Returns: AccessToken and RefreshToken
        static function authenticateWithPassword($id, $pass) {
            $link = DB::connect();
            $q1 = mysqli_query($link, "SELECT id, pass_hash FROM Users WHERE auth_provider='local' and user_id='" . mysqli_real_escape_string($link, $id) . "'");
            if(!$q1) return NULL;
            $row1 = mysqli_fetch_assoc($q1);
            if(!$row1) return NULL;
            if(!password_verify($pass, $row1['pass_hash'])) return NULL;
            
            $access = User::generateToken($row1['id'], 'access');
            $refresh = User::generateToken($row1['id'], 'refresh');

            return array(
                "access_token"=>$access,
                "refresh_token"=>$refresh
            );
        }

        // (Re)authenticate with refresh token
        static function authenticateWithRefreshToken($token) {
            if(!User::checkRefreshToken($token)) return NULL;

            $user = User::getUser($token);
            return User::generateToken($user, 'access');
        }

        static function authenticateWithProvider($id, $provider) {
            $id_ = $id . "_" . $provider;
            $link = DB::connect();
            $q1 = mysqli_query($link, "SELECT id FROM Users WHERE auth_provider='" . mysqli_real_escape_string($link, $provider) . "' and user_id='" . mysqli_real_escape_string($link, $id_) . "'");
            if(!$q1) return NULL;
            $row1 = mysqli_fetch_assoc($q1);
            if(!$row1) return NULL;
            
            $access = User::generateToken($row1['id'], 'access');
            $refresh = User::generateToken($row1['id'], 'refresh');

            return array(
                "access_token"=>$access,
                "refresh_token"=>$refresh
            );
        }

        static function registerWithProvider($id, $provider, $picture_url, $name) {
            $link = DB::connect();
            $q = mysqli_query($link, "SELECT setting_value FROM Settings WHERE setting_key='register';");
            if(!$q) {
                http_response_code(500);
                echo "{}";
                return;
            }
            $r = mysqli_fetch_assoc($q);
            if(!$r) {
                http_response_code(500);
                echo "{}";
                return;
            }
            $register_available = $r['setting_value'] == "1";
            if(!$register_available)
                return;

            $id_ = $id . "_" . $provider;
            $q = mysqli_query($link, "SELECT * FROM Users WHERE user_id='" . mysqli_real_escape_string($link, $id_) . "' AND auth_provider='" . mysqli_real_escape_string($link, $provider) . "';");
            if(!$q) {
                http_response_code(500);
                echo "{}";
                return;
            }
            $r = mysqli_fetch_assoc($q);
            if(!$r) {
                $uid = User::generateID();
                $q = mysqli_query($link, "INSERT INTO Users (id, user_id, pass_hash, auth_provider) VALUES ('" . mysqli_real_escape_string($link, $uid) . "', '" . mysqli_real_escape_string($link, $id_) . "', NULL, '" . mysqli_real_escape_string($link, $provider) . "')");
                if(!$q) return;
                $q = mysqli_query($link, "INSERT INTO Profiles (id, name, bio, user_rank) VALUES ('" . mysqli_real_escape_string($link, $uid) . "', '" . mysqli_real_escape_string($link, $name) . "', '', 1)");
                if(!$q) return;
    
                file_put_contents('/var/www/data/icons/' . basename($uid), file_get_contents($picture_url));
            }
        }

        // Dispose token
        static function disposeToken($token, $type) {
            if($type == "access" && !User::checkAccessToken($token)) return false;
            else if($type == "refresh" && !User::checkRefreshToken($token)) return false;
            else if($type != "access" && $type != "refresh") return false;

            $jwt_data = explode(".", $token);
            $payload = json_decode(base64_decode($jwt_data[1]), true);

            $link = DB::connect();
            $q = mysqli_query($link, "INSERT INTO RevokedTokens (token_id, default_expires, token_type) VALUES ('" . mysqli_real_escape_string($link, $payload["id"]) . "', FROM_UNIXTIME(" . mysqli_real_escape_string($link, $payload["exp"]) . "), '" . mysqli_real_escape_string($link, $payload["type"]) . "');");
            if(!$q) return false;

            return true;
        }
    }
?>