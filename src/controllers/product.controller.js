'use strict'
const ProductService = require('../services/product.service');
const ProductServiceV2 = require('../services/product.service.xxx');
const {SuccessResponse} = require('../core/success.response');

class ProductController {
    createProduct = async (req, res, next) => {
        // new SuccessResponse({
        //     message: "Product created",
        //     metadata: await ProductService.createProduct(req.body.product_type,
        //         {
        //             ...req.body,
        //             product_shop: req.user.userId,
        //         })
        // }).send(res);

        new SuccessResponse({
            message: "Product created",
            metadata: await ProductServiceV2.createProduct(req.body.product_type,
                {
                    ...req.body,
                    product_shop: req.user.userId,
                })
        }).send(res);
    }

    publishProduct = async (req, res, next) => {
        new SuccessResponse({
            message: "Product published",
            metadata: await ProductServiceV2.publishProductByShop({
                product_shop: req.user.userId,
                product_id: req.params.id
            })
        }).send(res);
    }

    unpublishProduct = async (req, res, next) => {
        new SuccessResponse({
            message: "Product unpublished",
            metadata: await ProductServiceV2.unpublishProductByShop({
                product_shop: req.user.userId,
                product_id: req.params.id
            })
        }).send(res);
    }

    ///QUERY
    getAllDraftsForShop = async (req, res, next) => {
        new SuccessResponse({
            message: "Get list of drafts",
            metadata: await ProductServiceV2.findAllDraftsForShop(req.user.userId)
        }).send(res);
    }

    getAllPublishedForShop = async (req, res, next) => {
        new SuccessResponse({
            message: "Get list of published products",
            metadata: await ProductServiceV2.findAllPublishedForShop(req.user.userId)
        }).send(res);
    }

    getListSearchProduct = async (req, res, next) => {
        new SuccessResponse({
            message: "Get list of search products",
            metadata: await ProductServiceV2.searchProduct(req.params)
        }).send(res);
    }

    findAllProducts = async (req, res, next) => {
        new SuccessResponse({
            message: "Get list of products",
            metadata: await ProductServiceV2.findAllProducts(req.query)
        }).send(res);
    }

    findProduct = async (req, res, next) => {
        new SuccessResponse({
            message: "Get product",
            metadata: await ProductServiceV2.findProduct(req.params.product_id)
        }).send(res);
    }

    ///END QUERY
}

module.exports = new ProductController();