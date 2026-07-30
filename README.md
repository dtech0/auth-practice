## Troubleshooting

### Issue: Express Server Starts but Application Does Not Work

While running the Express server it closed itself immediately,after I check the other project and find out this project is running is port:3000 . so I changed the port of this project
 the terminal showed:
```bash
Server is running on http://localhost:3000

### Solution :Change the Port Number


PORT=8080 
pnpm start/node server.js

# Auth Practice API (Express.js + Supabase Auth)

A lightweight and secure backend API built with **Node.js**, **Express.js**, and **Supabase Auth** as the Identity Provider (IdP). This repository demonstrates user registration, authentication, token verification using custom Express middleware, session logout, and interactive API testing via Swagger UI.

---

## 🚀 Features

- **User Authentication:** Sign up and log in handled via Supabase Auth (passwords are securely managed by Supabase).
- **JWT Middleware Guard:** Custom `requireAuth` middleware verifies incoming `Authorization: Bearer <token>` headers for protected endpoints.
- **Route Protection:** Access to protected resources returns `401 Unauthorized` for missing, invalid, or expired tokens.
- **Session Logout:** Invalidate current sessions using Supabase `signOut()`.
- **Swagger Documentation:** Interactive API documentation hosted at `/docs` with built-in Bearer Token authentication support.

---

## 📋 Prerequisites

Ensure you have the following installed before running the project:

- **Node.js** (v18.x or higher)
- **pnpm** (Node Package Manager)
- A **Supabase** account with an active project

---

## 🛠️ Setup & Installation

### 1. Clone the Repository
```bash
git clone https://github.com/dtech0/auth-practice
cd auth-practice
```

### 2. Install Dependencies
```bash
pnpm init
pnpm add express @supabase/supabase-js dotenv swagger-ui-express``` 

### 3. Configure Environment Variables
Create a `.env` file in the root directory:



Add your Supabase project credentials (retrieved from **Supabase Dashboard -> Project Settings -> API**):

```env
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_KEY=your-actual-anon-key
```

---

## 🚀 Running the Server

Start the application with Node:

```bash
node server.js
```

Or run with automatic reload (Node v18+):

```bash
node --watch server.js
```

The server will run at `http://localhost:8080`.

---

## 📑 API Reference

| Endpoint | Method | Auth Required | Description | Status Codes |
| :--- | :--- | :--- | :--- | :--- |
| `/public/info` | `GET` | No | Public endpoint accessible by anyone | `200` |
| `/auth/signup` | `POST` | No | Register a new user account | `201`, `400` |
| `/auth/login` | `POST` | No | Authenticate user & return JWT tokens | `200`, `400`, `401` |
| `/auth/logout` | `POST` | **Yes** (Bearer) | Invalidate authenticated session | `204`, `401` |
| `/protected/profile` | `GET` | **Yes** (Bearer) | Fetch authenticated user details | `200`, `401` |
| `/protected/dashboard` | `GET` | **Yes** (Bearer) | Access protected dashboard resource | `200`, `401` |
| `/docs` | `GET` | No | Interactive Swagger UI Documentation | `200` |

---

## 🧪 Interactive Testing with Swagger UI

1. Start the server and navigate to `http://localhost:8080/docs` in your browser.
2. Under the **Auth** section, expand `POST /auth/login`, click **Try it out**, fill in your credentials, and hit **Execute**.
3. Copy the returned `access_token` from the response body.
4. Click the green **Authorize 🔓** button at the top right of the Swagger UI page.
5. Paste the token into the value field and click **Authorize**.
6. You can now execute requests to protected endpoints such as `/protected/profile` and `/auth/logout` directly from the interface.

---

## 📂 Project Structure

```text
.
├── .env.example        # Environment variables template
├── .gitignore          # Excludes node_modules and .env from git
├── package.json        # Dependencies and scripts
├── server.js           # Main Express application & Swagger specs
└── supabaseClient.js   # Supabase client initialization
```