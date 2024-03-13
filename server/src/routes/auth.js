const express = require('express');
const router = express.Router();

const authController = require('../controllers/AuthController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/refresh', authController.requestRefreshToken);
router.post('/logout', authMiddleware.verifyToken, authController.logout);
router.get('/get/users', authController.getUser);
router.post('/login/facebook', authController.loginFacebook);
router.post('/login/google', authController.loginGoogle);
module.exports = router;
