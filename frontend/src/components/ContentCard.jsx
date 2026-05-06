import { motion } from "framer-motion";
import { Eye, Heart, MessageCircle, Share2, AlertTriangle } from "lucide-react";

const ContentCard = ({ item, showAnomaly = true }) => {
  const isAnomaly = item.likes > item.views;
  
  return (
    <motion.div 
      whileHover={{ scale: 1.03, y: -4 }}
      transition={{ duration: 0.2 }}
      className="glass-card overflow-hidden group relative flex flex-col h-full"
    >
      <div className="relative h-48 w-full overflow-hidden bg-slate-100">
        {item.mediaType === "video" && item.mediaUrl ? (
          <video src={item.mediaUrl} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
        ) : item.mediaUrl ? (
          <img src={item.mediaUrl} alt={item.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
            <span className="text-indigo-300 font-medium text-sm">No Preview</span>
          </div>
        )}
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
        
        {showAnomaly && isAnomaly && (
          <div className="absolute top-3 right-3 bg-red-500/90 backdrop-blur text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full flex items-center gap-1 shadow-lg shadow-red-500/30">
            <AlertTriangle className="w-3 h-3" />
            Anomaly
          </div>
        )}
      </div>

      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-lg font-bold text-slate-800 line-clamp-1 mb-4">{item.title}</h3>
        
        <div className="mt-auto flex items-center justify-between gap-2 text-slate-500 text-sm font-medium">
          <div className="flex items-center gap-1.5" title="Views">
            <Eye className="w-4 h-4 text-indigo-400" />
            <span>{(item.views || 0).toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-1.5" title="Likes">
            <Heart className="w-4 h-4 text-pink-400" />
            <span>{(item.likes || 0).toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-1.5" title="Comments">
            <MessageCircle className="w-4 h-4 text-blue-400" />
            <span>{(item.comments || 0).toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-1.5" title="Shares">
            <Share2 className="w-4 h-4 text-emerald-400" />
            <span>{(item.shares || 0).toLocaleString()}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ContentCard;
