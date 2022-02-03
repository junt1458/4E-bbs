<?php
    include_once __DIR__ . "/../utils/auth.php";
    checkRank($me, 4);

    $request = json_decode(file_get_contents('php://input'), true);
    $id = intval($request['id']);
    $rank = intval($request['rank']);
    if((empty($id) && $id !== 0) || (empty($rank) && $rank !== 0)) {
        http_response_code(400);
        echo '{}';
        return;
    }

    if($rank <= 0 || $rank >= 5) {
        http_response_code(400);
        echo '{}';
        return;
    }

    $q = mysqli_query($link, "UPDATE Categories SET view_rank=" . mysqli_real_escape_string($link, $rank) . " WHERE id=" . mysqli_real_escape_string($link, $id));
    if(!$q) {
        http_response_code(500);
        echo '{}';
        return;
    }

    echo '{}';