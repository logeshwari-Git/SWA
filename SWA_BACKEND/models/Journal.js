const mongoose = require("mongoose");

const journalSchema = new mongoose.Schema(
  {
    user_id: { type: String, required: true, index: true },
    journal_encrypted: { type: String, required: true },
    journal_date: { type: Date, required: true },
    edit_count: { type: Number, default: 0 }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Journal", journalSchema);
