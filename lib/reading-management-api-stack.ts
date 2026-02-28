import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';

export class ReadingManagementApiStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // 1. DynamoDBテーブルの作成 (読書データ保存用)
    const bookTable = new dynamodb.Table(this, 'BookTable', {
      partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.DESTROY, // ポートフォリオ用なのでスタック削除時にデータも消す設定
    });

    // 2. Lambda関数の作成 (先ほど作ったPythonコードを指定)
    const bookLambda = new lambda.Function(this, 'BookHandler', {
      runtime: lambda.Runtime.PYTHON_3_12,
      code: lambda.Code.fromAsset('lambda'),
      handler: 'app.handler',
      environment: {
        TABLE_NAME: bookTable.tableName, // 環境変数でテーブル名を渡す
      },
    });

    // LambdaにDynamoDBへの読み書き権限を付与 (最小権限の原則)
    bookTable.grantReadWriteData(bookLambda);

    // 3. API Gatewayの作成
    new apigateway.LambdaRestApi(this, 'BookApi', {
      handler: bookLambda,
    });
  }
}