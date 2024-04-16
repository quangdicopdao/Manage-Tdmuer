const User = require('../models/User.js');
const Schedule = require('../models/Schedule.js');
const ListJoin = require('../models/ListJoin.js');
const Notification = require('../models/Notification.js');
const Post = require('../models/Posts.js');
const mongoose = require('mongoose');

class ListJoinController {
    async joinActivity(req, res, next) {
        try {
            const { studentId, classId, fullName, department, email, userId, postId, description } = req.body;
            let { start, end } = req.body;
            start = new Date(start);
            end = new Date(end);

            console.log('type', typeof start);
            if (start.toDateString() === end.toDateString()) {
                if (start.getHours() === end.getHours() && start.getMinutes() === end.getMinutes()) {
                    return res.status(500).json({ message: 'Giờ bắt đầu phải khác giờ kết thúc.' });
                }
            }
            // Kiểm tra nếu giờ của start bằng giờ của end

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

            const post = await Post.findById(postId);
            const postTitle = post.title;
            const messageNoti = `Đăng ký tham gia thành công :${postTitle}`;

            const newNotification = new Notification({ userId, postId, message: messageNoti });
            await newNotification.save();

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
            const list = await ListJoin.find({ postId: postId });

            return res.status(200).json({ list });
        } catch (error) {
            return res.status(500).json({ message: 'Đã xảy ra lỗi khi hiển thị danh sách' });
        }
    }
    async showMyList(req, res) {
        try {
            const userId = new mongoose.Types.ObjectId(req.params.userId);
            console.log('userId', userId);
            const list = await ListJoin.find({ userId: userId });
            console.log('list', list);

            const data = [];
            for (let item of list) {
                const post = await Post.findById(item.postId);

                const newDataItem = {
                    title: post.title,
                    createdAt: item.createdAt,
                    mark: item.mark,
                    isPresent: item.isPresent,
                };

                data.push(newDataItem);
            }
            return res.status(200).json(data);
        } catch (error) {
            return res.status(500).json({ message: 'Đã xảy ra lỗi khi hiển thị danh sách' });
        }
    }

    async updateImageUrl(req, res) {
        try {
            const { url, userId, postId } = req.body;

            // Tìm Document cần cập nhật
            const contentUpdate = await ListJoin.findOneAndUpdate({ userId: userId, postId: postId });

            // Kiểm tra xem Document có tồn tại hay không
            if (!contentUpdate) {
                return res.status(404).json({ message: 'Document không tồn tại' });
            }

            // Cập nhật imageUrl
            contentUpdate.imageUrl = url;

            // Lưu thay đổi vào cơ sở dữ liệu
            await contentUpdate.save();

            return res.status(200).json({ message: 'Cập nhật minh chứng thành công' });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Đã xảy ra lỗi khi cập nhật minh chứng' });
        }
    }
    async updateMark(req, res) {
        try {
            const data = req.body; // Nhận dữ liệu từ request body

            // Kiểm tra nếu không có dữ liệu
            if (!data || data.length === 0) {
                return res.status(400).json({ message: 'Thiếu thông tin' });
            }

            // Lặp qua từng đối tượng trong mảng data để cập nhật điểm
            for (const item of data) {
                const { id, mark } = item; // Lấy id và mark từ mỗi đối tượng trong mảng

                // Kiểm tra nếu id là undefined
                if (!id) {
                    return res.status(400).json({ message: 'Thiếu thông tin _id' });
                }

                // Cập nhật điểm cho mỗi id
                const updateMark = await ListJoin.findByIdAndUpdate(
                    { _id: id }, // Điều kiện tìm kiếm tài liệu cần cập nhật
                    { mark: mark, isPresent: true }, // Giá trị mới cho trường mark
                    { new: true }, // Tùy chọn để trả về tài liệu đã được cập nhật
                );

                if (!updateMark) {
                    return res.status(404).json({ message: 'Không tìm thấy tài liệu cần cập nhật' });
                }
            }

            return res.status(200).json({ message: 'Cập nhập điểm rèn luyện thành công' });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Đã xảy ra lỗi khi cập nhật điểm rèn luyện' });
        }
    }
}
module.exports = new ListJoinController();
