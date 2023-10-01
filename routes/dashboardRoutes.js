"use strict";

const router = require('express').Router();
const dashboardController = require('../controllers/dashboardController');

// dashboard routes
router.get("/", dashboardController.showDashboard);

module.exports = router;
