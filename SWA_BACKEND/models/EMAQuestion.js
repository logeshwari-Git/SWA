const mongoose = require("mongoose");

const emaQuestionSchema = new mongoose.Schema(
  {
    questionText: { type: String, required: true },
    category: { type: String, required: true },
    difficulty: { type: String, default: "basic" },
    options: { type: [Number], default: [0, 1, 2, 3, 4] },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model("EMAQuestion", emaQuestionSchema);
