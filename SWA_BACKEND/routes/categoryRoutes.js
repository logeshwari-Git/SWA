const express = require("express");
const Category = require("../models/Category");
const { requireRole } = require("../middleware/auth");

const router = express.Router();

router.get("/", async (_req, res) => {
  const categories = await Category.find().sort({ order: 1, name: 1 });
  res.json(categories);
});

router.post("/", requireRole("admin"), async (req, res) => {
  const name = String(req.body.name || "").trim();
  if (!name) {
    return res.status(400).json({ message: "Category name is required" });
  }

  const existing = await Category.findOne({ name: new RegExp(`^${name}$`, "i") });
  if (existing) {
    return res.status(400).json({ message: "Category already exists" });
  }

  const lastCategory = await Category.findOne().sort({ order: -1, createdAt: -1 });
  const category = await Category.create({
    name,
    order: typeof req.body.order === "number" ? req.body.order : (lastCategory?.order ?? 0) + 1
  });

  res.status(201).json(category);
});

router.delete("/:id", requireRole("admin"), async (req, res) => {
  await Category.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

module.exports = router;
