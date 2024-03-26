"use strict";

const express = require("express");
const productController = require("../../controllers/product.controller");
const router = express.Router();
const asyncHandler = require("../../helper/asyncHandler");
const { authentication } = require("../../auth/authUtils");

//FOR USER
router.get(
    "/search/:keySearch",
    asyncHandler(productController.getListSearchProduct)
);

router.get("/:product_id", asyncHandler(productController.findProduct));
router.get("", asyncHandler(productController.findAllProducts));

//authentication
router.use(authentication);

router.post(
    "",
    asyncHandler(productController.createProduct)
);

router.patch(
    "/:product_id",
    asyncHandler(productController.updateProduct)
);

router.post(
    "/publish/:id",
    asyncHandler(productController.publishProduct)
);

router.post(
    "/unpublish/:id",
    asyncHandler(productController.unpublishProduct)
);

//query
/**
 * @desc Get all drafts for a shop
 * @route GET /api/products/drafts/all
 * @access Private
 * @param {string} product_shop - The shop id
 * @param {number} limit - The number of items to return - default 50
 * @param {number} skip - The number of items to skip - default 0
 * @returns {JSON} - A JSON object with the list of drafts
 */
router.get(
    "/drafts/all",
    asyncHandler(productController.getAllDraftsForShop)
);

/**
 * @desc Get all published products for a shop
 * @route GET /api/products/published/all
 * @access Private
 * @param {string} product_shop - The shop id
 * @param {number} limit - The number of items to return - default 50
 * @param {number} skip - The number of items to skip - default 0
 * @returns {JSON} - A JSON object with the list of published products
 */
router.get(
    "/published/all",
    asyncHandler(productController.getAllPublishedForShop)
);

module.exports = router;
