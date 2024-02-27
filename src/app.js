const express = require("express");
const morgan = require("morgan");
const { default: helmet } = require("helmet");
const compression = require("compression");
const app = express();

//init middleware
app.use(morgan("dev"));
app.use(helmet());
app.use(compression());

//init db
require("./dbs/init.mongodb");

//init routes

app.get("/", (req, res) => {
  const strCompressed = "Hello World";

  return res.status(200).json({
    message: "welcome to express",
    metadata: strCompressed.repeat(1000000),
  });
});

//init error handler

module.exports = app;
