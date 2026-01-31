import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield,
  User,
  Clock,
  Eye,
  FileText,
  AlertCircle,
  CheckCircle2,
  Bell,
  X,
  Lock,
  ChevronRight,
  ShieldCheck,
  Plus,
  Users,
  Key,
  LayoutDashboard,
  Zap,
  Trash2
} from 'lucide-react';
import api from '../utils/api';
import { toast } from 'react-hot-toast';

export default function AccessCard() {
  const [accessData, setAccessData] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAccessData();
    fetchPendingRequests();
  }, []);

  const fetchAccessData = async () => {
    try {
      const { data } = await api.get('/records/access-summary');
      setAccessData(data.accessSummary || []);
    } catch (err) {
      console.error('Failed to load access data');
    }
  };

  const fetchPendingRequests = async () => {
    try {
      const { data } = await api.get('/requests');
      const pending = data.requests?.filter(req => req.status === 'pending') || [];
      setPendingRequests(pending);
    } catch (err) {
      console.error('Failed to load pending requests');
    } finally {
      setLoading(false);
    }
  };

  const revokeAccess = async (recordId) => {
    try {
      await api.patch(`/records/${recordId}/revoke`);
      toast.success('Access code revoked successfully');
      fetchAccessData();
    } catch (err) {
      toast.error('Failed to revoke access');
    }
  };

  const listVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15, scale: 0.98 },
    show: { opacity: 1, y: 0, scale: 1 }
  };

  if (loading) {
    return (
      <div className="glass-md rounded-[3.5rem] p-10 animate-pulse border-white/60">
        <div className="flex gap-4 mb-10">
          <div className="w-16 h-16 bg-slate-200 rounded-[1.5rem]"></div>
          <div className="space-y-3 flex-1 pt-3">
            <div className="h-4 bg-slate-200 rounded w-1/3"></div>
            <div className="h-3 bg-slate-100 rounded w-1/2"></div>
          </div>
        </div>
        <div className="space-y-5">
          <div className="h-24 bg-slate-50 rounded-[2.5rem]"></div>
          <div className="h-24 bg-slate-50 rounded-[2.5rem]"></div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-md rounded-[3.5rem] p-8 lg:p-12 border-white/60 relative overflow-hidden group shadow-2xl shadow-slate-200/40 min-h-[500px] flex flex-col"
    >
      {/* Dynamic Background Elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-bl-full -z-0 blur-3xl group-hover:bg-blue-500/10 transition-colors duration-700"></div>
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-teal-500/5 rounded-tr-full -z-0 blur-2xl"></div>

      <header className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12 relative z-10">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 bg-slate-900 rounded-[1.8rem] flex items-center justify-center shadow-2xl group-hover:rotate-3 transition-transform duration-500 ring-4 ring-slate-900/10">
            <ShieldCheck className="w-8 h-8 text-teal-400" />
          </div>
          <div>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight uppercase italic leading-none">Record Access Management</h3>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mt-2 flex items-center gap-2">
              <span className="w-1 h-1 bg-teal-500 rounded-full animate-pulse"></span>
              Permission Core v4.2
            </p>
          </div>
        </div>
        <div className="bg-white/50 px-5 py-3 rounded-2xl border border-white/80 shadow-inner flex items-center gap-4">
          <div className="flex flex-col items-end">
            <span className="text-[9px] font-black text-blue-600 uppercase tracking-widest">Global Status</span>
            <span className="text-[11px] font-bold text-slate-800 uppercase italic">Encrypted</span>
          </div>
          <Lock className="w-5 h-5 text-slate-800" />
        </div>
      </header>

      <div className="flex-1 space-y-12 relative z-10">
        <AnimatePresence>
          {/* Pending Section */}
          {pendingRequests.length > 0 && (
            <motion.section
              initial={{ height: 0, opacity: 0, marginBottom: 0 }}
              animate={{ height: 'auto', opacity: 1, marginBottom: 40 }}
              exit={{ height: 0, opacity: 0, marginBottom: 0 }}
              className="overflow-hidden"
            >
              <div className="flex items-center justify-between mb-6 px-2">
                <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] flex items-center gap-3">
                  <Bell className="w-4 h-4 text-blue-500" /> Auth Requests
                </h4>
                <div className="flex items-center gap-2 px-3 py-1 bg-blue-600 rounded-full shadow-lg shadow-blue-500/30">
                  <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
                  <span className="text-white text-[9px] font-black uppercase">{pendingRequests.length} Pending</span>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {pendingRequests.map((request, idx) => (
                  <motion.div
                    key={idx}
                    whileHover={{ scale: 1.02 }}
                    className="p-6 rounded-[2rem] bg-blue-600 text-white shadow-xl flex items-center justify-between group/req relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-white/5 opacity-0 group-hover/req:opacity-100 transition-opacity"></div>
                    <div className="flex items-center gap-4 relative z-10">
                      <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-md">
                        <User className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="font-black text-sm tracking-tight italic uppercase">Dr. {request.doctorId?.name.split(' ').pop()}</p>
                        <span className="text-[9px] font-bold opacity-70 uppercase tracking-widest mt-1 block">Requesting Vault Entry</span>
                      </div>
                    </div>
                    <button onClick={() => toast.success('Navigate to Requests')} className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 transition-all flex items-center justify-center relative z-10">
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </motion.div>
                ))}
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        {/* Active Keys Section */}
        <section className="space-y-6">
          <div className="flex items-center justify-between px-2">
            <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] flex items-center gap-3">
              <Zap className="w-4 h-4 text-teal-500" /> Active Registry
            </h4>
            <div className="h-px bg-slate-100 flex-1 mx-6 opacity-50"></div>
          </div>

          {accessData.length === 0 && pendingRequests.length === 0 ? (
            <div className="py-20 text-center rounded-[3rem] bg-slate-50/50 border border-dashed border-slate-200">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner border border-slate-50">
                <Lock className="w-8 h-8 text-slate-200" />
              </div>
              <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em] italic leading-relaxed">
                Central Registry Empty.<br />No Active Permisssions.
              </p>
            </div>
          ) : (
            <motion.div
              variants={listVariants}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
            >
              {accessData.map((access, idx) => (
                <motion.div
                  key={idx}
                  variants={itemVariants}
                  whileHover={{ y: -6, scale: 1.02 }}
                  className="group/item flex flex-col justify-between p-8 rounded-[2.5rem] bg-white border border-slate-100 hover:border-blue-400/50 hover:shadow-2xl hover:shadow-blue-500/10 transition-all relative overflow-hidden shadow-sm"
                >
                  <div className="relative z-10">
                    <div className="flex items-start justify-between mb-6">
                      <div className="w-14 h-14 grad-primary rounded-2xl flex items-center justify-center shadow-lg group-hover/item:rotate-6 transition-transform">
                        <FileText className="w-7 h-7 text-white" />
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="text-[9px] font-black text-teal-600 uppercase tracking-widest leading-none mb-1">Live Access</span>
                        <div className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse"></div>
                      </div>
                    </div>

                    <h4 className="font-black text-slate-900 text-lg line-clamp-1 tracking-tight uppercase italic group-hover/item:text-blue-600 transition-colors mb-4">{access.recordName}</h4>

                    <div className="flex flex-wrap items-center gap-3">
                      <div className="flex items-center gap-2 px-3 py-2 bg-slate-900 rounded-xl shadow-lg">
                        <Key className="w-3.5 h-3.5 text-teal-400" />
                        <span className="text-[11px] font-black text-white tracking-[0.2em] font-mono">{access.shareCode}</span>
                      </div>
                      <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-tighter bg-slate-50 px-3 py-2 rounded-xl">
                        <Clock className="w-3.5 h-3.5 text-blue-400" /> {new Date(access.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 flex items-center justify-between relative z-10">
                    <div className="flex -space-x-2">
                      {[1, 2].map(i => <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-[8px] font-black text-slate-400 uppercase">A</div>)}
                    </div>
                    <button
                      onClick={() => revokeAccess(access.recordId)}
                      className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-500 hover:bg-rose-600 hover:text-white transition-all flex items-center justify-center shadow-sm hover:shadow-rose-500/30 active:scale-90"
                      title="Terminate Node"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Internal Glow Effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-blue-500/5 opacity-0 group-hover/item:opacity-100 transition-opacity pointer-events-none"></div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </section>
      </div>

      {/* Security Engine Advisory */}
      <footer className="mt-12 p-8 rounded-[2.5rem] bg-slate-900 text-white shadow-2xl relative overflow-hidden group/adv border border-white/5">
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl group-hover/adv:scale-150 transition-transform duration-1000"></div>
        <div className="flex items-start gap-5 relative z-10">
          <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center flex-shrink-0 backdrop-blur-sm">
            <Shield className="w-6 h-6 text-teal-400" />
          </div>
          <div>
            <p className="font-black text-white text-[11px] uppercase tracking-widest mb-2 italic">Universal Security Integrity</p>
            <p className="text-[12px] text-slate-400 font-medium leading-relaxed italic tracking-tight">
              Revocation is instantaneous and irreversible. Purging a key will immediately collapse the medical bridge, protecting your clinical metadata from unauthorized viewing.
            </p>
          </div>
        </div>
      </footer>
    </motion.div>
  );
}