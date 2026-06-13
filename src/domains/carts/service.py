import uuid
from typing import List
from domains.carts.repository import CartRepository
from domains.carts.models import CartModel, CartItemModel
from domains.carts.schemas import CartCreate, CartAddItem
from core.exceptions import NotFoundException

class CartService:
    def __init__(self):
        self.repository = CartRepository()

    def create_cart(self, data: CartCreate) -> CartModel:
        cart_id = str(uuid.uuid4())
        cart = CartModel(id=cart_id, user_id=data.user_id)
        return self.repository.create_cart(cart)

    def get_cart(self, cart_id: str) -> CartModel:
        cart = self.repository.get_cart(cart_id)
        if not cart:
            raise NotFoundException("Cart", cart_id)
        return cart

    def update_cart(self, cart_id: str, data: CartCreate) -> CartModel:
        cart = self.get_cart(cart_id)
        cart.user_id = data.user_id
        return self.repository.update_cart(cart)

    def delete_cart(self, cart_id: str) -> None:
        self.get_cart(cart_id)
        self.repository.delete_cart(cart_id)

    def list_carts_for_user(self, user_id: str) -> List[CartModel]:
        return self.repository.list_carts_for_user(user_id)

    def list_carts(self) -> List[CartModel]:
        return self.repository.list_carts()

    def add_item(self, cart_id: str, data: CartAddItem) -> None:
        self.get_cart(cart_id)
        
        item = CartItemModel(
            cart_id=cart_id, 
            product_id=data.product_id, 
            quantity=data.quantity
        )
        self.repository.add_item_to_cart(item)

    def get_cart_with_items(self, cart_id: str) -> dict:
        cart = self.get_cart(cart_id)
        items = self.repository.get_cart_items(cart_id)
        
        return {
            "cart": cart,
            "items": items
        }
