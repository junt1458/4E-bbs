<?php
    if(empty($_SERVER['HTTP_X_ACCESS_TOKEN']) && !empty($_GET['X-Access-Token'])) {
        $_SERVER['HTTP_X_ACCESS_TOKEN'] = $_GET['X-Access-Token'];
    }

    include_once __DIR__ . "/../utils/auth.php";
    include_once __DIR__ . "/../utils/threads.php";
    checkRank($me, 1);

    if((empty($_GET['id']) && $_GET['id'] !== 0)) {
        http_response_code(400);
        echo '{}';
        return;
    }
    $fid = $_GET['id'];

    $q = mysqli_query($link, "SELECT filename, category_id FROM Attachments WHERE id='" . mysqli_real_escape_string($link, $fid) . "'");
    if(!$q) {
        http_response_code(500);
        return;
    }

    $r = mysqli_fetch_assoc($q);
    if(!$q) {
        http_response_code(404);
        return;
    }

    checkRank($me, Threads::get_category(intval($r['category_id']))['rank']);

    if(!file_exists('/var/www/data/uploaded/' . basename($fid))) {
        http_response_code(404);
        return;
    }

    header('Content-Type: application/force-download');
    header('Content-Length: ' . filesize('/var/www/data/uploaded/' . basename($fid)));
    header('Content-Disposition: attachment; filename="' . $r['filename'] . '"');
    readfile('/var/www/data/uploaded/' . basename($fid));