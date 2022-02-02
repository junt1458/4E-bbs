<?php
    // 初期テーブル生成や管理アカウント生成を行うためのエンドポイント。
    //   管理ユーザー(Level 4)が既に存在している場合は使用できない。
    //   0 → ゲストユーザー
    //   1 → 登録ユーザー
    //   2 → 認証済みユーザー
    //   3 → サイトモデレーター
    //   4 → サイト管理ユーザー

    function error($message, $code = 500) {
        http_response_code($code);
        echo json_encode(array(
            "error"=>$message
        ));
        exit;
    }

    if(empty($_ENV['ADMIN_REGISTER_SECRET'])) {
        error("Setup secret is not set.");
    }
    
    include_once __DIR__ . "/utils/db.php";
    include_once __DIR__ . "/utils/user.php";
    $request = json_decode(file_get_contents('php://input'), true);

    $id = $request['id'];
    $pass = $request['pass'];
    $name = $request['name'];
    $secret = $request['secret'];

    if(empty($id) || empty($pass) || empty($name)) {
        error("Invalid arguments.", 400);
    }

    if ($secret !== $_ENV['ADMIN_REGISTER_SECRET']) {
        error("Setup secret is invalid.", 401);
    }

    // Create tables.
    $q = mysqli_query($link, "CREATE TABLE IF NOT EXISTS Users (id varchar(20) unique, user_id text, pass_hash text, auth_provider text, created_at datetime default current_timestamp, index(id));");
    if(!$q) error("Failed to execute query." . mysqli_error($link));
    $q = mysqli_query($link, "CREATE TABLE IF NOT EXISTS Profiles (id varchar(20) unique, name text, bio text, user_rank tinyint, index(id));");
    if(!$q) error("Failed to execute query." . mysqli_error($link));
    $q = mysqli_query($link, "CREATE TABLE IF NOT EXISTS RevokedTokens (id bigint auto_increment unique, token_id varchar(32), default_expires datetime, token_type varchar(16), index(token_id));");
    if(!$q) error("Failed to execute query." . mysqli_error($link));
    $q = mysqli_query($link, "CREATE TABLE IF NOT EXISTS Categories (id bigint auto_increment unique, name text, description text, view_rank tinyint, created_at datetime default current_timestamp, index(id));");
    if(!$q) error("Failed to execute query." . mysqli_error($link));
    $q = mysqli_query($link, "CREATE TABLE IF NOT EXISTS Threads (id bigint auto_increment unique, category_id bigint, name text, created_at datetime default current_timestamp, index(id));");
    if(!$q) error("Failed to execute query." . mysqli_error($link));
    $q = mysqli_query($link, "CREATE TABLE IF NOT EXISTS Messages (id bigint auto_increment unique, category_id bigint, thread_id bigint, content text, attachments text, user_id text, created_at datetime default current_timestamp, updated_at timestamp default current_timestamp on update current_timestamp, index(id));");
    if(!$q) error("Failed to execute query." . mysqli_error($link));

    // Check user count
    $q = mysqli_query($link, "SELECT COUNT(user_rank) as cnt FROM Profiles WHERE user_rank >= 4;");
    if(!$q) error("Failed to execute query." . mysqli_error($link));
    $cnt = mysqli_fetch_assoc($q)['cnt'];
    if($cnt > 0) {
        error("Admin user already exists.");
    }

    // Create admin user.
    $uid = User::createUser($id, $pass, $name, 4);
    if($uid == NULL) error("Failed to create user.");

    mysqli_close($link);

    echo json_encode(array(
        "message"=>"OK"
    ));
?>