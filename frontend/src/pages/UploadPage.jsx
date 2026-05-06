import { useEffect, useMemo, useRef, useState } from "react";
import api from "../api/client";
import UploadForm from "../components/UploadForm";
import ContentCard from "../components/ContentCard";
import FairBot from "../components/FairBot";
import { fallbackContent } from "../utils/fallbackData";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import { LayoutGrid, AlertCircle } from "lucide-react";

const UploadPage = () => {
  const { user } = useAuth();
  const [rows, setRows] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [fallback, setFallback] = useState(false);
  const inFlightRef = useRef(false);

  useEffect(() => {
    const load = async () => {
      try {
        const apiRows = await api.get("/content");
        const payload = apiRows.data || [];
        setRows(payload.length ? payload : fallbackContent);
        if (!payload.length) setFallback(true);
      } catch (_) {
        setRows(fallbackContent);
        setFallback(true);
      }
    };
    load();
  }, []);

  const submit = async ({ title, file }) => {
    if (inFlightRef.current) return;
    inFlightRef.current = true;
    setLoading(true);
    try {
      const mediaType = file.type.startsWith("video/") ? "video" : "image";
      const mediaUrl = URL.createObjectURL(file);
      const payload = { title, mediaType, mediaUrl };
      const { data } = await api.post("/content", payload);
      const newItem = { ...data, mediaType, mediaUrl, _id: data._id || `local-${Date.now()}` };
      setRows((prev) => (prev.some((row) => row._id === newItem._id) ? prev : [newItem, ...prev]));
      setMessage("Content uploaded successfully 🎉");
      setFallback(false);
      setTimeout(() => setMessage(""), 5000);
    } finally {
      setLoading(false);
      inFlightRef.current = false;
    }
  };

  const botMood = useMemo(() => (message ? "upload" : "happy"), [message]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <FairBot mood={botMood} />
      
      {user?.role === "creator" ? (
        <div className="max-w-2xl mx-auto">
          <UploadForm onSubmit={submit} isLoading={loading} />
        </div>
      ) : (
        <div className="glass-card p-5 border-l-4 border-l-amber-500 bg-amber-50/50 flex items-start gap-3 text-amber-800">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <div>
            <h3 className="font-bold">Upload Restricted</h3>
            <p className="text-sm opacity-90 mt-1">Upload functionality is for Creators only. As an Admin, you can review the uploaded content below.</p>
          </div>
        </div>
      )}

      {message && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="max-w-2xl mx-auto rounded-xl bg-emerald-50 border border-emerald-200 p-4 text-emerald-700 font-medium text-center shadow-sm"
        >
          {message}
        </motion.div>
      )}
      
      {fallback && (
        <div className="glass-card p-3 text-sm text-amber-700 flex items-center justify-center gap-2">
          <AlertCircle className="w-4 h-4" />
          No live data available, showing demo content
        </div>
      )}
      
      <div className="pt-6 border-t border-slate-200/60">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-white rounded-lg shadow-sm text-slate-700">
            <LayoutGrid className="w-5 h-5" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Content Library</h2>
        </div>
        
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {rows.map((item, i) => (
            <motion.div
              key={item._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <ContentCard item={item} />
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default UploadPage;
