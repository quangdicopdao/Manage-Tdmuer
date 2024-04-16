const User = require('../models/User.js');
const Spending = require('../models/Spending.js');
const Category = require('../models/CategorySpending.js');
const Wallet = require('../models/Wallet.js');
const mongoose = require('mongoose');
class SpendingController{
    async createSpending(req, res) {
        try {
            const { description, amount, categoryId, walletId} = req.body;
            const newSpending = new Spending({ description, amount, categoryId, walletId });
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

            const { description, amount, categoryId } = req.body;
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
    
            // Lấy tất cả các ví của người dùng dựa trên userId
            const wallets = await Wallet.find({ userId });
    
            if (!wallets || wallets.length === 0) {
                return res.status(404).json({ error: 'Wallets not found' });
            }
            // Lấy tất cả các mục chi tiêu thuộc các ví của người dùng trong khoảng thời gian đã chỉ định
            const spendings = await Spending.find({ 
                walletId: { $in: wallets.map(wallet => wallet._id) },
                date: { $gte: startDate, $lte: endDate } 
            });
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
            const userId = req.params.userId; 
            const wallets = await Wallet.find({ userId });
    
            if (!wallets || wallets.length === 0) {
                return res.status(404).json({ error: 'Wallets not found' });
            }
            const allspending = await Spending.find({
                walletId: { $in: wallets.map(wallet => wallet._id) }
            }
            ); // Lấy tất cả các danh mục từ bảng categorySpending

            res.json(allspending);
        } catch (error) {
            res.status(500).json({ error: 'Could not get categories' });
        }
    }
    // tạo ví và get ví
    async createWallet(req, res) {
        try{
            const {Initialbalance, userId} = req.body;
            const newWallet = new Wallet({Initialbalance,userId});
            await newWallet.save();
            res.status(201).json(newWallet);
        } catch(error) {
            res.status(400).json({ message: error.message });
        }
    }
    async getAllWallet(req, res) {
        try {
            const userId = req.params.userId; // Lấy userId từ tham số của request
            const allWallet = await Wallet.find({ userId }); // Lấy tất cả các ví dựa trên userId
            res.json(allWallet);
        } catch (error) {
            res.status(500).json({ error: 'Could not get wallets' });
        }
    }    
}
module.exports = new SpendingController();