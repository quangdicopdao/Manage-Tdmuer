// routes/site.js
const express = require('express');
const router = express.Router();
const siteController = require('../controllers/SiteController');

// Add a leading slash to the route path
router.get('/api/posts', siteController.index);

module.exports = router;
