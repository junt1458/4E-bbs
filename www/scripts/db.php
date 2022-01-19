<?php
    // このファイルを読み込むとデータベースに接続された状態になる。
    $link = mysqli_connect(
        "db:3306",                      // ホスト名:ポート
        $_ENV['MYSQL_USER'],            // ユーザー名 (環境変数)
        $_ENV["MYSQL_PASSWORD"],        // パスワード (環境変数)
        "bbs"                           // データベース名
    );

    if(!$link) {
        die('Could not connect to database.');
    }