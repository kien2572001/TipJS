"use strict";

const express = require("express");
const router = express.Router();
const { apiKey, permission } = require("../auth/checkAuth");

//check api key middleware
router.use(apiKey);
//check permission middleware
router.use(permission("0000"));

router.use("/v1/api/product", require("./product"));
router.use("/v1/api", require("./access"));

router.get("/", (req, res) => {
  return res.status(200).json({
    message: "welcome to express",
  });
});

module.exports = router;
