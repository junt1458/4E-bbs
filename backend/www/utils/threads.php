<?php
    include_once __DIR__ . "/user.php";

    class Threads {
        static function get_last_post($category_id = -1) {
            $link = DB::connect();
            $q = mysqli_query($link, "SELECT thread_id, user_id, created_at FROM Messages WHERE category_id=" . mysqli_real_escape_string($link, $category_id) . " ORDER BY created_at DESC");
            if(!$q) {
                return NULL;
            }
            $r = mysqli_fetch_assoc($q);
            if(!$r) {
                return NULL;
            }

            $th_id = intval($r['thread_id']);
            $usr_id = $r['user_id'];
            
            $q2 = mysqli_query($link, "SELECT name FROM Threads WHERE id=" . mysqli_real_escape_string($link, $th_id));
            if(!$q2) {
                return NULL;
            }
            $r2 = mysqli_fetch_assoc($q2);
            if(!$r2) {
                return NULL;
            }

            $usr = User::getUserInfo($usr_id);
            if($usr == NULL) {
                return NULL;
            }

            return array(
                "title"=>$r2['name'],
                "user_name"=>$usr['name'],
                "id"=>$th_id,
                "date"=>date("Y/m/d G:i", strtotime($r['created_at']))
            );
        }

        static function get_thread_last_post($thread_id) {
            $link = DB::connect();
            $q = mysqli_query($link, "SELECT thread_id, user_id, created_at FROM Messages WHERE thread_id=" . mysqli_real_escape_string($link, $thread_id) . " ORDER BY created_at DESC");
            if(!$q) {
                return NULL;
            }
            $r = mysqli_fetch_assoc($q);
            if(!$r) {
                return NULL;
            }

            $th_id = intval($r['thread_id']);
            $usr_id = $r['user_id'];
            
            $q2 = mysqli_query($link, "SELECT name FROM Threads WHERE id=" . mysqli_real_escape_string($link, $th_id));
            if(!$q2) {
                return NULL;
            }
            $r2 = mysqli_fetch_assoc($q2);
            if(!$r2) {
                return NULL;
            }

            $usr = User::getUserInfo($usr_id);
            if($usr == NULL) {
                return NULL;
            }

            return array(
                "title"=>$r2['name'],
                "user_name"=>$usr['name'],
                "id"=>$th_id,
                "date"=>date("Y/m/d G:i", strtotime($r['created_at']))
            );
        }

        static function get_thread_count($category_id = -1) {
            $link = DB::connect();
            $q = mysqli_query($link, 'SELECT COUNT(id) as cnt FROM Threads WHERE category_id=' . mysqli_real_escape_string($link, $category_id));
            if(!$q) {
                return NULL;
            }
            $r = mysqli_fetch_assoc($q);
            return intval($r['cnt']);
        }

        static function get_category($category_id = -1) {
            if($category_id == -1) {
                return [
                    "id"=>-1,
                    "title"=>"(未分類)",
                    "description"=>"カテゴリ未設定のスレッドです。",
                    "rank"=>1
                ];
            }

            $link = DB::connect();
            $q = mysqli_query($link, 'SELECT * FROM Categories WHERE id=' . mysqli_real_escape_string($link, $category_id));
            if(!$q) {
                return NULL;
            }
        
            while($row = mysqli_fetch_assoc($q)) {
                return [
                    "id"=>intval($row['id']),
                    "title"=>$row['name'],
                    "description"=>$row['description'],
                    "rank"=>intval($row['view_rank'])
                ];
            }
            
            return [
                "id"=>-999,
                "title"=>NULL,
                "description"=>NULL,
                "rank"=>-1
            ];
        }

        static function get_thread_category($thread_id) {
            $link = DB::connect();
            $q = mysqli_query($link, 'SELECT category_id FROM Threads WHERE id=' . mysqli_real_escape_string($link, $thread_id));
            if(!$q) {
                return NULL;
            }
            $r = mysqli_fetch_assoc($q);
            if(!$r) {
                return -999;
            }
            return intval($r['category_id']);
        }
    }