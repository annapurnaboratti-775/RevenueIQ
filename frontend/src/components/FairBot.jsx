import { motion } from "framer-motion";

const moodMap = {
  happy: { emoji: "✅", text: "System fair and healthy", glow: "shadow-[0_0_40px_rgba(52,211,153,0.4)]" },
  alert: { emoji: "🚨", text: "Suspicious activity detected", glow: "shadow-[0_0_40px_rgba(248,113,113,0.6)]" },
  celebrate: { emoji: "🎉", text: "Revenue distributed fairly", glow: "shadow-[0_0_40px_rgba(167,139,250,0.5)]" },
  upload: { emoji: "✨", text: "Content uploaded successfully!", glow: "shadow-[0_0_40px_rgba(52,211,153,0.5)]" },
  thinking: { emoji: "🤔", text: "Analyzing fairness...", glow: "shadow-[0_0_40px_rgba(125,211,252,0.4)]" },
};

const animations = {
  happy: { y: [0, -8, 0], transition: { duration: 2, repeat: Infinity, ease: "easeInOut" } },
  alert: { x: [0, -6, 6, -6, 0], transition: { duration: 0.5, repeat: Infinity, ease: "easeInOut" } },
  celebrate: { y: [0, -15, 0], rotate: [0, -10, 10, 0], transition: { duration: 1.5, repeat: Infinity } },
  upload: { y: [0, -10, 0], scale: [1, 1.1, 1], transition: { duration: 1 } },
  thinking: { rotate: [0, -5, 5, 0], transition: { duration: 2, repeat: Infinity } },
};

const FairBot = ({ mood = "thinking" }) => {
  const activeMood = moodMap[mood] ? mood : "thinking";
  const active = moodMap[activeMood];
  return (
    <motion.div
      className={`fixed bottom-8 right-8 z-50 flex items-center gap-4 rounded-full bg-slate-900/95 backdrop-blur-md pl-2 pr-6 py-2 shadow-2xl border border-slate-700/50 ${active.glow}`}
      animate={animations[activeMood]}
      whileHover={{ scale: 1.05, rotate: 2 }}
    >
      <motion.div className="flex items-center justify-center w-12 h-12 bg-white/10 rounded-full text-2xl shadow-inner border border-white/5" whileHover={{ scale: 1.1 }}>
        {active.emoji}
      </motion.div>
      <div className="flex flex-col justify-center">
        <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-0.5">FairBot AI</p>
        <p className="font-medium text-sm text-white whitespace-nowrap">{active.text}</p>
      </div>
    </motion.div>
  );
};

export default FairBot;
