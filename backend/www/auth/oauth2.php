<?php
    include_once __DIR__ . "/../utils/cors.php";
    session_start();

    $provider = $_GET['provider'];
    $mode = $_GET['mode'];

    if(!empty($mode) && $mode == 'token') {
        header('Content-Type: application/json;charset=utf-8');
        echo json_encode(array(
            "error"=>$_SESSION['err'],
            "access_token"=>$_SESSION['access'],
            "refresh_token"=>$_SESSION['refresh']
        ));
        //session_destroy();
        return;
    }

    if(empty($provider) || empty($mode)) {
        http_response_code(400);
        echo '{}';
        return;
    }

    if($mode == 'register' || $mode == 'login') {
        switch($provider) {
            case "Google":
                $querys = array(
                    'client_id' => $_ENV['OAUTH2_GOOGLE_ID'],
                    'redirect_uri' => $_ENV['SERVER_BASE_URI'] . '/auth/callback/google?mode=' . $mode,
                    'scope' => 'https://www.googleapis.com/auth/userinfo.profile',
                    'response_type' => 'code',
                );
    
                header('Location: https://accounts.google.com/o/oauth2/auth?' . http_build_query($querys));
                return;
            default:
                break;
        }
        return;
    }

    http_response_code(400);
    echo '{}';