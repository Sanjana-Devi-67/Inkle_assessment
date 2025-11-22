  
# Inkle Social Feed Backend

Backend implementation for the **Inkle Backend Intern Assignment**.  
This project builds a complete **social activity feed system** with authentication, posts, likes, follows, blocking, RBAC (Admin/Owner roles), and a global activity wall.

---

## 🧱 Tech Stack

- **Node.js** + **Express** – REST API
- **MongoDB** + **Mongoose**
- **JWT Authentication**
- **RBAC (Role-Based Access Control)** — User, Admin, Owner
- **Rate Limiting**
- **CORS**, **Morgan**, **Dotenv**

---

## ✨ Core Features

- User Signup/Login
- JWT Authentication
- Update Profile
- Create Posts
- Like / Unlike Posts
- Follow / Unfollow Users
- Block / Unblock Users  
  → Blocked user cannot see posts of the blocker  
- Global Activity Wall (action logs)
- Admin & Owner permissions
- Soft deletes for posts/users

---

## 📁 Folder Structure

```txt
inkle-social-feed-backend/
  ├─ package.json
  ├─ README.md
  ├─ .env
  ├─ .gitignore
  ├─ InkleSocialFeed.postman_collection.json
  └─ src/
     ├─ app.js
     ├─ server.js
     ├─ config/
     │  └─ db.js
     ├─ models/
     │  ├─ User.js
     │  ├─ Post.js
     │  └─ Activity.js
     ├─ middleware/
     │  ├─ authMiddleware.js
     │  ├─ roleMiddleware.js
     │  ├─ rateLimiter.js
     │  └─ errorHandler.js
     ├─ controllers/
     │  ├─ authController.js
     │  ├─ userController.js
     │  ├─ postController.js
     │  ├─ activityController.js
     │  └─ adminController.js
     └─ routes/
        ├─ authRoutes.js
        ├─ userRoutes.js
        ├─ postRoutes.js
        ├─ activityRoutes.js
        └─ adminRoutes.js
```

## Setup & Installation
### 1.Clone the Repository
git clone https://github.com/Sanjana-Devi-67/Inkle_assessment
cd inkle-social-feed-backend

### 2.Install Dependencies
npm install

### 3. Create a .env File
PORT=4000
MONGO_URI=<your-mongo-uri>
JWT_SECRET=<your-secret>
JWT_EXPIRES_IN=7d

### 4.Start the Server
#### Development
npm run dev
#### Production
npm start
#### Local API base URL:
http://localhost:4000/api

## Deployed API Base URL
https://inkle-social-feed-backend.onrender.com/api
Use this in Postman as:
{{baseUrl}} = https://inkle-social-feed-backend.onrender.com/api


## 📚 API Routes Overview
###🔐 Auth Routes
| Method | Endpoint      | Description        |
|--------|---------------|-------------------|
| POST   | /auth/signup  | Create new user   |
| POST   | /auth/login   | Login + JWT token |

###👤 User Routes
| Method | Endpoint              | Description       |
|--------|----------------------|------------------|
| GET    | /users/me            | Get own profile  |
| PUT    | /users/me            | Update profile   |
| POST   | /users/:id/follow    | Follow user      |
| POST   | /users/:id/unfollow  | Unfollow user    |
| POST   | /users/:id/block     | Block user       |
| POST   | /users/:id/unblock   | Unblock user     |

###📝 Post Routes
| Method | Endpoint            | Description  |
|--------|--------------------|--------------|
| POST   | /posts             | Create post  |
| POST   | /posts/:id/like    | Like post    |
| POST   | /posts/:id/unlike  | Unlike post  |
| GET    | /posts/feed        | Get feed     |

###📜 Activity Routes
| Method | Endpoint          | Description          |
|--------|------------------|---------------------|
| GET    | /activity/wall   | Global activity log |

🛠 Admin / Owner Routes
| Method | Endpoint                        | Role        | Description       |
|--------|---------------------------------|-------------|------------------|
| DELETE | /admin/users/:id                | Admin/Owner | Delete user      |
| DELETE | /admin/posts/:id                | Admin/Owner | Delete post      |
| POST   | /admin/posts/:id/remove-like    | Admin/Owner | Remove like      |
| PATCH  | /admin/users/:id/role           | Owner       | Change user role |

##🧪 Testing With Postman

###The repository includes:
InkleSocialFeed.postman_collection.json
Steps:
Open Postman
Click Import
Select the collection file
Go to Variables
baseUrl is pre-filled
Leave token empty (login will generate a JWT)

##🧪 Full Testing Flow
###Step 1 — Signup User A
{
  "name": "Alice",
  "username": "alice",
  "email": "alice@example.com",
  "password": "password123",
  "bio": "Hi!"
}

###Step 2 — Login & Save Token
Set the token in Postman variables.

###Step 3 — Create a Post
{
  "content": "Hello world!",
  "mediaUrl": ""
}

###Step 4 — Signup User B
Login and get their ID.

###Step 5
Follow / Block / Unfollow
###Step 6
Activity Wall
GET /activity/wall


###Expected output:

"alice made a post"

"alice followed bob"

"bob liked alice's post"

###Step 7 — Admin / Owner Testing
PATCH /admin/users/:id/role

##🧠 Design Highlights
**Soft Deletes**
Users & posts are soft-deleted, preserving activity logs.
**RBAC Middleware**
Strict permission handling for User / Admin / Owner.
**Blocking Logic**
Feed hides posts of users who blocked the requester.
**Activity Tracking**
Human-readable activity messages logged for every action.
**Rate Limiting**
Prevents brute-force attacks on /auth/* routes.

##🚀 Deployment (Render)
###Build Command
npm install

###Start Command
npm start

###Environment Variables
Add these in Render:
PORT
MONGO_URI
JWT_SECRET
JWT_EXPIRES_IN

##👤Author
V Sanjana Devi
Backend Developer — Inkle Internship Assignment
GitHub:https://github.com/Sanjana-Devi-67/Inkle_assessment/

