const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    text: String,

    // ✅ comment owner
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

    anonymousId: String,
    realUserName: String,
    createdAt: { type: Date, default: Date.now }
  },
  { _id: false }
);

const postSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },

    // ✅ post owner
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

    anonymousId: String,
    realUserName: String,
    likes: { type: Number, default: 0 },
    likedBy: { type: [String], default: [] },
    comments: { type: [commentSchema], default: [] }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", postSchema);