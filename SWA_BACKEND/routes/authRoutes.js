const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();

function getEffectiveStudentId(userLike) {
  if (!userLike) return null;
  return userLike.studentId || userLike.username || String(userLike._id || "");
}

function signUser(user) {
  return jwt.sign(
    {
      id: user._id,
      name: user.name,
      username: user.username,
      email: user.email,
      role: user.role,
      studentId: getEffectiveStudentId(user)
    },
    process.env.JWT_SECRET || "dev-secret",
    { expiresIn: "1d" }
  );
}

router.post("/register", async (req, res) => {
  try {
    const { name, username, email, password, studentId } = req.body;
    let role = "student";

    // Allow admin to create other roles (counselor, admin)
    if (req.headers.authorization) {
      try {
        const token = req.headers.authorization.replace(/^Bearer /i, "").trim();
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "dev-secret");
        if (decoded?.role === "admin" && req.body.role) {
          role = req.body.role;
        }
      } catch (e) {}
    }

    if (!username || !email || !password) {
      return res.status(400).json({ message: "Username, email, and password are required" });
    }

    const exists = await User.findOne({
      $or: [{ username }, { email }]
    });

    if (exists) {
      return res.status(400).json({ message: "Username or email already exists" });
    }

    const user = await User.create({
      name: name || username,
      username,
      email,
      password: await bcrypt.hash(password, 10),
      role,
      studentId: role === "student" ? (studentId || username) : (studentId || null),
      specialization: req.body.specialization || ""
    });

    res.status(201).json({
      token: signUser(user),
      user: {
        id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        role: user.role,
        studentId: getEffectiveStudentId(user)
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to register user" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    res.json({
      token: signUser(user),
      user: {
        id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        role: user.role,
        studentId: getEffectiveStudentId(user)
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to login" });
  }
});

router.get("/me", requireAuth, async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");
  res.json(user);
});

module.exports = router;
