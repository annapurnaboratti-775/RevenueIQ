import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { LayoutDashboard, UploadCloud, Activity, DollarSign, LogOut } from "lucide-react";

const Layout = ({ children }) => {
  const { pathname } = useLocation();
  const { user, logout } = useAuth();
  
  const links = user?.role === "admin"
      ? [
          ["Dashboard", "/admin", LayoutDashboard],
          ["Upload", "/upload", UploadCloud],
          ["Engagement", "/engagement", Activity],
          ["Revenue", "/revenue", DollarSign],
        ]
      : [
          ["Dashboard", "/creator", LayoutDashboard],
          ["Upload", "/upload", UploadCloud],
          ["Engagement", "/engagement", Activity],
          ["Revenue", "/revenue", DollarSign],
        ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-white text-slate-900 selection:bg-indigo-100 selection:text-indigo-900">
      {/* Decorative Gradients */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full bg-purple-200/50 blur-[100px]" />
        <div className="absolute top-1/3 -left-40 h-[400px] w-[400px] rounded-full bg-blue-200/50 blur-[100px]" />
        <div className="absolute -bottom-40 right-1/3 h-[600px] w-[600px] rounded-full bg-teal-100/40 blur-[120px]" />
      </div>

      <div className="mx-auto max-w-6xl px-4 py-6 md:px-8 space-y-8">
        <header className="glass-card flex flex-col md:flex-row items-center justify-between gap-4 px-6 py-4 sticky top-6 z-40">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/30 flex items-center justify-center text-white font-bold text-xl">
              R
            </div>
            <h1 className="text-xl font-extrabold tracking-tight text-slate-900">
              Revenue<span className="text-indigo-600">IQ</span>
            </h1>
          </div>
          
          <nav className="flex flex-wrap justify-center items-center gap-1 sm:gap-2">
            {links.map(([label, href, Icon]) => (
              <Link key={href} to={href} className={`menu-link flex items-center gap-2 ${pathname === href ? "menu-link-active" : ""}`}>
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{label}</span>
              </Link>
            ))}
          </nav>

          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={logout} 
            className="btn bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-red-600 hover:border-red-200 transition-colors hidden md:flex"
            title="Logout"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </motion.button>
        </header>

        <motion.main 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="space-y-6 pb-24"
        >
          {children}
        </motion.main>
      </div>
    </div>
  );
};

export default Layout;
