import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  FileText,
  Share2,
  UploadCloud,
  Activity,
  Activity as ActivityIcon,
  Clock,
  ChevronRight,
  TrendingUp,
  FilePlus2,
  CalendarCheck,
  History,
  Shield,
  Zap,
  Plus
} from 'lucide-react';
import Layout from '../components/Layout';
import AccessCard from '../components/AccessCard';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

export default function PatientDashboard() {
  const [stats, setStats] = useState({ total: 0, shared: 0, recent: 0 });
  const [recentRecords, setRecentRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await api.get('/records/my-records');
        setRecentRecords(data.records.slice(0, 5));
        setStats({
          total: data.records.length,
          shared: data.records.filter(r => r.sharedWith?.length > 0).length,
          recent: data.records.filter(r => {
            const date = new Date(r.createdAt);
            const now = new Date();
            return (now - date) / (1000 * 60 * 60 * 24) < 7;
          }).length
        });
      } catch (err) {
        console.error('Loader error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const statCards = [
    { label: 'Total Records', value: stats.total, icon: <FileText className="w-6 h-6 text-blue-500" />, trend: 'System synced', color: 'blue' },
    { label: 'Vault Access', value: stats.shared, icon: <Share2 className="w-6 h-6 text-teal-500" />, trend: 'Active shares', color: 'teal' },
    { label: 'Recent Events', value: stats.recent, icon: <Activity className="w-6 h-6 text-purple-500" />, trend: 'Last 7 days', color: 'purple' },
  ];

  return (
    <Layout title="Patient Dashboard">
      <div className="space-y-12 pb-20">
        {/* Welcome Section */}
        <section className="flex flex-col md:flex-row md:items-center justify-between gap-6 md:gap-12 mesh-gradient-dark p-6 md:p-10 rounded-[2.5rem] md:rounded-[3.5rem] text-white relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[100px] -z-0"></div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 md:gap-8 relative z-10 w-full md:w-auto">
            <div className="w-20 h-20 md:w-24 md:h-24 bg-white rounded-[1.5rem] md:rounded-[2rem] shadow-2xl flex items-center justify-center p-1.5 border-4 border-white/20 overflow-hidden ring-4 ring-blue-500/20 active:scale-95 transition-transform shrink-0">
              <img src={user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email}`} className="w-full h-full object-cover rounded-[1rem] md:rounded-[1.5rem]" />
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2 md:gap-3 mb-2">
                <span className="px-2 md:px-3 py-1 bg-blue-500/20 text-blue-400 text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] rounded-full border border-blue-500/30">Patient Node</span>
                <p className="text-slate-400 font-bold uppercase text-[8px] md:text-[10px] tracking-[0.2em] flex items-center gap-1.5 leading-none">
                  <div className="w-1.5 h-1.5 bg-teal-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(20,184,166,0.8)]"></div>
                  Verified Health ID
                </p>
              </div>
              <h1 className="text-2xl md:text-4xl font-black tracking-tight italic uppercase leading-tight truncate">
                Welcome, <span className="grad-text brightness-125">{user?.name.split(' ')[0]}</span>
              </h1>
            </div>
          </div>
          <div className="relative z-10 w-full md:w-auto mt-4 md:mt-0">
            <button
              onClick={() => navigate('/upload')}
              className="group flex items-center justify-center gap-3 w-full md:w-auto px-8 py-4 bg-white text-slate-900 font-extrabold rounded-2xl shadow-xl hover:bg-slate-50 transition-all active:scale-95"
            >
              <Plus className="w-5 h-5 text-blue-600 group-hover:rotate-90 transition-transform" />
              <span className="uppercase tracking-widest text-[12px]">Initialize Upload</span>
            </button>
          </div>
        </section>

        {/* Stats Grid */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {statCards.map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              className="glass-md p-10 rounded-[3rem] hover-lift group cursor-default relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-slate-500/5 rounded-bl-[100px] -z-0"></div>
              <div className="flex items-start justify-between mb-8 relative z-10">
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-lg border border-slate-100 group-hover:scale-110 group-hover:rotate-6 transition-transform">
                  {stat.icon}
                </div>
                <div className="flex items-center gap-1.5 text-teal-600 font-black text-[9px] uppercase tracking-[0.2em] bg-teal-500/10 px-4 py-2 rounded-full border border-teal-500/20 shadow-sm">
                  <TrendingUp className="w-3.5 h-3.5" /> Stable
                </div>
              </div>
              <h3 className="text-slate-400 font-black text-[10px] uppercase tracking-[0.3em] mb-2 relative z-10">{stat.label}</h3>
              <div className="flex items-baseline gap-3 relative z-10">
                <span className="text-5xl font-black text-slate-900 tracking-tighter leading-none">{stat.value}</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{stat.trend}</span>
              </div>
            </motion.div>
          ))}
        </section>

        <div className="flex flex-col gap-12">
          {/* Record Access Management - Now a wide rectangle */}
          <section className="w-full">
            <div className="flex items-center justify-between mb-8 px-2">
              <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-lg border border-slate-100">
                  <Shield className="w-6 h-6 text-teal-500" />
                </div>
                Universal Security Hub
              </h2>
            </div>
            <AccessCard />
          </section>

          {/* Recent Activity List */}
          <section className="space-y-8">
            <div className="flex items-center justify-between px-2">
              <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-lg border border-slate-100">
                  <Zap className="w-6 h-6 text-blue-500" />
                </div>
                Data Audit Registry
              </h2>
              <Link to="/records" className="text-blue-600 font-black text-[10px] uppercase tracking-widest hover:translate-x-1 transition-transform flex items-center gap-2">
                Open Full Vault <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="space-y-4">
              {loading ? (
                [1, 2, 3].map(i => <div key={i} className="h-28 w-full glass-sm animate-pulse rounded-[2.5rem]"></div>)
              ) : recentRecords.length === 0 ? (
                <div className="glass-md rounded-[3rem] p-24 text-center border-dashed border-2 border-slate-200">
                  <FileText className="w-20 h-20 text-slate-200 mx-auto mb-6" />
                  <p className="text-slate-400 font-black uppercase tracking-widest text-sm italic">Vault Empty. Initiate First Protocol.</p>
                </div>
              ) : (
                recentRecords.map((record, idx) => (
                  <motion.div
                    key={record._id}
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className="group glass-md p-6 rounded-[2.5rem] hover:bg-white transition-all flex items-center gap-6 cursor-pointer border-transparent hover:border-blue-200 shadow-sm"
                  >
                    <div className="w-20 h-20 grad-primary rounded-[1.5rem] flex flex-col items-center justify-center text-white font-black shadow-lg group-hover:scale-105 transition-all">
                      <span className="text-[10px] opacity-70 mb-1">TYPE</span>
                      <span className="text-lg tracking-tighter uppercase">{record.fileType.split('/')[1] || 'DOC'}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xl font-black text-slate-800 truncate tracking-tight group-hover:text-blue-600 transition-colors uppercase italic">{record.originalName}</h4>
                      <div className="flex items-center gap-6 mt-2">
                        <span className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                          <Clock className="w-3.5 h-3.5 text-blue-400" /> SYNCED: {new Date(record.createdAt).toLocaleDateString()}
                        </span>
                        <div className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${record.sharedWith?.length > 0 ? 'bg-teal-50 text-teal-600 border-teal-200' : 'bg-slate-50 text-slate-500 border-slate-200'}`}>
                          {record.sharedWith?.length > 0 ? 'Public Node' : 'Private Sector'}
                        </div>
                      </div>
                    </div>
                    <Link to={`/records`} className="w-14 h-14 bg-slate-50 text-slate-300 rounded-2xl flex items-center justify-center group-hover:grad-primary group-hover:text-white transition-all group-hover:shadow-blue-500/20 group-hover:translate-x-1">
                      <ChevronRight className="w-7 h-7" />
                    </Link>
                  </motion.div>
                ))
              )}
            </div>
          </section>
        </div>
      </div>
    </Layout>
  );
}
