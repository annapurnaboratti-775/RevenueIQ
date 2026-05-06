const express = require("express");
const User = require("../models/User");
const Revenue = require("../models/Revenue");
const Content = require("../models/Content");
const auth = require("../middleware/auth");
const { getEngagementScore, normalizeScores, distributeRevenue } = require("../services/analytics");

const router = express.Router();

router.get("/", auth(["admin", "creator"]), async (req, res) => {
  try {
    if (req.user.role === "creator") {
      const mineRows = await Content.find({ creatorId: req.user.id });
      const creatorScore = mineRows.reduce((acc, row) => acc + row.views + row.likes * 2 + row.comments * 3 + row.shares * 4, 0);
      const weekly = Number((creatorScore / 10).toFixed(2));
      const monthly = Number((weekly * 4).toFixed(2));
      const yearly = Number((weekly * 52).toFixed(2));
      return res.json({ creatorId: req.user.id, weeklyRevenue: weekly, weekly, monthly, yearly });
    }

    const creators = await User.find({ role: "creator" });
    const rawRows = [];
    for (const creator of creators) {
      const rows = await Content.find({ creatorId: creator._id });
      rawRows.push({
        creatorId: creator._id.toString(),
        creatorName: creator.name,
        rawScore: rows.reduce((acc, row) => acc + getEngagementScore(row), 0),
      });
    }

    const distributed = distributeRevenue(normalizeScores(rawRows), Number(process.env.REVENUE_POOL || 100000));
    for (const row of distributed) {
      const weekly = row.weeklyRevenue;
      const monthly = Number((weekly * 4).toFixed(2));
      const yearly = Number((weekly * 52).toFixed(2));
      await Revenue.findOneAndUpdate(
        { creatorId: row.creatorId },
        { weekly, monthly, yearly },
        { upsert: true }
      );
      row.weekly = weekly;
      row.monthly = monthly;
      row.yearly = yearly;
    }

    if (req.query.creatorId) {
      const target = distributed.find((item) => item.creatorId === req.query.creatorId);
      return res.json(target || null);
    }
    return res.json(distributed);
  } catch (error) {
    return res.status(500).json({ message: "Unable to calculate revenue", error: error.message });
  }
});

module.exports = router;
