<?php
    include_once __DIR__ . "/utils.php";
    
    // 各種リクエストパラメータのチェック
    if(!Utils::checkRequest($_POST, ["name", "edit", "delete", "content", "token"])) {
        $error = "未入力項目があります。";
    } else {
        // DBに接続
        include __DIR__ . "/db.php";

        // CSRF対策用トークンの確認
        if($_POST['token'] !== $_SESSION['CSRF_TOKEN']) {
            $error = "セッション情報が不正です。";
        } else {
            // 一回使用したトークンは破棄する
            $_SESSION["CSRF_TOKEN"] = "";

            // データベースに挿入するようにエスケープ処理
            $name = mysqli_real_escape_string($link, $_POST["name"]);
            $delkey = mysqli_real_escape_string($link, password_hash($_POST["delete"], PASSWORD_BCRYPT, [ 'cost' => 12 ]));
            $editkey = mysqli_real_escape_string($link, password_hash($_POST["edit"], PASSWORD_BCRYPT, [ 'cost' => 12 ]));
            $content = mysqli_real_escape_string($link, $_POST["content"]);

            // データベースに挿入
            $res = mysqli_query($link,
                "INSERT INTO Posts (name, delete_key, edit_key, content) VALUES ('" . $name . "', '" . $delkey . "', '" . $editkey . "', '" . $content . "');"
            );

            if(!$res) {
                $error = "データを記録できませんでした。<br>" . mysqli_error($link);
            }
        }
    }