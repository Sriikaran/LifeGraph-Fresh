from typing import Dict, Any, List, Optional

class ProductModel:
    def __init__(self, id: str, name: str, price: float, stock: int, category: str,
                 title: str | None = None, image: str | None = None, brand: str | None = None,
                 mrp: float | None = None, rating: float | None = None, reviews: int | None = None,
                 subcategory: str | None = None, deliveryDays: int | None = None,
                 description: str | None = None, semanticTags: List[str] | None = None,
                 missionHints: List[str] | None = None, prime: bool | None = None,
                 embeddingText: str = ""):
        self.id = id
        self.name = name
        self.price = price
        self.stock = stock
        self.category = category
        self.title = title
        self.image = image
        self.brand = brand
        self.mrp = mrp
        self.rating = rating
        self.reviews = reviews
        self.subcategory = subcategory
        self.deliveryDays = deliveryDays
        self.description = description
        self.semanticTags = semanticTags or []
        self.missionHints = missionHints or []
        self.prime = prime
        self.embeddingText = embeddingText

    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> 'ProductModel':
        name = data.get('name') or data.get('title') or ''
        title = data.get('title') or data.get('name') or ''
        return cls(
            id=data.get('id', ''),
            name=name,
            price=float(data.get('price', 0.0)),
            stock=int(data.get('stock', 0)),
            category=data.get('category', ''),
            title=data.get('title') or data.get('name') or '',
            image=data.get('image', ''),
            brand=data.get('brand', ''),
            mrp=float(data.get('mrp', 0.0)) if data.get('mrp') is not None else 0.0,
            rating=float(data.get('rating', 0.0)) if data.get('rating') is not None else 0.0,
            reviews=int(data.get('reviews', 0)) if data.get('reviews') is not None else 0,
            subcategory=data.get('subcategory', ''),
            deliveryDays=int(data.get('deliveryDays', 3)) if data.get('deliveryDays') is not None else 3,
            description=data.get('description', ''),
            semanticTags=data.get('semanticTags', []),
            missionHints=[
                {k: float(v) if type(v).__name__ == 'Decimal' else v for k, v in m.items()} if isinstance(m, dict) else m
                for m in data.get('missionHints', [])
            ] if data.get('missionHints') else [],
            prime=bool(data.get('prime', False)) if data.get('prime') is not None else False,
            embeddingText=data.get('embeddingText', '')
        )

    def to_dict(self) -> Dict[str, Any]:
        from decimal import Decimal
        d = {
            'PK': f"PRODUCT#{self.id}",
            'SK': "METADATA",
            'entityType': "PRODUCT",
            'id': self.id,
            'name': self.name,
            'title': self.title,
            'brand': self.brand,
            'price': Decimal(str(self.price)),
            'mrp': Decimal(str(self.mrp)),
            'stock': self.stock,
            'category': self.category,
            'subcategory': self.subcategory,
            'description': self.description,
            'rating': Decimal(str(self.rating)),
            'reviews': self.reviews,
            'image': self.image,
            'prime': self.prime,
            'deliveryDays': self.deliveryDays,
            'semanticTags': self.semanticTags,
            'missionHints': self.missionHints,
            'embeddingText': self.embeddingText,
            'GSI1PK': f"CATEGORY#{self.category}",
            'GSI1SK': f"PRODUCT#{self.id}"
        }
        if self.title is not None: d['title'] = self.title
        if self.image is not None: d['image'] = self.image
        if self.brand is not None: d['brand'] = self.brand
        if self.mrp is not None: d['mrp'] = Decimal(str(self.mrp))
        if self.rating is not None: d['rating'] = Decimal(str(self.rating))
        if self.reviews is not None: d['reviews'] = self.reviews
        if self.subcategory is not None: d['subcategory'] = self.subcategory
        if self.deliveryDays is not None: d['deliveryDays'] = self.deliveryDays
        if self.description is not None: d['description'] = self.description
        if self.semanticTags: d['semanticTags'] = self.semanticTags
        if self.missionHints: d['missionHints'] = self.missionHints
        if self.prime is not None: d['prime'] = self.prime
        return d
