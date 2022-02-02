<?php
    include_once __DIR__ . "/../utils/auth.php";
    if($me == NULL) {
        http_response_code(401);
        echo "{}";
        return;
    }

    $request = json_decode(file_get_contents('php://input'), true);
    $name = $request['name'];
    if(empty($name) && $name !== 0) {
        http_response_code(400);
        echo '{}';
        return;
    }

    $q = mysqli_query($link, "UPDATE Profiles SET name='" . mysqli_real_escape_string($link, $name) . "' WHERE id='" . mysqli_real_escape_string($link, $me['id']) . "';");
    if(!$q) {
        http_response_code(500);
    }
    echo '{}';