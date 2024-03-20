const express = require('express');
const router = express.Router();
const SpendingController = require('../controllers/SpendingController');
const authMiddleware = require('../middlewares/authMiddleware');


router.post('/api/createSpending', authMiddleware.verifyToken, SpendingController.createSpending);
router.get('/api/getSpending/:userId', SpendingController.getSpending);
router.get('/api/getAllSpending/:userId', SpendingController.getAllSpending);
router.post('/api/updateSpending/:id',authMiddleware.verifyToken,SpendingController.updateSpending);
router.delete('/api/deleteSpending/:id', authMiddleware.verifyToken, SpendingController.deleteSpending);
// test api category
router.post('/api/createcategory',SpendingController.createcategory);
router.get('/api/getcategory', SpendingController.getCategorySpending);
module.exports = router;