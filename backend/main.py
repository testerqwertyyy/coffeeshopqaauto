"""
Artisan Roast — Specialty Coffee API
FastAPI backend with SQLite database.

Run:  uvicorn main:app --reload --port 8000
Docs: http://localhost:8000/docs
"""
import json
from datetime import datetime, timedelta
from typing import List, Optional

from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import JWTError, jwt
from passlib.context import CryptContext
from sqlalchemy.orm import Session

from database import get_db, init_db
from models import User, Product, CartItem, Order, OrderItem
from schemas import (
    UserRegister, UserLogin, UserResponse, TokenResponse,
    ProductResponse,
    CartItemAdd, CartItemUpdate, CartItemResponse, CartResponse,
    OrderCreate, OrderResponse, OrderItemResponse, MessageResponse,
)

# ─── App ────────────────────────────────────────────────
app = FastAPI(title="Artisan Roast API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── Security ───────────────────────────────────────────
SECRET_KEY = "artisan-roast-secret-key-change-in-production"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24  # 24 hours

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
security = HTTPBearer(auto_error=False)


def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(plain: str, hashed: str) -> bool:
    return pwd_context.verify(plain, hashed)


def create_access_token(data: dict) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


def get_current_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security),
    db: Session = Depends(get_db),
) -> User:
    """Extract and validate JWT, return current user."""
    if credentials is None:
        raise HTTPException(status_code=401, detail="Not authenticated")
    token = credentials.credentials
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: int = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid token")
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

    user = db.query(User).filter(User.id == user_id).first()
    if user is None:
        raise HTTPException(status_code=401, detail="User not found")
    return user


# ─── Startup ────────────────────────────────────────────
@app.on_event("startup")
def on_startup():
    init_db()
    seed_products()


def seed_products():
    """Seed the database with specialty coffee products if empty."""
    from database import SessionLocal
    db = SessionLocal()
    try:
        if db.query(Product).count() == 0:
            products = [
                Product(
                    name="Ethiopia Yirgacheffe", origin="Ethiopia", category="light",
                    roast_level="light", price=24.99, weight="250g",
                    description="A stunning single-origin coffee from the birthplace of coffee. Delicate floral aromatics with a bright, tea-like body.",
                    flavor_notes=json.dumps(["Jasmine", "Bergamot", "Peach", "Honey"]),
                    altitude="1,900 - 2,200m", process="Washed",
                    image="https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&h=400&fit=crop"
                ),
                Product(
                    name="Colombia Huila", origin="Colombia", category="medium",
                    roast_level="medium", price=21.99, weight="250g",
                    description="From the lush mountains of Huila department. A perfectly balanced cup showcasing the terroir of one of Colombia's finest regions.",
                    flavor_notes=json.dumps(["Caramel", "Red Apple", "Milk Chocolate", "Walnut"]),
                    altitude="1,600 - 1,800m", process="Washed",
                    image="https://images.unsplash.com/photo-1587734195503-904fca47e0e9?w=400&h=400&fit=crop"
                ),
                Product(
                    name="Kenya AA Nyeri", origin="Kenya", category="light",
                    roast_level="light", price=28.99, weight="250g",
                    description="A premium AA grade lot from the red volcanic soils of Nyeri county. Explosively complex cup with vibrant acidity.",
                    flavor_notes=json.dumps(["Blackcurrant", "Grapefruit", "Tomato", "Brown Sugar"]),
                    altitude="1,700 - 1,900m", process="Washed",
                    image="https://images.unsplash.com/photo-1611854779393-1b2da9d400fe?w=400&h=400&fit=crop"
                ),
                Product(
                    name="Brazil Santos Natural", origin="Brazil", category="medium",
                    roast_level="medium", price=18.99, weight="250g",
                    description="A classic Brazilian natural process coffee from Cerrado Mineiro. Smooth, sweet cup with low acidity and velvety body.",
                    flavor_notes=json.dumps(["Hazelnut", "Dark Chocolate", "Dried Fig", "Vanilla"]),
                    altitude="1,000 - 1,200m", process="Natural",
                    image="https://images.unsplash.com/photo-1610632380989-680fe40816c6?w=400&h=400&fit=crop"
                ),
                Product(
                    name="Guatemala Antigua", origin="Guatemala", category="dark",
                    roast_level="dark", price=22.99, weight="250g",
                    description="Grown in the shadow of three volcanoes. Dark roasted to bring out deep, smoky sweetness with a full body.",
                    flavor_notes=json.dumps(["Dark Cocoa", "Smoky", "Spice", "Molasses"]),
                    altitude="1,500 - 1,700m", process="Washed",
                    image="https://images.unsplash.com/photo-1514432324607-a09d9b4aefda?w=400&h=400&fit=crop"
                ),
                Product(
                    name="Costa Rica Tarrazú", origin="Costa Rica", category="dark",
                    roast_level="dark", price=23.99, weight="250g",
                    description="Honey-processed coffee from the renowned Tarrazú region. Rich, complex flavors with remarkable depth.",
                    flavor_notes=json.dumps(["Toffee", "Roasted Almond", "Cherry", "Cane Sugar"]),
                    altitude="1,400 - 1,700m", process="Honey",
                    image="https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=400&h=400&fit=crop"
                ),
            ]
            db.add_all(products)
            db.commit()
    finally:
        db.close()


# ═════════════════════════════════════════════════════════
#  AUTH ROUTES
# ═════════════════════════════════════════════════════════

@app.post("/api/auth/register", response_model=TokenResponse, tags=["Auth"])
def register(data: UserRegister, db: Session = Depends(get_db)):
    """Register a new user account."""
    if db.query(User).filter(User.email == data.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")
    if db.query(User).filter(User.username == data.username).first():
        raise HTTPException(status_code=400, detail="Username already taken")

    user = User(
        email=data.email,
        username=data.username,
        hashed_password=hash_password(data.password),
        full_name=data.full_name,
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    token = create_access_token({"sub": user.id})
    return TokenResponse(access_token=token, user=UserResponse.model_validate(user))


@app.post("/api/auth/login", response_model=TokenResponse, tags=["Auth"])
def login(data: UserLogin, db: Session = Depends(get_db)):
    """Authenticate user and return JWT token."""
    user = db.query(User).filter(User.username == data.username).first()
    if not user or not verify_password(data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_access_token({"sub": user.id})
    return TokenResponse(access_token=token, user=UserResponse.model_validate(user))


@app.get("/api/auth/me", response_model=UserResponse, tags=["Auth"])
def get_me(current_user: User = Depends(get_current_user)):
    """Get current authenticated user profile."""
    return current_user


# ═════════════════════════════════════════════════════════
#  PRODUCT ROUTES
# ═════════════════════════════════════════════════════════

@app.get("/api/products", response_model=List[ProductResponse], tags=["Products"])
def list_products(
    category: Optional[str] = None,
    search: Optional[str] = None,
    db: Session = Depends(get_db),
):
    """Get all products with optional category and search filters."""
    query = db.query(Product)
    if category and category != "all":
        query = query.filter(Product.category == category)
    if search:
        search_filter = f"%{search}%"
        query = query.filter(
            (Product.name.ilike(search_filter)) |
            (Product.origin.ilike(search_filter)) |
            (Product.description.ilike(search_filter))
        )
    return query.all()


@app.get("/api/products/{product_id}", response_model=ProductResponse, tags=["Products"])
def get_product(product_id: int, db: Session = Depends(get_db)):
    """Get a single product by ID."""
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product


# ═════════════════════════════════════════════════════════
#  CART ROUTES
# ═════════════════════════════════════════════════════════

@app.get("/api/cart", response_model=CartResponse, tags=["Cart"])
def get_cart(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Get current user's cart with all items."""
    items = db.query(CartItem).filter(CartItem.user_id == current_user.id).all()
    total_items = sum(i.quantity for i in items)
    total_price = sum(i.quantity * i.product.price for i in items)
    return CartResponse(
        items=[CartItemResponse.model_validate(i) for i in items],
        total_items=total_items,
        total_price=round(total_price, 2),
    )


@app.post("/api/cart", response_model=CartResponse, tags=["Cart"])
def add_to_cart(
    data: CartItemAdd,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Add a product to cart (or increase quantity if already present)."""
    product = db.query(Product).filter(Product.id == data.product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    existing = db.query(CartItem).filter(
        CartItem.user_id == current_user.id,
        CartItem.product_id == data.product_id,
    ).first()

    if existing:
        existing.quantity += data.quantity
    else:
        existing = CartItem(
            user_id=current_user.id,
            product_id=data.product_id,
            quantity=data.quantity,
        )
        db.add(existing)

    db.commit()

    items = db.query(CartItem).filter(CartItem.user_id == current_user.id).all()
    total_items = sum(i.quantity for i in items)
    total_price = sum(i.quantity * i.product.price for i in items)
    return CartResponse(
        items=[CartItemResponse.model_validate(i) for i in items],
        total_items=total_items,
        total_price=round(total_price, 2),
    )


@app.put("/api/cart/{item_id}", response_model=CartResponse, tags=["Cart"])
def update_cart_item(
    item_id: int,
    data: CartItemUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Update quantity of a cart item. Removes if quantity <= 0."""
    item = db.query(CartItem).filter(
        CartItem.id == item_id,
        CartItem.user_id == current_user.id,
    ).first()
    if not item:
        raise HTTPException(status_code=404, detail="Cart item not found")

    if data.quantity <= 0:
        db.delete(item)
    else:
        item.quantity = data.quantity

    db.commit()

    items = db.query(CartItem).filter(CartItem.user_id == current_user.id).all()
    total_items = sum(i.quantity for i in items)
    total_price = sum(i.quantity * i.product.price for i in items)
    return CartResponse(
        items=[CartItemResponse.model_validate(i) for i in items],
        total_items=total_items,
        total_price=round(total_price, 2),
    )


@app.delete("/api/cart/{item_id}", response_model=CartResponse, tags=["Cart"])
def remove_from_cart(
    item_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Remove an item from the cart."""
    item = db.query(CartItem).filter(
        CartItem.id == item_id,
        CartItem.user_id == current_user.id,
    ).first()
    if not item:
        raise HTTPException(status_code=404, detail="Cart item not found")

    db.delete(item)
    db.commit()

    items = db.query(CartItem).filter(CartItem.user_id == current_user.id).all()
    total_items = sum(i.quantity for i in items)
    total_price = sum(i.quantity * i.product.price for i in items)
    return CartResponse(
        items=[CartItemResponse.model_validate(i) for i in items],
        total_items=total_items,
        total_price=round(total_price, 2),
    )


@app.delete("/api/cart", response_model=MessageResponse, tags=["Cart"])
def clear_cart(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Clear all items from the cart."""
    db.query(CartItem).filter(CartItem.user_id == current_user.id).delete()
    db.commit()
    return MessageResponse(message="Cart cleared")


# ═════════════════════════════════════════════════════════
#  ORDER ROUTES
# ═════════════════════════════════════════════════════════

@app.post("/api/orders", response_model=OrderResponse, tags=["Orders"])
def create_order(
    data: OrderCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Create an order from the current cart contents.
    Moves cart items into order, then clears the cart.
    """
    cart_items = db.query(CartItem).filter(CartItem.user_id == current_user.id).all()
    if not cart_items:
        raise HTTPException(status_code=400, detail="Cart is empty")

    total = sum(ci.quantity * ci.product.price for ci in cart_items)

    order = Order(
        user_id=current_user.id,
        total=round(total, 2),
        customer_name=data.customer_name,
        customer_email=data.customer_email,
        address=data.address,
        city=data.city,
        zip_code=data.zip_code,
    )
    db.add(order)
    db.flush()

    for ci in cart_items:
        order_item = OrderItem(
            order_id=order.id,
            product_id=ci.product_id,
            product_name=ci.product.name,
            quantity=ci.quantity,
            unit_price=ci.product.price,
        )
        db.add(order_item)
        # Decrease stock
        ci.product.stock -= ci.quantity
        # Remove cart item individually (safe for session state)
        db.delete(ci)

    db.commit()
    db.refresh(order)

    return order


@app.get("/api/orders", response_model=List[OrderResponse], tags=["Orders"])
def list_orders(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get all orders for the current user."""
    orders = db.query(Order).filter(Order.user_id == current_user.id).order_by(Order.created_at.desc()).all()
    return orders


@app.get("/api/orders/{order_id}", response_model=OrderResponse, tags=["Orders"])
def get_order(
    order_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get a specific order by ID."""
    order = db.query(Order).filter(Order.id == order_id, Order.user_id == current_user.id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order


# ─── Health ─────────────────────────────────────────────
@app.get("/api/health", tags=["System"])
def health_check():
    return {"status": "ok", "service": "Artisan Roast API"}
