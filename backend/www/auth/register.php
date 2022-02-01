<?php
    include_once __DIR__ . "/../utils/user.php";

    // TODO: 値をいい感じに変えられるようにする
    $register_available = true;

    if ($_SERVER["REQUEST_METHOD"] === "GET") {
        echo json_encode(array(
            "register_open"=>$register_available
        ));
    } else if($_SERVER["REQUEST_METHOD"] == "POST") {
        if(!$register_available) {
            http_response_code(403);
            echo "{}";
            return;
        }
        $request = json_decode(file_get_contents('php://input'), true);
    
        $id = $request['id'];
        $pass = $request['pass'];
        $name = $request['name'];
        
        if((empty($id) && $id !== 0) || (empty($pass) && $pass !== 0) || (empty($name) && $name !== 0)) {
            http_response_code(400);
            echo json_encode(array(
                "error"=>"Not enough arguments."
            ));
            return;
        }
    
        // 0 = Guest
        // 1 = Registered User
        // 2 = Verified User
        // 3 = Site Moderator
        // 4 = Site Administrator
        // 5 = Site Installer
    
        if(User::isUserExists($id)) {
            http_response_code(401);
            echo json_encode(array(
                "error"=>"User already exists"
            ));
            return;
        }
        
        User::createUser($id, $pass, $name, 1);
        $tokens = User::authenticateWithPassword($id, $pass);
        if($tokens === NULL) {
            http_response_code(400);
            echo json_encode(array(
                "access_token"=>NULL,
                "refresh_token"=>NULL
            ));
            return;
        }
    
        echo json_encode($tokens);
    } else {
        http_response_code(405);
        echo '{}';
    }