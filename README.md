# 読書管理アプリ インフラストラクチャ

## 1. プロジェクト概要
読書記録（タイトル、レビュー、評価等）を管理するためのシンプルなREST APIバックエンド、およびそのインフラストラクチャ定義です。
サーバーレスアーキテクチャによるスケーラブルな基盤と、OIDC連携を用いたセキュアなCI/CDの実践を目的に構築しています。

* **環境**: prod (ポートフォリオ用本番環境)
* **アーキテクチャ**: 完全サーバーレス構成 (Client -> API Gateway -> Lambda -> DynamoDB)
* **主要リソース**: Amazon API Gateway, AWS Lambda, Amazon DynamoDB

## 2. 技術スタック (Tech Stack)
* **Cloud**: AWS
* **IaC**: AWS CDK v2 (TypeScript)
* **Backend Logic**: Python 3.12 (Lambda Runtime)
* **CI/CD**: GitHub Actions

## 3. ディレクトリ構成
```text
.
├── .github/workflows/ : CI/CD (GitHub Actions) のデプロイ定義
├── bin/ : CDKアプリのエントリポイント
├── lib/ : インフラストラクチャ定義 (TypeScript)
├── lambda/ : バックエンドAPIロジック (Python)
├── cdk.json : CDK設定ファイル
└── package.json : Node.js パッケージおよび依存関係
```

## 4. セットアップ (Getting Started)
開発者が最初にすべき手順です（※本番デプロイはCI/CDにて自動化されています）。

1. **ツールのインストール**: 
   - Node.js (v20推奨), AWS CLI, AWS CDK CLI
2. **依存パッケージのインストール**: 
   `npm ci` を実行します。
3. **認証設定**: 
   ローカルのAWS CLIにAdministrator権限を持つプロファイルを設定します（または `aws sso login` を実行）。
4. **初期化 (初回のみ)**: 
   `npx cdk bootstrap` を実行します。

## 5. 操作ガイド (Usage)
ローカル開発時によく使うコマンドです。

* `npx cdk diff` : インフラ定義の差分確認
* `npx cdk synth` : CloudFormationテンプレートの生成確認
* `npx cdk deploy` : ローカルからの手動デプロイ（※検証用）

## 6. 運用上の注意 (Important Notes)
* **手動変更の禁止**: AWSマネジメントコンソールからのリソース変更は原則禁止です。すべての変更は IaC (CDK) のコードを修正して反映させてください。
* **デプロイフロー**: `main` ブランチへのコード Push をトリガーとして、GitHub Actions が自動で `cdk deploy` を実行します。
* **秘匿情報の扱い**: AWSの永続的なアクセスキー（IAMユーザー）は発行・使用していません。GitHub Actionsからのデプロイは、**OIDC (OpenID Connect)** を利用した一時クレデンシャルによってセキュアに行われます。
