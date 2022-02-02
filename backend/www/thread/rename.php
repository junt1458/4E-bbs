<?php
    include_once __DIR__ . "/../utils/auth.php";
    include_once __DIR__ . "/../utils/threads.php";
    checkRank($me, 3);

    $request = json_decode(file_get_contents('php://input'), true);

    $th_id = intval($request['thread_id']);
    $new_name = $request['name'];
    if((empty($th_id) && $th_id !== 0) || (empty($new_name) && $new_name !== 0)) {
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
    $q = mysqli_query($link, "UPDATE Threads SET name='" . mysqli_real_escape_string($link, $new_name) . "' WHERE id=" . mysqli_real_escape_string($link, $th_id));
    if(!$q) {
        http_response_code(500);
        echo '{}';
        return;
    }

    echo '{}';