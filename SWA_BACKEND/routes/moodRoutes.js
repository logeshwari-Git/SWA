const express = require("express");
const Mood = require("../models/Mood");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();

// GET moods for logged-in user
router.get("/", requireAuth, async (req, res) => {
  const moods = await Mood.find({ userId: req.user.id }).sort({ mood_date: -1 });
  res.json(moods);
});

// CREATE mood
router.post("/", requireAuth, async (req, res) => {
  const mood = await Mood.create({
    ...req.body,
    userId: req.user.id
  });

  res.status(201).json(mood);
});

module.exports = router;