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
      <div className="max-w-4xl mx-auto pb-24 space-y-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-medBlue shadow-xl shadow-medBlue/20 rounded-2xl flex items-center justify-center text-white">
              <History className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-medDark tracking-tight italic">Audit Activity</h1>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1.5 mt-0.5">
                <ShieldCheck className="w-3.5 h-3.5 text-medTeal" /> Immutable Security Logs
              </p>
            </div>
          </div>
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-medBlue transition-all" />
            <input
              type="text"
              placeholder="Search logs..."
              className="pl-12 pr-6 py-3 rounded-2xl border-none bg-white shadow-xl shadow-slate-200/50 focus:ring-4 focus:ring-medBlue/10 font-bold text-sm"
            />
          </div>
        </div>

        {/* Logs List */}
        <div className="bg-white rounded-[3rem] border border-gray-100 shadow-2xl shadow-slate-200/50 overflow-hidden">
          <AnimatePresence mode="wait">
            {loading ? (
              <div key="loader" className="p-20 text-center"><span className="inline-block w-8 h-8 border-4 border-medBlue border-t-transparent rounded-full animate-spin"></span></div>
            ) : logs.length === 0 ? (
              <div key="empty" className="py-24 text-center">
                <Activity className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                <p className="text-gray-400 font-bold italic uppercase text-xs tracking-widest">No activity logs found</p>
              </div>
            ) : (
              <div key="list" className="divide-y divide-gray-50">
                {logs.map((log, idx) => (
                  <motion.div
                    key={log._id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.03 }}
                    className="p-8 hover:bg-medGrey/30 transition-all flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-5">
                      <div className="w-12 h-12 bg-medGrey rounded-xl flex items-center justify-center text-medBlue group-hover:bg-medBlue group-hover:text-white transition-all shadow-inner">
                        <Clock className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-md font-black text-medDark uppercase tracking-tighter group-hover:text-medBlue transition-colors">{log.action.replace('_', ' ')}</h4>
                        <p className="text-xs font-bold text-gray-400 mt-1">
                          Ref: <span className="text-medTeal">{log.resource}</span> • ID: {log.resourceId?.slice(-6).toUpperCase()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right flex flex-col items-end gap-1.5">
                      <span className="text-xs font-black text-medDark italic">{formatDate(log.createdAt)}</span>
                      <span className="text-[9px] font-black uppercase text-gray-300 tracking-tighter bg-medGrey px-2 py-0.5 rounded-full">Sequence #{idx + 1 + (page - 1) * 20}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </AnimatePresence>
        </div>

        {/* Pagination */}
        {total > 20 && (
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-4 bg-white rounded-2xl border border-gray-100 shadow-xl disabled:opacity-30 hover:bg-medGrey transition-all"
            >
              <ChevronLeft className="w-6 h-6 text-medDark" />
            </button>
            <span className="text-sm font-black text-medDark uppercase tracking-widest bg-white px-8 py-4 rounded-2xl border border-gray-100 shadow-xl">
              Page {page} of {Math.ceil(total / 20)}
            </span>
            <button
              onClick={() => setPage(p => p + 1)}
              disabled={page * 20 >= total}
              className="p-4 bg-white rounded-2xl border border-gray-100 shadow-xl disabled:opacity-30 hover:bg-medGrey transition-all"
            >
              <ChevronRight className="w-6 h-6 text-medDark" />
            </button>
          </div>
        )}
      </div>
    </Layout>
  );
}
