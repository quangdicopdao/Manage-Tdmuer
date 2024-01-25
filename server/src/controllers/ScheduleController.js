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
    async updateStatusWork() {
        try {
            const currentDate = moment(); // Lấy ngày hiện tại
            const oneDayAhead = currentDate.clone().add(1, 'day'); // Lấy ngày hiện tại cộng thêm 1 ngày
            const oneDayAgo = currentDate.clone().subtract(1, 'day'); // Lấy ngày hiện tại trừ đi 1 ngày

            // Tìm tất cả công việc có ngày kết thúc cách ngày hiện tại 1 ngày
            const allSchedules = await Schedule.find({
                end: { $lt: oneDayAhead.toDate(), $gte: oneDayAgo.toDate() },
            });

            // Lọc ra những công việc chưa hoàn thành và là ngày hôm qua, là ngày mai, hoặc cách 2 ngày trở đi
            const schedulesToUpdate = allSchedules.filter((schedule) => {
                const isYesterday = moment(schedule.end).isSame(oneDayAgo, 'day');
                const isTomorrow = moment(schedule.end).isSame(oneDayAhead, 'day');
                const isMoreThanOneDayBehind = moment(schedule.end).isBefore(
                    currentDate.clone().subtract(1, 'day'),
                    'day',
                );

                return (
                    schedule.statusWork !== '2' && // Chưa hoàn thành
                    (isYesterday || isTomorrow || isMoreThanOneDayBehind)
                );
            });

            // Cập nhật trạng thái công việc
            for (const schedule of schedulesToUpdate) {
                // Kiểm tra nếu công việc chưa hoàn thành và là ngày hôm qua, cập nhật trạng thái thành '3'
                if (moment(schedule.end).isSame(oneDayAgo, 'day')) {
                    schedule.statusWork = '3'; // Quá hạn
                }
                // Kiểm tra nếu công việc chưa hoàn thành và là ngày mai, cập nhật trạng thái thành '1'
                else if (moment(schedule.end).isSame(oneDayAhead, 'day')) {
                    schedule.statusWork = '1'; // Sắp tới hạn
                }
                // Kiểm tra nếu công việc chưa hoàn thành và cách hơn 1 ngày, cập nhật trạng thái thành '3'
                else {
                    schedule.statusWork = '3'; // Quá hạn
                }

                await schedule.save();
            }

            console.log('Updated schedules:', schedulesToUpdate);
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
