# Ethio

Curated modern furniture storefront built with the MERN stack. The project includes customer accounts, favorites, persistent carts, inventory-aware checkout, MongoDB-backed orders, and role-protected catalog administration.

## Project Structure

- `client/` contains the React, TypeScript, Vite, and Tailwind frontend.
- `server/` contains the Express, Node.js, and MongoDB backend.

## Stack

- MongoDB
- Express
- React
- Node.js

## Scripts

- `npm run client` starts the React frontend.
- `npm run server:dev` starts the Express backend with auto-reload.
- `npm run build` builds the frontend for production.
- `npm test` runs frontend and backend tests.
- `npm run test:e2e` opens the local app and runs a Playwright storefront smoke test.
- `npm run lint` checks the frontend code.
- `npm run install:all` installs dependencies for both folders.
- `docker compose up -d` starts the project MongoDB and browser dashboard.

## MongoDB Setup

1. Create `server/.env` from `server/.env.example`.
2. Set `MONGODB_URI`, `JWT_SECRET`, `ADMIN_EMAIL`, and `ADMIN_PASSWORD`.
3. To use the included Docker Compose services, run `docker compose up -d` and set `MONGODB_URI=mongodb://admin:secret@127.0.0.1:27018/maison?authSource=admin`. The MongoDB dashboard will be available at `http://localhost:8083`.
4. Seed the product catalog and admin account:

```bash
npm --prefix server run seed:products
npm --prefix server run seed:admin
```

Run the seed command again after changing the product schema. It replaces the catalog with the current starter products, including gallery images and product specifications.

5. Start the backend:

```bash
npm run server:dev
```

6. Start the frontend in a second terminal:

```bash
npm run client
```

Open `http://localhost:8080`. Register a customer account to save favorites and place orders. Sign in with the seeded admin account at `/auth`, then use `/admin` to demonstrate dashboard totals, catalog CRUD, inventory, gallery uploads, cover-image selection, order review, and fulfillment status updates.

## Product Images

Admins can upload one or more JPG, PNG, WEBP, or GIF product images from `/admin`, preview the gallery, and select the storefront cover image. The API validates files up to 5 MB each, saves them under `server/uploads/`, and stores only `/uploads/...` URLs in MongoDB. Uploaded files are intentionally ignored by Git; keep a backup or move to cloud storage before deploying across multiple servers.

## Final Manual Checks

Before presenting the project, create one customer account and place one checkout order in the browser. Then sign in as the seeded admin, upload your preferred product photos, confirm the dashboard totals, and move that order through the fulfillment statuses. These visual checks use your actual local data and are intentionally left manual.

## API

- `GET /api/health` checks API and MongoDB health.
- `GET /api/products` lists products.
- `GET /api/products/:id` returns one product.
- `POST /api/auth/register` creates a customer account.
- `POST /api/auth/login` creates an authenticated session.
- `PUT /api/auth/wishlist/:productId` toggles an authenticated customer's favorite.
- `POST`, `PUT`, and `DELETE /api/products` routes require an admin session.
- `POST /api/uploads` accepts an admin-authenticated image upload.
- `POST /api/orders` validates stock, recalculates totals, reduces inventory, and stores an authenticated customer's order.
- `GET /api/orders` returns the signed-in customer's orders or all orders for an admin.
- `PUT /api/orders/:orderNumber/status` lets an admin update fulfillment status.

The frontend deliberately shows API failures instead of silently displaying hardcoded catalog data. This makes it clear during development and grading whether MongoDB is actually connected.
