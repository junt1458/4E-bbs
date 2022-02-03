<?php
    session_start();
    include_once __DIR__ . '/../../utils/user.php';

    if(empty($_GET['mode']) || empty($_GET['code'])) {
        header('Location: ' . $_ENV['APP_BASE_URI'] . '/callback');
        return;
    }

    $_SESSION['err'] = NULL;
    $baseURL = 'https://accounts.google.com/o/oauth2/token';
    $params = array(
        'code'          => $_GET['code'],
        'client_id'     => $_ENV['OAUTH2_GOOGLE_ID'],
        'client_secret' => $_ENV['OAUTH2_GOOGLE_SECRET'],
        'redirect_uri'  => $_ENV['SERVER_BASE_URI'] . '/auth/callback/google?mode=' . $_GET['mode'],
        'grant_type'    => 'authorization_code'
    );
    $headers = array(
        'Content-Type: application/x-www-form-urlencoded',
    );

    $options = array('http' => array(
        'method' => 'POST',
        'content' => http_build_query($params),
        'header' => implode("\r\n", $headers),
    ));

    $response = json_decode(
            file_get_contents($baseURL, false, stream_context_create($options)));

    if(!$response || isset($response->error)){
        $_SESSION['err'] = 1;
        header('Location: ' . $_ENV['APP_BASE_URI'] . '/callback');
        return;
    }

    $token = $response->access_token;
    $userInfo = json_decode(
        file_get_contents('https://www.googleapis.com/oauth2/v1/userinfo?'.
        'access_token=' . $token),
        true
    );

    if (empty($userInfo)) {
        $_SESSION['err'] = 1;
        header('Location: ' . $_ENV['APP_BASE_URI'] . '/callback');
        return;
    }

    if($_GET['mode'] !== "login" && $_GET['mode'] !== "register") {
        $_SESSION['err'] = 1;
        header('Location: ' . $_ENV['APP_BASE_URI'] . '/callback');
        return;
    }

    $id = $userInfo["id"];
    if($_GET['mode'] == "register") {
        $name = $userInfo["name"];
        $pic_url = $userInfo["picture"];
        // 登録
        User::registerWithProvider($id, "Google", $pic_url, $name);
    }

    $res = User::authenticateWithProvider($id, "Google");
    $_SESSION['access'] = $res["access_token"];
    $_SESSION['refresh'] = $res["refresh_token"];
    if($_SESSION['access'] == NULL)
        $_SESSION['err'] = 2;

    header('Location: ' . $_ENV['APP_BASE_URI'] . '/callback');