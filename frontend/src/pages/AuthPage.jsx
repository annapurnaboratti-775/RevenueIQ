import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { Mail, Lock, User, Key, ArrowRight, AlertCircle, BarChart3, TrendingUp, DollarSign } from "lucide-react";

const initial = { name: "", email: "", password: "", role: "creator", uniqueId: "" };

const AuthPage = () => {
  const [isSignup, setIsSignup] = useState(false);
  const [form, setForm] = useState(initial);
  const [error, setError] = useState("");
  const { login, signup } = useAuth();
  const navigate = useNavigate();

  const onChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  // Validation logic
  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email);
  const passwordValid = form.password.length >= 6;
  const nameValid = !isSignup || /^[A-Za-z ]{2,}$/.test(form.name);
  const uniqueIdValid = form.role === "admin" ? /^ADMIN\d+$/.test(form.uniqueId) : /^CREATOR\d+$/.test(form.uniqueId);

  const isValid = emailValid && passwordValid && nameValid && uniqueIdValid;

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!isValid) return;
    try {
      if (isSignup) {
        await signup(form);
      }
      const user = await login({ email: form.email, password: form.password, role: form.role, uniqueId: form.uniqueId });
      navigate(user.role === "admin" ? "/admin" : "/creator");
    } catch (err) {
      setError(err.response?.data?.message || "Authentication failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex relative overflow-hidden font-['Inter']">
      
      {/* Left Side - Animated Illustration Panel */}
      <div className="hidden lg:flex w-1/2 relative bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900 flex-col justify-center items-center overflow-hidden border-r border-slate-800/50 shadow-2xl z-10">
        
        {/* Animated Background Gradients */}
        <motion.div 
          animate={{ y: [0, -50, 0], x: [0, 30, 0], scale: [1, 1.2, 1] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-0 left-0 w-[500px] h-[500px] bg-indigo-500/20 rounded-full blur-[120px]" 
        />
        <motion.div 
          animate={{ y: [0, 50, 0], x: [0, -30, 0], scale: [1, 1.5, 1] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-fuchsia-500/20 rounded-full blur-[150px]" 
        />

        <div className="relative z-20 max-w-lg text-center px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-12 relative"
          >
            {/* Attractive 3D-like Floating Cards Illustration */}
            <div className="relative h-64 w-full flex justify-center items-center perspective-[1000px]">
              <motion.div 
                animate={{ y: [-10, 10, -10], rotateY: [-5, 5, -5], rotateX: [5, -5, 5] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="absolute z-30 w-48 h-56 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-2xl shadow-indigo-500/50 border border-white/10 p-5 flex flex-col justify-between"
              >
                <div className="flex justify-between items-center">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-white/80 text-xs font-bold bg-black/20 px-2 py-1 rounded-md">+45%</span>
                </div>
                <div>
                  <p className="text-indigo-100 text-sm font-medium mb-1">Total Revenue</p>
                  <h3 className="text-white text-3xl font-black">₹2.4M</h3>
                </div>
              </motion.div>
              
              <motion.div 
                animate={{ y: [15, -5, 15], rotateY: [10, -5, 10], x: 80, z: -50 }}
                transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute z-20 w-40 h-48 bg-slate-800 rounded-2xl shadow-2xl border border-slate-700 p-4 flex flex-col justify-between opacity-90"
              >
                <div className="w-8 h-8 bg-emerald-500/20 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <div className="h-2 w-1/2 bg-slate-700 rounded-full mb-2"></div>
                  <div className="h-2 w-3/4 bg-slate-700 rounded-full"></div>
                </div>
              </motion.div>

              <motion.div 
                animate={{ y: [-5, 15, -5], rotateY: [-10, 5, -10], x: -80, z: -30 }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                className="absolute z-10 w-40 h-48 bg-slate-800/80 backdrop-blur rounded-2xl shadow-2xl border border-slate-700/50 p-4 flex flex-col justify-between opacity-80"
              >
                <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center">
                  <BarChart3 className="w-4 h-4 text-blue-400" />
                </div>
                <div className="flex items-end gap-1.5 h-16">
                  <div className="w-full bg-blue-500 rounded-t-sm h-1/3"></div>
                  <div className="w-full bg-blue-500 rounded-t-sm h-2/3"></div>
                  <div className="w-full bg-blue-500 rounded-t-sm h-full"></div>
                </div>
              </motion.div>
            </div>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl font-extrabold text-white tracking-tight mb-4"
          >
            Empowering Fair <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-indigo-400">Creator Revenue</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-indigo-200 text-lg leading-relaxed"
          >
            The ultimate system to distribute, track, and protect earnings using advanced anomaly detection.
          </motion.p>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative z-20">
        
        {/* Mobile Background Elements (hidden on desktop) */}
        <div className="absolute inset-0 z-0 lg:hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-indigo-600/10 rounded-full blur-[100px]" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[100px]" />
        </div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-full max-w-md relative z-10"
        >
          <div className="bg-indigo-950/40 backdrop-blur-2xl p-8 sm:p-10 rounded-3xl border border-indigo-500/20 shadow-[0_0_50px_rgba(79,70,229,0.15)]">
            <div className="text-center mb-8 lg:hidden">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/30 text-white font-bold text-2xl mb-4">
                R
              </div>
              <h1 className="text-2xl font-extrabold text-white tracking-tight">RevenueIQ</h1>
            </div>

            <div className="mb-8 hidden lg:block">
              <h2 className="text-2xl font-bold text-white tracking-tight">
                {isSignup ? "Create an account" : "Welcome back"}
              </h2>
              <p className="text-slate-400 text-sm mt-1">
                {isSignup ? "Sign up to start tracking your revenue safely." : "Enter your details to access your dashboard."}
              </p>
            </div>

            <form onSubmit={onSubmit} className="space-y-5">
              <AnimatePresence mode="popLayout">
                {isSignup && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }} 
                    animate={{ opacity: 1, height: "auto" }} 
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-1"
                  >
                    <div className="relative group">
                      <User className="absolute left-4 top-3.5 h-5 w-5 text-indigo-300/50 group-focus-within:text-indigo-400 transition-colors" />
                      <input 
                        name="name" 
                        placeholder="Full Name" 
                        className={`w-full bg-slate-950/40 border ${form.name && !nameValid ? 'border-red-500' : 'border-indigo-500/30'} text-white rounded-xl px-4 py-3.5 pl-12 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all placeholder:text-slate-500`} 
                        value={form.name} 
                        onChange={onChange} 
                        required 
                      />
                    </div>
                    {form.name && !nameValid && <p className="text-xs text-red-400 pl-1">Only letters and spaces, min 2 chars.</p>}
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="space-y-1">
                <div className="relative group">
                  <Mail className="absolute left-4 top-3.5 h-5 w-5 text-indigo-300/50 group-focus-within:text-indigo-400 transition-colors" />
                  <input 
                    name="email" 
                    type="email" 
                    placeholder="Email Address" 
                    className={`w-full bg-slate-950/40 border ${form.email && !emailValid ? 'border-red-500' : 'border-indigo-500/30'} text-white rounded-xl px-4 py-3.5 pl-12 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all placeholder:text-slate-500`} 
                    value={form.email} 
                    onChange={onChange} 
                    required 
                  />
                </div>
                {form.email && !emailValid && <p className="text-xs text-red-400 pl-1">Please enter a valid email address.</p>}
              </div>

              <div className="space-y-1">
                <div className="relative group">
                  <Lock className="absolute left-4 top-3.5 h-5 w-5 text-indigo-300/50 group-focus-within:text-indigo-400 transition-colors" />
                  <input 
                    name="password" 
                    type="password" 
                    placeholder="Password" 
                    className={`w-full bg-slate-950/40 border ${form.password && !passwordValid ? 'border-red-500' : 'border-indigo-500/30'} text-white rounded-xl px-4 py-3.5 pl-12 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all placeholder:text-slate-500`} 
                    value={form.password} 
                    onChange={onChange} 
                    required 
                  />
                </div>
                {form.password && !passwordValid && <p className="text-xs text-red-400 pl-1">Password must be at least 6 characters.</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-1">
                  <select 
                    name="role" 
                    className="w-full bg-slate-950/40 border border-indigo-500/30 text-white rounded-xl px-4 py-3.5 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all appearance-none cursor-pointer" 
                    value={form.role} 
                    onChange={onChange}
                  >
                    <option value="creator" className="bg-slate-900">Creator</option>
                    <option value="admin" className="bg-slate-900">Admin</option>
                  </select>
                </div>
                <div className="col-span-1 space-y-1">
                  <div className="relative group">
                    <Key className="absolute left-3 top-4 h-4 w-4 text-indigo-300/50 group-focus-within:text-indigo-400 transition-colors" />
                    <input
                      name="uniqueId"
                      placeholder={form.role === "admin" ? "ADMIN123" : "CREATOR456"}
                      className={`w-full bg-slate-950/40 border ${form.uniqueId && !uniqueIdValid ? 'border-red-500' : 'border-indigo-500/30'} text-white rounded-xl px-4 py-3.5 pl-9 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all placeholder:text-slate-500 text-sm`}
                      value={form.uniqueId}
                      onChange={onChange}
                      required
                    />
                  </div>
                </div>
              </div>
              {form.uniqueId && !uniqueIdValid && (
                <p className="text-xs text-red-400 pl-1 -mt-2">Must start with {form.role === "admin" ? "ADMIN" : "CREATOR"} followed by numbers.</p>
              )}

              <AnimatePresence>
                {error && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }} 
                    animate={{ opacity: 1, scale: 1 }} 
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="rounded-xl bg-red-900/30 border border-red-500/50 p-4 text-sm text-red-200 flex items-start gap-3"
                  >
                    <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-red-400" />
                    <p>{error}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={!isValid && (form.email || form.password || form.name || form.uniqueId)} 
                className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold rounded-xl py-4 mt-4 shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                <span>{isSignup ? "Create Account" : "Sign In securely"}</span>
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-slate-400 text-sm">
                {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
                <button 
                  type="button" 
                  className="text-indigo-400 font-semibold hover:text-indigo-300 transition-colors" 
                  onClick={() => setIsSignup((v) => !v)}
                >
                  {isSignup ? "Sign In" : "Sign Up"}
                </button>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AuthPage;
