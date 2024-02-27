"use strict";

const mongoose = require("mongoose");

const connectString = "mongodb://localhost:27018/MongoDocker";

mongoose
  .connect(connectString)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log("Error connecting to MongoDB", err);
  });

class Database {
  constructor() {
    this._connect();
  }
  _connect() {
    mongoose
      .connect(connectString)
      .then(() => {
        console.log("Database connection successful");
      })
      .catch((err) => {
        console.error("Database connection error", err);
      });
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new Database();
    }
    return this.instance;
  }
}

module.exports = Database.getInstance();
