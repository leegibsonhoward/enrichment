"use strict";

const router = require('express').Router();
const indexController = require('../controllers/indexController');

// routes
router.get("/", indexController.showIndex);

module.exports = router;

