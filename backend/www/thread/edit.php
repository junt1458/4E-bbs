<?php
    include_once __DIR__ . "/../utils/auth.php";
    include_once __DIR__ . "/../utils/threads.php";

    function edit($link, $id, $content) {
        $q = mysqli_query($link, "UPDATE Messages SET content='" . mysqli_real_escape_string($link, $content) . "' WHERE id=" . mysqli_real_escape_string($link, $id));
        if(!$q) {
            return false;
        }
        return true;
    }

    checkRank($me, 1);

    $request = json_decode(file_get_contents('php://input'), true);

    $post_id = intval($request['id']);
    $content = $request['content'];
    if((empty($post_id) && $post_id !== 0) || (empty($content) && $content !== 0)) {
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
        if(!edit($link, $post_id, $content)) {
            http_response_code(500);
        }
        echo '{}';
        return;
    }

    checkRank($me, 3);
    checkRank($me, Threads::get_category(intval($category_id))['rank']);

    if(!edit($link, $post_id, $content . PHP_EOL . PHP_EOL . "<" . date("Y/m/d G:i:s", time()) . " にモデレーターがこの投稿を編集しました。>")) {
        http_response_code(500);
    }
    echo '{}';