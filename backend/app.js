import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { router as userRouter } from './src/routes/user.routes.js';
import {router as blogRouter} from './src/routes/blog.routes.js'
import {router as subscriberRouter} from './src/routes/subscriber.routes.js'
//import { dirname } from 'path';
//import { fileURLToPath } from 'url'; // Import this for `fileURLToPath`
import path from 'path'; // Import the `path` module
import fileUpload from 'express-fileupload'

const app = express();

// Configure CORS
app.use(cors({
    origin: [], // Add allowed origins here
    credentials: true, // Corrected typo
    methods: ["GET", "PUT", "DELETE", "POST", "PATCH"]
}));

// Resolve __dirname for ES modules
//const __dirname = dirname(fileURLToPath(import.meta.url));

// Serve static files from the "public" directory
//app.use(express.static(path.join(__dirname, "public")));

// Middleware for cookies and JSON parsing
app.use(cookieParser());
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(fileUpload({
    useTempFiles:true,
    tempFileDir:"./public/temp"
}))
// Register routes
app.use('/api/v1/user', userRouter);
app.use('/api/v1/blog',blogRouter);
app.use('/api/v1/subscribe',subscriberRouter);
export default app;
