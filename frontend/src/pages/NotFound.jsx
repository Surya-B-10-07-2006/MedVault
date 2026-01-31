import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldAlert, Home, ArrowLeft } from 'lucide-react';
import Button from '../components/Button';

export default function NotFound() {
  return (
    <div className="min-h-screen grad-medical flex items-center justify-center p-8 bg-white overflow-hidden relative">
      <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-medBlue/5 rounded-full blur-[10rem] -mr-[20rem] -mt-[20rem]"></div>
      <div className="absolute bottom-0 left-0 w-[40rem] h-[40rem] bg-medTeal/5 rounded-full blur-[10rem] -ml-[20rem] -mb-[20rem]"></div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center relative z-10 max-w-2xl px-12 py-20 bg-white/40 backdrop-blur-xl border border-white/50 rounded-[4rem] shadow-2xl shadow-medBlue/10"
      >
        <div className="w-24 h-24 grad-hero rounded-[2rem] flex items-center justify-center text-white mx-auto shadow-2xl shadow-medBlue/20 mb-10 overflow-hidden ring-8 ring-white">
          <ShieldAlert className="w-12 h-12" />
        </div>

        <h1 className="text-8xl font-black text-medDark tracking-tighter leading-none mb-4 italic">
          4<span className="text-medBlue animate-pulse">0</span>4
        </h1>

        <h2 className="text-2xl font-black text-medDark uppercase tracking-widest mb-6 italic">Record Not Found</h2>

        <p className="text-gray-500 font-medium text-lg leading-relaxed italic mb-12">
          "The data node you're attempting to access has either been relocated or never existed in this sector of the vault."
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
          <Link to="/" className="w-full sm:w-auto">
            <Button className="w-full sm:w-auto px-10 py-4 flex items-center gap-3">
              <Home className="w-5 h-5" /> Return to Base
            </Button>
          </Link>
          <button
            onClick={() => window.history.back()}
            className="w-full sm:w-auto px-10 py-4 bg-white border border-gray-100 rounded-2xl text-medDark font-black text-sm uppercase tracking-widest hover:bg-medGrey transition-all flex items-center justify-center gap-3 shadow-xl shadow-slate-200/50"
          >
            <ArrowLeft className="w-5 h-5" /> Back Previous
          </button>
        </div>

        <div className="mt-20 pt-10 border-t border-gray-100/50">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em]">
            Security Protocol: MED-404-ABSENT
          </p>
        </div>
      </motion.div>
    </div>
  );
}
