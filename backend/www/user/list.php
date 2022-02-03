<?php
    include_once __DIR__ . "/../utils/auth.php";
    checkRank($me, 4);

    $q1 = mysqli_query($link, "SELECT Users.id, Users.auth_provider, Profiles.name, Profiles.bio, Profiles.user_rank FROM Users, Profiles WHERE Users.id = Profiles.id;");
    if(!$q1) {
        http_response_code(500);
        echo '{}';
        return;
    }

    $users = [];
    while($r = mysqli_fetch_assoc($q1)) {
        if($r['auth_provider'] == "deleted")
            continue;
            
        array_push($users, [
            "name"=>$r['name'],
            "id"=>$r['id'],
            "bio"=>$r['bio'],
            "rank"=>intval($r['user_rank']),
            "provider"=>str_replace('local', "パスワード", $r['auth_provider'])
        ]);
    }

    echo json_encode($users);