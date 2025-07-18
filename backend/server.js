import { dbConnect } from "./src/database/index.js";
import dotenv from 'dotenv'
import app, { setIO } from "./app.js";
import { Server } from "socket.io";
import http from "http"
import { v2 as cloudinary } from 'cloudinary'
import registerSocketHandlers from "./src/socket/index.js";

dotenv.config({
    path: './.env'
})

const server = http.createServer(app)

const io = new Server(server, {
    cors: {
        origin: process.env.FRONTEND_URI || "http://localhost:5173",
        credentials: true
    }
});

setIO(io)

registerSocketHandlers(io);

const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
    console.log(`App is listening on port ${PORT}`);
});

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
dbConnect();