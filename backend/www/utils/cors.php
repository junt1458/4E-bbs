<?php
    function endsWith($haystack, $needle)
    {
        return (strlen($haystack) >= strlen($needle)) ? (substr($haystack, -strlen($needle)) == $needle) : false;
    }

    // 後方一致で許可するorigin
    $accept_origin = array(
        "localhost",
        "localhost:3000",
        "192.168.3.49:3000"
    );

    if (!empty($_SERVER["HTTP_ORIGIN"])) {
        foreach ($accept_origin as $orig) {
            $srv = str_replace(array("http://", "https://"), "", $_SERVER["HTTP_ORIGIN"]);
            if (endsWith($srv, $orig)) {
                header("Access-Control-Allow-Origin: " . $_SERVER["HTTP_ORIGIN"]);
                header("Access-Control-Allow-Credentials: true");
                header("Access-Control-Allow-Headers: Content-Type, X-Refresh-Token, X-Access-Token");
                header("Access-Control-Allow-Methods: HEAD, GET, POST, OPTIONS");
                break;
            }
        }
    }

    if (isset($_SERVER["REQUEST_METHOD"]) && $_SERVER["REQUEST_METHOD"] == "OPTIONS") {
        http_response_code(200);
        exit;
    }
