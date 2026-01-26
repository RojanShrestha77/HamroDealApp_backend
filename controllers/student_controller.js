const asyncHandler = require("../middleware/async");
const Student = require("../models/student_model");
const path = require("path");
const fs = require("fs");

// @desc    Create a new student
// @route   POST /api/students
// @access  Public
exports.createStudent = asyncHandler(async (req, res) => {
  const { fullName, email, username, password, profilePicture } = req.body;

  console.log("Creating student with fullName:", fullName);

  if (!fullName || !email || !username || !password) {
    return res.status(400).json({ message: "Please provide all fields" });
  }

  // Check if email or username exists
  const existing = await Student.findOne({ $or: [{ email }, { username }] });
  if (existing) {
    return res
      .status(400)
      .json({ message: "Email or Username already exists" });
  }

  const student = await Student.create({
    fullName,
    email,
    username,
    password,
    profilePicture: profilePicture || "default-profile.png",
  });

  const studentResponse = student.toObject();
  delete studentResponse.password;

  res.status(201).json({
    success: true,
    data: studentResponse,
  });
});

// @desc    Login student
// @route   POST /api/students/login
// @access  Public
exports.loginStudent = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Please provide email and password" });
  }

  const student = await Student.findOne({ email }).select("+password");

  if (!student || !(await student.matchPassword(password))) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  sendTokenResponse(student, 200, res);
});

// @desc    Get all students
// @route   GET /api/students
// @access  Private
exports.getAllStudents = asyncHandler(async (req, res) => {
  const students = await Student.find();

  res.status(200).json({
    success: true,
    count: students.length,
    data: students,
  });
});

// @desc    Get a student by ID
// @route   GET /api/students/:id
// @access  Public
exports.getStudentById = asyncHandler(async (req, res) => {
  const student = await Student.findById(req.params.id);

  if (!student) {
    return res.status(404).json({ message: "Student not found" });
  }

  res.status(200).json({ success: true, data: student });
});

// @desc    Update student
// @route   PUT /api/students/:id
// @access  Private
exports.updateStudent = asyncHandler(async (req, res) => {
  const { fullName, email, username, password, profilePicture } = req.body;

  const student = await Student.findById(req.params.id);
  if (!student) return res.status(404).json({ message: "Student not found" });

  if (student._id.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: "Not authorized to update this student" });
  }

  student.fullName = fullName || student.fullName;
  student.email = email || student.email;
  student.username = username || student.username;
  student.profilePicture = profilePicture || student.profilePicture;
  if (password) student.password = password;

  await student.save();

  const studentResponse = student.toObject();
  delete studentResponse.password;

  res.status(200).json({ success: true, data: studentResponse });
});

// @desc    Delete student
// @route   DELETE /api/students/:id
// @access  Private
exports.deleteStudent = asyncHandler(async (req, res) => {
  const student = await Student.findById(req.params.id);
  if (!student) return res.status(404).json({ message: "Student not found" });

  if (student._id.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: "Not authorized to delete this student" });
  }

  // Delete profile picture if not default
  if (student.profilePicture && student.profilePicture !== "default-profile.png") {
    const profilePath = path.join(__dirname, "../public/profile_pictures", student.profilePicture);
    if (fs.existsSync(profilePath)) fs.unlinkSync(profilePath);
  }

  await Student.findByIdAndDelete(student._id);

  res.status(200).json({ success: true, message: "Student deleted successfully" });
});

// Upload profile picture
exports.uploadProfilePicture = asyncHandler(async (req, res) => {
  if (!req.file) return res.status(400).json({ message: "Please upload a file" });

  if (req.file.size > process.env.MAX_FILE_UPLOAD) {
    return res.status(400).json({
      message: `File too large. Max ${process.env.MAX_FILE_UPLOAD} bytes`,
    });
  }

  res.status(200).json({ success: true, data: req.file.filename });
});

// Send token
const sendTokenResponse = (student, statusCode, res) => {
  const token = student.getSignedJwtToken();
  const options = {
    expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24*60*60*1000),
    httpOnly: true,
  };
  if (process.env.NODE_ENV === "production") options.secure = true;

  const studentObj = student.toObject();
  delete studentObj.password;

  res.status(statusCode).cookie("token", token, options).json({
    success: true,
    token,
    data: studentObj,
  });
};
