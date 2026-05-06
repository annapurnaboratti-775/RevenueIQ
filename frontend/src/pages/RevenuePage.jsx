import { useEffect, useState, useMemo } from "react";
import api from "../api/client";
import FairBot from "../components/FairBot";
import { fallbackRevenueList } from "../utils/fallbackData";
import RevenueChart from "../components/RevenueChart";
import { motion } from "framer-motion";
import { DollarSign, AlertCircle, BarChart3, Users, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const RevenuePage = () => {
  const navigate = useNavigate();
  const [rows, setRows] = useState([]);
  const [chartRows, setChartRows] = useState([
    { name: "Weekly", value: 1200 },
    { name: "Monthly", value: 5400 },
    { name: "Yearly", value: 22000 },
  ]);
  const [loading, setLoading] = useState(true);
  const [fallback, setFallback] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const { data } = await api.get("/revenue");
        const list = Array.isArray(data) ? data : data ? [data] : [];
        const source = list.length ? list : fallbackRevenueList;
        setRows(source);
        const top = source[0] || {};
        setChartRows([
          { name: "Weekly", value: top.weekly ?? top.weeklyRevenue ?? 1200 },
          { name: "Monthly", value: top.monthly ?? 5400 },
          { name: "Yearly", value: top.yearly ?? 22000 },
        ]);
        if (!list.length) setFallback(true);
      } catch (_) {
        setRows(fallbackRevenueList);
        const top = fallbackRevenueList[0];
        setChartRows([
          { name: "Weekly", value: top.weekly ?? top.weeklyRevenue ?? 1200 },
          { name: "Monthly", value: top.monthly ?? 5400 },
          { name: "Yearly", value: top.yearly ?? 22000 },
        ]);
        setFallback(true);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // Sort by recently joined (DESC)
  const sortedRows = useMemo(() => {
    return [...rows].sort((a, b) => {
      const getJoinTime = (row) => {
        if (row.creatorId && /^[0-9a-fA-F]{24}$/.test(row.creatorId)) {
          return parseInt(row.creatorId.substring(0, 8), 16) * 1000;
        }
        return row.lastLogin ? new Date(row.lastLogin).getTime() : 0;
      };
      const timeA = getJoinTime(a);
      const timeB = getJoinTime(b);
      return timeB - timeA;
    });
  }, [rows]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <FairBot mood={loading ? "thinking" : "celebrate"} />
      
      {loading && (
        <div className="glass-card p-4 text-sm text-indigo-700 flex items-center gap-3">
          <span className="spinner border-indigo-500" />
          Calculating fair revenue...
        </div>
      )}
      
      {fallback && (
        <div className="glass-card p-4 text-sm text-amber-700 flex items-center gap-2 border-l-4 border-amber-500">
          <AlertCircle className="w-5 h-5" />
          No live data available, showing demo data
        </div>
      )}

      {/* Analytics Chart */}
      <div className="glass-card p-6">
        <div className="flex items-center gap-2 mb-6">
          <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
            <BarChart3 className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">Revenue Trajectory</h2>
        </div>
        <RevenueChart data={chartRows} variant="area" />
      </div>

      {/* Revenue Table */}
      <div className="glass-card overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-emerald-100 rounded-lg text-emerald-600">
              <Users className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">Creator Earnings</h2>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 text-slate-500 text-xs uppercase tracking-wider font-bold">
                <th className="px-6 py-4 font-medium">Creator</th>
                <th className="px-6 py-4 font-medium">Weekly</th>
                <th className="px-6 py-4 font-medium">Monthly</th>
                <th className="px-6 py-4 font-medium">Yearly</th>
                <th className="px-6 py-4 font-medium text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sortedRows.map((row, index) => (
                <motion.tr 
                  key={row.creatorId || index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-slate-50/80 transition-colors group"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img 
                        src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${row.creatorName}`} 
                        alt={row.creatorName} 
                        className="w-10 h-10 rounded-full bg-indigo-50 border border-indigo-100"
                      />
                      <div>
                        <p className="font-bold text-slate-900">{row.creatorName}</p>
                        {row.lastLogin && (
                          <p className="text-[10px] uppercase text-slate-400 font-semibold tracking-wider">
                            Active {new Date(row.lastLogin).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1 font-semibold text-slate-700 bg-white border border-slate-200 px-2.5 py-1 rounded-md shadow-sm">
                      <DollarSign className="w-3.5 h-3.5 text-slate-400" />
                      {(row.weekly ?? row.weeklyRevenue ?? 0).toLocaleString("en-IN")}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-medium text-slate-600">
                      ₹{(row.monthly ?? 0).toLocaleString("en-IN")}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-bold text-emerald-600">
                      ₹{(row.yearly ?? 0).toLocaleString("en-IN")}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => navigate(`/admin/creator/${row.creatorId}`)}
                      className="p-2 text-indigo-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
};

export default RevenuePage;
