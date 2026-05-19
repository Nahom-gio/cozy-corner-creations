# Maison

Curated modern furniture storefront built with the MERN stack.

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
- `npm run install:all` installs dependencies for both folders.

## MongoDB Setup

1. Create `server/.env` from `server/.env.example`.
2. Set `MONGODB_URI` to your MongoDB connection string.
3. Seed the product catalog:

```bash
npm --prefix server run seed:products
```

4. Start the backend:

```bash
npm run server:dev
```

The frontend reads products from `/api/products`. If MongoDB is not connected, the backend uses the sample product data so the app can still run locally.
