"use strict";

const { model, Schema, Types } = require("mongoose");
const DOCUMENT_NAME = "Product";
const COLLECTION_NAME = "products";
const slugify = require('slugify');

const productSchema = new Schema(
  {
    product_name: {
      type: String,
      required: true,
      trim: true,
    },
    product_thumb: {
      type: String,
      required: true,
    },
    product_description: {
      type: String,
    },
      product_slug: {
            type: String,
      },
    product_price: {
      type: Number,
      required: true,
    },
    product_quantity: {
      type: Number,
      required: true,
    },
    product_type: {
      type: String,
      required: true,
      enum: ["Electronic", "Clothing", "Books", "Others"],
    },
    product_shop: {
      type: Types.ObjectId,
      ref: "Shop",
    },
    product_attributes: {
      type: Schema.Types.Mixed,
      required: true,
    },
      //more
      product_ratingsAverage: {
            type: Number,
            default: 4.5,
            min: [1, 'Rating must be above 1.0'],
            max: [5, 'Rating must be below 5.0'],
          //   4.666666666666667 => 4.7
            set: val => Math.round(val * 10) / 10
        },
      product_variations: {
        type: Array,
        default: []
      },
      isDraft: {
        type: Boolean,
        default: true,
        index: true,
        select: false
      },
        isPublished: {
            type: Boolean,
            default: false,
            index: true,
            select: false
        },
  },
  { timestamps: true, collection: COLLECTION_NAME }
);

// Indexes
productSchema.index({ product_name: 'text', product_description: 'text' });

// DOCUMENT MIDDLEWARE: runs before .save() and .create()
productSchema.pre('save', function(next) {
    this.product_slug = slugify(this.product_name, { lower: true });
    next();
});

const clothingSchema = new Schema(
  {
      product_shop: {
          type: Schema.Types.ObjectId,
          ref: 'Shop'
      },
    brand: {
      type: String,
      required: true,
    },
    size: {
      type: String,
    },
    material: {
      type: String,
    },
  },
  { timestamps: true, collection: "clothes" }
);

const electronicSchema = new Schema(
  {
      product_shop: {
          type: Schema.Types.ObjectId,
          ref: 'Shop'
      },
    manufacturer: {
      type: String,
      required: true,
    },
    model: {
      type: String,
    },
    color: {
      type: String,
    },
  },
  { timestamps: true, collection: "electronics" }
);

const furnitureSchema = new Schema(
  {
      product_shop: {
          type: Schema.Types.ObjectId,
          ref: 'Shop'
      },
      brand: {
            type: String,
            required: true,
        },
    size: {
        type: String,
    },
    material: {
      type: String,
      required: true,
    },
  },
  { timestamps: true, collection: "furniture" }
);

module.exports = {
  productModel: model(DOCUMENT_NAME, productSchema),
  clothingModel: model("Clothing", clothingSchema),
  electronicModel: model("Electronics", electronicSchema),
  furnitureModel: model("Furniture", furnitureSchema),
};
