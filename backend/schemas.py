"""
Pydantic schemas for request/response validation.
"""
from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, EmailStr


# ─── Auth ───────────────────────────────────────────────
class UserRegister(BaseModel):
    email: str
    username: str
    password: str
    full_name: Optional[str] = None


class UserLogin(BaseModel):
    username: str
    password: str


class UserResponse(BaseModel):
    id: int
    email: str
    username: str
    full_name: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse


# ─── Products ───────────────────────────────────────────
class ProductResponse(BaseModel):
    id: int
    name: str
    origin: str
    category: str
    roast_level: str
    price: float
    weight: str
    description: str
    flavor_notes: str
    altitude: str
    process: str
    image: str
    stock: int

    class Config:
        from_attributes = True


# ─── Cart ───────────────────────────────────────────────
class CartItemAdd(BaseModel):
    product_id: int
    quantity: int = 1


class CartItemUpdate(BaseModel):
    quantity: int


class CartItemResponse(BaseModel):
    id: int
    product_id: int
    quantity: int
    product: ProductResponse

    class Config:
        from_attributes = True


class CartResponse(BaseModel):
    items: List[CartItemResponse]
    total_items: int
    total_price: float


# ─── Orders ─────────────────────────────────────────────
class OrderCreate(BaseModel):
    customer_name: str
    customer_email: str
    address: str
    city: str
    zip_code: str


class OrderItemResponse(BaseModel):
    id: int
    product_id: int
    product_name: str
    quantity: int
    unit_price: float

    class Config:
        from_attributes = True


class OrderResponse(BaseModel):
    id: int
    status: str
    total: float
    customer_name: str
    customer_email: str
    address: str
    city: str
    zip_code: str
    created_at: datetime
    items: List[OrderItemResponse]

    class Config:
        from_attributes = True


class MessageResponse(BaseModel):
    message: str
    order_id: Optional[int] = None
