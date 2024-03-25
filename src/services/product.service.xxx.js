"use strict";

const {
    productModel,
    clothingModel,
    electronicModel,
    furnitureModel,
} = require("../models/product.model");

const {BadRequestError, ForbiddenRequestError} = require("../core/error.response");

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