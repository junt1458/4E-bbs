<?php
    include_once __DIR__ . "/../utils/auth.php";
    include_once __DIR__ . "/../utils/threads.php";
    checkRank($me, 1);

    if((empty($_GET['id']) && $_GET['id'] !== 0)) {
        http_response_code(400);
        echo '{}';
        return;
    }
    $th_id = intval($_GET['id']);
    $page = empty($_GET['page']) ? 1 : intval($_GET['page']);
    $order = empty($_GET['order']) || intval($_GET['order']) !== 1 ? "DESC" : "ASC";

    $category_id = Threads::get_thread_category($th_id);
    if($category_id == -999) {
        http_response_code(404);
        echo '{}';
        return;
    }

    checkRank($me, Threads::get_category($category_id)['rank']);
    $q = mysqli_query($link, "SELECT * FROM Messages WHERE thread_id=" . mysqli_real_escape_string($link, $th_id) . " ORDER BY created_at " . $order . ";");
    if(!$q) {
        http_response_code(500);
        echo '{}';
        return;
    }

    $count = mysqli_num_rows($q);
    $pages = intval($count / 20) + ($count % 20 !== 0 ? 1 : 0);
    $pages = $pages <= 0 ? 1 : $pages;
    
    if($pages < $page) {
        $page = $pages;
    }
    if($page <= 0) {
        $page = 1;
    }

    $posts = [];
    while($row = mysqli_fetch_assoc($q)) {
        array_push($posts, $row);
    }

    $user_cache = [];
    $posts_output = [];
    for($i = 20 * ($page - 1); $i < ((20 * $page < $count) ? 20 * $page : $count); $i++) {
        $post = $posts[$i];
        $user = NULL;
        if(array_key_exists($post['user_id'])) {
            $user = $user_cache[$post['user_id']];
        } else {
            $user = User::getUserInfo($post['user_id']);
            $user_cache[$post['user_id']] = $user;
        }

        array_push($posts_output, [
            "id"=>intval($post['id']),
            "index"=>$i,
            "content"=>$post['content'],
            "attachments"=>$post['attachments'] == NULL ? NULL : explode('.', $post['attachments']),
            "posted_at"=>$post['created_at'],
            "updated_at"=>$post['updated_at'],
            "user"=>$user
        ]);
    }

    $q = mysqli_query($link, "SELECT name FROM Threads WHERE id=" . mysqli_real_escape_string($link, $th_id) . ";");
    if(!$q) {
        http_response_code(500);
        echo '{}';
        return;
    }
    $r = mysqli_fetch_assoc($q);

    echo json_encode([
        "page"=>[
            "current"=>$page,
            "max"=>$pages,
        ],
        "category"=>Threads::get_category($category_id),
        "thread"=>[
            "name"=>$r['name'],
            "id"=>$th_id
        ],
        "all_count"=>$count,
        "posts"=>$posts_output
    ]);