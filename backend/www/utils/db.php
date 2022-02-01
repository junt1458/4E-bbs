<?php
    include_once __DIR__ . '/cors.php';

    class DB {
        static function connect() {
            $link = mysqli_connect($_ENV['MYSQL_HOST'], $_ENV['MYSQL_USER'], $_ENV['MYSQL_PASSWORD'], 'bbs');
            return $link;
        }
    }
    
    header('Content-Type: application/json;charset=utf-8');
    $link = DB::connect();
    if(!$link) {
        http_response_code(503);
        echo json_encode(array(
            "message"=>"Could not connect to database."
        ));
        exit;
    }