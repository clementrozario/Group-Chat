const { createServer } = require('http');
const { Server } = require('socket.io');
const { instrument } = require('@socket.io/admin-ui');

// Create an HTTP server using the http module
const httpServer = createServer();
const ioServer = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

// Instrument the Socket.IO server for admin UI
instrument(ioServer, { auth: false });

// Handle socket connections
ioServer.on('connection', (socket) => {
  console.log(`New connection: ${socket.id}`);
});

httpServer.listen(3000, () => {
  console.log('WebSocket server is running on port 3000');
});
