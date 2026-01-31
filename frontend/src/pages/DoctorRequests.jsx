import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BellRing,
  Search,
  ShieldCheck,
  User,
  Clock,
  CheckCircle2,
  XCircle,
  Activity,
  FileSearch,
  ChevronRight
} from 'lucide-react';
import Layout from '../components/Layout';
import api from '../utils/api';
import { toast } from 'react-hot-toast';

export default function DoctorRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const { data } = await api.get('/doctor/requests');
      setRequests(data.requests || []);
    } catch (err) {
      toast.error('Failed to load access requests');
    } finally {
      setLoading(false);
    }
  };

  const filteredRequests = requests.filter(req =>
    req.patientId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    req.recordId?.originalName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'bg-medTeal text-white shadow-medTeal/20';
      case 'rejected': return 'bg-rose-500 text-white shadow-rose-500/20';
      default: return 'bg-amber-100 text-amber-700 shadow-amber-500/5';
    }
  };

  return (
    <Layout title="Secure Access Management">
      <div className="space-y-10 pb-24">
        {/* Header Section */}
        <section className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-medBlue shadow-xl shadow-medBlue/20 rounded-2xl flex items-center justify-center text-white">
              <BellRing className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-medDark tracking-tight italic">Access Requests</h1>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2 mt-0.5">
                <ShieldCheck className="w-4 h-4 text-medTeal" /> Permission Registry
              </p>
            </div>
          </div>
          <div className="relative group flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-medBlue" />
            <input
              type="text"
              placeholder="Filter by patient name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-6 py-4 rounded-[1.5rem] border-none bg-white shadow-xl shadow-slate-200/50 focus:ring-4 focus:ring-medBlue/10 font-bold text-sm"
            />
          </div>
        </section>

        {/* Content List */}
        <div className="bg-white rounded-[3rem] border border-gray-100 shadow-2xl shadow-slate-200/50 overflow-hidden">
          <AnimatePresence mode="wait">
            {loading ? (
              <div key="loader" className="p-20 text-center">
                <span className="inline-block w-8 h-8 border-4 border-medBlue border-t-transparent rounded-full animate-spin"></span>
              </div>
            ) : filteredRequests.length === 0 ? (
              <div key="empty" className="py-32 text-center px-10">
                <FileSearch className="w-20 h-20 text-gray-200 mx-auto mb-6" />
                <h3 className="text-2xl font-black text-medDark mb-2 italic">You have no pending requests</h3>
                <p className="text-gray-400 font-medium">Any access requests sent to patients will appear here with status updates.</p>
              </div>
            ) : (
              <div key="list" className="divide-y divide-gray-50">
                {filteredRequests.map((req, idx) => (
                  <motion.div
                    key={req._id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.03 }}
                    className="p-8 hover:bg-medGrey/30 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-6 group"
                  >
                    <div className="flex items-center gap-6">
                      <div className="w-16 h-16 bg-medGrey rounded-[1.5rem] flex items-center justify-center text-medBlue shadow-inner group-hover:bg-medBlue group-hover:text-white transition-all">
                        <Activity className="w-7 h-7" />
                      </div>
                      <div>
                        <h4 className="text-lg font-black text-medDark group-hover:text-medBlue transition-colors">{req.recordId?.originalName || 'Patient Medical Profile'}</h4>
                        <div className="flex items-center gap-4 mt-1.5">
                          <span className="flex items-center gap-1.5 text-xs font-bold text-gray-400 uppercase tracking-tighter">
                            <User className="w-3.5 h-3.5 text-medTeal" /> {req.patientId?.name || 'Unknown Patient'}
                          </span>
                          <span className="w-1 h-1 bg-gray-200 rounded-full"></span>
                          <span className="flex items-center gap-1.5 text-xs font-bold text-gray-400 uppercase tracking-tighter">
                            <Clock className="w-3.5 h-3.5 text-medBlue" /> {new Date(req.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className={`px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg ${getStatusColor(req.status)}`}>
                        {req.status}
                      </span>
                      <button className="p-3 bg-medGrey text-gray-400 rounded-xl hover:bg-medBlue hover:text-white transition-all">
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </Layout>
  );
}
