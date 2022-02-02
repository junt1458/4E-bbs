<?php
    include_once __DIR__ . "/../utils/auth.php";
    include_once __DIR__ . "/../utils/threads.php";

    function delete($link, $id) {
        // TODO: Remove attachments.
        $q = mysqli_query($link, "DELETE FROM Messages WHERE id=" . mysqli_real_escape_string($link, $id));
        if(!$q) {
            return false;
        }
        return true;
    }

    checkRank($me, 1);

    $request = json_decode(file_get_contents('php://input'), true);

    $post_id = intval($request['id']);
    if((empty($post_id) && $post_id !== 0)) {
        http_response_code(400);
        echo '{}';
        return;
    }

    $q = mysqli_query($link, "SELECT user_id, category_id FROM Messages WHERE id=" . mysqli_real_escape_string($link, $post_id));
    if(!$q) {
        http_response_code(500);
        echo '{}';
        return;
    }

    $r = mysqli_fetch_assoc($q);
    if(!$r) {
        http_response_code(404);
        echo '{}';
        return;
    }

    if($r['user_id'] === $me['id']) {
        if(!delete($link, $post_id)) {
            http_response_code(500);
        }
        echo '{}';
        return;
    }

    checkRank($me, 3);
    checkRank($me, Threads::get_category(intval($category_id))['rank']);

    if(!delete($link, $post_id)) {
        http_response_code(500);
    }
    echo '{}';