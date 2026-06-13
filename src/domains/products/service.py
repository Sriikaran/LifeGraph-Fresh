import uuid
from typing import List
from domains.products.repository import ProductRepository
from domains.products.models import ProductModel
from domains.products.schemas import ProductCreate
from core.exceptions import NotFoundException

class ProductService:
    def __init__(self):
        self.repository = ProductRepository()

    def create_product(self, data: ProductCreate) -> ProductModel:
        product_id = str(uuid.uuid4())
        product = ProductModel(
            id=product_id, 
            name=data.name, 
            price=data.price, 
            stock=data.stock, 
            category=data.category
        )
        return self.repository.create_product(product)

    def get_product(self, product_id: str) -> ProductModel:
        product = self.repository.get_product(product_id)
        if not product:
            raise NotFoundException("Product", product_id)
        return product

    def update_product(self, product_id: str, data: ProductCreate) -> ProductModel:
        product = self.get_product(product_id)
        product.name = data.name
        product.price = data.price
        product.stock = data.stock
        product.category = data.category
        return self.repository.update_product(product)

    def delete_product(self, product_id: str) -> None:
        self.get_product(product_id)
        self.repository.delete_product(product_id)

    def list_products_by_category(self, category: str) -> List[ProductModel]:
        return self.repository.list_products_by_category(category)

    def list_products(self) -> List[ProductModel]:
        return self.repository.list_products()
