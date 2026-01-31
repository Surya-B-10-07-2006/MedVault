import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  Clock,
  Search,
  Eye,
  CheckCircle,
  XCircle,
  Stethoscope,
  Activity,
  ArrowRight,
  TrendingUp,
  FileSearch,
  ChevronRight
} from 'lucide-react';
import QuickAccessCard from '../components/QuickAccessCard';
import Layout from '../components/Layout';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';

export default function DoctorDashboard() {
  const [stats, setStats] = useState({ shared: 0, requested: 0, patients: 0 });
  const [pendingRequests, setPendingRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [requestsRes, sharedRes] = await Promise.all([
        api.get('/doctor/requests'),
        api.get('/doctor/shared')
      ]);

      const pending = requestsRes.data.requests.filter(r => r.status === 'pending');
      setPendingRequests(pending.slice(0, 5));

      setStats({
        requested: requestsRes.data.requests.length,
        shared: sharedRes.data.records.length,
        patients: [...new Set(sharedRes.data.records.map(r => r.patientId?._id))].length
      });
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (requestId, status) => {
    try {
      // In a real app, doctor might cancel or finalize a request
      toast.success(`Request ${status} successfully`);
      fetchDashboardData();
    } catch (err) {
      toast.error('Action failed');
    }
  };

  return (
    <Layout title="Doctor's Command Center">
      <div className="space-y-10 pb-20">
        {/* Professional Header */}
        <section className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-white rounded-3xl shadow-xl flex items-center justify-center p-2 border border-gray-100 overflow-hidden ring-4 ring-medBlue/5">
              <img src={user?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=doctor'} className="w-full h-full object-cover" />
            </div>
            <div>
              <h1 className="text-4xl font-black text-medDark tracking-tight italic">
                Greetings, Dr. {user?.name.split(' ').pop()}
              </h1>
              <p className="text-gray-400 font-bold mt-1 uppercase text-[10px] tracking-[0.2em] flex items-center gap-2">
                <span className="w-2 h-2 bg-medBlue rounded-full shadow-[0_0_8px_rgba(45,156,219,0.5)]"></span>
                License Active • Medical Infrastructure Encrypted
              </p>
            </div>
          </div>
          <div>
            <button className="flex items-center gap-3 px-8 py-4 bg-medTeal text-white font-extrabold rounded-[2rem] shadow-xl hover:bg-medTeal/90 hover:-translate-y-1 transition-all">
              Quick Access Portal
            </button>
          </div>
        </section>

        {/* Doctor Stats (Professional Navy/Blue/Grey Palette) */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { label: 'Total Patients', value: stats.patients, icon: <Users className="w-6 h-6" />, color: 'bg-medBlue' },
            { label: 'Records Accessed', value: stats.shared, icon: <Stethoscope className="w-6 h-6" />, color: 'bg-medDark' },
            { label: 'Access Requests', value: stats.requested, icon: <Clock className="w-6 h-6" />, color: 'bg-slate-400' },
          ].map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-2xl shadow-slate-200/50 hover:shadow-medBlue/10 transition-all group overflow-hidden relative"
            >
              <div className={`absolute top-0 right-0 w-32 h-32 ${stat.color} opacity-[0.03] rounded-bl-full`}></div>
              <div className="flex items-start justify-between mb-8">
                <div className={`w-14 h-14 ${stat.color} text-white rounded-2xl flex items-center justify-center shadow-lg group-hover:rotate-6 transition-transform`}>
                  {stat.icon}
                </div>
                <div className="text-[10px] font-black text-gray-300 uppercase italic tracking-widest">Medical Analytics</div>
              </div>
              <h3 className="text-gray-400 font-bold text-xs uppercase tracking-widest mb-1">{stat.label}</h3>
              <div className="text-4xl font-black text-medDark leading-none">{stat.value}</div>
            </motion.div>
          ))}
        </section>

        {/* Main Workspace */}
        <div className="grid lg:grid-cols-3 gap-10">
          {/* Quick Access Card */}
          <section className="lg:col-span-1">
            <QuickAccessCard />
          </section>

          {/* Access Requests Table */}
          <section className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between px-6">
              <h2 className="text-2xl font-black text-medDark tracking-tight flex items-center gap-3 italic">
                <Activity className="w-7 h-7 text-medTeal" /> Pending Access
              </h2>
            </div>

            <div className="bg-white rounded-[3rem] border border-gray-100 shadow-2xl shadow-slate-200/50 overflow-hidden">
              {loading ? (
                <div className="p-20 text-center"><Loader2 className="w-10 h-10 animate-spin text-medBlue mx-auto" /></div>
              ) : pendingRequests.length === 0 ? (
                <div className="py-24 text-center">
                  <FileSearch className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                  <p className="text-gray-400 font-bold italic uppercase text-xs tracking-widest">No pending patient requests</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-50">
                  {pendingRequests.map((req, idx) => (
                    <motion.div
                      key={req._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="p-8 hover:bg-medGrey/30 transition-all flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-5">
                        <div className="w-14 h-14 bg-medGrey rounded-2xl flex items-center justify-center font-black text-medDark text-lg shadow-inner ring-4 ring-transparent group-hover:ring-medBlue/10 transition-all">
                          {req.patientId?.name?.[0]?.toUpperCase() || 'P'}
                        </div>
                        <div>
                          <h4 className="text-lg font-black text-medDark leading-tight group-hover:text-medBlue transition-colors">{req.patientId?.name || 'Unknown Patient'}</h4>
                          <p className="text-xs font-bold text-gray-400 mt-1 uppercase italic tracking-tighter">
                            Requested on {new Date(req.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="px-4 py-2 bg-amber-50 text-amber-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-amber-100">Pending</span>
                        <Link to="/doctor/requests" className="p-3 bg-medDark text-white rounded-xl hover:bg-medBlue transition-all shadow-lg group-hover:translate-x-1">
                          <ArrowRight className="w-5 h-5" />
                        </Link>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* Quick Stats / Timeline */}
          <section className="lg:col-span-3 grid md:grid-cols-2 gap-8">
            <div className="bg-medDark p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden group">
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-medBlue/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
              <TrendingUp className="w-10 h-10 mb-8 text-medTeal" />
              <h3 className="text-2xl font-black mb-4 italic leading-tight">Practice <br /> Insights</h3>
              <p className="text-white/50 text-sm font-medium leading-relaxed italic mb-8">
                Your response rate to patient requests is <span className="text-medTeal font-black">94%</span>. Maintaining this ensures higher patient trust.
              </p>
              <button className="text-xs font-black uppercase tracking-[0.2em] border-b-4 border-medBlue pb-1 hover:text-medBlue transition-colors">
                View Performance
              </button>
            </div>

            <div className="glass p-10 rounded-[3rem] border-white/50 border shadow-inner">
              <h3 className="text-lg font-black text-medDark mb-8 uppercase tracking-tighter flex items-center gap-3">
                <Clock className="w-6 h-6 text-medDark" /> System Status
              </h3>
              <div className="space-y-6">
                {[
                  { label: 'Encrypted DB', status: 'Online', color: 'text-medTeal' },
                  { label: 'Audit Logs', status: 'Syncing', color: 'text-medBlue' },
                  { label: 'Blockchain ID', status: 'Verified', color: 'text-medTeal' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">{item.label}</span>
                    <span className={`text-[10px] font-black uppercase italic ${item.color}`}>{item.status}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </div>
    </Layout>
  );
}

function Loader2(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
}
