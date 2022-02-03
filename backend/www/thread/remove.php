<?php
    include_once __DIR__ . "/../utils/auth.php";
    include_once __DIR__ . "/../utils/threads.php";
    checkRank($me, 3);

    $request = json_decode(file_get_contents('php://input'), true);

    $th_id = intval($request['thread_id']);
    if((empty($th_id) && $th_id !== 0)) {
        http_response_code(400);
        echo '{}';
        return;
    }

    $category_id = Threads::get_thread_category($th_id);
    if($category_id == -999) {
        http_response_code(400);
        echo '{}';
        return;
    }

    checkRank($me, Threads::get_category($category_id)['rank']);

    $q = mysqli_query($link, "DELETE FROM Threads WHERE id=" . mysqli_real_escape_string($link, $th_id));
    if(!$q) {
        http_response_code(500);
        echo '{}';
        return;
    }

    $q = mysqli_query($link, "DELETE FROM Messages WHERE thread_id=" . mysqli_real_escape_string($link, $th_id));
    if(!$q) {
        http_response_code(500);
        echo '{}';
        return;
    }

    $q = mysqli_query($link, "SELECT id FROM Attachments WHERE thread_id=" . mysqli_real_escape_string($link, $th_id));
    if(!$q) {
        http_response_code(500);
        echo '{}';
        return;
    }

    while($r = mysqli_fetch_assoc($q)) {
        unlink('/var/www/data/uploaded/' . basename($r['id']));
    }

    $q = mysqli_query($link, "DELETE FROM Attachments WHERE thread_id=" . mysqli_real_escape_string($link, $th_id));
    if(!$q) {
        http_response_code(500);
        echo '{}';
        return;
    }

    echo '{}';