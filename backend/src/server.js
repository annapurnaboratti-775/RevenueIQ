const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDb = require("./config/db");
const authRoutes = require("./routes/auth");
const contentRoutes = require("./routes/content");
const analyticsRoutes = require("./routes/analytics");
const revenueRoutes = require("./routes/revenue");
const seedIfEmpty = require("./services/seed");

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (_, res) => res.json({ ok: true }));
app.use("/api", authRoutes);
app.use("/api/content", contentRoutes);
app.use("/api", analyticsRoutes);
app.use("/api/revenue", revenueRoutes);

const port = process.env.PORT || 5000;
connectDb()
  .then(async () => {
    await seedIfEmpty();
    app.listen(port, () => {
      console.log(`API running on http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error("DB connection failed", error.message);
    process.exit(1);
  });
