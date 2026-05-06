import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/client";
import ContentCard from "../components/ContentCard";
import RevenueChart from "../components/RevenueChart";
import FairBot from "../components/FairBot";
import { motion } from "framer-motion";
import { User, ShieldCheck, ShieldAlert, BarChart3, LayoutGrid } from "lucide-react";

const AdminCreatorViewPage = () => {
  const { creatorId } = useParams();
  const [anomaly, setAnomaly] = useState(null);
  const [revenue, setRevenue] = useState(null);
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [a, r, c] = await Promise.all([
          api.get(`/anomaly?creatorId=${creatorId}`),
          api.get(`/revenue?creatorId=${creatorId}`),
          api.get(`/content?creatorId=${creatorId}`),
        ]);
        setAnomaly(a.data?.[0] || null);
        setRevenue(r.data || null);
        setContent(c.data || []);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [creatorId]);

  const chart = [
    { name: "Weekly", value: revenue?.weekly ?? revenue?.weeklyRevenue ?? 0 },
    { name: "Monthly", value: revenue?.monthly ?? 0 },
    { name: "Yearly", value: revenue?.yearly ?? 0 },
  ];

  const hasAnomalies = anomaly?.anomalies?.length > 0;
  const trustScore = anomaly?.trustScore ?? 0;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <FairBot mood={loading ? "thinking" : hasAnomalies ? "alert" : "happy"} />
      
      {loading && (
        <div className="glass-card p-4 text-sm text-indigo-700 flex items-center gap-3">
          <span className="spinner border-indigo-500" />
          Loading creator profile...
        </div>
      )}

      {/* Creator Profile Header */}
      <div className="glass-card p-6 flex flex-col md:flex-row items-center md:items-start gap-6 border-l-4 border-l-indigo-500">
        <div className="relative">
          <img
            src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${anomaly?.creatorName || 'Creator'}`}
            alt={anomaly?.creatorName}
            className="w-24 h-24 rounded-full border-4 border-indigo-50 shadow-md bg-white"
          />
          {hasAnomalies && (
            <div className="absolute bottom-0 right-0 bg-red-500 text-white p-1.5 rounded-full border-2 border-white shadow-sm">
              <ShieldAlert className="w-4 h-4" />
            </div>
          )}
        </div>
        
        <div className="flex-1 text-center md:text-left">
          <h2 className="text-2xl font-bold text-slate-900">{anomaly?.creatorName || "Creator Details"}</h2>
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mt-3">
            <span className="inline-flex items-center gap-1.5 bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-sm font-medium border border-slate-200">
              <User className="w-4 h-4" /> ID: {creatorId}
            </span>
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-bold border ${
              trustScore >= 70 ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-red-50 text-red-700 border-red-200"
            }`}>
              <ShieldCheck className="w-4 h-4" /> Trust Score: {trustScore}
            </span>
          </div>
        </div>
      </div>

      {/* Revenue Section */}
      <div className="glass-card p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 bg-indigo-100 rounded-xl text-indigo-600">
            <BarChart3 className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">Revenue Trajectory</h3>
        </div>
        <RevenueChart data={chart} variant="area" />
      </div>

      {/* Content Section */}
      <div className="pt-4">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-white border border-slate-200 rounded-lg shadow-sm text-slate-700">
            <LayoutGrid className="w-5 h-5" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">Creator Content</h3>
        </div>
        
        {content.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {content.map((row, i) => (
              <motion.div
                key={row._id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
              >
                <ContentCard item={row} />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="glass-card p-8 text-center text-slate-500">
            No content uploaded by this creator yet.
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default AdminCreatorViewPage;
