<?php
    include_once __DIR__ . "/../utils/auth.php";
    include_once __DIR__ . "/../utils/threads.php";
    checkRank($me, 1);

    $request = json_decode(file_get_contents('php://input'), true);

    $th_id = intval($request['id']);
    $content = $request['content'];
    // TODO: File upload logic.
    if((empty($th_id) && $th_id !== 0) || (empty($content) && $content !== 0)) {
        http_response_code(400);
        echo '{}';
        return;
    }

    $category_id = Threads::get_thread_category($th_id);
    if($category_id == -999) {
        http_response_code(404);
        echo '{}';
        return;
    }

    checkRank($me, Threads::get_category($category_id)['rank']);
    $q = mysqli_query($link, "INSERT INTO Messages (category_id, thread_id, content, user_id) VALUES (" . mysqli_real_escape_string($link, $category_id) . ", " . mysqli_real_escape_string($link, $th_id) . ", '" . mysqli_real_escape_string($link, $content) . "', '" . mysqli_real_escape_string($link, $me['id']) . "');");
    if(!$q) {
        http_response_code(500);
        echo '{}';
        return;
    }

    echo '{}';