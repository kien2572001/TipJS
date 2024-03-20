"use strict";

const express = require("express");
const accessControler = require("../../controllers/access.controler");
const router = express.Router();
const { asyncHandler } = require("../../auth/checkAuth");

//signUp
router.post("/shop/signup", asyncHandler(accessControler.signUp));

module.exports = router;
