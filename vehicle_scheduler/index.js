const express = require('express');
const schedulerRoutes = require('./routes/scheduler.route');

const router = express.Router();

router.use('/optimize', schedulerRoutes);

module.exports = router;
