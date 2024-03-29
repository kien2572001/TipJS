"use strict";

const { findById } = require("../services/apikey.service");

const HEADER = {
  API_KEY: "x-api-key",
  CLIENT_ID: "x-client-id",
  AUTHORIZATION: "authorization",
};

const apiKey = async (req, res, next) => {
  try {
    const key = req.headers[HEADER.API_KEY]?.toString();
    //console.log("[P]::[auth]::[apiKey]::[key]", key);
    if (!key) {
      return res.status(403).json({
        message: "Forbidden Error",
      });
    }
    const objKey = await findById(key);
    //console.log("[P]::[auth]::[apiKey]::[objKey]", objKey);
    if (!objKey) {
      return res.status(403).json({
        message: "Forbidden Error",
      });
    }
    req.objKey = objKey;
    return next();
  } catch (error) {
    //console.log("[P]::[auth]::[apiKey]::[error]", error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

const permission = (permission) => {
  return (req, res, next) => {
    if (!req.objKey.permissions) {
      return res.status(403).json({
        message: "Permission Denied",
      });
    }

    //console.log("permissions", req.objKey.permissions);
    const validPermission = req.objKey.permissions.includes(permission);
    if (!validPermission) {
      return res.status(403).json({
        message: "Permission Denied",
      });
    }

    return next();
  };
};

module.exports = {
  apiKey,
  permission,
};
