const express = require("express");
const User = require("../models/User");
const Content = require("../models/Content");
const CreatorProfile = require("../models/CreatorProfile");
const auth = require("../middleware/auth");
const { getEngagementScore, normalizeScores, detectAnomaliesForCreator } = require("../services/analytics");

const router = express.Router();

router.get("/anomaly", auth(["admin", "creator"]), async (req, res) => {
  try {
    const creators =
      req.user.role === "creator"
        ? [await User.findById(req.user.id)]
        : req.query.creatorId
          ? [await User.findById(req.query.creatorId)]
          : await User.find({ role: "creator" });
    const result = [];
    for (const creator of creators.filter(Boolean)) {
      const rows = await Content.find({ creatorId: creator._id });
      const { anomalies, trustScore } = detectAnomaliesForCreator(rows);
      await CreatorProfile.findOneAndUpdate({ userId: creator._id }, { trustScore }, { new: true, upsert: true });
      result.push({
        creatorId: creator._id,
        creatorName: creator.name,
        trustScore,
        anomalies: anomalies.filter((item) => item.flags.length),
      });
    }
    return res.json(result);
  } catch (error) {
    return res.status(500).json({ message: "Unable to run anomaly analysis", error: error.message });
  }
});

router.get("/normalization", auth(["admin"]), async (req, res) => {
  try {
    const creators = await User.find({ role: "creator" });
    const scoreRows = [];
    for (const creator of creators) {
      const rows = await Content.find({ creatorId: creator._id });
      const rawScore = rows.reduce((acc, row) => acc + getEngagementScore(row), 0);
      scoreRows.push({ creatorId: creator._id, creatorName: creator.name, rawScore });
    }
    const normalized = normalizeScores(scoreRows);
    return res.json(
      normalized.map((row) => ({
        ...row,
        formula: "score = (views + likes + comments + shares) / max(all creators)",
      }))
    );
  } catch (error) {
    return res.status(500).json({ message: "Unable to normalize engagement", error: error.message });
  }
});

module.exports = router;
