<div align="center">

# 🎓 Course API

### A clean, modular REST API for courses & categories — built with Express, MongoDB and JWT.

<br />

![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Mongoose](https://img.shields.io/badge/Mongoose-880000?style=for-the-badge&logo=mongoose&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-Auth-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)

![Architecture](https://img.shields.io/badge/architecture-MVC-6C5CE7?style=flat-square)
![API](https://img.shields.io/badge/API-REST-0984E3?style=flat-square)
![Endpoints](https://img.shields.io/badge/endpoints-13-00B894?style=flat-square)
![PRs Welcome](https://img.shields.io/badge/PRs-welcome-FD79A8?style=flat-square)
![Made with Love](https://img.shields.io/badge/made%20with-%E2%9D%A4-E17055?style=flat-square)

<br />

[**Quick Start**](#-quick-start) •
[**Endpoints**](#-api-endpoints) •
[**Examples**](#-request-bodies) •
[**Structure**](#-project-structure) •
[**Author**](#-author)

</div>

---

## ✨ Features

- 🔐 **JWT authentication** — register, login and a protected `/me` route
- 📚 **Full CRUD** for **categories** and **courses**
- 🔗 **Relational data** — every course belongs to a category, filterable via `?category=<id>`
- 🧱 **Modular MVC structure** — models, controllers, routes and middleware cleanly separated
- 🛡️ **Centralised error handling** with `asyncHandler` + `errorHandler` middleware
- ✅ **Proper HTTP status codes** across every endpoint

---

## 🧰 Tech Stack

| Layer | Technology |
|:------|:-----------|
| Runtime | Node.js |
| Framework | Express.js |
| Database | MongoDB + Mongoose |
| Auth | JSON Web Tokens (JWT) |
| Architecture | MVC |

---

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Create your environment file
cp .env.example .env        # Windows: copy .env.example .env

# 3. Start the dev server
npm run dev
```

> [!IMPORTANT]
> Make sure MongoDB is running locally, or put a **MongoDB Atlas** connection string in `MONGO_URI` inside your `.env`.

---

## 🗂️ Project Structure

```text
📦 course-api
├── 📄 server.js
└── 📁 src
    ├── 📄 app.js
    ├── 📁 config
    │   └── 📄 db.js
    ├── 📁 models
    │   ├── 📄 User
    │   ├── 📄 Category
    │   └── 📄 Course
    ├── 📁 controllers
    │   ├── 📄 authController
    │   ├── 📄 categoryController
    │   └── 📄 courseController
    ├── 📁 routes
    │   ├── 📄 authRoutes
    │   ├── 📄 categoryRoutes
    │   └── 📄 courseRoutes
    └── 📁 middleware
        ├── 📄 auth
        ├── 📄 asyncHandler
        └── 📄 errorHandler
```

### 🔄 Request lifecycle

```mermaid
flowchart LR
    A[Client] --> B[Route]
    B --> C{Protected?}
    C -- Yes --> D[auth middleware]
    C -- No --> E[Controller]
    D --> E
    E --> F[(MongoDB)]
    F --> E
    E --> G[Response]
    E -. error .-> H[errorHandler]
    H --> G
```

### 🧬 Data model

```mermaid
erDiagram
    CATEGORY ||--o{ COURSE : contains
    USER {
        string name
        string email
        string password
    }
    CATEGORY {
        string name
        string description
    }
    COURSE {
        string title
        string description
        number price
        ObjectId category
    }
```

---

## 📡 API Endpoints

> 🔒 = requires `Authorization: Bearer <token>`

### 🔑 Auth

| Method | Endpoint | Auth | Description |
|:------:|:---------|:----:|:------------|
| ![POST](https://img.shields.io/badge/POST-F39C12?style=flat-square) | `/api/auth/register` | — | Register a user, returns a token |
| ![POST](https://img.shields.io/badge/POST-F39C12?style=flat-square) | `/api/auth/login` | — | Login, returns a token |
| ![GET](https://img.shields.io/badge/GET-27AE60?style=flat-square) | `/api/auth/me` | 🔒 | Get the current user |

### 🗃️ Categories

| Method | Endpoint | Auth | Description |
|:------:|:---------|:----:|:------------|
| ![POST](https://img.shields.io/badge/POST-F39C12?style=flat-square) | `/api/categories` | 🔒 | Create a category `201` |
| ![GET](https://img.shields.io/badge/GET-27AE60?style=flat-square) | `/api/categories` | — | List all categories `200` |
| ![GET](https://img.shields.io/badge/GET-27AE60?style=flat-square) | `/api/categories/:id` | — | Get one category |
| ![PUT](https://img.shields.io/badge/PUT-2980B9?style=flat-square) | `/api/categories/:id` | 🔒 | Update a category |
| ![DELETE](https://img.shields.io/badge/DELETE-C0392B?style=flat-square) | `/api/categories/:id` | 🔒 | Delete a category |

### 📘 Courses

| Method | Endpoint | Auth | Description |
|:------:|:---------|:----:|:------------|
| ![POST](https://img.shields.io/badge/POST-F39C12?style=flat-square) | `/api/courses` | 🔒 | Create a course |
| ![GET](https://img.shields.io/badge/GET-27AE60?style=flat-square) | `/api/courses` | — | List courses (`?category=<id>` to filter) |
| ![GET](https://img.shields.io/badge/GET-27AE60?style=flat-square) | `/api/courses/:id` | — | Get one course |
| ![PUT](https://img.shields.io/badge/PUT-2980B9?style=flat-square) | `/api/courses/:id` | 🔒 | Update a course |
| ![DELETE](https://img.shields.io/badge/DELETE-C0392B?style=flat-square) | `/api/courses/:id` | 🔒 | Delete a course |

---

## 📨 Request Bodies

<details open>
<summary><b>🔑 Register</b> — <code>POST /api/auth/register</code></summary>

```json
{
  "name": "Muhammad Furqan",
  "email": "furqan@example.com",
  "password": "123456"
}
```

</details>

<details>
<summary><b>🔓 Login</b> — <code>POST /api/auth/login</code></summary>

```json
{
  "email": "furqan@example.com",
  "password": "123456"
}
```

</details>

<details>
<summary><b>🗃️ Create category</b> — <code>POST /api/categories</code></summary>

```json
{
  "name": "Web Development",
  "description": "Frontend and backend courses"
}
```

</details>

<details>
<summary><b>📘 Create course</b> — <code>POST /api/courses</code></summary>

```json
{
  "title": "Node.js Basics",
  "description": "Intro to Node",
  "price": 49,
  "category": "<categoryId>"
}
```

</details>

---

## 🧪 Try It Out

```bash
# Register and grab your token
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Muhammad Furqan","email":"furqan@example.com","password":"123456"}'

# Use the token on protected routes
curl -X POST http://localhost:5000/api/categories \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{"name":"Web Development","description":"Frontend and backend courses"}'

# Filter courses by category
curl "http://localhost:5000/api/courses?category=<categoryId>"
```

> [!NOTE]
> Adjust the port to match the value in your `.env`.

---

## 🚦 Status Codes

| Code | Meaning | When |
|:----:|:--------|:-----|
| ![200](https://img.shields.io/badge/200-OK-2ECC71?style=flat-square) | **OK** | Successful read / update / delete |
| ![201](https://img.shields.io/badge/201-Created-27AE60?style=flat-square) | **Created** | Resource created |
| ![400](https://img.shields.io/badge/400-Bad%20Request-E67E22?style=flat-square) | **Bad Request** | Validation failed |
| ![401](https://img.shields.io/badge/401-Unauthorized-E74C3C?style=flat-square) | **Unauthorized** | Missing or invalid token |
| ![404](https://img.shields.io/badge/404-Not%20Found-95A5A6?style=flat-square) | **Not Found** | Resource doesn't exist |

---

## 👨‍💻 Author

<div align="center">

**Muhammad Furqan** — Frontend Software Engineer · Lahore, Pakistan

[![Portfolio](https://img.shields.io/badge/Portfolio-furqannewportfolio.netlify.app-6C5CE7?style=for-the-badge&logo=netlify&logoColor=white)](https://furqannewportfolio.netlify.app)
[![GitHub](https://img.shields.io/badge/GitHub-furqanzubair209--cell-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/furqanzubair209-cell)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-muhammad--furqan-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/muhammad-furqan-228807304)

<br />

⭐ **If this project helped you, consider giving it a star!** ⭐

</div>
