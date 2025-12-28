# 自習用：Gemini API 思考過程表示チャットボット

このプロジェクトは、Google の Gemini API を利用して、AI の思考過程と最終的な回答をリアルタイムで表示するチャットアプリケーションです。

フロントエンドは React (Vite)、バックエンドは Node.js (Express) で構築されています。開発環境は Docker Compose によってコンテナ化されており、簡単なコマンドで全体のシステムを起動できます。

## ✨ 主な機能

-   **リアルタイム応答**: Server-Sent Events (SSE) を使用し、サーバーからの思考過程や回答をストリーミングで表示します。
-   **思考過程の可視化**: Gemini API の思考プロセス（`thought`）を抽出し、ユーザーに応答が生成されるまでの裏側の動きを見ることができます。
-   **Markdown レンダリング**: AI からの回答を Markdown 形式で整形して表示します。
-   **Docker による開発環境**: `docker-compose` を使って、ワンコマンドでフロントエンドとバックエンドの開発環境を同時に構築・起動できます。

## 🛠️ 技術スタック

-   **フロントエンド**:
    -   React 19, Vite
    -   `react-markdown`: 回答の Markdown レンダリング
-   **バックエンド**:
    -   Node.js 24.12.0, Express
    -   `@google/generative-ai`: Gemini API との通信
    -   `nodemon`: 開発時のホットリロード
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
    プロジェクトのルートディレクトリに `.env` ファイルを作成し、ご自身の Gemini API キーと、クライアントがバックエンドサーバーに接続するための URL を記述します。

    ```.env
    # Google Gemini API の認証キー
    GEMINI_API_KEY=YOUR_GEMINI_API_KEY

    # フロントエンド (Vite) がバックエンドサーバーを参照するための URL
    # docker-compose で起動する場合、通常は localhost:3001 を指定します
    VITE_AI_CHAT_SERVER_URL=http://localhost:3001
    ```
    
    **注意**: `VITE_` プレフィックスは、Vite がクライアントサイドのコードで環境変数を読み込むために必須です。

3.  **Docker コンテナのビルドと起動:**
    ```bash
    docker-compose up --build
    ```
    `-d` フラグを付けると、コンテナをバックグラウンドで実行します。

4.  **アプリケーションへのアクセス:**
    ブラウザで `http://localhost:5173` にアクセスすると、チャットアプリケーションが表示されます。

    -   フロントエンド (クライアント): `http://localhost:5173`
    -   バックエンド (サーバー API): `http://localhost:3001`

## ⚙️ 動作の仕組み

1.  ユーザーがフロントエンドからメッセージを送信します。
2.  クライアント (React) は、環境変数 `VITE_AI_CHAT_SERVER_URL` を元にバックエンドの `/api/chat` エンドポイントにリクエストを送信します。
3.  サーバー (Express) は、リクエストを受け取り、Gemini API にストリーミング形式でリクエストを転送します。この際、思考プロセスを有効にする設定を付与します。
4.  Gemini API からチャンク（部分的なデータ）が返ってくるたびに、サーバーはそれを解析します。
    -   `thought` (思考過程) のデータが含まれていれば、`event: thinking` としてクライアントに送信します。
    -   回答本文のデータが含まれていれば、`event: answer` としてクライアントに送信します。
5.  クライアントは SSE を通じてこれらのイベントをリッスンし、受け取ったデータをリアルタイムで画面に描画します。

## 📁 ディレクトリ構造

```
.
├── client/                # React フロントエンド
│   ├── Dockerfile         # 開発用 Dockerfile
│   ├── .dockerignore      # Docker イメージから除外するファイル
│   ├── .env               # ローカル開発用の環境変数（docker-composeからは使用されない）
│   ├── package.json
│   └── src/
│       └── App.jsx        # メインコンポーネント
├── server/                # Node.js バックエンド
│   ├── Dockerfile         # 開発用 Dockerfile
│   ├── .dockerignore
│   ├── package.json
│   └── index.js           # Express サーバー
├── .env                   # docker-compose が読み込む環境変数
├── docker-compose.yaml    # Docker Compose 設定ファイル
└── README.md              # このファイル
```
