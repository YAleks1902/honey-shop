# Мёд из Кадымки — E-Commerce Shop

Full-stack honey e-commerce site built with React + TypeScript + Node.js + Express + PostgreSQL.

## Tech Stack

| Layer | Technologies |
|---|---|
| Frontend | React 18, TypeScript, Vite, Tailwind CSS, Zustand, TanStack Query, React Hook Form + Zod, Axios |
| Backend | Node.js, Express, TypeScript, Prisma ORM |
| Database | PostgreSQL |
| Auth | JWT (access + refresh tokens), bcrypt |

## Project Structure

```
honey/
├── client/     # React frontend (Vite)
└── server/     # Express backend
    └── prisma/ # Database schema and seed
```

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL (running locally or via Docker)

### 1. Clone and install dependencies

```bash
npm run install:all
```

### 2. Set up the database

Copy the env example and fill in your database URL:

```bash
cp server/.env.example server/.env
# Edit server/.env with your PostgreSQL connection string
```

Create the database:

```bash
createdb honey_db
```

Run Prisma migrations:

```bash
cd server
npx prisma migrate dev --name init
```

Seed sample data:

```bash
npm run prisma:seed
```

### 3. Start development servers

From the root:

```bash
npm run dev
```

This starts:
- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:3001

### Test user

After seeding, you can log in with:
- **Email**: test@example.com
- **Password**: password123

## API Endpoints

| Method | Route | Description |
|---|---|---|
| POST | /api/auth/register | Register new user |
| POST | /api/auth/login | Login |
| POST | /api/auth/logout | Logout |
| POST | /api/auth/refresh | Refresh access token |
| POST | /api/auth/forgot-password | Request password reset |
| GET | /api/products | List products (with filters) |
| GET | /api/products/featured | Featured products for homepage |
| GET | /api/products/popular | Popular products |
| GET | /api/products/:slug | Single product detail |
| GET | /api/categories | All categories |
| POST | /api/orders | Create order |
| GET | /api/orders | User's orders |
| GET | /api/favorites | User's favorites |
| POST | /api/favorites/:productId | Add to favorites |
| DELETE | /api/favorites/:productId | Remove from favorites |
| GET | /api/reviews/:productId | Product reviews |
| POST | /api/reviews/:productId | Create review |
| GET | /api/users/profile | Get user profile |
| PUT | /api/users/profile | Update profile |
| PUT | /api/users/address | Update address |

## Pages

| Route | Description |
|---|---|
| / | Homepage with hero, featured products, reviews, newsletter |
| /catalog | Product catalog with filters, search, sorting |
| /catalog/:slug | Product detail with volume selector and reviews |
| /cart | Shopping cart (empty state + filled) |
| /checkout | Checkout with shipping/payment selection |
| /account/orders | User's order history |
| /account/profile | Edit profile and password |
| /account/address | Edit shipping address |

## Docker (optional)

Start a local PostgreSQL quickly:

```bash
docker run --name honey-db -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=honey_db -p 5432:5432 -d postgres:15
```

Then set `DATABASE_URL="postgresql://postgres:postgres@localhost:5432/honey_db"` in `server/.env`.
