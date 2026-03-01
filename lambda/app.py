import json
import os
import boto3
import uuid
from decimal import Decimal

class DecimalEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, Decimal):
            if obj % 1 == 0:
                return int(obj)
            return float(obj)
        return super(DecimalEncoder, self).default(obj)

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table(os.environ['TABLE_NAME'])

def handler(event, context):
    method = event.get('httpMethod')

    try:
        # 本の登録 (POSTリクエスト)
        if method == 'POST':
            body = json.loads(event['body'])
            item = {
                'id': str(uuid.uuid4()),
                'title': body.get('title', 'No Title'),
                'review': body.get('review', ''),
                'rating': body.get('rating', 0)
            }
            table.put_item(Item=item)
            return {
                'statusCode': 201,
                'headers': {'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'message': 'Book added!', 'item': item})
            }
        
        # 本の一覧取得 (GETリクエスト)
        elif method == 'GET':
            response = table.scan()
            return {
                'statusCode': 200,
                'headers': {'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'books': response.get('Items', [])}, cls=DecimalEncoder, ensure_ascii=False)
            }

        # 🌟 本の削除 (DELETEリクエスト) を追加！
        elif method == 'DELETE':
            body = json.loads(event['body'])
            book_id = body.get('id')
            table.delete_item(Key={'id': book_id})
            return {
                'statusCode': 200,
                'headers': {'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'message': 'Book deleted!'})
            }

        return {'statusCode': 400, 'body': 'Unsupported method'}

    except Exception as e:
        return {'statusCode': 500, 'body': json.dumps({'error': str(e)})}