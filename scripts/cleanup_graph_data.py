import os
import sys

# Add src to the path
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'src'))

from infrastructure.dynamodb.client import get_table

def cleanup():
    table = get_table()
    print("Scanning table for cleanup...")
    
    response = table.scan()
    items = response.get('Items', [])
    
    deleted_count = 0
    preserved_count = 0
    
    # Integration test fixtures to preserve
    preserve_missions = {"BIRTHDAY"}
    preserve_products = {
        "CAKE001", "CANDLE001", "DRINK001", "SNACK001",
        "Cake", "Candles", "Drinks", "Snacks", "Balloons"
    }
    
    with table.batch_writer() as batch:
        for item in items:
            pk = item.get('PK', '')
            sk = item.get('SK', '')
            
            should_delete = False
            
            # Determine if this item should be deleted
            if pk.startswith("MISSION#"):
                mission_id = pk.split("#")[1]
                if mission_id not in preserve_missions:
                    should_delete = True
                elif sk != "METADATA" and not sk.startswith("REQUIRES#"):
                    # Delete metadata other than base requirements / metadata for BIRTHDAY
                    should_delete = True
            elif pk.startswith("PRODUCT#"):
                product_id = pk.split("#")[1]
                if product_id not in preserve_products:
                    should_delete = True
            elif sk.startswith("REQUIRES#") or sk.startswith("DEPENDS_ON#") or sk.startswith("COMPATIBLE_WITH#") or sk.startswith("SUBSTITUTES_FOR#") or sk.startswith("OPTIONAL#"):
                # Relationship edges
                source_id = pk.split("#")[1] if "#" in pk else ""
                if pk.startswith("MISSION#") and source_id in preserve_missions:
                    target_id = sk.split("#")[-1]
                    if target_id not in preserve_products:
                        should_delete = True
                else:
                    should_delete = True
            
            if should_delete:
                batch.delete_item(Key={'PK': pk, 'SK': sk})
                deleted_count += 1
            else:
                preserved_count += 1
                
    print(f"Cleanup complete! Deleted {deleted_count} items. Preserved {preserved_count} items.")

if __name__ == "__main__":
    cleanup()
