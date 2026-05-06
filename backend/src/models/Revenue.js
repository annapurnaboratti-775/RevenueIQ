const mongoose = require("mongoose");

const revenueSchema = new mongoose.Schema(
  {
    creatorId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    weekly: { type: Number, default: 0 },
    monthly: { type: Number, default: 0 },
    yearly: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Revenue", revenueSchema);
