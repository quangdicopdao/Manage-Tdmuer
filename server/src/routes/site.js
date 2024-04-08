// routes/site.js
const express = require('express');
const router = express.Router();
const siteController = require('../controllers/SiteController');
// Add a leading slash to the route path

router.get('/api/search', siteController.search);
router.get('/api/notification/:userId', siteController.notification);
module.exports = router;
