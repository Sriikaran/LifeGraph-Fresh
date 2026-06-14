import uuid
from typing import List
from shared.repositories.product_repository import ProductRepository
from shared.models.product_model import ProductModel
from shared.schemas.product_schemas import ProductCreate, ProductUpdate
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
            category=data.category,
            title=data.title,
            image=data.image,
            brand=data.brand,
            mrp=data.mrp,
            rating=data.rating,
            reviews=data.reviews,
            subcategory=data.subcategory,
            deliveryDays=data.deliveryDays,
            description=data.description,
            semanticTags=data.semanticTags,
            missionHints=data.missionHints,
            prime=data.prime
        )
        return self.repository.create_product(product)

    def get_product(self, product_id: str) -> ProductModel:
        product = self.repository.get_product(product_id)
        if not product:
            raise NotFoundException("Product", product_id)
        return product

    def update_product(self, product_id: str, data: ProductUpdate) -> ProductModel:
        product = self.get_product(product_id)
        if data.name is not None: product.name = data.name
        if data.price is not None: product.price = data.price
        if data.stock is not None: product.stock = data.stock
        if data.category is not None: product.category = data.category
        if data.title is not None: product.title = data.title
        if data.image is not None: product.image = data.image
        if data.brand is not None: product.brand = data.brand
        if data.mrp is not None: product.mrp = data.mrp
        if data.rating is not None: product.rating = data.rating
        if data.reviews is not None: product.reviews = data.reviews
        if data.subcategory is not None: product.subcategory = data.subcategory
        if data.deliveryDays is not None: product.deliveryDays = data.deliveryDays
        if data.description is not None: product.description = data.description
        if data.semanticTags is not None: product.semanticTags = data.semanticTags
        if data.missionHints is not None: product.missionHints = data.missionHints
        if data.prime is not None: product.prime = data.prime
        return self.repository.update_product(product)

    def delete_product(self, product_id: str) -> None:
        self.get_product(product_id)
        self.repository.delete_product(product_id)

    def list_products_by_category(self, category: str) -> List[ProductModel]:
        return self.repository.list_products_by_category(category)

    def list_products(self) -> List[ProductModel]:
        return self.repository.list_products()
