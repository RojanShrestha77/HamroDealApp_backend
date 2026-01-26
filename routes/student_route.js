const express = require("express");
const router = express.Router();
const upload = require("../middleware/uploads");
const { protect } = require("../middleware/auth");

const {
  createStudent,
  getAllStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
  loginStudent,
  uploadProfilePicture,
} = require("../controllers/student_controller");

router.post("/upload", upload.single("profilePicture"), uploadProfilePicture);
router.post("/", createStudent);
router.post("/login", loginStudent);
router.get("/", protect, getAllStudents);
router.get("/:id", getStudentById);
router.put("/:id", protect, updateStudent);
router.delete("/:id", protect, deleteStudent);

module.exports = router;
