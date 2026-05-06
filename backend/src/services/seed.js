const bcrypt = require("bcryptjs");
const User = require("../models/User");
const CreatorProfile = require("../models/CreatorProfile");
const Content = require("../models/Content");
const Revenue = require("../models/Revenue");

const ensureUser = async ({ name, email, password, role, uniqueId }) => {
  let user = await User.findOne({ email });
  if (!user) {
    user = await User.create({
      name,
      email,
      password: await bcrypt.hash(password, 10),
      role,
      uniqueId,
    });
  }
  return user;
};

const seedIfEmpty = async () => {
  const userCount = await User.countDocuments();
  const contentCount = await Content.countDocuments();

  if (userCount > 0 && contentCount > 0) return;

  const admin = await ensureUser({
    name: "Platform Admin",
    email: "admin@test.com",
    password: "123456",
    role: "admin",
    uniqueId: "ADMIN123",
  });

  const creator = await ensureUser({
    name: "Demo Creator",
    email: "creator@test.com",
    password: "123456",
    role: "creator",
    uniqueId: "CREATOR123",
  });
  const creatorTwo = await ensureUser({
    name: "Riya Streams",
    email: "riya@test.com",
    password: "123456",
    role: "creator",
    uniqueId: "CREATOR456",
  });
  const creatorThree = await ensureUser({
    name: "Arjun Clips",
    email: "arjun@test.com",
    password: "123456",
    role: "creator",
    uniqueId: "CREATOR789",
  });

  await CreatorProfile.findOneAndUpdate(
    { userId: creator._id },
    { bio: "Demo profile", contact: "creator@test.com", trustScore: 80 },
    { upsert: true, new: true }
  );
  await CreatorProfile.findOneAndUpdate(
    { userId: creatorTwo._id },
    { bio: "Gaming creator", contact: "riya@test.com", trustScore: 82 },
    { upsert: true, new: true }
  );
  await CreatorProfile.findOneAndUpdate(
    { userId: creatorThree._id },
    { bio: "Education channel", contact: "arjun@test.com", trustScore: 88 },
    { upsert: true, new: true }
  );

  if ((await Content.countDocuments({ creatorId: creator._id })) === 0) {
    await Content.insertMany([
      { creatorId: creator._id, title: "Travel Vlog", views: 1000, likes: 800, comments: 100, shares: 50 },
      { creatorId: creator._id, title: "Short Viral Clip", views: 5000, likes: 6000, comments: 200, shares: 300 },
      { creatorId: creator._id, title: "Tech Tips", views: 200, likes: 50, comments: 10, shares: 5 },
    ]);
  }
  if ((await Content.countDocuments({ creatorId: creatorTwo._id })) === 0) {
    await Content.insertMany([
      { creatorId: creatorTwo._id, title: "Game Highlights", views: 2400, likes: 1200, comments: 190, shares: 70 },
      { creatorId: creatorTwo._id, title: "Live Stream Recap", views: 4800, likes: 4100, comments: 350, shares: 190 },
    ]);
  }
  if ((await Content.countDocuments({ creatorId: creatorThree._id })) === 0) {
    await Content.insertMany([
      { creatorId: creatorThree._id, title: "Math Shorts", views: 1700, likes: 1300, comments: 120, shares: 60 },
      { creatorId: creatorThree._id, title: "Exam Prep", views: 950, likes: 620, comments: 80, shares: 45 },
    ]);
  }

  await Revenue.findOneAndUpdate(
    { creatorId: creator._id },
    { weekly: 1000, monthly: 5000, yearly: 20000 },
    { upsert: true, new: true }
  );
  await Revenue.findOneAndUpdate(
    { creatorId: creatorTwo._id },
    { weekly: 1400, monthly: 5600, yearly: 23000 },
    { upsert: true, new: true }
  );
  await Revenue.findOneAndUpdate(
    { creatorId: creatorThree._id },
    { weekly: 1600, monthly: 6200, yearly: 26000 },
    { upsert: true, new: true }
  );

  console.log(`Seeded demo users: ${admin.email}, ${creator.email}`);
};

module.exports = seedIfEmpty;
