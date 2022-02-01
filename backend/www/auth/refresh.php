<?php
    include_once __DIR__ . "/../utils/user.php";

    // Authenticate with Refresh Token.
    $token_ = $_SERVER['HTTP_X_REFRESH_TOKEN'];
    if(empty($token_)) {
        http_response_code(400);
        echo json_encode(array(
            "access_token"=>NULL
        ));
        return;
    }

    $token = User::authenticateWithRefreshToken($token_);
    if($token == NULL) {
        http_response_code(401);
    }
    echo json_encode(array(
        "access_token"=>$token
    ));