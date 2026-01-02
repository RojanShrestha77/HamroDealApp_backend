const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema(
  {
    itemName: {
      type: String,
      required: [true, "Item name is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
    },
    type: {
      type: String,
      required: [true, "Item type is required"],
      enum: ["lost", "found"],
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Category is required"],
    },
    location: {
      type: String,
      required: [true, "Location is required"],
      trim: true,
      maxlength: [200, "Location cannot exceed 200 characters"],
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
    claimedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      default: null,
    },
    isClaimed: {
      type: Boolean,
      default: false,
    },
    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: [true, "Reported by is required"],
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
