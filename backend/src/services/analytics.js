const isSpike = (currentViews, averageViews) => averageViews > 0 && currentViews > averageViews * 2;

const getEngagementScore = ({ views, likes, comments, shares }) =>
  views + likes + comments + shares;

const normalizeScores = (rows) => {
  if (!rows.length) return [];
  const maxScore = Math.max(...rows.map((row) => row.rawScore), 1);
  return rows.map((row) => ({ ...row, normalizedScore: Number(((row.rawScore / maxScore) * 100).toFixed(2)) }));
};

const detectAnomaliesForCreator = (contentRows) => {
  if (!contentRows.length) return { anomalies: [], trustScore: 50, avgViews: 0 };
  const avgViews = contentRows.reduce((acc, item) => acc + item.views, 0) / contentRows.length;
  let trustPenalty = 0;

  const anomalies = contentRows.map((item) => {
    const flags = [];
    if (item.likes > item.views) {
      flags.push({ type: "likes_greater_than_views", severity: "HIGH" });
      trustPenalty += 25;
    }
    if (isSpike(item.views, avgViews)) {
      flags.push({ type: "sudden_spike", severity: "MEDIUM" });
      trustPenalty += 12;
    }
    return { contentId: item._id, title: item.title, flags };
  });

  const trustScore = Math.max(0, Math.min(100, 100 - trustPenalty));
  return { anomalies, trustScore, avgViews };
};

const distributeRevenue = (normalizedRows, revenuePool = 100000) => {
  const totalNormalized = normalizedRows.reduce((acc, row) => acc + row.normalizedScore, 0) || 1;
  return normalizedRows.map((row) => ({
    ...row,
    weeklyRevenue: Number(((row.normalizedScore / totalNormalized) * revenuePool).toFixed(2)),
  }));
};

module.exports = { getEngagementScore, normalizeScores, detectAnomaliesForCreator, distributeRevenue };
