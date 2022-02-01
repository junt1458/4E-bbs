<?php
    include_once __DIR__ . "/../utils/user.php";

    // Authenticate with ID and Password
    $request = json_decode(file_get_contents('php://input'), true);
    
    $id = $request['id'];
    $pass = $request['pass'];
    if((empty($id) && $id !== 0) || (empty($pass) && $pass !== 0)) {
        http_response_code(400);
        echo json_encode(array(
            "access_token"=>NULL,
            "refresh_token"=>NULL
        ));
        return;
    }

    $tokens = User::authenticateWithPassword($id, $pass);
    if($tokens === NULL) {
        http_response_code(401);
        echo json_encode(array(
            "access_token"=>NULL,
            "refresh_token"=>NULL
        ));
        return;
    }

    echo json_encode($tokens);