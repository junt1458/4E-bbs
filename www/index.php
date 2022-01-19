<?php
    session_start();

    $error = NULL;
    // DELETE/PUTの時は_methodに乗ってくるのでそれを見る
    $REQ_METHOD = $_SERVER["REQUEST_METHOD"];
    if ($_SERVER["REQUEST_METHOD"] === "POST") {
        $REQ_METHOD = isset($_POST["_method"]) ? $_POST["_method"] : $_SERVER["REQUEST_METHOD"];
    }

    // METHODが正しいかのチェック
    //   今回はGET/POST/PUT/DELETEのみOK
    if ($REQ_METHOD !== "GET"
        && $REQ_METHOD !== "POST"
        && $REQ_METHOD !== "PUT"
        && $REQ_METHOD !== "DELETE") {

        http_response_code(405);
        echo "Method not allowed.";
    }

    if ($REQ_METHOD === "POST") {
        // 新規投稿
        include __DIR__ . "/scripts/post.php";
    } else if ($REQ_METHOD === "PUT") {
        // 投稿の編集
        include __DIR__ . "/scripts/put.php";
    } else if ($REQ_METHOD === "DELETE") {
        // 投稿の削除
        include __DIR__ . "/scripts/delete.php";
    }

    // CSRF対策用トークンの生成
    include_once __DIR__ . "/scripts/utils.php";
    $_SESSION['CSRF_TOKEN'] = Utils::genToken();

    // GETの処理はPOST/PUT/DELETEの場合でも走らせる
    include __DIR__ . "/scripts/get.php";
?>
<!DOCTYPE html>
<html lang="ja">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>BBS</title>
    <link rel="stylesheet" href="./css/base.css">
    <link rel="stylesheet" href="./css/form.css">
    <link rel="stylesheet" href="./css/contents.css">
    <link rel="stylesheet" href="./css/edit.css">
    <script src="./js/misc.js" type="text/javascript" defer></script>
    <script src="./js/edit.js" type="text/javascript" defer></script>
</head>

<body>
    <div class="header">
        <a class="title" href="./">4E Exp. BBS</a>
    </div>
    <div class="container">
        <div class="form">
            <h1 class="form__title">～ 新規投稿 ～</h1>
            <form method="POST" class="form__container">
                <table class="form__container__table">
                    <tr>
                        <td class="form__container__title">
                            <label for="name" class="form__container__label">名前:&nbsp;&nbsp;</label>
                        </td>
                        <td>
                            <input type="text" id="name" name="name" class="form__container__input form__container__input__small" required>
                        </td>
                    </tr>
                    <tr>
                        <td class="form__container__title">
                            <label for="edit" class="form__container__label">編集キー:&nbsp;&nbsp;</label>
                        </td>
                        <td>
                            <input type="text" id="edit" name="edit" class="form__container__input form__container__input__small" required>
                        </td>
                    </tr>
                    <tr>
                        <td class="form__container__title">
                            <label for="delete" class="form__container__label">削除キー:&nbsp;&nbsp;</label>
                        </td>
                        <td>
                            <input type="text" id="delete" name="delete" class="form__container__input form__container__input__small" required>
                        </td>
                    </tr>
                    <tr>
                        <td class="form__container__title">
                            <label for="content" class="form__container__label">内容:&nbsp;&nbsp;</label>
                        </td>
                        <td>
                            <textarea name="content" id="content" class="form__container__input form__container__input__large" required></textarea>
                        </td>
                    </tr>
                </table>
                <div class="form__container__buttons">
                    <input type="hidden" name="token" value="<?php echo $_SESSION['CSRF_TOKEN']; ?>">
                    <button type="submit" class="form__container__button form__container__submit">送信</button>
                    <button type="reset" class="form__container__button form__container__reset">リセット</button>
                </div>
            </form>
        </div>

        <?php if(!empty($error)) { ?>
            <div class="error_div">
                <div class="error">
                    <span>
                        エラーが発生しました。<br>
                        <br>
                        <?php echo $error; ?>
                    </span>
                </div>
            </div>
        <?php } ?>

        <br>
        <h1 class="form__title">～ 投稿一覧 ～</h1>
        <div class="order_div">
            並び順: 
            <select id="order" onchange="change()">
                <option value="">投稿順</option>
                <option value="desc">新着順</option>
            </select>
        </div>
        <div class="contents">
            <?php foreach($posts as $post) { ?>
                <div class="content">
                    <ul class="content__list">
                        <li>
                            <u><a href="#<?php echo $post['id']; ?>" name="<?php echo $post['id']; ?>">#<?php echo $post['id']; ?></a>: <span id="name__<?php echo $post['id']; ?>"><?php echo $post['name']; ?></span></u>
                        </li>
                        <li>
                            投稿日時: <?php echo $post['time']; ?>
                        </li>
                        <li>
                            <form method="POST">
                                <input type="hidden" name="_method" value="DELETE">
                                <input type="hidden" name="postid" value="<?php echo $post['id']; ?>">
                                <input type="hidden" name="token" value="<?php echo $_SESSION['CSRF_TOKEN']; ?>">
                                <button type="button" onclick="edit(<?php echo $post['id']; ?>);" <?php if($post['deleted']) echo 'disabled'; ?>>編集</button> 削除キー: <input type="text" name="delete" class="content__input__short" <?php if($post['deleted']) echo 'disabled'; ?> required> <button type="submit" <?php if($post['deleted']) echo 'disabled'; ?>>削除</button>
                            </form>
                        </li>
                        <hr>
                        <li class="content__list__text" id="content__<?php echo $post['id']; ?>">
                            <?php echo nl2br($post['content']); ?>
                        </li>
                    </ul>
                </div>
            <?php } ?>
        </div>
    </div>
    <div class="footer">
        <span class="copyright">Copyright &copy; 2022 Junki Tomatsu All Rights Reserved.</span>
    </div>

    <div class="edit_overlay" id="overlay" style="display: none;">
        <div class="edit_container">
            <div class="edit_header">
                <div class="edit_title">
                    #<span id="overlay_title">1</span> を編集
                </div>
                <div class="edit_close">
                    <a href="#" onclick="close_overlay()">×</a>
                </div>
            </div>
            <hr>
            <form method="POST" class="edit_form">
                <input type="hidden" name="_method" value="PUT">
                <input type="hidden" name="postid" id="overlay_postid" value="1">
                <table class="form__container__table">
                    <tr>
                        <td class="form__container__title">
                            <label for="overlay_name" class="form__container__label">名前:&nbsp;&nbsp;</label>
                        </td>
                        <td>
                            <input type="text" id="overlay_name" name="name" class="form__container__input form__container__input__small" required>
                        </td>
                    </tr>
                    <tr>
                        <td class="form__container__title">
                            <label for="overlay_content" class="form__container__label">内容:&nbsp;&nbsp;</label>
                        </td>
                        <td>
                            <textarea name="content" id="overlay_content" class="form__container__input form__container__input__large" required></textarea>
                        </td>
                    </tr>
                    <tr>
                        <td class="form__container__title">
                            <label for="overlay_edit" class="form__container__label">編集キー:&nbsp;&nbsp;</label>
                        </td>
                        <td>
                            <input type="text" id="overlay_edit" name="edit" class="form__container__input form__container__input__small" required>
                        </td>
                    </tr>
                </table>
                <div class="form__container__buttons">
                    <input type="hidden" name="token" value="<?php echo $_SESSION['CSRF_TOKEN']; ?>">
                    <button type="submit" class="form__container__button form__container__submit">編集</button>
                    <button type="button" class="form__container__button form__container__reset" onclick="close_overlay()">キャンセル</button>
                </div>
            </form>
        </div>
    </div>
</body>

</html>