const mongoose = require("mongoose");

const dailyRiskSchema = new mongoose.Schema(
  {
    studentId: { type: String, required: true, index: true },
    dayNumber: { type: Number, required: true },
    assessmentDate: { type: String, required: true },
    ghqScore: { type: Number, default: 0 },
    whoPercentage: { type: Number, default: 0 },
    phqScore: { type: Number, default: 0 },
    gadScore: { type: Number, default: 0 },
    mbiScores: {
      exhaustion: { type: Number, default: 0 },
      cynicism: { type: Number, default: 0 },
      efficacy: { type: Number, default: 0 }
    },
    dailyRiskLevel: { type: String, default: "LOW" },
    finalRiskLevel: { type: String, default: "LOW" },
    assessment1Complete: { type: Boolean, default: false },
    assessment2Complete: { type: Boolean, default: false },
    counselorNotified: { type: Boolean, default: false },
    hiddenFromCounselor: { type: Boolean, default: false }
  },
  { timestamps: true }
);

module.exports = mongoose.model("DailyRisk", dailyRiskSchema);
