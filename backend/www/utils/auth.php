<?php
    include_once __DIR__ . '/user.php';
    header('Content-Type: application/json;charset=utf-8');
    $me = NULL;

    $token = empty($_SERVER['HTTP_X_ACCESS_TOKEN']) ? "" : $_SERVER['HTTP_X_ACCESS_TOKEN'];
    if(User::checkAccessToken($token)) {
        $me = User::getUserInfo(User::getUser($token), true);
    }

    function checkRank($me, $value = 0) {
        if($value === 0)
            return;

        if($me == NULL) {
            http_response_code(401);
            echo '{}';
            exit;
        }

        if(intval($me["rank"]) < $value) {
            http_response_code(403);
            echo '{}';
            exit;
        }
    }
?>