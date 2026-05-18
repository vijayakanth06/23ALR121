const express = require('express');
const router = express.Router();
const { optimizeSchedule } = require('../controllers/scheduler.controller');

router.get('/', optimizeSchedule);

module.exports = router;
