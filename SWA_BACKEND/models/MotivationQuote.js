const mongoose = require("mongoose");

const motivationQuoteSchema = new mongoose.Schema(
  {
    message: { type: String, required: true },
    riskLevel: {
      type: String,
      enum: ["LOW", "MODERATE", "HIGH"],
      required: true
    },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model("MotivationQuote", motivationQuoteSchema);
