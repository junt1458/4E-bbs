<?php
    include_once __DIR__ . "/../utils/auth.php";
    include_once __DIR__ . "/../utils/threads.php";

    checkRank($me, 1);

    $request = json_decode(file_get_contents('php://input'), true);

    $th_id = intval($request['id']);
    $category_id_n = intval($request['category']);
    if((empty($th_id) && $th_id !== 0) || (empty($category_id_n) && $category_id_n !== 0)) {
        http_response_code(400);
        echo '{}';
        return;
    }

    $category_id_o = Threads::get_thread_category($th_id);
    if($category_id_o == -999) {
        http_response_code(404);
        echo '{}';
        return;
    }

    $category_o = Threads::get_category($category_id_o);
    if($category_o['rank'] == -1) {
        http_response_code(400);
        echo '{}';
        return;
    }

    $category_n = Threads::get_category($category_id_n);
    if($category_n['rank'] == -1) {
        http_response_code(400);
        echo '{}';
        return;
    }

    checkRank($me, $category_o['rank']);
    checkRank($me, $category_n['rank']);
    
    $q = mysqli_query($link, "UPDATE Attachments SET category_id=" . mysqli_real_escape_string($link, $category_id_n) . " WHERE thread_id=" . mysqli_real_escape_string($link, $th_id));
    if(!$q) {
        http_response_code(500);
        echo '{}';
        return;
    }

    $q = mysqli_query($link, "UPDATE Messages SET category_id=" . mysqli_real_escape_string($link, $category_id_n) . " WHERE thread_id=" . mysqli_real_escape_string($link, $th_id));
    if(!$q) {
        http_response_code(500);
        echo '{}';
        return;
    }

    $q = mysqli_query($link, "UPDATE Threads SET category_id=" . mysqli_real_escape_string($link, $category_id_n) . " WHERE id=" . mysqli_real_escape_string($link, $th_id));
    if(!$q) {
        http_response_code(500);
        echo '{}';
        return;
    }
    
    echo '{}';