<?php
    class Utils {
        static function checkRequest($kvp, $keys) {
            foreach($keys as $key) {
                if(!isset($kvp[$key]) || (empty($kvp[$key]) && $kvp[$key] !== 0 && $kvp[$key] !== "0")) {
                    return false;
                }
            }
            return true;
        }

        static function genToken() {
            return Utils::makeRandStr(32);
        }

        // Ref. https://qiita.com/TetsuTaka/items/bb020642e75458217b8a
        static function makeRandStr($length) {
            $str = array_merge(range('a', 'z'), range('0', '9'), range('A', 'Z'));
            $r_str = null;
            for ($i = 0; $i < $length; $i++) {
                $r_str .= $str[rand(0, count($str) - 1)];
            }
            return $r_str;
        }
    }