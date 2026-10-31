const express = require("express");
const router = express.Router();
const Post = require("../models/Post");
const User = require("../models/User");
const generateAnonymousName = require("../utils/anonymousName.js");

const leoProfanity = require("leo-profanity");
leoProfanity.loadDictionary();


// =======================
// ✅ CREATE POST
// =======================
router.post("/", async (req, res) => {
  try {
    const { title, userId } = req.body;

    console.log("📩 Incoming userId:", userId);

    if (!title || !userId) {
      return res.status(400).json({ message: "Title and userId required" });
    }

    if (leoProfanity.check(title)) {
      return res.status(400).json({
        message: "⚠️ Inappropriate language is not allowed"
      });
    }

    const user = await User.findById(userId);

    console.log("👤 Fetched user:", user?._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // ✅ Generate anonymous name only once per user
    if (!user.anonymousName) {
      user.anonymousName = generateAnonymousName();
      await user.save();
    }

    const newPost = new Post({
      title,
      userId: user._id,                 // ✅ important for admin
      anonymousId: user.anonymousName,
      realUserName: user.name
    });

    await newPost.save();
    res.json(newPost);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// =======================
// ✅ GET ALL POSTS (USER)
// =======================
router.get("/", async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// =======================
// ✅ LIKE POST
// =======================
router.put("/like/:id", async (req, res) => {
  try {
    const { profileId } = req.body;

    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.likedBy.includes(profileId)) {
      return res.status(400).json({ message: "Already liked" });
    }

    post.likes += 1;
    post.likedBy.push(profileId);

    await post.save();
    res.json(post);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// =======================
// ✅ ADD COMMENT
// =======================
router.post("/comment/:id", async (req, res) => {
  try {
    const { text, userId } = req.body;

    console.log("💬 Comment userId:", userId);

    if (!text || !userId) {
      return res.status(400).json({ message: "Text and userId required" });
    }

    if (leoProfanity.check(text)) {
      return res.status(400).json({
        message: "⚠️ Inappropriate language in comment"
      });
    }

    const user = await User.findById(userId);

    console.log("👤 Comment user:", user?._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.anonymousName) {
      user.anonymousName = generateAnonymousName();
      await user.save();
    }

    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    post.comments.push({
      text,
      userId: user._id,                 // ✅ important
      anonymousId: user.anonymousName,
      realUserName: user.name
    });

    await post.save();
    res.json(post);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// =======================
// 👩‍💼 ADMIN: GET POSTS
// =======================
router.get("/admin/posts", async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("userId", "name username email") // ✅ powerful for admin
      .sort({ createdAt: -1 });

    res.json(posts);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// =======================
// ❌ ADMIN: DELETE POST
// =======================
router.delete("/admin/delete/:id", async (req, res) => {
  try {
    await Post.findByIdAndDelete(req.params.id);
    res.json({ message: "Post deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// =======================
// ❌ DELETE COMMENT
// =======================
router.delete("/admin/delete-comment/:postId/:commentIndex", async (req, res) => {
  try {
    const { postId, commentIndex } = req.params;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    post.comments.splice(commentIndex, 1);

    await post.save();

    res.json(post);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;