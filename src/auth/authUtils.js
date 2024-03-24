"use strict";

const HEADER = {
  API_KEY: "x-api-key",
  CLIENT_ID: "x-client-id",
  AUTHORIZATION: "authorization",
};

const JWT = require("jsonwebtoken");
const asyncHandler = require("../helper/asyncHandler");
const KeyTokenService = require("../services/keyToken.service");
const {
  AuthFailedError,
  NotFoundRequestError,
} = require("../core/error.response");
const createTokenPair = async (payload, publicKey, privateKey) => {
  try {
    const accessToken = JWT.sign(payload, publicKey, {
      expiresIn: "2 days",
    });

    const refreshToken = JWT.sign(payload, privateKey, {
      expiresIn: "7 days",
    });

    JWT.verify(accessToken, publicKey, (err, decoded) => {
      if (err) {
        console.log("err verify accessToken", err);
      }
      console.log("decoded accessToken", decoded);
    });

    return {
      accessToken,
      refreshToken,
    };
  } catch (error) {
    throw error;
  }
};

const authentication = asyncHandler(async (req, res, next) => {
  /*
    1 - check userId is missing
    2 - get accessToken
    3 - verifyToken
    4 - check user ib db
    5 - check key store with this userId
    6 - OK all -> next
  */

  //step 1
  const userId = req.headers[HEADER.CLIENT_ID];
  if (!userId) {
    throw new AuthFailedError("Invalid request");
  }

  //step 2
  const keyStore = await KeyTokenService.findByUserId(userId);
  if (!keyStore) {
    throw new NotFoundRequestError("Not found key store");
  }

  //step 3
  const accessToken = req.headers[HEADER.AUTHORIZATION];
  if (!accessToken) {
    throw new AuthFailedError("Invalid request");
  }

  try {
    const decodedUser = JWT.verify(accessToken, keyStore.publicKey);
    if (userId !== decodedUser.userId)
      throw new AuthFailedError("Invalid user");
    req.keyStore = keyStore;
    req.user = decodedUser;
    return next();
  } catch (error) {
    throw error;
  }
});

const verifyJWT = (token, keySecret) => {
  return JWT.verify(token, keySecret);
};

module.exports = {
  createTokenPair,
  authentication,
  verifyJWT,
};
