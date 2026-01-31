import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldAlert, Home, ArrowLeft } from 'lucide-react';
import Button from '../components/Button';

export default function NotFound() {
  return (
    <div className="min-h-screen mesh-gradient flex items-center justify-center p-8 overflow-hidden relative">
      <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-blue-500/5 rounded-full blur-[10rem] -mr-[20rem] -mt-[20rem]"></div>
      <div className="absolute bottom-0 left-0 w-[40rem] h-[40rem] bg-teal-500/5 rounded-full blur-[10rem] -ml-[20rem] -mb-[20rem]"></div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center relative z-10 max-w-2xl w-full px-12 py-20 glass-lg rounded-[4rem] shadow-2xl shadow-slate-200/50 border-white/60"
      >
        <div className="w-24 h-24 mesh-gradient-dark rounded-[2rem] flex items-center justify-center text-white mx-auto shadow-2xl shadow-slate-900/20 mb-10 overflow-hidden group hover:rotate-6 transition-transform">
          <ShieldAlert className="w-12 h-12 text-teal-400 group-hover:scale-110 transition-transform" />
        </div>

        <h1 className="text-8xl font-black text-slate-900 tracking-tighter leading-none mb-4 italic">
          4<span className="text-blue-600 animate-pulse">0</span>4
        </h1>

        <h2 className="text-2xl font-black text-slate-800 uppercase tracking-[0.2em] mb-8 italic">Node Offset Detected</h2>

        <p className="text-slate-500 font-bold text-lg leading-relaxed italic mb-12 uppercase tracking-tight">
          "The data node you're attempting to access has either been purged, relocated, or never existed in this sector of the vault."
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
          <Link to="/" className="w-full sm:w-auto">
            <button className="w-full sm:w-auto px-12 py-5 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-[0.3em] hover:bg-blue-600 transition-all flex items-center justify-center gap-3 shadow-2xl shadow-slate-900/20 active:scale-95 italic">
              <Home className="w-5 h-5 text-teal-400" /> Return to Base
            </button>
          </Link>
          <button
            onClick={() => window.history.back()}
            className="w-full sm:w-auto px-12 py-5 bg-white border border-slate-100 rounded-2xl text-slate-900 font-black text-xs uppercase tracking-[0.3em] hover:bg-slate-50 transition-all flex items-center justify-center gap-3 shadow-xl shadow-slate-200/50 active:scale-95 italic"
          >
            <ArrowLeft className="w-5 h-5 text-blue-600" /> Back Protocol
          </button>
        </div>

        <div className="mt-20 pt-10 border-t border-slate-100">
          <div className="flex items-center justify-center gap-3">
            <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] italic">
              Security Protocol: MED-404-PURGED
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
