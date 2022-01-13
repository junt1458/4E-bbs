CREATE DATABASE IF NOT EXISTS bbs CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
GRANT ALL ON bbs.* TO `bbs`;

USE bbs;

CREATE TABLE IF NOT EXISTS Posts (
    id bigint auto_increment unique,
    name text not null,
    subject text not null,
    content text not null,
    delete_key text not null,
    edit_key text not null,
    created_at datetime  default current_timestamp,
    updated_at timestamp default current_timestamp on update current_timestamp
);