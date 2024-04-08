const User = require('../models/User.js');
const Spending = require('../models/Spending.js');
const Category = require('../models/CategorySpending.js');
const mongoose = require('mongoose');
class SpendingController{
    async createSpending(req, res) {
        try {
            const { description, amount, userId, categoryId} = req.body;
            const newSpending = new Spending({ description, amount, userId, categoryId });
            await newSpending.save();
            res.status(201).json(newSpending);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
    
    // Hàm cập nhật một mục chi tiêu đã tồn tại
    async updateSpending(req, res) {
        try {
            const { id } = req.params;
            const { description, amount,categoryId } = req.body;
            const updatedSpending = await Spending.findByIdAndUpdate(id, { description, amount, categoryId }, { new: true });
            if (!updatedSpending) {
                return res.status(404).json({ message: 'Không tìm thấy mục chi tiêu' });
            }
            res.json(updatedSpending);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
    
    // Hàm xóa một mục chi tiêu đã tồn tại
    async deleteSpending(req, res) {
        try {
            const { id } = req.params;
            const deletedSpending = await Spending.findByIdAndDelete(id);
            if (!deletedSpending) {
                return res.status(404).json({ message: 'Không tìm thấy mục chi tiêu' });
            }
            res.json({ message: 'Xóa thành công' });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    async getSpending(req, res) {
        try {
            const { userId } = req.params;
            let { date } = req.query;
    
            // Chuyển đổi ngày từ string thành đối tượng Date
            date = new Date(date);
    
            // Tạo một range thời gian từ 00:00:00 đến 23:59:59 của ngày được chỉ định
            const startDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
            const endDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59);
    
            // Lấy các mục chi tiêu có userId tương ứng và ngày nằm trong khoảng thời gian đã chỉ định
            const spendings = await Spending.find({ userId, date: { $gte: startDate, $lte: endDate } });
    
            res.json(spendings);
        } catch (error) {
            res.status(500).json({ error: 'Could not get spendings' });
        }
    }
    
    async createcategory(req, res) {
        try {
            const { name} = req.body;
            
            // Tạo một loại chi tiêu mới từ dữ liệu được gửi từ client
            const newCategory = new Category({
                name: name,
            });
    
            // Lưu loại chi tiêu mới vào cơ sở dữ liệu
            const savedCategory = await newCategory.save();
    
            // Trả về thông tin của loại chi tiêu vừa được thêm mới
            res.status(201).json(savedCategory);
        } catch (error) {
            // Xử lý lỗi nếu có bất kỳ lỗi nào xảy ra
            console.error('Error creating category:', error);
            res.status(500).json({ error: 'Could not create category' });
        }
    }
    async getCategorySpending(req, res) {
        try {
            const categories = await Category.find(); // Lấy tất cả các danh mục từ bảng categorySpending
            res.json(categories);
        } catch (error) {
            res.status(500).json({ error: 'Could not get categories' });
        }
    }
    async getAllSpending(req,res) {
        try {
            const allspending = await Spending.find(); // Lấy tất cả các danh mục từ bảng categorySpending
            res.json(allspending);
        } catch (error) {
            res.status(500).json({ error: 'Could not get categories' });
        }
    }
}
module.exports = new SpendingController();