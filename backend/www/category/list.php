<?php
    include_once __DIR__ . "/../utils/auth.php";
    include_once __DIR__ . "/../utils/threads.php";
    checkRank($me, 1);

    $categories = [];
    $q = mysqli_query($link, 'SELECT * FROM Categories WHERE view_rank <= ' . mysqli_real_escape_string($link, $me['rank']));
    if(!$q) {
        http_response_code(500);
        echo '{}';
        return;
    }

    while($row = mysqli_fetch_assoc($q)) {
        array_push($categories, [
            "id"=>intval($row['id']),
            "title"=>$row['name'],
            "last_post"=>Threads::get_last_post(intval($row['id'])),
            "threads"=>Threads::get_thread_count(intval($row['id'])),
            "description"=>$row['description'],
            "rank"=>intval($row['view_rank'])
        ]);
    }

    // カテゴリ未設定
    array_push($categories, [
        "id"=>-1,
        "title"=>"(未分類)",
        "last_post"=>Threads::get_last_post(),
        "threads"=>Threads::get_thread_count(),
        "description"=>"カテゴリ未設定のスレッドです。",
        "rank"=>1
    ]);

    echo json_encode($categories);