const User = require('../models/User.js');
const Schedule = require('../models/Schedule.js');
const ListJoin = require('../models/ListJoin.js');
const mongoose = require('mongoose');

class ListJoinController {
    async joinActivity(req, res, next) {
        try {
            const { studentId, classId, fullName, department, email, userId, postId, description } = req.body;
            let { start, end } = req.body;
            start = new Date(start);
            end = new Date(end);

            console.log('type', typeof start);
            // Kiểm tra nếu giờ của start bằng giờ của end
            if (start.getHours() === end.getHours() && start.getMinutes() === end.getMinutes()) {
                return res.status(500).json({ message: 'Giờ bắt đầu phải khác giờ kết thúc.' });
            }

            // Tạo một truy vấn để kiểm tra xem có lịch trình nào chồng chéo với thời gian mới không
            const existingSchedule = await Schedule.findOne({
                userId: userId,
                $or: [
                    // Bắt đầu mới trong khoảng thời gian của lịch trình đã tồn tại
                    { start: { $lte: start }, end: { $gte: start } },
                    // Kết thúc mới trong khoảng thời gian của lịch trình đã tồn tại
                    { start: { $lte: end }, end: { $gte: end } },
                    // Lịch trình đã tồn tại nằm trong khoảng thời gian mới
                    { start: { $gte: start }, end: { $lte: end } },
                ],
            });

            if (existingSchedule) {
                return res.status(500).json({ message: 'Thời gian đã được sử dụng trong lịch trình khác.' });
            }

            const newList = new ListJoin({ studentId, classId, fullName, department, email, userId, postId });
            await newList.save();
            const title = 'Tham gia hoạt động có điểm rèn luyện';

            const newSchedule = new Schedule({ title, start, end, description, userId });
            await newSchedule.save();
            return res.status(200).json({ message: 'Đăng ký tham gia thành công.' });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Đã xảy ra lỗi khi đăng ký tham gia.' });
        }
    }
    async checkJoinActivity(req, res) {
        try {
            const { userId, postId } = req.body;
            console.log(userId, postId);

            // Tìm kiếm trong danh sách hoạt động đã đăng ký với userId cụ thể
            const joinActivity = await ListJoin.findOne({ userId, postId });

            if (joinActivity) {
                return res.status(200).json({ message: 'joined' });
            } else {
                return res.status(404).json({ message: 'joined yet' });
            }
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Đã xảy ra lỗi khi kiểm tra đăng ký tham gia hoạt động.' });
        }
    }
    async showList(req, res) {
        try {
            const postId = new mongoose.Types.ObjectId(req.params.postId);
            console.log(postId);
            const list = await ListJoin.find({ postId: postId });
            console.log(list);

            return res.status(200).json({ list });
        } catch (error) {
            return res.status(500).json({ message: 'Đã xảy ra lỗi khi hiển thị danh sách' });
        }
    }
}
module.exports = new ListJoinController();
