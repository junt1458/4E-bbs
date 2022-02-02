<?php
    include_once __DIR__ . "/../utils/auth.php";
    include_once __DIR__ . "/../utils/threads.php";
    checkRank($me, 1);

    if((empty($_GET['id']) && $_GET['id'] !== 0)) {
        http_response_code(400);
        echo '{}';
        return;
    }
    $cat_id = intval($_GET['id']);

    $category = Threads::get_category($cat_id);
    if($category['rank'] == -1) {
        http_response_code(404);
        echo '{}';
        return;
    }

    $q = mysqli_query($link, "SELECT * FROM Threads WHERE category_id=" . mysqli_real_escape_string($link, $cat_id) . ";");
    if(!$q) {
        http_response_code(500);
        echo '{}';
        return;
    }

    $threads = [];
    while($r = mysqli_fetch_assoc($q)) {
        array_push($threads, [
            "id"=>intval($r['id']),
            "name"=>$r['name'],
            "last_post"=>Threads::get_thread_last_post(intval($r['id']))
        ]);
    }

    echo json_encode(array(
        "threads"=>$threads,
        "category"=>$category
    ));