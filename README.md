# SB Stocks - Stock Trading Simulation Platform

A full-stack MERN application that allows users to simulate buying and selling US stocks using virtual funds in a realistic trading environment.

## Overview
This platform provides a realistic simulation for paper trading. Users begin with a $100,000 virtual balance and can trade simulated stock options, manage a portfolio, maintain watchlists, and view graphical performance indicators.

## Tech Stack
-   **Frontend**: React (Vite), Redux Toolkit, Tailwind CSS, Chart.js, React Router
-   **Backend**: Node.js, Express, MongoDB (Mongoose), JWT, bcrypt
-   **Architecture**: RESTful API with MVC pattern

## Quick Start Setup

### Prerequisites
Make sure you have Node.js and MongoDB installed locally or a MongoDB Atlas URI ready.

### 1. Backend Setup
1. Navigate to the `backend` directory: `cd backend`
2. Install dependencies: `npm install`
3. Configure environment variables in `backend/.env`:
   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/sbstocks  # OR your Atlas URI
   JWT_SECRET=your_super_secret_jwt_key
   NODE_ENV=development
   ```
4. Start the server: `npm run dev`

### 2. Frontend Setup
1. Navigate to the `frontend` directory: `cd frontend`
2. Install dependencies: `npm install`
3. Start the Vite dev server: `npm run dev`
4. Access the app at `http://localhost:3000`

## Setting up Mock Data (Admin)
To populate the database with initial stock data:
1. Register a new user in the frontend.
2. Manually access your MongoDB database and change that user's role to `"admin"`.
3. Log in as that user, navigate to the `Admin Panel`, and click **Seed Mock Stocks**.

## API Endpoints

### Authentication `/api/users`
-   `POST /` - Register user
-   `POST /login` - Authenticate user & grab token
-   `GET /profile` - Retrieve user profile (Private)

### Stocks `/api/stocks`
-   `GET /` - List all stocks (Pagination & Search)
-   `GET /:id` - Get specific stock
-   `POST /seed` - Seed mock market data (Admin only)

### Trading `/api/trade`
-   `POST /buy` - Execute buy order (Private)
-   `POST /sell` - Execute sell order (Private)

### Portfolio `/api/portfolio`
-   `GET /` - Retrieve user portfolio holdings (Private)
-   `GET /transactions` - Retrieve transaction history (Private)
-   `GET /watchlist` - Retrieve user watchlist (Private)
-   `POST /watchlist` - Add stock to watchlist (Private)
-   `DELETE /watchlist/:id` - Remove stock from watchlist (Private)

### Admin `/api/admin`
-   `GET /users` - Retrieve all users (Admin only)
-   `GET /transactions` - Retrieve all global transactions (Admin only)

## Deployment Guidelines

### 1. MongoDB Atlas
-   Create a cluster and whitelist IP `0.0.0.0/0`.
-   Get connection string and replace `MONGO_URI` in production `.env`.

### 2. Backend (Render / Heroku)
-   Set build command: `npm install`
-   Set start command: `node server.js`
-   Add Environment Variables (`MONGO_URI`, `JWT_SECRET`, `NODE_ENV=production`)

### 3. Frontend (Vercel / Netlify)
-   Set build command: `npm run build`
-   Set output directory: `dist`
-   Ensure backend URL is explicitly referenced in `services/api.js` OR set via Vite environment variables if splitting frontend/backend across different domains natively. For Vercel, replace the proxy in `vite.config.js` and use absolute URLs for Axios calls in production.
