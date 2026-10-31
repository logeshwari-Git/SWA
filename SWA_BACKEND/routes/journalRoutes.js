const express = require("express");
const Journal = require("../models/Journal");
const { encrypt, decrypt } = require("../utils/crypto");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();

// GET journals for logged-in user
router.get("/", requireAuth, async (req, res) => {
  const journals = await Journal.find({ user_id: req.user.id }).sort({
    journal_date: -1
  });

  res.json(
    journals.map((journal) => ({
      _id: journal._id,
      user_id: journal.user_id,
      journal_text: decrypt(journal.journal_encrypted),
      journal_date: journal.journal_date,
      edit_count: journal.edit_count
    }))
  );
});

// CREATE or UPDATE today's journal
router.post("/", requireAuth, async (req, res) => {
  const { journal_text } = req.body;
  const user_id = req.user.id;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let journal = await Journal.findOne({
    user_id,
    journal_date: {
      $gte: today,
      $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
    }
  });

  if (journal) {
    journal.journal_encrypted = encrypt(journal_text);
    journal.edit_count += 1;
    await journal.save();
    return res.json(journal);
  }

  journal = await Journal.create({
    user_id,
    journal_encrypted: encrypt(journal_text),
    journal_date: new Date()
  });

  res.status(201).json(journal);
});

// UPDATE journal
router.put("/:id", requireAuth, async (req, res) => {
  const journal = await Journal.findById(req.params.id);
  if (!journal) {
    return res.status(404).json({ message: "Journal not found" });
  }

  journal.journal_encrypted = encrypt(req.body.journal_text);
  journal.edit_count += 1;
  await journal.save();

  res.json(journal);
});

// DELETE journal
router.delete("/:id", requireAuth, async (req, res) => {
  await Journal.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

module.exports = router;