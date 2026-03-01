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
├── .github/
│   └── workflows/   # CI/CD (GitHub Actions) のデプロイ定義
├── bin/             # CDKアプリのエントリポイント
├── lib/             # インフラストラクチャ定義 (TypeScript)
├── lambda/          # バックエンドAPIロジック (Python)
├── cdk.json         # CDK設定ファイル
└── package.json     # Node.js パッケージおよび依存関係
