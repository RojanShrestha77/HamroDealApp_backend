const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    // Use _id as String to accept UUID from Flutter/Hive
    // _id: {
    //   type: String,
    //   required: true,
    // },
    name: {
      type: String,
      required: [true, "Category name is required"],
      trim: true,
      unique: true,
      maxlength: [50, "Category name cannot exceed 50 characters"],
      minlength: [2, "Category name must be at least 2 characters"],
      index: true,
    },
    description: {
      type: String,
      trim: true,
      maxlength: [200, "Description cannot exceed 200 characters"],
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  {
    timestamps: true,
    _id: false, // Disable auto ObjectId generation
  }
);

module.exports = mongoose.model("Category", categorySchema);