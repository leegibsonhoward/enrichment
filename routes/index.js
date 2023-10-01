"use strict";

const router = require('express').Router();

const userRoutes = require('./userRoutes');
const mentorshipRoutes = require('./mentorshipRoutes');
const dashboardRoutes = require('./dashboardRoutes');
const indexRoutes = require('./indexRoutes');
const errorRoutes = require('./errorRoutes');

router.use("/users", userRoutes);
router.use("/mentorships", mentorshipRoutes);
router.use("/dashboard", dashboardRoutes);
router.use("/", indexRoutes);
router.use("/", errorRoutes);

module.exports = router;