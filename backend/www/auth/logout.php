<?php
    include_once __DIR__ . "/../utils/user.php";

    $request = json_decode(file_get_contents('php://input'), true);

    $refresh = $request['refresh_token'];
    $access = $request['access_token'];

    if(!User::disposeToken($refresh, 'refresh'))
        http_response_code(401);

    if(!User::disposeToken($access, 'access'))
        http_response_code(401);

    echo '{}';