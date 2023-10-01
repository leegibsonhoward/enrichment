"use strict";

const router = require('express').Router();
const mentorshipController = require('../controllers/mentorshipController');

// mentorships routes
router.get("/", mentorshipController.index, mentorshipController.indexView);
router.get("/:id", mentorshipController.show, mentorshipController.showView);

module.exports = router;