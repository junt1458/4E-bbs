<?php
    // DBに接続
    include __DIR__ . "/db.php";

    // 整列順の取得
    $ord = "ASC";
    if(isset($_GET['order']) && !empty($_GET['order'])) {
        if($_GET['order'] == "desc") {
            $ord = "DESC";
        }
    }

    // DBから取得
    $res = mysqli_query($link, "SELECT id, name, content, created_at, updated_at FROM Posts ORDER BY id " . $ord . ";");

    if(!$res) {
        $error = "データを取得できませんでした。<br>" . mysqli_error($link);
    } else {
        $posts = [];
        while($row = mysqli_fetch_assoc($res)) {
            // 名前 (XSS対策もする)
            $deleted = false;
            if($row["name"] == NULL) {
                $deleted = true;
                $row["name"] = "(削除済み)";
            }
            $name = htmlspecialchars($row["name"]);

            // 投稿日時 (更新がある場合はその日付も併せて表示する。)
            $time_post = DateTime::createFromFormat('Y-m-d H:i:s', $row["created_at"])->format('Y/m/d H:i:s');
            if($row["created_at"] !== $row["updated_at"]) {
                $upd = DateTime::createFromFormat('Y-m-d H:i:s', $row["updated_at"])->format('Y/m/d H:i:s');
                $time_post = $time_post . " (" . $upd . " 更新)";
            }

            // 本文 (レスのリンク追加/XSS対策もする)
            if($row["content"] == NULL) {
                $deleted = true;
                $row["content"] = "(この投稿は削除されました。)";
            }
            $content = htmlspecialchars($row["content"]);
            $content = preg_replace('/' . htmlspecialchars('>>') . '(\d+)/', '<a href="#$1">' . htmlspecialchars('>>') . '$1</a>', $content);

            array_push($posts, [
                "id" => $row["id"],
                "name" => $name,
                "time" => $time_post,
                "content" => $content,
                "deleted" => $deleted
            ]);
        }
    }