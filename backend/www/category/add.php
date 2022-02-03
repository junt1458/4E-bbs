<?php
    include_once __DIR__ . "/../utils/auth.php";
    checkRank($me, 4);

    $request = json_decode(file_get_contents('php://input'), true);
    
    $name = $request['name'];
    $desc = $request['description'];
    $rank = intval($request['rank']);
    if((empty($name) && $name !== 0) || (empty($rank) && $rank !== 0)) {
        http_response_code(400);
        echo '{}';
        return;
    }
    if((empty($desc) && $desc !== 0)) {
        $desc = "";
    }

    if($rank <= 0 || $rank >= 5) {
        http_response_code(400);
        echo '{}';
        return;
    }

    $q = mysqli_query($link, "INSERT INTO Categories (name, description, view_rank) VALUES ('" . mysqli_real_escape_string($link, $name) . "', '" . mysqli_real_escape_string($link, $desc) . "', " . mysqli_real_escape_string($link, $rank) . ");");
    if(!$q) {
        http_response_code(400);
        echo '{}';
        return;
    }

    echo '{}';