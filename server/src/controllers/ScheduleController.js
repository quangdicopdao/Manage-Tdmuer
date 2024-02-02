// controllers/SiteController.js
const Schedule = require('../models/Schedule.js');
const User = require('../models/User.js');
const moment = require('moment');

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
            const { statusWork, page, pageSize } = req.query;

            if (statusWork === undefined || statusWork === null || statusWork === '') {
                return res.status(400).json({ message: 'StatusWork is required' });
            }

            const skip = (page - 1) * pageSize;

            const userSchedule = await Schedule.find({ userId, statusWork })
                .skip(skip)
                .limit(pageSize)
                .sort({ end: 'desc' });

            const total = await Schedule.countDocuments({ userId, statusWork });
            const total_pages = Math.ceil(total / pageSize);

            res.status(200).json({
                page: parseInt(page),
                per_page: parseInt(pageSize),
                total: total,
                total_pages: total_pages,
                data: userSchedule,
            });
        } catch (error) {
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

    async updateStatusWork() {
        try {
            const currentDate = moment(); // Lấy ngày hiện tại

            // Tìm tất cả công việc có ngày kết thúc cách ngày hiện tại 1 ngày
            const oneDayAhead = currentDate.clone().add(1, 'day');

            const query = {
                end: { $lt: oneDayAhead.toDate() },
            };

            // Tìm và cập nhật công việc có statusWork khác 2
            const schedulesToUpdate = await Schedule.find({ ...query, statusWork: { $ne: 2 } });

            // Cập nhật statusWork của các công việc
            for (const schedule of schedulesToUpdate) {
                const isOverdue = moment(schedule.end).isBefore(currentDate, 'day');

                if (isOverdue) {
                    // Nếu quá hạn và statusWork không phải là 2, cập nhật thành 3
                    schedule.statusWork = 3;
                } else {
                    // Ngược lại, cập nhật statusWork thành 1
                    schedule.statusWork = 1;
                }

                await schedule.save();
            }

            console.log(`Updated ${schedulesToUpdate.length} schedules`);
        } catch (error) {
            console.error('Error updating statusWork:', error);
        }
    }

    // Hàm chạy định kỳ để cập nhật trạng thái công việc
    startStatusUpdateInterval() {
        setInterval(async () => {
            await this.updateStatusWork();
        }, 24 * 60 * 60 * 1000); // Cập nhật mỗi 24 giờ (1 ngày)
    }
}

module.exports = new ScheduleController();
