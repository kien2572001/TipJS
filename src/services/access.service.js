"use strict";

const shopModel = require("../models/shop.model");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const KeyTokenService = require("../services/keyToken.service");
const { createTokenPair } = require("../auth/authUtils");
const { getInfoData } = require("../utils");
const { BadRequestError, AuthFailedError } = require("../core/error.response");
const { findShopByEmail } = require("./shop.service");
const RoleShop = {
  SHOP: "SHOP",
  WRITER: "WRITER",
  EDITOR: "EDITOR",
  ADMIN: "ADMIN",
};

class AccessService {
  /*
    1 - check if email exists
    2 - check if password is correct
    3 - create AT and RT and save RT to db
    4 - generate token
    5 - get data return login
  */
  static login = async ({ email, password, refreshToken }) => {
    console.log("[P]::[AccessService]::[login]");
    //step 1
    const foundShop = await findShopByEmail({ email });
    if (!foundShop) {
      throw new BadRequestError("Shop not found");
    }
    //step 2
    const match = await bcrypt.compare(password, foundShop.password);
    if (!match) {
      throw new AuthFailedError("Password is incorrect");
    }

    //step 3
    //create privateKey, publicKey
    const privateKey = crypto.randomBytes(64).toString("hex");
    const publicKey = crypto.randomBytes(64).toString("hex");

    //step 4

    const { _id: userId } = foundShop;
    const tokens = await createTokenPair(
      {
        userId: userId,
        email: foundShop.email,
      },
      publicKey,
      privateKey
    );

    await KeyTokenService.createKeyToken({
      refreshToken: tokens.refreshToken,
      privateKey,
      publicKey,
      userId: userId,
    });

    // if (!publicKeyString) {
    //   throw new BadRequestError("create publicKey failed");
    // }

    return {
      metadata: {
        shop: getInfoData({
          fields: ["_id", "name", "email", "status", "verify", "roles"],
          object: foundShop,
        }),
        tokens,
      },
    };
  };

  static signUp = async ({ name, email, password }) => {
    console.log("[P]::[AccessService]::[signUp]");
    //step 1: check if email exists
    const hodelShop = await shopModel.findOne({ email }).lean();
    if (hodelShop) {
      throw new BadRequestError("Email already exists");
    }

    //step 2: create new user
    const passwordHash = await bcrypt.hash(password, 10);
    const newShop = await shopModel.create({
      name,
      email,
      password: passwordHash,
      roles: [RoleShop.SHOP],
    });
    if (newShop) {
      //create privateKey, publicKey
      // const { privateKey, publicKey } = crypto.generateKeyPairSync("rsa", {
      //   modulusLength: 4096,
      //   publicKeyEncoding: {
      //     type: "pkcs1",
      //     format: "pem",
      //   },
      //   privateKeyEncoding: {
      //     type: "pkcs1",
      //     format: "pem",
      //   },
      // });
      const privateKey = crypto.randomBytes(64).toString("hex");
      const publicKey = crypto.randomBytes(64).toString("hex");

      // console.log("privateKey", privateKey);
      // console.log("publicKey", publicKey);

      const publicKeyString = await KeyTokenService.createKeyToken({
        userId: newShop._id,
        publicKey,
        privateKey,
      });

      if (!publicKeyString) {
        throw new BadRequestError("create publicKey failed");
      }

      // const publicKeyObject = crypto.createPublicKey(publicKeyString);
      // console.log("publicKeyObject", publicKeyObject);

      //create token pair
      const tokens = await createTokenPair(
        {
          userId: newShop._id,
          email: newShop.email,
        },
        publicKey,
        privateKey
      );
      console.log("Create Token success");
      return {
        code: "201",
        metadata: {
          shop: getInfoData({
            fields: ["_id", "name", "email", "status", "verify", "roles"],
            object: newShop,
          }),
          tokens,
        },
      };
    }

    return {
      code: "200",
      message: "create shop failed",
    };
  };
}

module.exports = AccessService;
