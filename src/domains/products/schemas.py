from pydantic import BaseModel, Field

from typing import List

class ProductBase(BaseModel):
    name: str
    price: float = Field(ge=0)
    stock: int = Field(ge=0)
    category: str
    title: str | None = None
    image: str | None = None
    brand: str | None = None
    mrp: float | None = None
    rating: float | None = None
    reviews: int | None = None
    subcategory: str | None = None
    deliveryDays: int | None = None
    description: str | None = None
    semanticTags: list[str] | None = None
    missionHints: list | None = None
    prime: bool | None = None
    embeddingText: str | None = None

class ProductCreate(ProductBase):
    pass

class ProductUpdate(BaseModel):
    name: str | None = None
    price: float | None = Field(None, ge=0)
    stock: int | None = Field(None, ge=0)
    category: str | None = None
    title: str | None = None
    image: str | None = None
    brand: str | None = None
    mrp: float | None = None
    rating: float | None = None
    reviews: int | None = None
    subcategory: str | None = None
    deliveryDays: int | None = None
    description: str | None = None
    semanticTags: list[str] | None = None
    missionHints: list | None = None
    prime: bool | None = None

class ProductResponse(ProductBase):
    id: str
