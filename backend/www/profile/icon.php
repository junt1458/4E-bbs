<?php
    if(empty($_SERVER['HTTP_X_ACCESS_TOKEN']) && !empty($_GET['X-Access-Token'])) {
        $_SERVER['HTTP_X_ACCESS_TOKEN'] = $_GET['X-Access-Token'];
    }

    function showImage($path) {
        header('Content-Type: ' . mime_content_type($path));
        header('Content-Length: ' . filesize($path));
        readfile($path);
    }

    include_once __DIR__ . "/../utils/auth.php";

    if($_SERVER['REQUEST_METHOD'] == 'GET') {
        if(empty($_GET['id']) && $me != NULL) {
            $_GET['id'] = $me['id'];
        }
        if(!file_exists('/var/www/data/icons/' . basename($_GET['id']))) {
            showImage(__DIR__ . '/../utils/default.png');
        } else {
            showImage('/var/www/data/icons/' . basename($_GET['id']));
        }
    } else if($_SERVER['REQUEST_METHOD'] == 'POST') {
        checkRank($me, 1);
        $path = '/var/www/data/icons/' . basename($me['id']);
        if(file_exists($path)) {
            unlink($path);
        }
        if(!move_uploaded_file($_FILES['icon']['tmp_name'], '/var/www/data/icons/' . basename($me['id']))) {
            http_response_code(500);
        }
        echo '{}';
    } else {
        http_response_code(405);
        return;
    }