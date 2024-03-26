"use strict";

const {
    productModel,
    clothingModel,
    electronicModel,
    furnitureModel,
} = require("../models/product.model");

const {BadRequestError, ForbiddenRequestError} = require("../core/error.response");
const {findAllDraftsForShop,
    publishProductByShop,
    findAllPublishedForShop,
    searchProductByUser,
    unpublishProductByShop,
    findAllProducts,
    findProduct,
    updateProductById,
} = require("../models/repositories/product.repo");

const {
    removeUndefinedObject,
    updateNestedObject,
} = require("../utils");

//define Factory class to create product instances

class ProductFactory {

    //key - class
    static productRegistry = {};

    static registerProductType(type, classRef) {
        ProductFactory.productRegistry[type] = classRef;
    }
    /*
        type: 'Clothing' or 'Electronic'
     */
    static async createProduct(type,payload) {
        const productClass = ProductFactory.productRegistry[type];
        if (!productClass) {
            throw new BadRequestError("Invalid product type: " + type)
        }
        return new productClass(payload).createProduct();
    }

    static async updateProduct(type,product_id,payload) {
        const productClass = ProductFactory.productRegistry[type];
        if (!productClass) {
            throw new BadRequestError("Invalid product type: " + type)
        }
        return new productClass(payload).updateProduct(product_id);
    }

    static async publishProductByShop({product_shop, product_id}) {
        return await publishProductByShop({product_shop, product_id});
    }

    static async unpublishProductByShop({product_shop, product_id}) {
        return await unpublishProductByShop({product_shop, product_id});
    }

    //query //
    static async findAllDraftsForShop(product_shop,limit = 50, skip = 0){
        const query = {product_shop, isDraft: true};
        return await findAllDraftsForShop({query,limit,skip});
    }

    static async findAllPublishedForShop(product_shop,limit = 50, skip = 0){
        const query = {product_shop, isPublished: true};
        return await findAllPublishedForShop({query,limit,skip});
    }

    //search product
    static async searchProduct({keySearch}){
        return await searchProductByUser({keySearch});
    }

    static async findAllProducts(limit = 50, sort = 'ctime', page = 1,filters = {isPublished: true}){
        return await findAllProducts({limit, sort, page, filters,
            select : ['product_name','product_thumb','product_price','product_quantity','product_type','product_shop','product_attributes']
        });
    }

    static async findProduct(product_id){
        return await findProduct({
            product_id,
            unselect: ['__v']
        });
    }
}


//define base product class
class Product {
    constructor({
                    product_name,
                    product_thumb,
                    product_description,
                    product_price,
                    product_quantity,
                    product_type,
                    product_shop,
                    product_attributes,
                }) {
        this.product_name = product_name;
        this.product_thumb = product_thumb;
        this.product_description = product_description;
        this.product_price = product_price;
        this.product_quantity = product_quantity;
        this.product_type = product_type;
        this.product_shop = product_shop;
        this.product_attributes = product_attributes;
    }
    //create new product
    async createProduct(productId) {
        return await productModel.create({
            ...this,
            _id: productId,
        });
    }

    async updateProduct(productId,bodyUpdate) {
        return await updateProductById({
            product_id: productId,
            updateData: bodyUpdate,
            model: productModel,
        });
    }
}

//define sub-class for different product types Clothing and Electronic
class Clothing extends Product {
    async createProduct() {
        const newClothing = await clothingModel.create({
            ...this.product_attributes,
            product_shop: this.product_shop,
        });
        if (!newClothing) {
            throw new BadRequestError("Failed to create clothing product");
        }

        const newProduct = await super.createProduct(newClothing._id);
        if (!newProduct) {
            throw new BadRequestError("Failed to create product");
        }

        return newProduct;
    }

    async updateProduct(product_id) {
        //1. remove attributes null or undefined
        const objectParams = removeUndefinedObject(this);
        //2. check xem update o cho nao
        if (objectParams.product_attributes) {
            //update child product
            await updateProductById({
                product_id: product_id,
                updateData: updateNestedObject(objectParams.product_attributes),
                model: clothingModel,
            });
        }
        const updateProduct = await super.updateProduct(product_id, updateNestedObject(objectParams));
        return updateProduct;
    }
}

class Electronic extends Product {
    async createProduct() {
        const newElectronic = await electronicModel.create({
            ...this.product_attributes,
            product_shop: this.product_shop,
        });
        if (!newElectronic) {
            throw new BadRequestError("Failed to create electronic product");
        }

        const newProduct = await super.createProduct(newElectronic._id);
        if (!newProduct) {
            throw new BadRequestError("Failed to create product");
        }

        return newProduct;
    }
}

class Furniture extends Product {
    async createProduct() {
        const newFurniture = await furnitureModel.create({
            ...this.product_attributes,
            product_shop: this.product_shop,
        });
        if (!newFurniture) {
            throw new BadRequestError("Failed to create furniture product");
        }

        const newProduct = await super.createProduct(newFurniture._id);
        if (!newProduct) {
            throw new BadRequestError("Failed to create product");
        }

        return newProduct;
    }
}

//register product types
ProductFactory.registerProductType('Clothing', Clothing);
ProductFactory.registerProductType('Electronic', Electronic);
ProductFactory.registerProductType('Furniture', Furniture);

module.exports = ProductFactory;