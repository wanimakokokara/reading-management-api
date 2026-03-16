import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment';
// 👇 新しく追加するバックエンド用のモジュール
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';

export class ReadingManagementApiStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // ==========================================
    // 1. バックエンドの構築 (今回追加した部分)
    // ==========================================

    // ① DynamoDBテーブルの作成
    const bookTable = new dynamodb.Table(this, 'BookTable', {
      partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST, // オンデマンド課金
      removalPolicy: cdk.RemovalPolicy.DESTROY, // スタック削除時にテーブルも削除
    });

    // ② Lambda関数の作成
    const apiLambda = new lambda.Function(this, 'ApiHandler', {
      runtime: lambda.Runtime.PYTHON_3_9,
      code: lambda.Code.fromAsset('lambda'), // lambdaフォルダのapp.pyを読み込む
      handler: 'app.handler',
      environment: {
        TABLE_NAME: bookTable.tableName, // DynamoDBのテーブル名を環境変数で渡す
      },
    });

    // LambdaにDynamoDBへの読み書き権限を付与 (AccessDeniedエラーを防ぐ！)
    bookTable.grantReadWriteData(apiLambda);

    // ③ API Gatewayの作成
    const api = new apigateway.RestApi(this, 'ReadingApi', {
      restApiName: 'Reading Management API',
      // フロントエンド(別ドメイン)からの通信を許可するCORS設定
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: apigateway.Cors.ALL_METHODS,
      },
    });

    // API GatewayへのアクセスをすべてLambdaに流す統合設定
    const lambdaIntegration = new apigateway.LambdaIntegration(apiLambda);
    api.root.addMethod('ANY', lambdaIntegration); 

    // 新しいAPIのURLをターミナルに出力する
    new cdk.CfnOutput(this, 'ApiEndpointUrl', {
      value: api.url,
      description: 'API Gateway Endpoint URL',
    });


    // ==========================================
    // 2. フロントエンドの構築 (既存のコードそのまま)
    // ==========================================

    const websiteBucket = new s3.Bucket(this, 'WebsiteBucket', {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
    });

    const distribution = new cloudfront.Distribution(this, 'WebsiteDistribution', {
      defaultRootObject: 'index.html',
      defaultBehavior: {
        origin: origins.S3BucketOrigin.withOriginAccessControl(websiteBucket),
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
      },
    });

    new s3deploy.BucketDeployment(this, 'DeployWebsite', {
      sources: [s3deploy.Source.asset('./frontend/dist')],
      destinationBucket: websiteBucket,
      distribution: distribution,
      distributionPaths: ['/*'],
    });

    new cdk.CfnOutput(this, 'WebsiteURL', {
      value: `https://${distribution.distributionDomainName}`,
      description: 'The URL of the deployed website',
    });
  }
}