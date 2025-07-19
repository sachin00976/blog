import cookie from 'cookie';
import jwt from 'jsonwebtoken';

export const userSocketMap = new Map();

export default function registerSocketHandlers(io) {
    io.on('connection', (socket) => {
        console.log(`New client connected: ${socket.id}`);
        const cookies = cookie.parse(socket.handshake.headers.cookie || '');

        const accessToken = cookies.accessToken;

        if (accessToken) {
            const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET); 
            const userId = decoded.id;
            userSocketMap.set(userId, socket.id);
            socket.userId = userId;
        }

        // Handle disconnection
        socket.on('disconnect', () => {
            console.log(`Client disconnected: ${socket.id}`);
            if (socket.userId) {
                userSocketMap.delete(socket.userId);
            }
        });
    });
}  
