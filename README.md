.

🚀 Mini Social App
🧑‍💻 Full-Stack Developer Technical Assignment
📌 Project Overview

This project is a minimal social media-style full-stack application developed as part of a Full-Stack Developer technical assessment.

🎯 Purpose of the Assignment

This project demonstrates strong understanding of:

🔹 Backend API Design
🔹 Database Modeling
🔹 Frontend State Management
🔹 Data Validation
🔹 Clean & Maintainable Code Structure

✨ Core Features

Users can:

📝 Create posts (maximum 280 characters)
❤️ Like and Unlike posts
🕒 View posts in reverse chronological order
🔄 See like state persist after refresh
⚡ Experience instant UI updates (no page reload)
🎯 The focus of this implementation is correctness, clarity, and reliable full-stack behavior rather than heavy UI styling.

🛠 Tech Stack
🎨 Frontend
⚛️ React (Vite)
📡 Axios
🎨 Tailwind CSS
💾 LocalStorage (lightweight user identity simulation)

🧠 Backend
🟢 Node.js
🚂 Express.js
🍃 MongoDB (MongoDB Atlas)

🗂 Mongoose

⚙️ Setup Instructions
1️⃣ Clone the Repository
git clone <your-repository-url>
cd <project-folder>
2️⃣ Backend Setup
cd backend
npm install

Create a .env file inside the backend folder:

PORT=5000
MONGO_URL=your_mongodb_connection_string
CORS_ORIGINS=http://localhost:5173

Start the backend server:
npm run dev

📍 Backend runs at:
http://localhost:5000
3️⃣ Frontend Setup
cd frontend
npm install

Create a .env file inside the frontend folder:
VITE_API_URL=http://localhost:5000/api

Start the frontend:
npm run dev

📍 Frontend runs at:
http://localhost:5173
🧠 Architecture & Design Decisions
🔐 User Identity Handling

Authentication is simplified using a unique userId stored in localStorage and sent via request headers.

✅ Why this approach?
Enables user-based like tracking
Ensures like state persistence
Simulates multi-user logic
Allows faster implementation within time constraints

**🗄 Database Schema Explanation**

💡 Schema design was structured to ensure data integrity, scalability, and correctness.
👤 User Schema
{
  name: String (required),
  email: String (required, unique)
}
🔎 Explanation

email is unique to prevent duplicate users
Designed minimal intentionally
Easily extendable for future authentication (JWT, passwords, etc.)

** Post Schema
**{
  content: String (required, max 280 characters),
  user: String (required)
},
{ timestamps: true }
🔎 Why This Matters
✅ maxlength: 280 → Enforces server-side validation
✅ timestamps: true → Enables sorting by newest posts
✅ user stored as String → Matches simplified identity logic

This ensures posts are:
Validated

Chronologically sortable
Easy to manage
❤️ Like Schema
{
  user: String (required),
  post: ObjectId (reference to Post)
}
🔥 Critical Index
likeSchema.index({ user: 1, post: 1 }, { unique: true });
🚨 Why This Is Important

🚫 Prevents duplicate likes at the database level
🔒 Ensures a user can like a post only once
⚡ Protects against race conditions
🛡 Maintains strong data integrity

This is a production-level design decision.

🔄 API Endpoints
📝 Create Post
POST /api/posts
✅ Validations

User must exist

Content must not be empty

Maximum 280 characters

📥 Get All Posts
GET /api/posts
📦 Returns

Posts sorted by newest first

Like count per post

isLiked status for current user

❤️ Toggle Like
POST /api/posts/:id/like
🔄 Behavior

If like exists → Remove (Unlike)
If not → Create Like

Returns updated like count and like status

⚡ Frontend State Management
🚀 Optimistic UI Updates

Like button updates instantly before server confirmation

🔁 Rollback Handling
If API fails → UI reverts to previous state

⏱ Debouncing Rapid Clicks

500ms debounce using useRef

Prevents multiple rapid like requests

🔘 Disabled States

Like button disabled during API call

Publish button disabled while posting

📱 UI Expectations Covered

✔ Clean feed layout
✔ Newest posts at the top
✔ No page reload
✔ Proper loading states
✔ No broken UI states
✔ Basic mobile responsiveness

🔒 Backend Robustness

✅ Server-side validation
✅ Unique compound index on Like model
✅ Proper error handling
✅ CORS configuration
✅ MongoDB connection management
✅ Health check endpoint
🧪 Edge Cases Handled
🚫 Empty posts blocked
🚫 Posts exceeding 280 characters blocked
🚫 Duplicate likes prevented
⚡ Rapid repeated clicks handled safely
🔄 Like state persists after refresh
🔢 Like count recalculated accurately

🎯 Trade-Offs & Design Decisions
Authentication simplified to localStorage-based identity
Likes stored in a separate collection for scalability
Like count calculated dynamically for consistency
Priority given to correctness over UI styling

🚀 Future Improvements
If given more time, I would implement:
🔐 JWT-based authentication (Login / Signup)
💬 Comment system with nested replies
👤 User profile system
🖼 Media uploads (images)
📜 Pagination or infinite scrolling
🔴 Real-time updates using WebSockets
🧪 Unit & integration testing
🛡 Rate limiting middleware

✏ Edit & delete post functionality
These improvements would make the application production-ready and scalable.

 OPEN : https://updated-social-eyeu.vercel.app/
👩‍💻 Author
Tanya Singh
Full-Stack Developer (MERN)
