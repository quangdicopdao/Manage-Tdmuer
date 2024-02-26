const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io'); // Thêm thư viện socket.io
const db = require('./config/db');

//route
const siteRoutes = require('./routes/site');
const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profile');
const scheduleRoutes = require('./routes/schedule');
const postRoutes = require('./routes/post');

const ScheduleController = require('./controllers/ScheduleController');
require('dotenv').config();

const app = express();
// Cấu hình Keep-Alive trên server
const port = process.env.PORT || 5000;
const corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true,
};
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors(corsOptions));

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

        //Post
        app.use('/post', postRoutes);
        // Schedule
        app.use('/schedule', scheduleRoutes);

        // Register
        app.use('/v1/auth', authRoutes);

        // Profile
        app.use('/profile', profileRoutes);
        // Start the server
        server.listen(port, () => {
            console.log(`Server is running on port ${port}`);
            ScheduleController.startStatusUpdateInterval();
        });
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB:', error.message);
    });

///
