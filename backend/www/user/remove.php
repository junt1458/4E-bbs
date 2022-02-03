<?php
    include_once __DIR__ . "/../utils/auth.php";
    checkRank($me, 4);

    $request = json_decode(file_get_contents('php://input'), true);
    $id = $request['id'];
    $rank = intval($request['rank']);
    if((empty($id) && $id !== 0) || (empty($rank) && $rank !== 0)) {
        http_response_code(400);
        echo '{}';
        return;
    }

    if($request['id'] == $me['id']) {
        http_response_code(403);
        echo '{}';
        return;
    }

    $user = User::getUserInfo($id, false);
    if($user == NULL) {
        http_response_code(404);
        echo '{}';
        return;
    }

    $q1 = mysqli_query($link, "UPDATE Profiles SET name='(削除済みユーザー)', bio='(削除済みユーザー)' WHERE id='" . mysqli_real_escape_string($link, $id) . "';");
    if(!$q1) {
        http_response_code(500);
        echo '{}';
        return;
    }

    $q2 = mysqli_query($link, "UPDATE Users SET auth_provider='deleted', pass_hash=NULL, user_id='" . mysqli_real_escape_string($link, User::makeRandStr(40)) . "' WHERE id='" . mysqli_real_escape_string($link, $id) . "';");
    if(!$q2) {
        http_response_code(500);
        echo '{}';
        return;
    }

    unlink('/var/www/data/icons/' . basename($id));

    echo '{}';