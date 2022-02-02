<?php
    include_once __DIR__ . "/../utils/auth.php";
    include_once __DIR__ . "/../utils/threads.php";
    checkRank($me, 1);

    $request = json_decode(file_get_contents('php://input'), true);
    
    $name = $request['name'];
    $cat_id = intval($request['category_id']);
    if((empty($name) && $name !== 0) || (empty($cat_id) && $cat_id !== 0)) {
        http_response_code(400);
        echo '{}';
        return;
    }

    $category = Threads::get_category($cat_id);
    if($category['rank'] == -1) {
        http_response_code(400);
        echo '{}';
        return;
    }

    checkRank($me, $category['rank']);

    $q = mysqli_query($link, "INSERT INTO Threads (category_id, name) VALUES (" . mysqli_real_escape_string($link, $cat_id) . ", '" . mysqli_real_escape_string($link, $name) . "');");
    if(!$q) {
        http_response_code(500);
        echo '{}';
        return;
    }

    echo json_encode(array(
        "thread_id"=>mysqli_insert_id($link)
    ));