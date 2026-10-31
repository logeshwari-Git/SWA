const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
  {
    studentName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    counselorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    studentId: { type: String, default: null },
    date: { type: String, required: true },
    slot: { type: String, required: true },
    status: { type: String, default: "Pending" },
    counselorNotified: { type: Boolean, default: false },
    remarks: { type: String, default: "" },
    counselorSuggestedDate: { type: String, default: null },
    counselorSuggestedSlot: { type: String, default: null },
    messages: [
      {
        sender: { type: String, enum: ["student", "counselor"], required: true },
        senderName: { type: String, required: true },
        text: { type: String, required: true },
        timestamp: { type: Date, default: Date.now }
      }
    ]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Appointment", appointmentSchema);
