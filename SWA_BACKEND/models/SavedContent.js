const mongoose = require("mongoose");

const savedContentSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, index: true },
    selfCareId: { type: String, required: true },
    title: { type: String, required: true },
    category: { type: String, required: true },
    image: { type: String, default: "" },
    steps: { type: [String], default: [] }
  },
  { timestamps: true }
);

savedContentSchema.index({ userId: 1, selfCareId: 1 }, { unique: true });

module.exports = mongoose.model("SavedContent", savedContentSchema);
