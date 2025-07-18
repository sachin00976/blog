export default function registerSocketHandlers(io) {
    io.on('connection', (socket) => {
        console.log(`New client connected: ${socket.id}`);

        

        // Handle disconnection
        socket.on('disconnect', () => {
            console.log(`Client disconnected: ${socket.id}`);
        });
    });
}  
