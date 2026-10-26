# Course API

REST API built with **Express.js** and a modular **MVC** structure (MongoDB + Mongoose, JWT auth).

## Setup

```bash
npm install
cp .env.example .env     # Windows: copy .env.example .env
npm run dev
```

Make sure MongoDB is running locally (or put a MongoDB Atlas URI in `MONGO_URI`).

## Project structure

```
server.js
src/
  app.js
  config/db.js
  models/        User, Category, Course
  controllers/   authController, categoryController, courseController
  routes/        authRoutes, categoryRoutes, courseRoutes
  middleware/    auth, asyncHandler, errorHandler
```

## Endpoints

| Method | URL | Auth | Description |
|--------|-----|------|-------------|
| POST | /api/auth/register | No | Register, returns token |
| POST | /api/auth/login | No | Login, returns token |
| GET | /api/auth/me | Yes | Current user |
| POST | /api/categories | Yes | Create category (201) |
| GET | /api/categories | No | List categories (200) |
| GET | /api/categories/:id | No | Get one |
| PUT | /api/categories/:id | Yes | Update |
| DELETE | /api/categories/:id | Yes | Delete |
| POST | /api/courses | Yes | Create course |
| GET | /api/courses | No | List courses (`?category=<id>` filter) |
| GET | /api/courses/:id | No | Get one |
| PUT | /api/courses/:id | Yes | Update |
| DELETE | /api/courses/:id | Yes | Delete |

Protected routes need the header `Authorization: Bearer <token>`.

## Request bodies

```json
// POST /api/auth/register
{ "name": "Muhammad Furqan", "email": "furqan@example.com", "password": "123456" }

// POST /api/auth/login
{ "email": "furqan@example.com", "password": "123456" }

// POST /api/categories
{ "name": "Web Development", "description": "Frontend and backend courses" }

// POST /api/courses
{ "title": "Node.js Basics", "description": "Intro to Node", "price": 49, "category": "<categoryId>" }
```

## Status codes

200 OK, 201 Created, 400 Bad Request (validation), 401 Unauthorized, 404 Not Found.
