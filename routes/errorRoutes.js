"use strict";

const router = require('express').Router();
const errorController = require('../controllers/errorController');

// error handling middleware
router.use(errorController.pageNotFoundError);
router.use(errorController.internalServerError);

module.exports = router;