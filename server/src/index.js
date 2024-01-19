const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io'); // Thêm thư viện socket.io
const db = require('./config/db');
const siteRoutes = require('./routes/site');
const authRoutes = require('./routes/auth');
const scheduleRoutes = require('./routes/schedule');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(cors());

// Connect to MongoDB
db.connect()
    .then(() => {
        // Thêm server HTTP
        const server = http.createServer(app);

        // Thêm WebSocket server
        const io = socketIo(server);

        // Middleware để thêm biến io vào req
        app.use((req, res, next) => {
            req.io = io;
            next();
        });

        // Lắng nghe kết nối mới từ client
        io.on('connection', (socket) => {
            console.log('A user connected');

            // Gửi tin nhắn test khi có người dùng mới kết nối
            socket.emit('message', 'Hello from server!');
        });

        // Home
        app.use('/', siteRoutes);

        // Schedule
        app.use('/schedule', scheduleRoutes);

        // Register
        app.use('/v1/auth', authRoutes);

        // Start the server
        server.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB:', error.message);
    });




    




    ///
    