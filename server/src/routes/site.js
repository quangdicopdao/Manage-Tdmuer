// routes/site.js
const express = require('express');
const router = express.Router();
const siteController = require('../controllers/SiteController');
const authMiddleware = require('../middlewares/authMiddleware');
// Add a leading slash to the route path
router.get('/api/posts', siteController.index);
router.post('/api/posts/create', authMiddleware.verifyToken, siteController.create);
router.get('/api/posts/:id', siteController.detail);
module.exports = router;
