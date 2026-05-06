import { motion } from "framer-motion";
import { ShieldCheck, ShieldAlert, Shield } from "lucide-react";

const TrustScoreWidget = ({ score = 78 }) => {
  const safeScore = Math.max(0, Math.min(100, Number(score) || 0));
  
  // Determine color based on score
  let colorClass = "text-emerald-500";
  let strokeClass = "stroke-emerald-500";
  let Icon = ShieldCheck;
  
  if (safeScore < 40) {
    colorClass = "text-red-500";
    strokeClass = "stroke-red-500";
    Icon = ShieldAlert;
  } else if (safeScore < 70) {
    colorClass = "text-amber-500";
    strokeClass = "stroke-amber-500";
    Icon = Shield;
  }

  // Calculate SVG stroke dasharray for circle progress
  const radius = 24;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (safeScore / 100) * circumference;

  return (
    <motion.div
      className="pointer-events-none fixed bottom-8 left-8 z-40 rounded-2xl bg-white/90 backdrop-blur-md p-4 shadow-2xl border border-slate-200/60 hidden md:flex items-center gap-4"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <div className="relative w-16 h-16 flex items-center justify-center">
        {/* Background Circle */}
        <svg className="w-16 h-16 transform -rotate-90 absolute top-0 left-0">
          <circle cx="32" cy="32" r="24" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-slate-100" />
          <motion.circle 
            cx="32" 
            cy="32" 
            r="24" 
            stroke="currentColor" 
            strokeWidth="6" 
            fill="transparent" 
            strokeDasharray={circumference}
            strokeLinecap="round"
            className={strokeClass}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />
        </svg>
        <span className={`font-black text-xl z-10 ${colorClass}`}>{safeScore}</span>
      </div>
      <div>
        <div className="flex items-center gap-1.5 mb-0.5">
          <Icon className={`w-4 h-4 ${colorClass}`} />
          <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Trust Score</p>
        </div>
        <p className="text-sm font-medium text-slate-800">
          {safeScore >= 70 ? "Excellent Standing" : safeScore >= 40 ? "Needs Improvement" : "Critical Risk"}
        </p>
      </div>
    </motion.div>
  );
};

export default TrustScoreWidget;
