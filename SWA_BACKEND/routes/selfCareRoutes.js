const express = require("express");
const multer = require("multer");
const path = require("path");
const SelfCare = require("../models/SelfCare");
const { requireRole } = require("../middleware/auth");

const router = express.Router();

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, path.join(process.cwd(), "uploads")),
  filename: (_req, file, cb) => cb(null, `${Date.now()}${path.extname(file.originalname)}`)
});

const upload = multer({ storage });

router.get("/", async (req, res) => {
  const filter = req.query.category ? { category: req.query.category } : {};
  const items = await SelfCare.find(filter).sort({ createdAt: -1 });
  res.json(items);
});

router.post("/", requireRole("admin"), upload.single("image"), async (req, res) => {
  const steps = req.body.steps ? JSON.parse(req.body.steps) : [];
  const item = await SelfCare.create({
    title: req.body.title,
    category: req.body.category,
    steps: Array.isArray(steps) ? steps.filter(Boolean) : [],
    image: req.file ? `/uploads/${req.file.filename}` : ""
  });
  res.status(201).json(item);
});

router.put("/:id", requireRole("admin"), upload.single("image"), async (req, res) => {
  const steps = req.body.steps ? JSON.parse(req.body.steps) : [];
  const update = {
    title: req.body.title,
    category: req.body.category,
    steps: Array.isArray(steps) ? steps.filter(Boolean) : []
  };

  if (req.file) {
    update.image = `/uploads/${req.file.filename}`;
  }

  const item = await SelfCare.findByIdAndUpdate(req.params.id, update, { new: true });
  res.json(item);
});

router.delete("/:id", requireRole("admin"), async (req, res) => {
  await SelfCare.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

module.exports = router;
