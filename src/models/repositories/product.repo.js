'use strict'

const {productModel, clothingModel, electronicModel, furnitureModel} = require('../product.model')
const mongoose = require('mongoose')

const findAllDraftsForShop = async ({query,limit,skip}) => {
    return await queryProduct({query,limit,skip})
}

const findAllPublishedForShop = async ({query,limit,skip}) => {
    return await queryProduct({query,limit,skip})
}

const queryProduct = async ({query,limit,skip}) => {
    return await productModel.find(query)
        .populate('product_shop', 'name email -_id')
        .sort({updatedAt: -1})
        .skip(skip)
        .limit(limit)
        .lean()
        .exec()
}

const searchProductByUser = async ({keySearch}) => {
    const regex = new RegExp(keySearch, 'i')
    return await productModel.find({
        $isDraft: false,
        $isPublished: true,
        $text: {$search: regex}
        },
        {
            score: {$meta: 'textScore'}
        }
    )
        .sort({score: {$meta: 'textScore'}})
        .lean()
        .exec()
}

const publishProductByShop = async ({product_shop, product_id}) => {
    const foundShop = await productModel.findOne({
        product_shop : new mongoose.Types.ObjectId(product_shop),
        _id: new mongoose.Types.ObjectId(product_id)
    });
    if (!foundShop) {
        return null;
    }
    foundShop.isDraft = false;
    foundShop.isPublished = true;
    const {modifiedCount} = await productModel.updateOne({
        product_shop: new mongoose.Types.ObjectId(product_shop),
        _id: new mongoose.Types.ObjectId(product_id)
    }, foundShop);
    return modifiedCount;
}

const unpublishProductByShop = async ({product_shop, product_id}) => {
    const foundShop = await productModel.findOne({
        product_shop : new mongoose.Types.ObjectId(product_shop),
        _id: new mongoose.Types.ObjectId(product_id)
    });
    if (!foundShop) {
        return null;
    }
    foundShop.isDraft = true;
    foundShop.isPublished = false;
    const {modifiedCount} = await productModel.updateOne({
        product_shop: new mongoose.Types.ObjectId(product_shop),
        _id: new mongoose.Types.ObjectId(product_id)
    }, foundShop);
    return modifiedCount;
}

module.exports = {
    findAllDraftsForShop,
    findAllPublishedForShop,
    publishProductByShop,
    unpublishProductByShop,
    searchProductByUser
}