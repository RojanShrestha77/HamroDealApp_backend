const asyncHandler = require("../middleware/async");
const Item = require("../models/items_model");
const path = require("path");
const fs = require("fs").promises;

// @desc    Create a new item
// @route   POST /api/v1/items
// @access  Private
exports.createItem = asyncHandler(async (req, res) => {
  const { productName, description, price, quantity, category, media, mediaType } = req.body;

  const item = await Item.create({
    productName,
    description,
    price,
    quantity,
    category,
    media,
    mediaType,
  });

  res.status(201).json({
    success: true,
    data: item,
  });
});

// @desc    Get all items
// @route   GET /api/v1/items
// @access  Public
exports.getAllItems = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const skip = (page - 1) * limit;

  const filter = {};
  if (req.query.status) filter.status = req.query.status;
  if (req.query.category) filter.category = req.query.category;

  const total = await Item.countDocuments(filter);
  const items = await Item.find(filter)
    .skip(skip)
    .limit(limit)
    .populate("category", "name")
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: items.length,
    total,
    page,
    pages: Math.ceil(total / limit),
    data: items,
  });
});

// @desc    Get a single item by ID
// @route   GET /api/v1/items/:id
// @access  Public
exports.getItemById = asyncHandler(async (req, res) => {
  const item = await Item.findById(req.params.id)
    .populate("category", "name");

  if (!item) {
    return res.status(404).json({ 
      success: false,
      message: "Item not found" 
    });
  }

  res.status(200).json({
    success: true,
    data: item,
  });
});

// @desc    Update an item
// @route   PUT /api/v1/items/:id
// @access  Private
exports.updateItem = asyncHandler(async (req, res) => {
  const {
    productName,
    description,
    price,
    quantity,
    category,
    media,
    mediaType,
    status,
  } = req.body;

  const item = await Item.findById(req.params.id);

  if (!item) {
    return res.status(404).json({ 
      success: false,
      message: "Item not found" 
    });
  }

  item.productName = productName || item.productName;
  item.description = description || item.description;
  item.price = price !== undefined ? price : item.price;
  item.quantity = quantity !== undefined ? quantity : item.quantity;
  item.category = category || item.category;
  item.media = media || item.media;
  item.mediaType = mediaType || item.mediaType;
  item.status = status || item.status;

  await item.save();

  res.status(200).json({
    success: true,
    data: item,
  });
});

// @desc    Delete an item
// @route   DELETE /api/v1/items/:id
// @access  Private
exports.deleteItem = asyncHandler(async (req, res) => {
  const item = await Item.findById(req.params.id);

  if (!item) {
    return res.status(404).json({ 
      success: false,
      message: "Item not found" 
    });
  }

  if (item.media && item.media !== "default.jpg") {
    const ext = path.extname(item.media).toLowerCase();
    let mediaPath;

    if ([".jpg", ".jpeg", ".png", ".gif"].includes(ext)) {
      mediaPath = path.join(__dirname, "../public/item_photos", item.media);
    } else if ([".mp4", ".avi", ".mov", ".wmv"].includes(ext)) {
      mediaPath = path.join(__dirname, "../public/item_videos", item.media);
    }

    if (mediaPath) {
      try {
        await fs.unlink(mediaPath);
      } catch (err) {
        console.log(`Could not delete file: ${err.message}`);
      }
    }
  }

  await Item.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    message: "Item deleted successfully",
  });
});

// @desc    Upload Item Photo
// @route   POST /api/v1/items/upload-photo
// @access  Private
exports.uploadItemPhoto = asyncHandler(async (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({ 
      success: false,
      message: "Please upload a photo file" 
    });
  }

  if (req.file.size > process.env.MAX_FILE_UPLOAD) {
    return res.status(400).json({
      success: false,
      message: `Please upload an image less than ${process.env.MAX_FILE_UPLOAD} bytes`,
    });
  }

  res.status(200).json({
    success: true,
    data: req.file.filename,
    message: "Item photo uploaded successfully",
  });
});

// @desc    Upload Item Video
// @route   POST /api/v1/items/upload-video
// @access  Private
exports.uploadItemVideo = asyncHandler(async (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({ 
      success: false,
      message: "Please upload a video file" 
    });
  }

  if (req.file.size > process.env.MAX_FILE_UPLOAD) {
    return res.status(400).json({
      success: false,
      message: `Please upload a video less than ${process.env.MAX_FILE_UPLOAD} bytes`,
    });
  }

  res.status(200).json({
    success: true,
    data: req.file.filename,
    message: "Item video uploaded successfully",
  });
});