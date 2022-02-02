# API リファレンス
(ユーザー認証が必要なエンドポイントを叩く場合はX-Access-Tokenにアクセストークンをつける)

## セットアップ
POST /setup

初期セットアップ
- id → ログインに使用するID
- pass → パスワード
- name → 表示名
- secret → セットアップ用シークレット(環境変数で指定)

## 認証
POST /auth/login

アクセストークン発行(ID/パスワード)
- id → id
- pass → パスワード

POST /auth/logout

アクセストークン破棄
- access_token → アクセストークン
- refresh_token → リフレッシュトークン

GET /auth/refresh

アクセストークン更新
- なし(HeaderのX-Refresh-Tokenにリフレッシュトークンを設定する必要あり)

GET /auth/register

登録可能か確認
- なし

POST /auth/register

登録(ID/パスワード)
- id → ID
- pass → パスワード
- name → 表示名

## プロフィール

GET /profile/me

自分のプロフィール取得
- なし


## カテゴリ
GET /category/list

カテゴリ一覧の取得
- なし

POST /category/add

カテゴリの追加
- name → カテゴリタイトル
- description → カテゴリ設定
- rank → 閲覧可能ランク


POST /category/remove

カテゴリの削除
- id → カテゴリID

## スレッド
GET /thread/list

スレッドリストの取得
- id → カテゴリID

GET /thread/posts

投稿の取得
- id → スレッドID
- page → (任意)ページ

POST /thread/add

スレッドの追加
- name → スレッドタイトル
- category_id → カテゴリID

POST /thread/remove

スレッドの削除
- thread_id → スレッドID

POST /thread/post
POST /thread/edit
POST /thread/delete