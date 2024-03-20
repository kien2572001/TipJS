"use strict";

const apiKeyModel = require("../models/apikey.model");
const crypto = require("crypto");

const findById = async (key) => {
  //console.log("[P]::[apiKeyService]::[findById]:key", key);
  const objKey = await apiKeyModel.findOne({ key, status: true }).lean();
  return objKey;
};

module.exports = {
  findById,
};
