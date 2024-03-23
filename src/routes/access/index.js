"use strict";

const express = require("express");
const accessController = require("../../controllers/access.controler");
const router = express.Router();
const asyncHandler = require("../../helper/asyncHandler");
const { authentication } = require("../../auth/authUtils");

//signUp
router.post("/shop/login", asyncHandler(accessController.login));
router.post("/shop/signup", asyncHandler(accessController.signUp));

//authentication
router.use(authentication);

//logout
router.post("/shop/logout", asyncHandler(accessController.logout));
router.post(
  "/shop/handleRefreshToken",
  asyncHandler(accessController.handlerRefreshToken)
);

module.exports = router;
