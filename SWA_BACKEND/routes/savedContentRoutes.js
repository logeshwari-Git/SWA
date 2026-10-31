const express = require("express");
const SavedContent = require("../models/SavedContent");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();

function getEffectiveStudentId(userLike) {
  if (!userLike) return "";
  return String(userLike.studentId || userLike.username || userLike.id || userLike._id || "");
}

router.get("/", requireAuth, async (req, res) => {
  const userId = getEffectiveStudentId(req.user);
  const items = await SavedContent.find({ userId }).sort({ createdAt: -1 });
  res.json(items);
});

router.post("/", requireAuth, async (req, res) => {
  const userId = getEffectiveStudentId(req.user);
  const selfCareId = String(req.body.selfCareId || req.body._id || "");
  if (!selfCareId) {
    return res.status(400).json({ message: "Self-care item id is required" });
  }

  const payload = {
    userId,
    selfCareId,
    title: req.body.title,
    category: req.body.category,
    image: req.body.image || "",
    steps: Array.isArray(req.body.steps) ? req.body.steps : []
  };

  const item = await SavedContent.findOneAndUpdate(
    { userId, selfCareId },
    payload,
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );

  res.status(201).json(item);
});

router.delete("/:id", requireAuth, async (req, res) => {
  const userId = getEffectiveStudentId(req.user);
  const deleted = await SavedContent.findOneAndDelete({
    userId,
    $or: [{ _id: req.params.id }, { selfCareId: req.params.id }]
  });

  if (!deleted) {
    return res.status(404).json({ message: "Saved item not found" });
  }

  res.json({ success: true });
});

module.exports = router;
