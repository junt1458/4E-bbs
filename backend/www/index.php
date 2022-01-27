<?php
    $link = mysqli_connect($_ENV['MYSQL_HOST'], $_ENV['MYSQL_USER'], $_ENV['MYSQL_PASSWORD'], 'bbs');
    if(!$link) {
        http_build_query(503);
        echo json_encode(array(
            "message"=>"Could not connect to database."
        ));
        exit;
    }
    echo json_encode(array(
        "message"=>"API server is online."
    ));