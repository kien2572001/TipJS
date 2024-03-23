"use strict";

const keyTokenModel = require("../models/keytoken.model");
const mongoose = require("mongoose");

class KeyTokenService {
  static createKeyToken = async ({
    userId,
    publicKey,
    privateKey,
    refreshToken,
  }) => {
    try {
      // const publicKeyString = publicKey.toString();
      // const tokens = await keyTokenModel.create({
      //   user: userId,
      //   publicKey,
      //   privateKey,
      // });
      // return tokens ? tokens.publicKey : null;

      //level xx
      const filter = { user: userId };
      const update = {
        publicKey,
        privateKey,
        refreshTokenUsed: [],
        refreshToken,
      };
      const options = { upsert: true, new: true };
      const tokens = await keyTokenModel.findOneAndUpdate(
        filter,
        update,
        options
      );

      return tokens ? tokens.publicKey : null;
    } catch (error) {
      throw error;
    }
  };

  static findByUserId = async (userId) => {
    const filter = { user: new mongoose.Types.ObjectId(userId) };
    return await keyTokenModel.findByOne(filter).lean();
  };

  static findByUserId = async (userId) => {
    const filter = { user: new mongoose.Types.ObjectId(userId) };
    return await keyTokenModel.findOne(filter).lean();
  };

  static removeKeyById = async (id) => {
    //console.log("id", id);
    return await keyTokenModel.deleteOne({ _id: id });
  };

  static findByRefreshToken = async (refreshToken) => {
    const filter = { refreshToken };
    return await keyTokenModel.findOne(filter);
  };

  static findByRefreshTokenUsed = async (refreshToken) => {
    const filter = { refreshTokenUsed: refreshToken };
    return await keyTokenModel.findOne(filter).lean();
  };

  static deleteKeyByUserId = async (userId) => {
    const filter = { user: userId };
    return await keyTokenModel.deleteOne(filter);
  };
}

module.exports = KeyTokenService;
