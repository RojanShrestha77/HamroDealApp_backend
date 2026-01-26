const express = require("express");
const router = express.Router();
const { register, login, getMe } = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware"); // Optional: for protected routes

router.post("/register", register);
router.post("/login", login);
router.get("/me", protect, getMe); // example protected route

module.exports = router;
