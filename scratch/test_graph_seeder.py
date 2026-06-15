import sys
import os

# Add src to path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../../src')))

from shared.services.graph_seeder_service import GraphSeederService
from shared.models.product_model import ProductModel

def test_product_model_instantiation():
    try:
        # This matches the signature used in graph_seeder_service.py
        p = ProductModel(
            id="test-123",
            name="Test Product",
            price=99.99,
            stock=10,
            category="TEST_CATEGORY"
        )
        print("SUCCESS: ProductModel instantiated correctly with only required arguments.")
        print(f"Title is: {p.title}")
    except Exception as e:
        print(f"FAILED: {e}")
        sys.exit(1)

def test_graph_seeder_import():
    try:
        seeder = GraphSeederService()
        print("SUCCESS: GraphSeederService imported and initialized without errors.")
    except Exception as e:
        print(f"FAILED: {e}")
        sys.exit(1)

if __name__ == "__main__":
    test_product_model_instantiation()
    test_graph_seeder_import()
