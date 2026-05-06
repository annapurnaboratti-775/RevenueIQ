const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const CreatorProfile = require("../models/CreatorProfile");

const router = express.Router();
const allowedRoles = ["admin", "creator"];

const validateRoleId = (role, uniqueId) => {
  if (role === "admin") return /^ADMIN\d{3,}$/i.test(uniqueId);
  if (role === "creator") return /^CREATOR\d{3,}$/i.test(uniqueId);
  return false;
};

router.post("/signup", async (req, res) => {
  try {
    const { name, email, password, role, uniqueId } = req.body;
    if (!name || !email || !password || !role || !uniqueId) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (!allowedRoles.includes(role)) {
      return res.status(400).json({ message: "Invalid role selected" });
    }
    if (!validateRoleId(role, uniqueId)) {
      return res.status(400).json({ message: "Invalid unique ID format for selected role" });
    }

    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ message: "Email already registered" });

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: passwordHash,
      role,
      uniqueId: uniqueId.toUpperCase(),
    });

    if (role === "creator") {
      await CreatorProfile.create({ userId: user._id });
    }

    return res.status(201).json({ message: "Signup successful" });
  } catch (error) {
    return res.status(500).json({ message: "Signup failed", error: error.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password, role, uniqueId } = req.body;
    if (!email || !password || !role || !uniqueId) {
      return res.status(400).json({ message: "Email, password, role and unique ID are required" });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    if (user.role !== role || user.uniqueId !== uniqueId.toUpperCase()) {
      return res.status(401).json({ message: "Invalid role or unique ID" });
    }

    const token = jwt.sign({ id: user._id, role: user.role, email: user.email }, process.env.JWT_SECRET || "dev-secret", {
      expiresIn: "1d",
    });

    return res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role, uniqueId: user.uniqueId },
    });
  } catch (error) {
    return res.status(500).json({ message: "Login failed", error: error.message });
  }
});

module.exports = router;
