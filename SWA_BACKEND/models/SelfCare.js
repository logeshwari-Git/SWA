const mongoose = require("mongoose");

const selfCareSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    category: { type: String, required: true },
    image: { type: String, default: "" },
    steps: { type: [String], default: [] }
  },
  { timestamps: true }
);

module.exports = mongoose.model("SelfCare", selfCareSchema);
