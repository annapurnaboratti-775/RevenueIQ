import { useEffect, useState } from "react";
import api from "../api/client";
import FairBot from "../components/FairBot";
import { fallbackRevenueSingle } from "../utils/fallbackData";
import RevenueChart from "../components/RevenueChart";
import { motion } from "framer-motion";
import { BarChart3, AlertCircle } from "lucide-react";

const EarningsPage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fallback, setFallback] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const { data: row } = await api.get("/revenue");
        const src = row || fallbackRevenueSingle;
        setData([
          { name: "Weekly", value: src.weekly ?? src.weeklyRevenue ?? 0 },
          { name: "Monthly", value: src.monthly ?? (src.weeklyRevenue || 0) * 4 },
          { name: "Yearly", value: src.yearly ?? (src.weeklyRevenue || 0) * 52 },
        ]);
        if (!row) setFallback(true);
      } catch (_) {
        setData([
          { name: "Weekly", value: fallbackRevenueSingle.weekly },
          { name: "Monthly", value: fallbackRevenueSingle.monthly },
          { name: "Yearly", value: fallbackRevenueSingle.yearly },
        ]);
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
      <FairBot mood={loading ? "thinking" : "celebrate"} />
      
      {loading && (
        <div className="glass-card p-4 text-sm text-indigo-700 flex items-center gap-3">
          <span className="spinner border-indigo-500" />
          Loading earnings...
        </div>
      )}
      
      {fallback && (
        <div className="glass-card p-4 text-sm text-amber-700 flex items-center gap-2 border-l-4 border-amber-500">
          <AlertCircle className="w-5 h-5" />
          No live data available, showing demo data
        </div>
      )}
      
      <div className="glass-card p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 bg-indigo-100 rounded-xl text-indigo-600">
            <BarChart3 className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Revenue Trajectory</h2>
        </div>
        
        <RevenueChart data={data} variant="bar" />
      </div>
    </motion.div>
  );
};

export default EarningsPage;
