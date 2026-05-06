export const fallbackAnomaly = [
  {
    creatorId: "demo-creator-1",
    creatorName: "Sarah Connor",
    trustScore: 92,
    lastLogin: "2024-05-06T10:00:00Z",
    anomalies: [],
  },
  {
    creatorId: "demo-creator-2",
    creatorName: "John Doe",
    trustScore: 45,
    lastLogin: "2024-05-05T14:30:00Z",
    anomalies: [
      {
        contentId: "c2",
        title: "Short Viral Clip",
        flags: [{ type: "likes_greater_than_views", severity: "HIGH" }],
      },
    ],
  },
  {
    creatorId: "demo-creator-3",
    creatorName: "Alice Wonderland",
    trustScore: 88,
    lastLogin: "2024-05-06T12:15:00Z",
    anomalies: [],
  }
];

export const fallbackNormalization = [
  { creatorId: "demo-creator", creatorName: "Demo Creator", rawScore: 13665, normalizedScore: 100 },
];

export const fallbackContent = [
  { _id: "c1", title: "Travel Vlog - Bali", views: 12000, likes: 8000, comments: 400, shares: 150, mediaUrl: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80", mediaType: "image" },
  { _id: "c2", title: "Tech Tips 2024", views: 5000, likes: 6000, comments: 200, shares: 300, mediaUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80", mediaType: "image" },
  { _id: "c3", title: "Morning Routine", views: 2500, likes: 500, comments: 50, shares: 15, mediaUrl: "https://images.unsplash.com/photo-1542204165-65bf26472b9b?auto=format&fit=crop&w=800&q=80", mediaType: "image" },
  { _id: "c4", title: "Street Photography", views: 18000, likes: 14000, comments: 800, shares: 1200, mediaUrl: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&w=800&q=80", mediaType: "image" },
];

export const fallbackRevenueList = [
  { creatorId: "demo-creator-3", creatorName: "Alice Wonderland", lastLogin: "2024-05-06T12:15:00Z", weeklyRevenue: 4500, weekly: 4500, monthly: 18000, yearly: 210000 },
  { creatorId: "demo-creator-1", creatorName: "Sarah Connor", lastLogin: "2024-05-06T10:00:00Z", weeklyRevenue: 3200, weekly: 3200, monthly: 12500, yearly: 150000 },
  { creatorId: "demo-creator-2", creatorName: "John Doe", lastLogin: "2024-05-05T14:30:00Z", weeklyRevenue: 1200, weekly: 1200, monthly: 5400, yearly: 22000 },
];

export const fallbackRevenueSingle = { creatorId: "demo-creator", creatorName: "Demo Creator", weeklyRevenue: 1200, weekly: 1200, monthly: 5400, yearly: 22000 };
