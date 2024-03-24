"use strict";

const {
  productModel,
  clothingModel,
  electronicModel,
} = require("../models/product.model");

const {BadRequestError, ForbiddenRequestError} = require("../core/error.response");

//define Factory class to create product instances

class ProductFactory {

    /*
        type: 'Clothing' or 'Electronic'
     */
  static createProduct(type,payload) {
    switch (type) {
      case "Clothing":
        return new Clothing(payload).createProduct();
      case "Electronic":
        return new Electronic(payload).createProduct();
      default:
        throw new ForbiddenRequestError("Invalid product type: " + type);
    }
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
    async createProduct() {
        return await productModel.create(this);
  }
}

//define sub-class for different product types Clothing and Electronic
class Clothing extends Product {
    async createProduct() {
        const newClothing = await clothingModel.create(this.product_attributes);
        if (!newClothing) {
            throw new BadRequestError("Failed to create clothing product");
        }

        const newProduct = await super.createProduct();
        if (!newProduct) {
            throw new BadRequestError("Failed to create product");
        }

        return newProduct;
    }
}

class Electronic extends Product {
    async createProduct() {
        const newElectronic = await electronicModel.create(this.product_attributes);
        if (!newElectronic) {
            throw new BadRequestError("Failed to create electronic product");
        }

        const newProduct = await super.createProduct();
        if (!newProduct) {
            throw new BadRequestError("Failed to create product");
        }

        return newProduct;
    }
}

module.exports = ProductFactory;