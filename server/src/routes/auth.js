// routes/auth.js
const express = require('express');
const router = express.Router();
const passport = require('passport');
const authController = require('../controllers/AuthController');

// Route đăng nhập bằng Google
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', authController.googleLoginCallback);

module.exports = router;
