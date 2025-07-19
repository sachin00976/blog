import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser';
import { router as userRouter } from './src/routes/user.routes.js';
import { router as blogRouter } from './src/routes/blog.routes.js';
import { router as subscriberRouter } from './src/routes/subscriber.routes.js';
import { router as commentRouter } from "./src/routes/comment.routes.js"
import fileUpload from 'express-fileupload';

const app = express();

dotenv.config({
    path: './.env'
})

app.use((req, res, next) => {
    res.setHeader("Cross-Origin-Opener-Policy", "same-origin-allow-popups");
    res.setHeader("Cross-Origin-Embedder-Policy", "credentialless");
    next();
});

let io = null;
export const setIO = (ioInstance) => {
    io = ioInstance;
};

app.use((req, res, next) => {
    if (io) req.io = io;
    next();
});

const allowedOrigins = [
    process.env.FRONTEND_URI || 'http://localhost:5173'
]

// Configure CORS
app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
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
app.use('/api/v1/comment', commentRouter);

export default app;
