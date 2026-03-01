# 📚 読書管理アプリ (Full-stack Serverless App)

React + TypeScript で構築された、サーバーレスアーキテクチャの読書管理アプリケーションです。
フロントエンドは AWS S3 + CloudFront、バックエンドは API Gateway + Lambda + DynamoDB を採用し、完全な IaC (AWS CDK) と CI/CD パイプラインを構築しています。
<br><br>

## 🌐 本番URL
https://d22cu18dyopixt.cloudfront.net/  
<br><br>

## 🏗 アーキテクチャ構成
- **Frontend**: React (Vite) / TypeScript
- **Infrastructure**: AWS CDK (TypeScript)
- **Storage**: Amazon S3 (Static Website Hosting)
- **CDN**: Amazon CloudFront (with Origin Access Control)
- **API**: Amazon API Gateway / AWS Lambda (Python)
- **Database**: Amazon DynamoDB
- **CI/CD**: GitHub Actions (OIDC Auth)  
<br><br>

## ✨ 技術的なこだわり

### 1. セキュアな静的コンテンツ配信 (OAC)
CloudFront の **Origin Access Control (OAC)** を導入し、S3 バケットへの直接アクセスを遮断。CloudFront 経由のアクセスのみを許可する AWS のベストプラクティスに基づいたセキュアな配信環境を構築しました。 

### 2. GitHub Actions によるシークレットレスな CI/CD
**OIDC (OpenID Connect)** を用いた認証を実装。IAM ユーザーのアクセスキーを GitHub に保存せず、一時的な認証情報を使用することで、セキュリティリスクを最小限に抑えた自動デプロイを実現しました。 

### 3. モダンなUI/UXとレスポンシブ対応
CSS モジュールによるカード型レイアウトを採用し、直感的なユーザー体験を意識したインターフェースを実装しています。 
<br><br>

## 🛠 解決した主な課題
- **CI/CD 内でのビルドフロー構築**: GitHub Actions 上でフロントエンドのビルドステップを定義し、環境に依存しない堅牢なデプロイフローを確立。
- **インフラ構成のリファクタリング**: `S3Origin` から最新の `S3BucketOrigin` への移行を行い、非推奨警告を解消しつつ最新のセキュリティ構成（OAC）を適用。 
