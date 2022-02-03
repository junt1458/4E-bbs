<?php
    include_once __DIR__ . "/utils/db.php";
    header('Content-Type: application/json;charset=utf-8');
    mysqli_close($link);
    echo json_encode(array(
        "message"=>"API server is online."
    ));