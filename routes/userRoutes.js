"use strict";

const router = require('express').Router();
const userController = require('../controllers/userController');
const Role = require('../_helpers/roles');

// User routes
router.get("/", userController.authorize(Role.Admin), userController.index, userController.indexView);
router.get("/portal", userController.portal);
router.post("/create", userController.validate, userController.create, userController.redirectView);
router.get("/logout", userController.logout, userController.redirectView);
router.post("/login", userController.authenticate);
router.get("/:id", userController.authorize([Role.Admin, Role.User]), userController.show, userController.showView);
router.get("/:id/edit", userController.authorize([Role.Admin, Role.User]),userController.edit);
router.put("/:id/update", userController.authorize([Role.Admin, Role.User]), userController.update, userController.redirectView);
router.delete("/:id/delete", userController.authorize([Role.Admin, Role.User]), userController.delete, userController.redirectView);

module.exports = router;