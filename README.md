# Gemini API 思考過程表示チャットボット
**(この README は Gemini 2.5Pro で生成しました。)**

このプロジェクトは、Google の Gemini API を利用して、AI の思考過程と最終的な回答をリアルタイムで表示するチャットアプリケーションです。

フロントエンドは React (Vite) でビルドされた静的コンテンツを nginx で配信し、バックエンドは Node.js (Express) で構築されています。システム全体は Docker Compose によってコンテナ化されており、簡単なコマンドで起動できます。

## ✨ 主な機能

-   **リアルタイム応答**: Server-Sent Events (SSE) を使用し、サーバーからの思考過程や回答をストリーミングで表示します。
-   **思考過程の可視化**: Gemini API の思考プロセス（`thought`）を抽出し、ユーザーに応答が生成されるまでの裏側の動きを見ることができます。
-   **Markdown レンダリング**: AI からの回答を Markdown 形式で整形して表示します。
-   **リバースプロキシ**: フロントエンドの nginx が API リクエストをバックエンドに中継するため、ブラウザはフロントエンドのエンドポイントとのみ通信します。
-   **Docker による実行環境**: `docker-compose` を使って、ワンコマンドでフロントエンドとバックエンドの本番に近い環境を構築・起動できます。

## 🛠️ 技術スタック

-   **フロントエンド**:
    -   React 19, Vite (ビルドツールとして使用)
    -   Nginx (静的コンテンツ配信 & リバースプロキシ)
    -   `react-markdown`: 回答の Markdown レンダリング
-   **バックエンド**:
    -   Node.js 24.12.0, Express
    -   `@google/generative-ai`: Gemini API との通信
-   **コンテナ化**:
    -   Docker, Docker Compose

## 📝 フロントエンドのセットアップについて

このプロジェクトのフロントエンドは、以下のコマンドで生成された Vite の React テンプレートをベースにしています。

```bash
npm create vite@latest client -- --template react
```
-   `npm create vite@latest`: `create-vite` パッケージの最新版を使用して、新しい Vite プロジェクトを作成します。`npm init` のエイリアスです。
-   `client`: 作成されるプロジェクトのディレクトリ名です。
-   `--`: `create-vite` パッケージに直接引数を渡すためのセパレータです。
-   `--template react`: 使用するテンプレートとして `react` を指定します。これにより、React 用の基本的な設定（ビルドツール、ESLint など）が適用されたプロジェクトが生成されます。

## 🚀 セットアップと実行方法

### 前提条件

-   Docker と Docker Compose がインストールされていること。
-   Google Gemini API キーを取得していること。

### 実行手順

1.  **リポジトリをクローン:**
    ```bash
    git clone <repository-url>
    cd gemini-chatbot
    ```

2.  **.env ファイルの作成:**
    プロジェクトのルートディレクトリに `.env` ファイルを作成し、ご自身の Gemini API キーを記述します。

    ```.env
    # Google Gemini API の認証キー
    GEMINI_API_KEY=YOUR_GEMINI_API_KEY
    ```

3.  **Docker コンテナのビルドと起動:**
    ```bash
    docker-compose up --build
    ```
    `-d` フラグを付けると、コンテナをバックグラウンドで実行します。

4.  **アプリケーションへのアクセス:**
    ブラウザで `http://localhost:12080` にアクセスすると、チャットアプリケーションが表示されます。

    -   フロントエンド (クライアント): `http://localhost:12080`
    -   バックエンド (サーバー API): `http://localhost:3001` (直接アクセスは通常不要)

## ⚙️ 動作の仕組み

1.  ユーザーがブラウザで `http://localhost:12080` にアクセスすると、フロントエンドコンテナの **nginx** がビルド済みの React アプリケーション (静的ファイル) を返します。
2.  ユーザーがメッセージを送信すると、React アプリケーションは `/api/chat` という **相対パス** でリクエストを送信します。
3.  このリクエストはフロントエンドの **nginx** が受け取ります。`nginx.conf` の設定に基づき、`/api/` で始まるリクエストはバックエンドコンテナ (`http://chatbot-server:3001`) に **リバースプロキシ（転送）** されます。
4.  バックエンドサーバー (Express) はリクエストを受け取り、Gemini API との通信を開始します。
5.  Gemini API からの応答 (思考過程や回答) は、SSE を通じてバックエンドサーバー → nginx → ブラウザへとストリーミングされ、リアルタイムで画面に描画されます。

このアーキテクチャにより、ブラウザはバックエンドサーバーの存在を直接知る必要がなくなり、すべての通信がフロントエンドのエンドポイント (`http://localhost`) に集約されます。

## 📁 ディレクトリ構造

```
.
├── client/                # React フロントエンド
│   ├── Dockerfile         # Nginx を使用した本番用 Dockerfile
│   ├── nginx.conf         # Nginx のリバースプロキシ設定
│   ├── package.json
│   └── src/
│       └── App.jsx        # メインコンポーネント
├── server/                # Node.js バックエンド
│   ├── Dockerfile         # 開発用 Dockerfile
│   ├── package.json
│   └── index.js           # Express サーバー
├── .env                   # docker-compose が読み込む環境変数
├── docker-compose.yaml    # Docker Compose 設定ファイル
└── README.md              # このファイル
```
