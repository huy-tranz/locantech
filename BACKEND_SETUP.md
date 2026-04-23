# 🖥️ Hướng Dẫn Cài Đặt PostgreSQL Backend - LocAn Tech Store

## 📋 Tổng Quan

```
Frontend (Vite/React)  →  Backend (Express)  →  PostgreSQL (Docker)
     port 5173               port 3001              port 5432
```

---

## Bước 1: Cài Đặt Docker Desktop

1. Download Docker Desktop: https://www.docker.com/products/docker-desktop/
2. Install và khởi động Docker Desktop
3. Verify: `docker --version`

---

## Bước 2: Cài Đặt Dependencies

### 2.1 Cài đặt server dependencies
```bash
cd e:/LocAn_Tech/server
npm install
```

### 2.2 Cài đặt frontend dependencies (thêm axios)
```bash
cd e:/LocAn_Tech
npm install
```

---

## Bước 3: Khởi Tạo Database

### 3.1 Chạy PostgreSQL bằng Docker
```bash
cd e:/LocAn_Tech
docker-compose up -d db
```

### 3.2 Verify PostgreSQL đang chạy
```bash
docker exec -it locan_db psql -U locan -d locan_tech_store
# Gõ \dt để xem các bảng (sẽ trống lúc đầu)
# Gõ \q để thoát
```

### 3.3 Chạy Prisma Migrations
```bash
cd e:/LocAn_Tech/server
npx prisma migrate dev --name init
```

### 3.4 Seed dữ liệu mẫu
```bash
cd e:/LocAn_Tech/server
npx prisma db seed
```

**Kết quả mong đợi:**
```
🚀 Starting database seed...

🔐 Seeding admin account...
✅ Admin created: admin@locan.vn
📂 Seeding categories...
✅ Seeded 43 categories
📦 Seeding products...
✅ Seeded 51 products
🖼️ Seeding banners...
✅ Seeded 5 banners
📰 Seeding news...
✅ Seeded 6 news articles
🔧 Seeding services...
✅ Seeded 8 services

🎉 Database seeding completed successfully!

📋 Admin credentials:
   Email:    admin@locan.vn
   Password: Admin@LocAn2024!
```

---

## Bước 4: Chạy Development Server

### 4.1 Cách 1: Chạy đồng thời (Khuyến nghị)
```bash
# Terminal 1: Backend
cd e:/LocAn_Tech/server
npm run dev

# Terminal 2: Frontend
cd e:/LocAn_Tech
npm run dev:client
```

### 4.2 Cách 2: Chạy song song một lệnh (cần concurrently)
```bash
cd e:/LocAn_Tech
npm run dev
```

### 4.3 Verify server đang chạy
```bash
curl http://localhost:3001/api/health
# Kết quả: {"status":"ok","timestamp":"2026-..."}
```

### 4.4 Verify API Products
```bash
curl http://localhost:3001/api/products
# Kết quả: {"products":[...],"pagination":{...}}
```

---

## Bước 5: Test Đăng Nhập Admin

```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@locan.vn","password":"Admin@LocAn2024!"}'
```

**Kết quả:**
```json
{
  "user": {"id":"...","email":"admin@locan.vn","role":"SUPERADMIN","name":"LocAn Admin"},
  "accessToken": "eyJhbG...",
  "refreshToken": "eyJhbG..."
}
```

---

## 📁 Cấu Trúc File Đã Tạo

### Backend (`server/`)
```
server/
├── Dockerfile
├── package.json
├── tsconfig.json
├── .env.example
├── prisma/
│   ├── schema.prisma          ← Database schema
│   └── seed/                  ← Seed scripts
│       ├── seed.ts
│       ├── seedAdmin.ts
│       ├── seedCategories.ts
│       ├── seedProducts.ts
│       ├── seedBanners.ts
│       ├── seedNews.ts
│       └── seedServices.ts
└── src/
    ├── index.ts               ← Entry point
    ├── app.ts                 ← Express app
    ├── config/
    │   ├── database.ts        ← Prisma client
    │   ├── env.ts             ← Zod validation
    │   └── cors.ts
    ├── routes/                ← API routes
    ├── controllers/           ← Request handlers
    ├── services/             ← Business logic
    ├── middleware/           ← Auth, validation, error
    └── utils/                ← JWT, bcrypt, slug
```

### Frontend (`src/`)
```
src/
├── api/                       ← API client layer
│   ├── axios.ts               ← Axios instance + interceptors
│   ├── auth.api.ts
│   ├── product.api.ts
│   ├── category.api.ts
│   ├── order.api.ts
│   ├── cart.api.ts
│   ├── repair.api.ts
│   └── cms.api.ts
├── hooks/
│   ├── useAuth.tsx           ← Auth context (JWT state)
│   ├── useCartDb.ts          ← Dual-layer cart
│   └── queries/
│       ├── product.queries.ts
│       ├── category.queries.ts
│       ├── order.queries.ts
│       └── cms.queries.ts
```

---

## 🔌 API Endpoints

### Auth
| Method | Endpoint | Mô tả |
|--------|----------|--------|
| POST | `/api/auth/register` | Đăng ký |
| POST | `/api/auth/login` | Đăng nhập |
| POST | `/api/auth/refresh` | Refresh token |
| POST | `/api/auth/logout` | Đăng xuất |
| GET | `/api/auth/me` | Thông tin user hiện tại |

### Products
| Method | Endpoint | Mô tả |
|--------|----------|--------|
| GET | `/api/products` | Danh sách (filter, sort, paginate) |
| GET | `/api/products/:id` | Chi tiết sản phẩm |
| GET | `/api/products/slug/:slug` | Theo slug |
| GET | `/api/products/featured` | Sản phẩm nổi bật |
| GET | `/api/products/best-sellers` | Bán chạy |
| POST/PATCH/DELETE | `/api/products/*` | CRUD (admin) |

### Cart
| Method | Endpoint | Mô tả |
|--------|----------|--------|
| GET | `/api/cart` | Lấy giỏ hàng |
| POST | `/api/cart/items` | Thêm vào giỏ |
| PATCH | `/api/cart/items/:productId` | Cập nhật số lượng |
| DELETE | `/api/cart/items/:productId` | Xóa khỏi giỏ |
| POST | `/api/cart/merge` | Merge localStorage → DB |

### Orders
| Method | Endpoint | Mô tả |
|--------|----------|--------|
| GET | `/api/orders` | Danh sách đơn hàng |
| GET | `/api/orders/:id` | Chi tiết đơn |
| POST | `/api/orders` | Tạo đơn hàng |
| PATCH | `/api/admin/orders/:id/status` | Cập nhật trạng thái (admin) |

---

## 🐳 Docker Production Deployment

### Development (chỉ chạy PostgreSQL)
```bash
docker-compose up -d db
```

### Production (PostgreSQL + Backend API)
```bash
docker-compose up -d
```

### Xem logs
```bash
docker-compose logs -f api
docker-compose logs -f db
```

### Stop services
```bash
docker-compose down
```

---

## 🔒 Bảo Mật

### Thay đổi JWT Secrets (QUAN TRỌNG!)
```bash
# Generate secrets
openssl rand -base64 64
```

Cập nhật `.env`:
```bash
JWT_ACCESS_SECRET=<generated_access_secret>
JWT_REFRESH_SECRET=<generated_refresh_secret>
DB_PASSWORD=<your_strong_password>
```

### Mật khẩu Users hiện có
⚠️ Dữ liệu user hiện tại trong localStorage lưu plain-text password!
- Không thể migrate trực tiếp → bcrypt yêu cầu mật khẩu gốc
- Giải pháp: Thông báo users reset password

---

## 🛠️ Các Lệnh Hữu Ích

```bash
# Reset database (xóa và tạo lại)
cd server
npx prisma migrate reset --force

# Xem database schema trong trình duyệt
npx prisma studio

# Generate Prisma Client (sau khi thay đổi schema)
npx prisma generate

# Chạy migration mới
npx prisma migrate dev --name add_new_field

# Build backend cho production
npm run build

# Xem tất cả API routes
curl http://localhost:3001/api/health
```

---

## ⚠️ Troubleshooting

### Lỗi: `Cannot connect to database`
```bash
# Kiểm tra Docker đang chạy
docker ps

# Restart PostgreSQL
docker-compose restart db

# Kiểm tra connection string
# DATABASE_URL trong .env phải đúng
```

### Lỗi: `port already in use`
```bash
# Tìm process dùng port
netstat -ano | findstr :3001
netstat -ano | findstr :5432

# Kill process hoặc đổi port trong .env
```

### Lỗi: `PrismaClient not initialized`
```bash
cd server
npx prisma generate
npm run dev
```

### Lỗi: Seed failed
```bash
# Reset database
npx prisma migrate reset --force
npx prisma db seed
```

---

## 📊 Cách Dữ Liệu Hoạt Động

```
┌─────────────────────────────────────────────────────────────┐
│  Khách chưa đăng nhập                                       │
│  Cart: localStorage ("locan_cart")                          │
│  → Thêm giỏ hàng → localStorage                             │
│  → Reload → Cart vẫn còn (đã fix ở bước trước)             │
└──────────────────────┬──────────────────────────────────────┘
                       │ User đăng nhập
                       ▼
┌──────────────────────────────────────────────────────────────┐
│  Khách đã đăng nhập                                         │
│  Cart: PostgreSQL (CartItem table)                          │
│  → Login → localStorage cart merge vào DB                   │
│  → Reload → Cart từ DB (vẫn còn)                            │
│  → Logout → localStorage cart được khôi phục               │
└──────────────────────────────────────────────────────────────┘
```
