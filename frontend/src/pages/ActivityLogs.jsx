import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { History, Search, ShieldCheck, Clock, ChevronLeft, ChevronRight, Activity } from 'lucide-react';
import Layout from '../components/Layout';
import api from '../utils/api';

export default function ActivityLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetchLogs();
  }, [page]);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/audit?page=${page}&limit=20`);
      setLogs(data.logs || []);
      setTotal(data.pagination.total || 0);
    } catch (err) {
      setLogs([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (d) => new Date(d).toLocaleString(undefined, {
    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
  });

  return (
    <Layout title="Audit Logs">
      <div className="max-w-5xl mx-auto pb-24 space-y-10 px-4 md:px-0">
        {/* Header Section */}
        <section className="flex flex-col md:flex-row md:items-center justify-between gap-8 md:gap-12 mesh-gradient-dark p-8 md:p-12 rounded-[2.5rem] md:rounded-[3.5rem] text-white relative overflow-hidden shadow-2xl border border-white/10">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[100px] -mr-32 -mt-32"></div>

          <div className="flex items-center gap-6 relative z-10">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl flex items-center justify-center shadow-2xl">
              <History className="w-8 h-8 md:w-10 md:h-10 text-teal-400" />
            </div>
            <div>
              <h1 className="text-2xl md:text-4xl font-black tracking-tighter italic uppercase leading-none">Audit Activity</h1>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] flex items-center gap-2 mt-3 italic">
                <ShieldCheck className="w-4 h-4 text-teal-500" /> Immutable Security Ledger
              </p>
            </div>
          </div>

          <div className="relative group w-full md:w-72 z-10">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-teal-400 transition-all" />
            <input
              type="text"
              placeholder="Filter by protocol..."
              className="w-full pl-14 pr-6 py-4 rounded-2xl bg-white/5 border border-white/10 focus:bg-white/10 focus:ring-4 focus:ring-teal-500/10 font-bold text-sm text-white placeholder:text-slate-500 outline-none backdrop-blur-sm"
            />
          </div>
        </section>

        {/* Logs List Container */}
        <div className="glass-md rounded-[3rem] border border-white/60 shadow-2xl shadow-slate-200/40 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-teal-500 to-blue-500"></div>

          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="loader"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="p-32 text-center"
              >
                <div className="inline-block w-12 h-12 border-[6px] border-slate-100 border-t-blue-600 rounded-full animate-spin"></div>
              </motion.div>
            ) : logs.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="py-32 text-center"
              >
                <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                  <Activity className="w-12 h-12 text-slate-200" />
                </div>
                <p className="text-slate-400 font-black italic uppercase text-xs tracking-[0.4em]">No activity nodes detected</p>
              </motion.div>
            ) : (
              <motion.div
                key="list"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="divide-y divide-slate-100"
              >
                {logs.map((log, idx) => (
                  <motion.div
                    key={log._id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.02 }}
                    className="p-6 md:p-10 hover:bg-slate-50 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6 group"
                  >
                    <div className="flex items-center gap-6">
                      <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-slate-900 group-hover:text-teal-400 transition-all shadow-inner border border-slate-200/50">
                        <Clock className="w-6 h-6" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-lg font-black text-slate-900 uppercase tracking-tighter italic group-hover:text-blue-600 transition-colors truncate">
                          {log.action.replace('_', ' ')}
                        </h4>
                        <div className="flex flex-wrap items-center gap-3 mt-1.5">
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-white border border-slate-100 px-3 py-1 rounded-lg shadow-sm">
                            Ref: <span className="text-blue-600">{log.resource}</span>
                          </span>
                          <span className="text-[10px] font-mono font-bold text-slate-400 bg-slate-50 px-3 py-1 rounded-lg">
                            NODEID://{log.resourceId?.slice(-8).toUpperCase()}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between md:flex-col md:items-end gap-3 md:gap-2">
                      <span className="text-sm font-black text-slate-900 italic bg-blue-50/50 px-4 py-2 rounded-xl border border-blue-100 md:border-none md:bg-transparent">
                        {formatDate(log.createdAt)}
                      </span>
                      <span className="text-[9px] font-black uppercase text-slate-300 tracking-[0.2em] bg-slate-50 px-3 py-1 rounded-full border border-slate-100">
                        Sequence Node #{idx + 1 + (page - 1) * 20}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Pagination Console */}
        {total > 20 && (
          <div className="flex items-center justify-center gap-6 pt-10">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="w-14 h-14 md:w-16 md:h-16 flex items-center justify-center bg-white rounded-2xl md:rounded-[2rem] border border-slate-100 shadow-xl disabled:opacity-20 hover:scale-105 active:scale-90 transition-all text-slate-900"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <div className="flex flex-col items-center gap-1">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] italic mb-1">Grid Sector</span>
              <span className="text-lg md:text-2xl font-black text-slate-900 uppercase tracking-widest italic bg-white px-8 md:px-12 py-3 md:py-4 rounded-2xl md:rounded-[2rem] border border-slate-100 shadow-2xl">
                {page} <span className="text-slate-200 mx-2">/</span> {Math.ceil(total / 20)}
              </span>
            </div>
            <button
              onClick={() => setPage(p => p + 1)}
              disabled={page * 20 >= total}
              className="w-14 h-14 md:w-16 md:h-16 flex items-center justify-center bg-white rounded-2xl md:rounded-[2rem] border border-slate-100 shadow-xl disabled:opacity-20 hover:scale-105 active:scale-90 transition-all text-slate-900"
            >
              <ChevronRight className="w-6 h-6 text-teal-400" />
            </button>
          </div>
        )}
      </div>
    </Layout>
  );
}
