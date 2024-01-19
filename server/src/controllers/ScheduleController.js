// controllers/SiteController.js
const Schedule = require('../models/Schedule.js');
const User = require('../models/User.js');
// controllers/ScheduleController.js
class ScheduleController {
    async show(req, res, next) {
        try {
            // Kiểm tra xem người dùng đã đăng nhập chưa
            if (!req.user) {
                return res.status(401).json({ message: 'Unauthorized' });
            }

            // Truy vấn lịch theo ID người dùng đã đăng nhập
            const userId = req.user.id;
            const userSchedule = await Schedule.find({ userId });

            res.json(userSchedule);
        } catch (error) {
            console.error('Error fetching user schedule:', error);
            next(error);
        }
    }
    async create(req, res, next) {
        const { title, start, end, description } = req.body;
        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized - User not logged in' });
        }
        const userId = req.user.id;

        try {
            const newSchedule = new Schedule({
                title,
                start,
                end,
                description,
                userId,
            });
            await newSchedule.save();
            return res.status(201).json({ message: 'Công việc đã được lưu trữ thành công.' });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Đã xảy ra lỗi khi lưu trữ bài viết.' });
        } finally {
            next();
        }
    }
}

module.exports = new ScheduleController();
