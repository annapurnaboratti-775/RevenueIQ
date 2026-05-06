import { useEffect, useState } from "react";
import { AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import api from "../api/client";
import FairBot from "../components/FairBot";
import { fallbackContent } from "../utils/fallbackData";
import ContentCard from "../components/ContentCard";
import { motion, AnimatePresence } from "framer-motion";
import { Activity, LayoutGrid, AlertCircle, PlayCircle, Heart, Eye } from "lucide-react";

const EngagementPage = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fallback, setFallback] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const { data } = await api.get("/content");
        setRows(data?.length ? data : fallbackContent);
        if (!data?.length) setFallback(true);
      } catch (_) {
        setRows(fallbackContent);
        setFallback(true);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // Auto-advance slider
  useEffect(() => {
    if (rows.length === 0) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % rows.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [rows]);

  // Make sure recent content appears at the top
  const sortedRows = [...rows].reverse();
  const trend = rows.map((row) => ({ name: row.title, engagement: row.views + row.likes + row.comments + row.shares }));
  const hasAnomaly = rows.some((r) => r.likes > r.views);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <FairBot mood={loading ? "thinking" : hasAnomaly ? "alert" : "happy"} />
      
      {loading && (
        <div className="glass-card p-4 text-sm text-indigo-700 flex items-center gap-3">
          <span className="spinner border-indigo-500" />
          Loading engagement analytics...
        </div>
      )}
      
      {fallback && (
        <div className="glass-card p-4 text-sm text-amber-700 flex items-center gap-2 border-l-4 border-amber-500">
          <AlertCircle className="w-5 h-5" />
          No live data available, showing demo data
        </div>
      )}

      {/* Featured Content Slider */}
      {rows.length > 0 && (
        <div className="relative w-full h-[400px] rounded-3xl overflow-hidden shadow-2xl shadow-indigo-500/20 group">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
              className="absolute inset-0"
            >
              <img 
                src={rows[currentSlide].mediaUrl || `https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=1200&q=80`} 
                alt="Featured Content" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent" />
            </motion.div>
          </AnimatePresence>

          {/* Slider Content */}
          <div className="absolute inset-0 p-8 flex flex-col justify-end z-10">
            <motion.div
              key={`content-${currentSlide}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/80 text-white text-xs font-bold uppercase tracking-wider mb-3 backdrop-blur-sm">
                <PlayCircle className="w-4 h-4" /> Featured
              </div>
              <h2 className="text-3xl md:text-5xl font-black text-white mb-4 drop-shadow-md">
                {rows[currentSlide].title}
              </h2>
              <div className="flex gap-6 text-white/90">
                <div className="flex items-center gap-2">
                  <Eye className="w-5 h-5 text-indigo-400" />
                  <span className="font-bold">{rows[currentSlide].views.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-pink-400" />
                  <span className="font-bold">{rows[currentSlide].likes.toLocaleString()}</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Slider Controls */}
          <div className="absolute bottom-6 right-8 flex gap-2 z-20">
            {rows.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentSlide(i)}
                className={`h-2 rounded-full transition-all duration-300 ${i === currentSlide ? 'w-8 bg-white' : 'w-2 bg-white/40 hover:bg-white/60'}`}
              />
            ))}
          </div>
        </div>
      )}

      {/* Engagement Trends */}
      <div className="glass-card p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 bg-blue-100 rounded-xl text-blue-600">
            <Activity className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">Engagement Trends</h2>
        </div>
        
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorEngagement" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dx={-10} tickFormatter={(val) => `${(val/1000).toFixed(1)}k`} />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)', fontWeight: 500 }}
                itemStyle={{ color: '#3b82f6' }}
                formatter={(value) => [value.toLocaleString(), "Total Engagements"]}
              />
              <Area type="monotone" dataKey="engagement" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorEngagement)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Engagement Feed */}
      <div className="pt-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-white border border-slate-200 rounded-lg shadow-sm text-slate-700">
            <LayoutGrid className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">Recent Uploads</h2>
        </div>
        
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {sortedRows.map((row, i) => (
            <motion.div
              key={row._id || i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <ContentCard item={row} />
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default EngagementPage;
