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
  ChevronRight,
  ShieldAlert,
  Dna,
  Zap,
  Activity as ActivityIcon,
  Plus
} from 'lucide-react';
import QuickAccessCard from '../components/QuickAccessCard';
import Layout from '../components/Layout';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

export default function DoctorDashboard() {
  const [stats, setStats] = useState({ shared: 0, requested: 0, patients: 0 });
  const [pendingRequests, setPendingRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const navigate = useNavigate();

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

  const statCards = [
    { label: 'Total Patients', value: stats.patients, icon: <Users className="w-7 h-7" />, color: 'blue' },
    { label: 'Vaults Accessed', value: stats.shared, icon: <Stethoscope className="w-7 h-7" />, color: 'teal' },
    { label: 'Pending Keys', value: stats.requested, icon: <ShieldAlert className="w-7 h-7" />, color: 'purple' },
  ];

  return (
    <Layout title="Command Core">
      <div className="space-y-12 pb-20">
        {/* Professional Header */}
        <section className="flex flex-col md:flex-row md:items-center justify-between gap-6 md:gap-12 bg-slate-900 p-6 md:p-10 rounded-[2.5rem] md:rounded-[3.5rem] text-white relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[100px] -z-0"></div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 md:gap-8 relative z-10 w-full md:w-auto">
            <div className="w-20 h-20 md:w-24 md:h-24 bg-white rounded-[1.5rem] md:rounded-[2rem] shadow-2xl flex items-center justify-center p-1.5 border-4 border-white/20 overflow-hidden ring-4 ring-blue-500/20 active:scale-95 transition-transform shrink-0">
              <img src={user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name}`} className="w-full h-full object-cover rounded-[1rem] md:rounded-[1.5rem]" />
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2 md:gap-3 mb-2">
                <span className="px-2 md:px-3 py-1 bg-teal-500/20 text-teal-400 text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] rounded-full border border-teal-500/30">Verified MD</span>
                <p className="text-slate-400 font-bold uppercase text-[8px] md:text-[10px] tracking-[0.2em] flex items-center gap-1.5 leading-none">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(59,130,246,0.8)]"></div>
                  System Encrypted
                </p>
              </div>
              <h1 className="text-2xl md:text-4xl font-black tracking-tight italic uppercase leading-tight truncate">
                Dr. <span className="grad-text brightness-125">{user?.name.split(' ').pop()}</span>
              </h1>
            </div>
          </div>
          <div className="relative z-10 w-full md:w-auto mt-4 md:mt-0">
            <button
              onClick={() => navigate('/doctor/quick-access')}
              className="group flex items-center justify-center gap-3 w-full md:w-auto px-8 py-4 bg-white text-slate-900 font-extrabold rounded-2xl shadow-xl hover:bg-slate-50 transition-all active:scale-95"
            >
              <Dna className="w-5 h-5 text-blue-600 group-hover:rotate-180 transition-transform duration-700" />
              <span className="uppercase tracking-widest text-[12px]">Scan New Vault</span>
            </button>
          </div>
        </section>

        {/* Doctor Stats Grid */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {statCards.map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="glass-md p-10 rounded-[3rem] hover-lift group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-slate-500/5 rounded-bl-[100px] -z-0"></div>
              <div className="flex items-start justify-between mb-8 relative z-10">
                <div className={`w-16 h-16 grad-primary rounded-2xl flex items-center justify-center text-white shadow-xl group-hover:scale-110 group-hover:rotate-6 transition-transform`}>
                  {stat.icon}
                </div>
                <div className="text-[10px] font-black text-slate-400 uppercase italic tracking-[0.3em]">Sector Analysis</div>
              </div>
              <h3 className="text-slate-400 font-black text-[10px] uppercase tracking-[0.4em] mb-2 relative z-10">{stat.label}</h3>
              <div className="text-5xl font-black text-slate-900 leading-none tracking-tighter relative z-10">{stat.value}</div>
            </motion.div>
          ))}
        </section>

        {/* Main Workspace */}
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Quick Access Card */}
          <section className="lg:col-span-1">
            <div className="hover-lift">
              <QuickAccessCard />
            </div>
          </section>

          {/* Access Requests Table */}
          <section className="lg:col-span-2 space-y-8">
            <div className="flex items-center justify-between px-2">
              <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-lg border border-slate-100">
                  <ActivityIcon className="w-6 h-6 text-teal-500" />
                </div>
                Pending Authorization
              </h2>
              <Link to="/doctor/requests" className="text-teal-600 font-black text-[10px] uppercase tracking-widest hover:translate-x-1 transition-transform flex items-center gap-2">
                All Requests <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="glass-md rounded-[3.5rem] overflow-hidden border-white/60">
              {loading ? (
                <div className="p-32 text-center animate-pulse flex flex-col items-center">
                  <div className="w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Syncing Node...</span>
                </div>
              ) : pendingRequests.length === 0 ? (
                <div className="py-32 text-center flex flex-col items-center">
                  <FileSearch className="w-20 h-20 text-slate-200 mb-6" />
                  <p className="text-slate-400 font-black uppercase text-xs tracking-[0.3em] italic">No active authorization requests</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {pendingRequests.map((req, idx) => (
                    <motion.div
                      key={req._id}
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      className="p-8 hover:bg-slate-50/50 transition-all flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-6">
                        <div className="w-16 h-16 grad-primary text-white rounded-[1.5rem] flex items-center justify-center font-black text-xl shadow-lg ring-4 ring-transparent group-hover:ring-blue-100 transition-all">
                          {req.patientId?.name?.[0]?.toUpperCase() || 'P'}
                        </div>
                        <div>
                          <h4 className="text-xl font-black text-slate-800 tracking-tight group-hover:text-blue-600 transition-colors uppercase italic">{req.patientId?.name || 'Unknown Subject'}</h4>
                          <p className="text-[10px] font-bold text-slate-400 mt-1.5 uppercase tracking-widest flex items-center gap-2">
                            <Clock className="w-3.5 h-3.5" /> Filed: {new Date(req.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="px-5 py-2 bg-amber-500/10 text-amber-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-amber-500/20">Awaiting Key</span>
                        <Link to="/doctor/requests" className="w-12 h-12 bg-slate-900 text-white rounded-xl flex items-center justify-center hover:bg-blue-600 transition-all shadow-xl group-hover:translate-x-1">
                          <ArrowRight className="w-5 h-5" />
                        </Link>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* Performance / Status Panel */}
          <section className="lg:col-span-3 grid md:grid-cols-2 gap-10">
            <div className="mesh-gradient-dark p-12 rounded-[4rem] text-white shadow-2xl relative overflow-hidden group border border-white/5">
              <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-teal-500/10 rounded-full blur-[100px] group-hover:scale-150 transition-transform duration-1000"></div>
              <TrendingUp className="w-12 h-12 mb-8 text-teal-400 opacity-50" />
              <h3 className="text-3xl font-black mb-4 italic leading-tight uppercase tracking-tight">Practice <br /> Throughput</h3>
              <p className="text-slate-400 text-sm font-bold leading-relaxed italic mb-10">
                Performance Score: <span className="text-teal-400 font-black tracking-widest text-lg">94.2%</span>. <br /> Optimal response time detected across all patient sectors.
              </p>
              <button className="text-[10px] font-black uppercase tracking-[0.4em] border-b-2 border-teal-500 pb-2 hover:text-teal-400 transition-colors">
                View Detailed Metrics
              </button>
            </div>

            <div className="glass-md p-12 rounded-[4rem] border-white/60 shadow-inner flex flex-col justify-between">
              <h3 className="text-[10px] font-black text-slate-400 mb-10 uppercase tracking-[0.4em] flex items-center gap-4">
                <Zap className="w-5 h-5 text-blue-500" /> System Health Status
              </h3>
              <div className="space-y-8">
                {[
                  { label: 'Blockchain ID Node', status: 'Online', color: 'bg-teal-500' },
                  { label: 'Cloud Vault Sync', status: 'High Speed', color: 'bg-blue-500' },
                  { label: 'Encryption Engine', status: 'Verified', color: 'bg-teal-500' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <span className="text-xs font-black text-slate-500 uppercase tracking-widest">{item.label}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-black uppercase italic text-slate-800 tracking-widest">{item.status}</span>
                      <div className={`w-2.5 h-2.5 rounded-full ${item.color} animate-pulse shadow-sm`}></div>
                    </div>
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
