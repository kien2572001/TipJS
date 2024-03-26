"use strict";

const _ = require("lodash");

const getInfoData = ({ fields = [], object = {} }) => {
  return _.pick(object, fields);
};

const getSelectData = (select = []) => {
    return Object.fromEntries(select.map((item) => [item, 1]));
}

const getUnselectData = (unselect = []) => {
    return Object.fromEntries(unselect.map((item) => [item, 0]));
}

const removeUndefinedObject = (object) => {
    const newObj = {};
    Object.keys(object).forEach((key) => {
        if (object[key] !== undefined && object[key] !== null) {
            newObj[key] = object[key];
        }
    });
    return newObj;
}

const updateNestedObject = (object) => {
    if (object === null || typeof object !== "object") {
        return object;
    }
    const final = {};
    Object.keys(object).forEach((key) => {
        if (typeof object[key] === "object" && !Array.isArray(object[key]) && object[key] !== null) {
            const nested = updateNestedObject(removeUndefinedObject(object[key]));
            if (typeof nested === "object" && Object.keys(nested).length > 0) {
                Object.keys(nested).forEach((nestedKey) => {
                    final[`${key}.${nestedKey}`] = nested[nestedKey];
                });
            }
        }
        else {
            final[key] = object[key];
        }
    });
    return final;
}

module.exports = {
  getInfoData,
  getSelectData,
  getUnselectData,
  removeUndefinedObject,
  updateNestedObject,
};
