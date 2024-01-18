const WebSocket = require('ws');
const http = require('http');
const express = require('express');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Array to store connected clients
const clients = new Set();

// WebSocket server event handlers
wss.on('connection', (ws) => {
    // Add the new client to the set
    clients.add(ws);

    // Event listener for receiving messages from clients
    ws.on('message', (message) => {
        // Broadcast the message to all connected clients
        broadcast(message);
    });

    // Event listener for closing a connection
    ws.on('close', () => {
        // Remove the client from the set
        clients.delete(ws);
    });
});

// Function to broadcast a message to all connected clients
function broadcast(message) {
    clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(message);
        }
    });
}

// Serve the HTML and static files
app.use(express.static('public'));

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
