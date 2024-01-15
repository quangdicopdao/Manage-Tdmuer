// controllers/SiteController.js
const Schedule = require('../models/Schedule.js');

// controllers/ScheduleController.js
class ScheduleController {
    async show(req, res, next) {
        try {
            const schedule = Schedule.find();
            res.json(schedule);
        } catch (error) {
            console.error('Error fetching posts:', err);
            next(err);
        }
    }
}

module.exports = new ScheduleController();
