// utils/auth.js
const jwt = require('jsonwebtoken');

function generateToken(user) {
    // Thực hiện logic tạo token từ thông tin người dùng và ký bằng secret key
    const token = jwt.sign({ user }, 'your-jwt-secret-key', { expiresIn: '1h' }); // Có thể cấu hình thời gian hết hạn

    return token;
}

module.exports = { generateToken };
