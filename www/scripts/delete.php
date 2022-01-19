<?php
    include_once __DIR__ . "/utils.php";

    // 各種リクエストパラメータのチェック
    if(!Utils::checkRequest($_POST, ["postid", "token", "delete"])) {
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

            // 投稿の情報を取得
            $id = mysqli_real_escape_string($link, $_POST['postid']);
            $res = mysqli_query($link, "SELECT id, delete_key FROM Posts WHERE id=" . $id . ";");

            if(!$res) {
                $error = "データを取得できませんでした。<br>" . mysqli_error($link);
            } else {
                $row = mysqli_fetch_assoc($res);
                if(!$row) {
                    $error = "投稿が見つかりませんでした。";
                } else {
                    if(password_verify($_POST['delete'], $row["delete_key"])) {
                        // データの削除
                        $r = mysqli_query($link, "UPDATE Posts SET name=NULL, content=NULL WHERE id=" . $id);
                        if(!$r) {
                            $error = "削除中にエラーが発生しました。<br>" . mysqli_error($link);
                        }
                    } else {
                        $error = "削除キーが異なります。";
                    }
                }
            }
        }
    }