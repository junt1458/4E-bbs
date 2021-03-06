<?php
    include_once __DIR__ . "/../utils/auth.php";
    checkRank($me, 4);

    $request = json_decode(file_get_contents('php://input'), true);
    $id = intval($request['id']);
    if(empty($id) && $id !== 0) {
        http_response_code(400);
        echo '{}';
        return;
    }

    $q = mysqli_query($link, 'DELETE FROM Categories WHERE id=' . mysqli_real_escape_string($link, $id));
    if(!$q) {
        http_response_code(500);
        echo '{}';
        return;
    }
    
    // カテゴリの付け替え
    $q = mysqli_query($link, "UPDATE Threads SET category_id=-1 WHERE category_id=" . mysqli_real_escape_string($link, $id) . ";");
    if(!$q) {
        http_response_code(500);
        echo '{}';
        return;
    }
    
    $q = mysqli_query($link, "UPDATE Attachments SET category_id=-1 WHERE category_id=" . mysqli_real_escape_string($link, $id) . ";");
    if(!$q) {
        http_response_code(500);
        echo '{}';
        return;
    }

    $q = mysqli_query($link, "UPDATE Messages SET category_id=-1 WHERE category_id=" . mysqli_real_escape_string($link, $id) . ";");
    if(!$q) {
        http_response_code(500);
        echo '{}';
        return;
    }

    echo '{}';