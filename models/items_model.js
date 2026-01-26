const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema(
  {
    productName: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price must be >= 0'],
    },
    quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
      min: [1, 'Quantity must be >= 1'],
      validate: {
        validator: function(v) {
          return Number.isInteger(v);
        },
        message: 'Quantity must be an integer',
      }
    },
    category: {
      type: String,
      ref: "Category",
      required: [true, "Category is required"],
    },
    media: {
      type: String,
      required: [true, "Media is required"],
      trim: true,
    },
    mediaType: {
      type: String,
      enum: ["photo", "video"],
      default: "photo",
    },
   
    status: {
      type: String,
      required: [true, "Status is required"],
      enum: ["available", "claimed", "resolved"],
      default: "available",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Item", itemSchema);