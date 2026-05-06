import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/client";
import FairBot from "../components/FairBot";
import { fallbackAnomaly } from "../utils/fallbackData";
import { motion } from "framer-motion";
import { TrendingUp, Users, AlertCircle, ShieldCheck, ChevronRight } from "lucide-react";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [anomaly, setAnomaly] = useState([]);
  const [revenuePool, setRevenuePool] = useState(50000);
  const [loading, setLoading] = useState(true);
  const [fallback, setFallback] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [a, r] = await Promise.all([api.get("/anomaly"), api.get("/revenue")]);
        setAnomaly(a.data?.length ? a.data : fallbackAnomaly);
        const total = (r.data || []).reduce((acc, item) => acc + (item.weekly || item.weeklyRevenue || 0), 0);
        setRevenuePool(Number(total.toFixed(2)) || 50000);
        if (!a.data?.length) setFallback(true);
      } catch (_) {
        setAnomaly(fallbackAnomaly);
        setRevenuePool(50000);
        setFallback(true);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const risky = anomaly.some((c) => c.anomalies && c.anomalies.length > 0);
  
  // Reverse first so new signups (at the end of the array) appear at the top among ties
  // Then sort by lastLogin DESC if it exists
  const sortedCreators = useMemo(() => {
    return [...anomaly].reverse().sort((a, b) => {
      const timeA = a.lastLogin ? new Date(a.lastLogin).getTime() : 0;
      const timeB = b.lastLogin ? new Date(b.lastLogin).getTime() : 0;
      return timeB - timeA;
    });
  }, [anomaly]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <FairBot mood={loading ? "thinking" : risky ? "alert" : "happy"} />
      
      {loading && (
        <div className="glass-card p-4 text-sm text-indigo-700 flex items-center gap-3">
          <span className="spinner border-indigo-500" />
          Loading analytics...
        </div>
      )}
      
      {fallback && (
        <div className="glass-card p-4 text-sm text-amber-700 flex items-center gap-2 border-l-4 border-amber-500">
          <AlertCircle className="w-5 h-5" />
          No live data available, showing demo data
        </div>
      )}

      {/* Revenue Pool Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-900 via-indigo-800 to-purple-900 text-white p-8 shadow-2xl shadow-indigo-900/20">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/20 rounded-full blur-2xl translate-y-1/3 -translate-x-1/4" />
        
        <div className="relative z-10 flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-sm font-medium mb-4 backdrop-blur-sm">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <span>Total Revenue Pool</span>
          </div>
          <h2 className="text-5xl md:text-7xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-indigo-100 drop-shadow-sm">
            ₹{revenuePool.toLocaleString("en-IN")}
          </h2>
          <p className="mt-4 text-indigo-200 font-medium">Ready for fair distribution this week</p>
        </div>
      </div>

      {/* Creators List */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
              <Users className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">Creators List</h2>
          </div>
          <span className="text-sm font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
            {sortedCreators.length} Total
          </span>
        </div>

        <div className="space-y-3">
          {sortedCreators.map((item, index) => {
            const hasAnomalies = item.anomalies && item.anomalies.length > 0;
            // Mocking 'NEW' badge logic based on trust score or recent lastLogin
            const isNew = item.trustScore === 100 || (item.lastLogin && new Date().getTime() - new Date(item.lastLogin).getTime() < 86400000 * 3); // less than 3 days
            
            return (
              <motion.button
                key={item.creatorId || index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate(`/admin/creator/${item.creatorId}`)}
                className="w-full group relative flex items-center gap-4 rounded-2xl bg-white border border-slate-100 p-4 text-left shadow-sm hover:shadow-lg hover:shadow-indigo-500/5 hover:border-indigo-100 transition-all duration-300"
              >
                <div className="relative">
                  <img
                    src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${item.creatorName}`}
                    alt={item.creatorName}
                    className="h-14 w-14 rounded-full border-2 border-slate-100 bg-slate-50 object-cover"
                  />
                  {hasAnomalies ? (
                    <div className="absolute -bottom-1 -right-1 bg-red-100 text-red-600 p-1 rounded-full border-2 border-white">
                      <AlertCircle className="w-3 h-3" />
                    </div>
                  ) : (
                    <div className="absolute -bottom-1 -right-1 bg-emerald-100 text-emerald-600 p-1 rounded-full border-2 border-white">
                      <ShieldCheck className="w-3 h-3" />
                    </div>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="truncate font-bold text-slate-900 text-lg">{item.creatorName}</p>
                    {isNew && (
                      <span className="bg-gradient-to-r from-teal-400 to-emerald-400 text-white text-[9px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full shadow-sm">
                        NEW
                      </span>
                    )}
                    {item.lastLogin && !isNew && (
                      <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 bg-slate-50 px-2 py-0.5 rounded-md hidden sm:inline-block">
                        Active {new Date(item.lastLogin).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-4 mt-1 text-sm text-slate-500">
                    <span className="flex items-center gap-1 font-medium">
                      Trust Score: <span className={item.trustScore >= 70 ? "text-emerald-600" : "text-red-500"}>{item.trustScore}</span>
                    </span>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2 shrink-0">
                  <span className={`px-2.5 py-1 text-xs font-bold rounded-md ${
                    hasAnomalies 
                      ? "bg-red-50 text-red-700 border border-red-100" 
                      : "bg-emerald-50 text-emerald-700 border border-emerald-100"
                  }`}>
                    {hasAnomalies ? "Risk Detected" : "Healthy"}
                  </span>
                </div>
                
                <div className="opacity-0 group-hover:opacity-100 transition-opacity ml-2 text-indigo-400">
                  <ChevronRight className="w-5 h-5" />
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};

export default AdminDashboard;
