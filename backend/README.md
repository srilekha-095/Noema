# Backend (Noema)

This folder contains the Express API for Noema.

## Setup

```bash
cd backend
npm install
```

Create `backend/.env`:

```env
PORT=5000
MONGO_DB=mongodb://127.0.0.1:27017/noema
JWT_WEB_TOKEN=your_secret_key_here
JWT_LIFETIME=1d

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

## Run

```bash
npm run start
```

`start` and `dev` both run nodemon in this project.

## API base URL

```text
http://localhost:5000/api/v1
```

## Key modules

- `src/app.js` - app bootstrap, middleware, routes
- `src/controllers/` - auth, users, posts logic
- `src/models/` - Mongoose schemas
- `src/routes/` - API routing
- `src/middlewares/` - auth, upload, error handlers
- `src/utils/cloudinary.js` - Cloudinary upload/delete helpers

## Image handling

- Uploads are processed by multer in memory.
- Images are uploaded to Cloudinary.
- MongoDB stores:
	- `image` (Cloudinary public URL)
	- `imagePublicId` (Cloudinary public id)
- Old Cloudinary assets are removed on image replacement and post deletion.

## Core routes

- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `GET /api/v1/users/me`
- `GET /api/v1/posts`
- `GET /api/v1/posts/:id`
- `POST /api/v1/posts`
- `PATCH /api/v1/posts/:id`
- `DELETE /api/v1/posts/:id`
