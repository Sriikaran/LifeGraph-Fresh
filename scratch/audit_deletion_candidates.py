import boto3
from decimal import Decimal
import json

def get_table():
    dynamodb = boto3.resource('dynamodb', region_name='ap-south-1')
    return dynamodb.Table('LifeGraph')

def run_audit():
    table = get_table()
    
    # Fetch all products
    products = []
    response = table.scan(
        FilterExpression="SK = :sk AND begins_with(PK, :pk_prefix)",
        ExpressionAttributeValues={":sk": "METADATA", ":pk_prefix": "PRODUCT#"}
    )
    products.extend(response.get('Items', []))
    
    while 'LastEvaluatedKey' in response:
        response = table.scan(
            FilterExpression="SK = :sk AND begins_with(PK, :pk_prefix)",
            ExpressionAttributeValues={":sk": "METADATA", ":pk_prefix": "PRODUCT#"},
            ExclusiveStartKey=response['LastEvaluatedKey']
        )
        products.extend(response.get('Items', []))

    invalid_image_products = [p for p in products if p.get('image', '').startswith('/assets/')]
    
    rating_gte_4 = 0
    reviews_gte_50 = 0
    reviews_gte_100 = 0
    price_gt_0 = 0
    categories = set()
    
    deletion_candidates = []
    
    for p in invalid_image_products:
        rating = float(p.get('rating', 0) or 0)
        reviews = int(p.get('reviews', 0) or 0)
        price = float(p.get('price', 0) or 0)
        
        if rating >= 4:
            rating_gte_4 += 1
        if reviews >= 50:
            reviews_gte_50 += 1
        if reviews >= 100:
            reviews_gte_100 += 1
        if price > 0:
            price_gt_0 += 1
            
        category = p.get('category', 'UNKNOWN')
        categories.add(category)
        
        # Check deletion criteria
        if rating == 0 and reviews == 0 and price == 0:
            deletion_candidates.append({
                'id': p.get('id', p.get('PK', '').replace('PRODUCT#', '')),
                'name': p.get('name', p.get('title', 'Unknown')),
                'category': category
            })
            
    print(json.dumps({
        "total_catalog": len(products),
        "invalid_image_count": len(invalid_image_products),
        "rating_gte_4": rating_gte_4,
        "reviews_gte_50": reviews_gte_50,
        "reviews_gte_100": reviews_gte_100,
        "price_gt_0": price_gt_0,
        "unique_categories": len(categories),
        "deletion_candidates_count": len(deletion_candidates),
        "deletion_candidates": deletion_candidates
    }, indent=2))

if __name__ == '__main__':
    run_audit()
