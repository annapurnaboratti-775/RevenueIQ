const mongoose = require("mongoose");

const contentSchema = new mongoose.Schema(
  {
    creatorId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true, trim: true },
    mediaType: { type: String, enum: ["image", "video", ""], default: "" },
    mediaUrl: { type: String, default: "" },
    views: { type: Number, required: true, min: 0 },
    likes: { type: Number, required: true, min: 0 },
    comments: { type: Number, required: true, min: 0 },
    shares: { type: Number, required: true, min: 0 },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Content", contentSchema);
