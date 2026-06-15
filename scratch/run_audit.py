import boto3
import json
from collections import defaultdict
from decimal import Decimal

def decimal_default(obj):
    if isinstance(obj, Decimal):
        return float(obj)
    raise TypeError

def audit_lifegraph():
    dynamodb = boto3.resource('dynamodb', region_name='us-east-1')
    table = dynamodb.Table('LifeGraph')
    
    stats = {
        'total_items': 0,
        'total_products': 0,
        'total_edges': 0,
        'total_missions': 0,
        'total_other_entities': 0,
        
        'edges': {
            'SUBSTITUTES_FOR': 0,
            'DEPENDS_ON': 0,
            'other': 0
        },
        
        'products': {
            'categories': defaultdict(int),
            'real_images': 0,
            'fallback_images': 0,
            'price_zero': 0,
            'missing_subcategory': 0
        }
    }
    
    response = table.scan()
    items = response.get('Items', [])
    
    while True:
        for item in items:
            stats['total_items'] += 1
            
            entity_type = item.get('entityType')
            relationship_type = item.get('relationshipType')
            
            if entity_type == 'PRODUCT':
                stats['total_products'] += 1
                
                # Category
                cat = item.get('category')
                if not cat:
                    cat = 'UNKNOWN'
                stats['products']['categories'][cat] += 1
                
                # Subcategory
                subcat = item.get('subcategory')
                if not subcat:
                    stats['products']['missing_subcategory'] += 1
                    
                # Price
                price = item.get('price', 0)
                try:
                    price_val = float(price)
                    if price_val == 0:
                        stats['products']['price_zero'] += 1
                except:
                    pass
                    
                # Images
                img_url = item.get('image', '')
                if not img_url or 'placehold' in img_url.lower():
                    stats['products']['fallback_images'] += 1
                else:
                    stats['products']['real_images'] += 1
                    
            elif relationship_type or (not entity_type and 'SK' in item and ('#' in item['SK'] or 'SUBSTITUTE' in item['SK'] or 'DEPENDS' in item['SK'])):
                stats['total_edges'] += 1
                edge_type = relationship_type
                if not edge_type:
                    # try to extract from SK
                    sk = item.get('SK', '')
                    if 'SUBSTITUTES_FOR' in sk:
                        edge_type = 'SUBSTITUTES_FOR'
                    elif 'DEPENDS_ON' in sk:
                        edge_type = 'DEPENDS_ON'
                    
                if edge_type == 'SUBSTITUTES_FOR':
                    stats['edges']['SUBSTITUTES_FOR'] += 1
                elif edge_type == 'DEPENDS_ON':
                    stats['edges']['DEPENDS_ON'] += 1
                else:
                    stats['edges']['other'] += 1
                    
            elif entity_type == 'MISSION':
                stats['total_missions'] += 1
            else:
                stats['total_other_entities'] += 1
                
        if 'LastEvaluatedKey' in response:
            response = table.scan(ExclusiveStartKey=response['LastEvaluatedKey'])
            items = response.get('Items', [])
        else:
            break
            
    # Convert defaultdict to dict for json serialization
    stats['products']['categories'] = dict(stats['products']['categories'])
    
    print(json.dumps(stats, default=decimal_default, indent=2))

if __name__ == '__main__':
    audit_lifegraph()
