<?php
    include_once __DIR__ . "/../utils/auth.php";
    if($me == NULL) {
        http_response_code(401);
        echo "{}";
        return;
    }
    echo json_encode($me);