const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["student", "counselor", "admin"],
      required: true
    },

    anonymousName: { type: String, default: null },

    studentId: { type: String, default: null, index: true },
    specialization: { type: String, default: "" },
    department: { type: String, default: "" }
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
