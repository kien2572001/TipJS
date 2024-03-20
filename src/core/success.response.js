"use strict";

const StatusCode = {
  OK: 200,
  CREATED: 201,
};

const ReasonStatusCodes = {
  OK: "OK",
  CREATED: "Created",
};

class SuccessResponse {
  constructor({
    message,
    statusCode = StatusCode.OK,
    reasonPhrase = ReasonStatusCodes.OK,
    metadata = {},
  }) {
    this.message = !message ? reasonPhrase : message;
    this.statusCode = statusCode;
    this.reasonPhrase = reasonPhrase;
    this.metadata = metadata;
  }

  send(res, headers = {}) {
    res.status(this.statusCode).json(this);
  }
}

class OKResponse extends SuccessResponse {
  constructor({ message, metadata }) {
    super({
      message,
      statusCode: StatusCode.OK,
      reasonPhrase: ReasonStatusCodes.OK,
      metadata,
    });
  }
}

class CreatedResponse extends SuccessResponse {
  constructor({ message, metadata, options = {} }) {
    super({
      message,
      statusCode: StatusCode.CREATED,
      reasonPhrase: ReasonStatusCodes.CREATED,
      metadata,
    });
    this.options = options;
  }
}

module.exports = {
  SuccessResponse,
  OKResponse,
  CreatedResponse,
};
