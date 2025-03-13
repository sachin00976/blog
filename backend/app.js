import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { router as userRouter } from './src/routes/user.routes.js';
import { router as blogRouter } from './src/routes/blog.routes.js';
import { router as subscriberRouter } from './src/routes/subscriber.routes.js';
import path from 'path';
import fileUpload from 'express-fileupload';

const app = express();

// ✅ Fix for "Cross-Origin-Opener-Policy" issue
app.use((req, res, next) => {
    res.setHeader("Cross-Origin-Opener-Policy", "same-origin-allow-popups");  // ✅ Google OAuth Fix
    res.setHeader("Cross-Origin-Embedder-Policy", "credentialless");  // ✅ Helps with security
    res.setHeader("Access-Control-Allow-Origin", "*"); // ✅ Allow frontend requests
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    next();
});

// Configure CORS
app.use(cors({
    origin: [], // Add allowed origins here
    credentials: true, // Allows cookies to be sent
    methods: ["GET", "PUT", "DELETE", "POST", "PATCH"]
}));

// Middleware for cookies and JSON parsing
app.use(cookieParser());
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: "./public/temp"
}));

// Register routes
app.use('/api/v1/user', userRouter);
app.use('/api/v1/blog', blogRouter);
app.use('/api/v1/subscribe', subscriberRouter);

export default app;
