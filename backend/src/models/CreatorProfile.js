const mongoose = require("mongoose");

const creatorProfileSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    bio: { type: String, default: "" },
    contact: { type: String, default: "" },
    image: { type: String, default: "" },
    trustScore: { type: Number, default: 50, min: 0, max: 100 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("CreatorProfile", creatorProfileSchema);
