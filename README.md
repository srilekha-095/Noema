# Noema

Noema is a full-stack blogging application with authentication, post CRUD, category/search filtering, and image uploads handled through Cloudinary.

## Project Structure

- `backend/` - Express API, MongoDB, JWT auth, Cloudinary integration
- `frontend/` - React + Vite client app

## Stack

### Backend
- Node.js
- Express
- MongoDB + Mongoose
- JWT
- Multer
- Cloudinary

### Frontend
- React
- Vite
- React Router
- Axios

## Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)
- Cloudinary account and API credentials

## Environment Variables (Backend)

Create `backend/.env`:

```env
PORT=5000
MONGO_DB=mongodb://127.0.0.1:27017/noema
JWT_WEB_TOKEN=your_jwt_secret
JWT_LIFETIME=1d

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

## Local Development

### 1. Start backend

```bash
cd backend
npm install
npm run start
```

API base URL:
- `http://localhost:5000/api/v1`

### 2. Start frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend URL:
- `http://localhost:5173`

## API Endpoints

### Auth
- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`

### Users
- `GET /api/v1/users/me`

### Posts
- `GET /api/v1/posts`
- `GET /api/v1/posts/:id`
- `POST /api/v1/posts` (multipart form-data supported)
- `PATCH /api/v1/posts/:id` (supports optional image replacement)
- `DELETE /api/v1/posts/:id`

## Image Upload Behavior

- Images are uploaded to Cloudinary.
- MongoDB stores:
  - `image` (public URL)
  - `imagePublicId` (Cloudinary public id)
- When a post image is replaced or a post is deleted, the old Cloudinary image is removed.

## Deployment Notes

- Backend (Render): set all backend environment variables from the list above.
- Frontend (Vercel): update API base URL in `frontend/src/app/api.js` to your deployed backend URL.
- Ensure backend CORS allows your deployed frontend domain.

## Current Important Config

The frontend currently uses a hardcoded local API URL in `frontend/src/app/api.js`:
- `http://localhost:5000/api/v1`

Before deploying, replace this with your backend production URL.
