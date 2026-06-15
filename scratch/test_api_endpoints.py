import sys
import os
import json

# Add src to path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../../src')))

from api.controllers.product_controller import ProductController

def test_endpoints():
    controller = ProductController()

    print("--- POST /products ---")
    create_event = {
        "body": json.dumps({
            "name": "Test Expanded Product",
            "price": 100.50,
            "stock": 50,
            "category": "TEST_CAT",
            "title": "Expanded Title",
            "image": "https://example.com/img.jpg",
            "brand": "TestBrand",
            "mrp": 150.0,
            "rating": 4.5,
            "reviews": 10,
            "subcategory": "TestSub",
            "deliveryDays": 2,
            "description": "Test description",
            "semanticTags": ["tag1", "tag2"],
            "missionHints": ["hint1"],
            "prime": True
        })
    }
    
    create_res = controller.create_product(create_event)
    print("Status:", create_res["statusCode"])
    data = json.loads(create_res["body"])["data"]
    print("Response Data:", json.dumps(data, indent=2))
    
    product_id = data["id"]
    
    print("\n--- GET /products/{id} ---")
    get_event = {
        "pathParameters": {"id": product_id}
    }
    get_res = controller.get_product(get_event)
    print("Status:", get_res["statusCode"])
    print("Response Data:", json.dumps(json.loads(get_res["body"])["data"], indent=2))
    
    print("\n--- PUT /products/{id} ---")
    update_event = {
        "pathParameters": {"id": product_id},
        "body": json.dumps({
            "price": 99.99,
            "stock": 40,
            "prime": False
        })
    }
    update_res = controller.update_product(update_event)
    print("Status:", update_res["statusCode"])
    print("Response Data:", json.dumps(json.loads(update_res["body"])["data"], indent=2))
    
    print("\n--- GET /products ---")
    list_event = {
        "queryStringParameters": {"category": "TEST_CAT"}
    }
    list_res = controller.list_products(list_event)
    print("Status:", list_res["statusCode"])
    print("Items found:", len(json.loads(list_res["body"])["data"]))
    print("First Item:", json.dumps(json.loads(list_res["body"])["data"][0], indent=2))

    print("\n--- DELETE /products/{id} ---")
    delete_res = controller.delete_product(get_event)
    print("Status:", delete_res["statusCode"])
    
if __name__ == "__main__":
    test_endpoints()
