# ☕ Artisan Roast — Full-Stack Specialty Coffee E-Commerce

Полноценное веб-приложение электронной коммерции для спешелти-кофе с Python бэкендом и React фронтендом.

---

## 🏗️ Архитектура

```
┌─────────────────────────────────────────────────────┐
│                  FRONTEND (React + Vite)             │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌────────┐ │
│  │  Auth    │ │ Products │ │   Cart   │ │ Orders │ │
│  │  Modal   │ │  Grid    │ │  Panel   │ │  Panel │ │
│  └────┬─────┘ └────┬─────┘ └────┬─────┘ └───┬────┘ │
│       │            │            │            │       │
│       └────────────┴────────────┴────────────┘       │
│                         │                            │
│                   API Client                         │
│              (services/api.ts)                       │
└────────────────────────┬────────────────────────────┘
                         │ HTTP + JWT
┌────────────────────────┴────────────────────────────┐
│              BACKEND (FastAPI + SQLite)               │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌────────┐ │
│  │  Auth    │ │ Products │ │   Cart   │ │ Orders │ │
│  │  Router  │ │  Router  │ │  Router  │ │ Router │ │
│  └────┬─────┘ └────┬─────┘ └────┬─────┘ └───┬────┘ │
│       │            │            │            │       │
│       └────────────┴────────────┴────────────┘       │
│                         │                            │
│                    SQLAlchemy ORM                     │
│                         │                            │
│                   ┌─────┴─────┐                      │
│                   │  SQLite   │                      │
│                   │  app.db   │                      │
│                   └───────────┘                      │
└─────────────────────────────────────────────────────┘
```

---

## 📋 API Ручки (Endpoints)

### 🔐 Авторизация (`/api/auth`)

| Метод | URL | Описание | Auth |
|-------|-----|----------|------|
| `POST` | `/api/auth/register` | Регистрация нового пользователя | ❌ |
| `POST` | `/api/auth/login` | Вход, получение JWT токена | ❌ |
| `GET`  | `/api/auth/me` | Профиль текущего пользователя | ✅ |

**Пример — Регистрация:**
```bash
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","username":"john","password":"secret123","full_name":"John Doe"}'
```

**Пример — Логин:**
```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"john","password":"secret123"}'
```

**Ответ:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "token_type": "bearer",
  "user": {
    "id": 1,
    "email": "john@example.com",
    "username": "john",
    "full_name": "John Doe",
    "created_at": "2024-01-15T10:30:00"
  }
}
```

---

### ☕ Товары (`/api/products`)

| Метод | URL | Описание | Auth |
|-------|-----|----------|------|
| `GET` | `/api/products` | Список товаров (фильтры: `?category=light&search=ethiopia`) | ❌ |
| `GET` | `/api/products/{id}` | Детали товара по ID | ❌ |

**Пример:**
```bash
curl http://localhost:8000/api/products?category=light&search=ethiopia
```

---

### 🛒 Корзина (`/api/cart`)

| Метод | URL | Описание | Auth |
|-------|-----|----------|------|
| `GET`    | `/api/cart` | Получить содержимое корзины | ✅ |
| `POST`   | `/api/cart` | Добавить товар в корзину | ✅ |
| `PUT`    | `/api/cart/{item_id}` | Обновить количество | ✅ |
| `DELETE` | `/api/cart/{item_id}` | Удалить товар из корзины | ✅ |
| `DELETE` | `/api/cart` | Очистить корзину | ✅ |

**Пример — Добавить в корзину:**
```bash
curl -X POST http://localhost:8000/api/cart \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"product_id": 1, "quantity": 2}'
```

**Пример — Обновить количество:**
```bash
curl -X PUT http://localhost:8000/api/cart/1 \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"quantity": 5}'
```

**Ответ:**
```json
{
  "items": [
    {
      "id": 1,
      "product_id": 1,
      "quantity": 2,
      "product": { "id": 1, "name": "Ethiopia Yirgacheffe", "price": 24.99, ... }
    }
  ],
  "total_items": 2,
  "total_price": 49.98
}
```

---

### 📦 Заказы (`/api/orders`)

| Метод | URL | Описание | Auth |
|-------|-----|----------|------|
| `POST` | `/api/orders` | Создать заказ из корзины | ✅ |
| `GET`  | `/api/orders` | Список заказов пользователя | ✅ |
| `GET`  | `/api/orders/{id}` | Детали конкретного заказа | ✅ |

**Пример — Создать заказ:**
```bash
curl -X POST http://localhost:8000/api/orders \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "customer_name": "John Doe",
    "customer_email": "john@example.com",
    "address": "123 Coffee Street",
    "city": "Portland",
    "zip_code": "97201"
  }'
```

**Логика создания заказа:**
1. Берёт все товары из корзины пользователя
2. Создаёт запись `Order` с итоговой суммой
3. Для каждого товара создаёт `OrderItem` (с фиксацией цены на момент покупки)
4. Уменьшает `stock` у каждого товара
5. Очищает корзину

---

### 🏥 Система

| Метод | URL | Описание |
|-------|-----|----------|
| `GET` | `/api/health` | Проверка работоспособности |
| `GET` | `/docs` | Swagger UI (автодокументация) |
| `GET` | `/redoc` | ReDoc документация |

---

## 🗄️ Структура Базы Данных

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│    users     │     │  cart_items  │     │   products   │
├──────────────┤     ├──────────────┤     ├──────────────┤
│ id (PK)      │◄────│ user_id (FK) │     │ id (PK)      │
│ email        │     │ id (PK)      │────►│ name         │
│ username     │     │ product_id   │     │ origin       │
│ hashed_pass  │     │ quantity     │     │ category     │
│ full_name    │     │ added_at     │     │ roast_level  │
│ created_at   │     └──────────────┘     │ price        │
└──────┬───────┘                          │ weight       │
       │                                  │ description  │
       │         ┌──────────────┐         │ flavor_notes │
       │         │   orders     │         │ altitude     │
       │         ├──────────────┤         │ process      │
       └────────►│ user_id (FK) │         │ image        │
                 │ id (PK)      │         │ stock        │
                 │ status       │         └──────────────┘
                 │ total        │
                 │ customer_*   │         ┌──────────────┐
                 │ created_at   │         │ order_items  │
                 └──────┬───────┘         ├──────────────┤
                        │                 │ id (PK)      │
                        └────────────────►│ order_id(FK) │
                                          │ product_id   │
                                          │ product_name │
                                          │ quantity     │
                                          │ unit_price   │
                                          └──────────────┘
```

---

## 🚀 Запуск проекта

### 1. Бэкенд (Python)

```bash
cd backend

# Создать виртуальное окружение
python -m venv venv
source venv/bin/activate  # Linux/Mac
# или: venv\Scripts\activate  # Windows

# Установить зависимости
pip install -r requirements.txt

# Запустить сервер
uvicorn main:app --reload --port 8000
```

Бэкенд будет доступен на `http://localhost:8000`
Swagger документация: `http://localhost:8000/docs`

### 2. Фронтенд (React)

```bash
# В корне проекта
npm install
npm run dev
```

Фронтенд будет на `http://localhost:3000`

### 3. Переменные окружения (опционально)

Создайте файл `.env` в корне проекта:
```
VITE_API_URL=http://localhost:8000
```

---

## 🔑 Аутентификация

- Используется **JWT (JSON Web Token)**
- Токен возвращается при логине/регистрации
- Передаётся в заголовке: `Authorization: Bearer <token>`
- Срок действия: 24 часа
- Пароли хешируются через **bcrypt**

---

## 📁 Структура файлов

```
├── backend/
│   ├── main.py            # FastAPI приложение + все роутеры
│   ├── database.py        # Подключение к SQLite
│   ├── models.py          # SQLAlchemy модели (5 таблиц)
│   ├── schemas.py         # Pydantic схемы валидации
│   └── requirements.txt   # Python зависимости
│
├── src/
│   ├── App.tsx            # Главный компонент
│   ├── services/
│   │   └── api.ts         # API клиент (auth, products, cart, orders)
│   ├── context/
│   │   ├── AuthContext.tsx # Контекст авторизации
│   │   └── CartContext.tsx # Контекст корзины (через API)
│   ├── components/
│   │   ├── Header.tsx      # Шапка с навигацией
│   │   ├── ProductCard.tsx # Карточка товара
│   │   ├── ProductDetail.tsx # Детали товара
│   │   ├── SearchFilter.tsx  # Поиск и фильтры
│   │   ├── Cart.tsx        # Панель корзины
│   │   ├── Checkout.tsx    # Оформление заказа
│   │   ├── AuthModal.tsx   # Модальное окно входа/регистрации
│   │   └── OrdersPanel.tsx # История заказов
│   └── types/
│       └── index.ts       # TypeScript типы
│
└── README.md              # Этот файл
```
