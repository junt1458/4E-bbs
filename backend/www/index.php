<?php
    include_once __DIR__ . "/utils/db.php";
    mysqli_close($link);
    echo json_encode(array(
        "message"=>"API server is online."
    ));