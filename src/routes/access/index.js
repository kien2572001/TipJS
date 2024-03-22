"use strict";

const express = require("express");
const accessControler = require("../../controllers/access.controler");
const router = express.Router();
const { asyncHandler } = require("../../auth/checkAuth");

//signUp
router.post("/shop/login", asyncHandler(accessControler.login));
router.post("/shop/signup", asyncHandler(accessControler.signUp));

module.exports = router;
