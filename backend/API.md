# API リファレンス
(ユーザー認証が必要なエンドポイントを叩く場合はX-Access-Tokenにアクセストークンをつける)

## セットアップ
POST /setup
- id → ログインに使用するID
- pass → パスワード
- name → 表示名
- secret → セットアップ用シークレット(環境変数で指定)

## 認証
POST /auth/login
- id → id
- pass → パスワード

POST /auth/logout
- access_token → アクセストークン
- refresh_token → リフレッシュトークン

GET/POST /auth/refresh
- なし(HeaderのX-Refresh-Tokenにリフレッシュトークンを設定する必要あり)


## プロフィール