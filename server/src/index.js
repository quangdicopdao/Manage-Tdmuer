const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io'); // Thêm thư viện socket.io
const db = require('./config/db');

//route
const siteRoutes = require('./routes/site');
const chatRoutes = require('./routes/chat');
const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profile');
const scheduleRoutes = require('./routes/schedule');
const postRoutes = require('./routes/post');
const joinRoutes = require('./routes/listjoin');
const spendingRoutes = require('./routes/spending');

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
        const io = socketIo(server, {
            cors: {
                origin: 'http://localhost:3000',
                credentials: true,
            },
        });

        // Middleware để thêm biến io vào req
        app.use((req, res, next) => {
            req.io = io;
            next();
        });

        global.onlineUsers = new Map();
        // Lắng nghe kết nối mới từ client
        io.on('connection', (socket) => {
            // Lắng nghe sự kiện addUser khi người dùng đăng nhập
            socket.on('addUser', (id) => {
                // Thêm người dùng vào danh sách onlineUsers với id của socket
                onlineUsers.set(id, socket.id);
            });

            // Lắng nghe sự kiện send-mess khi người dùng gửi tin nhắn
            socket.on('send-mess', (data) => {
                // Kiểm tra xem người nhận có phải là người dùng hay nhóm chat
                if (data.groupId) {
                    // Nếu là nhóm chat, gửi tin nhắn đến tất cả các thành viên trong nhóm
                    const groupMembers = data.groupMembers; // Danh sách id của các thành viên trong nhóm
                    groupMembers.forEach((memberId) => {
                        const memberSocket = onlineUsers.get(memberId);
                        if (memberSocket && memberSocket !== socket.id) {
                            const messageData = {
                                message: data.message,
                                senderAvatar: data.senderAvatar,
                                namesend: data.namesend,
                            };
                            socket.to(memberSocket).emit('mess-receive', messageData);
                        }
                    });
                } else {
                    // Nếu là người dùng, gửi tin nhắn đến socket của người đó
                    const receiverSocket = onlineUsers.get(data.to);
                    if (receiverSocket && receiverSocket !== socket.id) {
                        socket.to(receiverSocket).emit('mess-receive', data.message);
                    }
                }
            });
        });

        // Home
        app.use('/', siteRoutes);

        //Post
        app.use('/post', postRoutes);
        // Schedule
        app.use('/schedule', scheduleRoutes);

        // Register
        app.use('/v1/auth', authRoutes);

        app.use('/chat', chatRoutes);
        app.use('/spending', spendingRoutes);
        app.use('/join', joinRoutes);

        // Kết nối đến MongoDB thành công, bắt đầu cập nhật trạng thái công việc định kỳ

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
