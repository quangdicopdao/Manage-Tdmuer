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

            // Trích xuất selectedDate từ req.query
            const { selectedDate } = req.query;

            // Kiểm tra selectedDate nếu không có thì trả về lỗi
            if (!selectedDate) {
                return res.status(400).json({ message: 'Selected date is required' });
            }

            // Chuyển đổi selectedDate thành đối tượng Date
            const endOfDay = new Date(selectedDate);
            endOfDay.setHours(23, 59, 59, 999); // Đặt giờ là 23:59:59 và millisecond là 999

            // Tạo ngày bắt đầu của ngày đã chọn
            const startOfDay = new Date(selectedDate);
            startOfDay.setHours(0, 0, 0, 0); // Đặt giờ là 00:00:00 và millisecond là 0

            // Truy vấn lịch theo ID người dùng đã đăng nhập và end là ngày đã chọn
            const userId = req.user.id;
            const { statusWork, page, pageSize = 5, query } = req.query;

            if (statusWork === undefined || statusWork === null || statusWork === '') {
                return res.status(400).json({ message: 'StatusWork is required' });
            }

            // Tạo điều kiện tìm kiếm
            let searchCondition = { userId, end: { $gte: startOfDay, $lte: endOfDay } }; // Thêm điều kiện end

            // Nếu statusWork bằng 5, không cần thêm điều kiện tìm kiếm về statusWork
            if (statusWork !== '5') {
                searchCondition.statusWork = statusWork;
            }

            if (query) {
                // Nếu có query, thêm điều kiện tìm kiếm cho title hoặc description
                searchCondition.$or = [
                    { title: { $regex: query, $options: 'i' } },
                    { description: { $regex: query, $options: 'i' } },
                ];
            }

            const skip = (page - 1) * pageSize;

            const userSchedule = await Schedule.find(searchCondition).skip(skip).limit(pageSize).sort({ end: 'desc' });

            const total = await Schedule.countDocuments(searchCondition);
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

    async overview(req, res, next) {
        try {
            // Kiểm tra xem người dùng đã đăng nhập chưa
            if (!req.user) {
                return res.status(401).json({ message: 'Unauthorized' });
            }

            // Truy vấn lịch theo ID người dùng đã đăng nhập
            const userId = req.user.id;
            const schedules = await Schedule.find({ userId });
            return res.status(200).json({ schedules });
        } catch (error) {
            next(error);
        }
    }
    //create a new schedule
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
    //edit the schedule
    async edit(req, res, next) {
        try {
            const scheduleId = req.params.id; // Lấy id của schedule từ request params
            const updateData = req.body; // Lấy dữ liệu cập nhật từ request body

            // Kiểm tra nếu không có dữ liệu cập nhật được gửi lên
            if (!updateData) {
                return res.status(400).json({ success: false, message: 'No data provided for update' });
            }

            // Tiến hành cập nhật schedule trong cơ sở dữ liệu
            const updatedSchedule = await Schedule.findByIdAndUpdate(scheduleId, updateData, { new: true });

            // Kiểm tra xem có schedule được cập nhật thành công không
            if (!updatedSchedule) {
                return res.status(404).json({ success: false, message: 'Schedule not found or unable to update' });
            }

            // Trả về thông tin schedule đã cập nhật thành công
            res.status(200).json({ success: true, schedule: updatedSchedule });
        } catch (error) {
            // Bắt lỗi nếu có lỗi xảy ra trong quá trình cập nhật
            console.error('Error editing schedule:', error);
            res.status(500).json({ success: false, message: 'Internal server error' });
        }
    }

    // update the content of the schedule
    async update(req, res, next) {
        try {
            Schedule.updateOne({ _id: req.params.id }, req.body);
        } catch (error) {
            next(error);
        }
    }
    async delete(req, res, next) {
        try {
            await Schedule.deleteOne({ _id: req.params.id });
            res.status(200).json({ message: 'Deleted schedule successfully.' });
        } catch (error) {
            next(error);
        }
    }
    async updateStatus(req, res, next) {
        try {
            // Lấy id người dùng từ request
            const scheduleId = req.params.scheduleId;
            console.log('scheduleId: ', scheduleId);

            // Giá trị mới của trường statusWork
            const newStatusWork = 2; // Cố định statusWork thành 2

            // Cập nhật trường statusWork cho người dùng có id tương ứng
            await Schedule.updateMany({ _id: scheduleId }, { $set: { statusWork: newStatusWork } });

            res.status(200).json({ message: 'StatusWork updated successfully' });
        } catch (error) {
            next(error);
        }
    }

    // auto update status of schedule
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
