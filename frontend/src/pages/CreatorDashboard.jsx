import { useEffect, useState } from "react";
import api from "../api/client";
import FairBot from "../components/FairBot";
import { fallbackAnomaly, fallbackRevenueSingle, fallbackContent } from "../utils/fallbackData";
import CreatorProfileCard from "../components/CreatorProfileCard";
import TrustScoreWidget from "../components/TrustScoreWidget";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import { ShieldCheck, DollarSign, Wallet, LayoutGrid } from "lucide-react";

const CreatorDashboard = () => {
  const { user } = useAuth();
  const [anomaly, setAnomaly] = useState(null);
  const [revenue, setRevenue] = useState(null);
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fallback, setFallback] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [a, r, c] = await Promise.all([api.get("/anomaly"), api.get("/revenue"), api.get("/content")]);
        setAnomaly(a.data?.[0] || fallbackAnomaly[0]);
        setRevenue(r.data || fallbackRevenueSingle);
        setRecent((c.data?.length ? c.data : fallbackContent).slice(0, 3));
        if (!a.data?.length || !r.data || !c.data?.length) setFallback(true);
      } catch (_) {
        setAnomaly(fallbackAnomaly[0]);
        setRevenue(fallbackRevenueSingle);
        setRecent(fallbackContent.slice(0, 3));
        setFallback(true);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <FairBot mood={loading ? "thinking" : anomaly?.anomalies?.length ? "alert" : "happy"} />
      
      {loading && (
        <div className="glass-card p-4 text-sm text-indigo-700 flex items-center gap-3">
          <span className="spinner border-indigo-500" />
          Loading creator insights...
        </div>
      )}
      
      {fallback && <div className="glass-card p-3 text-sm text-amber-700">No data available, showing demo data</div>}
      
      <div className="mx-auto max-w-2xl mb-6">
        <CreatorProfileCard user={user} />
      </div>
      
      <div className="grid gap-6 md:grid-cols-3">
        {/* Trust Score Card */}
        <motion.div whileHover={{ scale: 1.03, y: -4 }} className="glass-card p-6 border-t-4 border-t-emerald-500 relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-emerald-100 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-500" />
          <div className="flex items-center gap-3 mb-4 relative z-10">
            <div className="p-2.5 bg-emerald-50 rounded-xl text-emerald-600">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h2 className="text-lg font-bold text-slate-800">Trust Score</h2>
          </div>
          <p className="break-words text-4xl font-black text-emerald-600 relative z-10">{anomaly?.trustScore ?? 50}</p>
        </motion.div>
        
        {/* Weekly Earnings Card */}
        <motion.div whileHover={{ scale: 1.03, y: -4 }} className="glass-card p-6 border-t-4 border-t-indigo-500 relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-indigo-100 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-500" />
          <div className="flex items-center gap-3 mb-4 relative z-10">
            <div className="p-2.5 bg-indigo-50 rounded-xl text-indigo-600">
              <DollarSign className="w-6 h-6" />
            </div>
            <h2 className="text-lg font-bold text-slate-800">Weekly Earnings</h2>
          </div>
          <p className="break-words text-4xl font-black text-indigo-600 relative z-10">
            ₹{revenue?.weekly?.toLocaleString("en-IN", { maximumFractionDigits: 2 }) || revenue?.weeklyRevenue?.toLocaleString("en-IN", { maximumFractionDigits: 2 }) || "0"}
          </p>
        </motion.div>
        
        {/* Monthly Earnings Card */}
        <motion.div whileHover={{ scale: 1.03, y: -4 }} className="glass-card p-6 border-t-4 border-t-purple-500 relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-purple-100 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-500" />
          <div className="flex items-center gap-3 mb-4 relative z-10">
            <div className="p-2.5 bg-purple-50 rounded-xl text-purple-600">
              <Wallet className="w-6 h-6" />
            </div>
            <h2 className="text-lg font-bold text-slate-800">Monthly Earnings</h2>
          </div>
          <p className="break-words text-4xl font-black text-purple-600 relative z-10">
            ₹{revenue?.monthly?.toLocaleString("en-IN", { maximumFractionDigits: 2 }) || "0"}
          </p>
        </motion.div>
      </div>

      <motion.div whileHover={{ scale: 1.01 }} className="glass-card p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
            <LayoutGrid className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">Recent Engagement Stats</h2>
        </div>
        <div className="bg-slate-50/50 rounded-2xl p-4 flex flex-wrap gap-8 items-center justify-around border border-slate-100">
          <div className="text-center">
            <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Posts</p>
            <p className="text-2xl font-black text-slate-800">{recent.length}</p>
          </div>
          <div className="text-center">
            <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Views</p>
            <p className="text-2xl font-black text-indigo-600">{recent.reduce((a, b) => a + b.views, 0).toLocaleString()}</p>
          </div>
          <div className="text-center">
            <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Likes</p>
            <p className="text-2xl font-black text-pink-600">{recent.reduce((a, b) => a + b.likes, 0).toLocaleString()}</p>
          </div>
        </div>
      </motion.div>
      
      <TrustScoreWidget score={anomaly?.trustScore ?? 50} />
    </motion.div>
  );
};

export default CreatorDashboard;
