const express = require("express");
const Content = require("../models/Content");
const auth = require("../middleware/auth");

const router = express.Router();

router.post("/", auth(["creator"]), async (req, res) => {
  try {
    const { title, views, likes, comments, shares, mediaType = "", mediaUrl = "" } = req.body;
    if (!title) return res.status(400).json({ message: "Title is required" });
    const generatedViews = Number(views ?? Math.floor(Math.random() * (10000 - 500 + 1)) + 500);
    const generatedLikes = Number(
      likes ?? Math.min(generatedViews, Math.floor(Math.random() * (generatedViews + 1)))
    );
    const generatedComments = Number(comments ?? Math.floor(Math.random() * (500 - 10 + 1)) + 10);
    const generatedShares = Number(shares ?? Math.floor(Math.random() * (200 - 5 + 1)) + 5);
    const doc = await Content.create({
      creatorId: req.user.id,
      title,
      mediaType,
      mediaUrl,
      views: generatedViews,
      likes: generatedLikes,
      comments: generatedComments,
      shares: generatedShares,
    });
    return res.status(201).json(doc);
  } catch (error) {
    return res.status(500).json({ message: "Unable to create content", error: error.message });
  }
});

router.get("/", auth(["admin", "creator"]), async (req, res) => {
  try {
    let query = {};
    if (req.user.role === "creator") {
      query = { creatorId: req.user.id };
    } else if (req.query.creatorId) {
      query = { creatorId: req.query.creatorId };
    }
    const content = await Content.find(query).sort({ createdAt: -1 });
    return res.json(content);
  } catch (error) {
    return res.status(500).json({ message: "Unable to fetch content", error: error.message });
  }
});

module.exports = router;
