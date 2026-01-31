import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  FileText,
  Share2,
  UploadCloud,
  Activity,
  Clock,
  ChevronRight,
  TrendingUp,
  FilePlus2,
  CalendarCheck,
  History
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
    { label: 'Total Records', value: stats.total, icon: <FileText className="w-6 h-6 text-blue-500" />, trend: '+2 this month', color: 'blue' },
    { label: 'Shared with Doctors', value: stats.shared, icon: <Share2 className="w-6 h-6 text-teal-500" />, trend: 'Active sessions', color: 'teal' },
    { label: 'Recent Uploads', value: stats.recent, icon: <UploadCloud className="w-6 h-6 text-purple-500" />, trend: 'Last 7 days', color: 'purple' },
  ];

  return (
    <Layout title="Patient Dashboard">
      <div className="space-y-10 pb-20">
        {/* Welcome Section */}
        <section className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl font-black text-medDark tracking-tight">
              Hello, {user?.name.split(' ')[0]} 👋
            </h1>
            <p className="text-gray-500 font-medium mt-1 uppercase text-xs tracking-widest flex items-center gap-2">
              <span className="w-2 h-2 bg-medTeal rounded-full animate-pulse"></span>
              All systems secure and active
            </p>
          </div>
          <Link to="/upload">
            <button className="flex items-center gap-3 px-8 py-4 grad-primary text-white font-extrabold rounded-[2rem] shadow-xl shadow-medBlue/20 hover:scale-105 transition-all">
              <FilePlus2 className="w-6 h-6" /> Upload New Record
            </button>
          </Link>
        </section>

        {/* Stats Grid */}
        <section className="grid md:grid-cols-3 gap-8">
          {statCards.map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="glass p-8 rounded-[2.5rem] border-white/50 hover:shadow-2xl transition-all group cursor-default"
            >
              <div className="flex items-start justify-between mb-6">
                <div className={`w-14 h-14 bg-${stat.color}-50 rounded-2xl flex items-center justify-center p-3 transition-transform group-hover:scale-110`}>
                  {stat.icon}
                </div>
                <div className="flex items-center gap-1 text-medTeal font-black text-xs uppercase bg-medTeal/10 px-3 py-1.5 rounded-full">
                  <TrendingUp className="w-3.5 h-3.5" /> High
                </div>
              </div>
              <h3 className="text-gray-400 font-bold text-sm uppercase tracking-wider mb-1">{stat.label}</h3>
              <div className="flex items-end gap-3">
                <span className="text-4xl font-black text-medDark leading-none">{stat.value}</span>
                <span className="text-xs font-bold text-gray-400 mb-1">{stat.trend}</span>
              </div>
            </motion.div>
          ))}
        </section>

        <div className="grid lg:grid-cols-3 gap-10">
          {/* Recent Activity List */}
          <section className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between px-4">
              <h2 className="text-2xl font-black text-medDark tracking-tight flex items-center gap-3">
                <Activity className="w-7 h-7 text-medBlue" /> Recent Activity
              </h2>
              <Link to="/records" className="text-medBlue font-extrabold text-sm hover:underline underline-offset-4 flex items-center gap-1 uppercase tracking-tighter">
                View All Records <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="space-y-4">
              {loading ? (
                [1, 2, 3].map(i => <div key={i} className="h-24 w-full bg-gray-100 animate-pulse rounded-[2rem]"></div>)
              ) : recentRecords.length === 0 ? (
                <div className="bg-medGrey/50 border-2 border-dashed border-gray-200 rounded-[2.5rem] p-16 text-center">
                  <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 font-bold">No records found. Start by uploading one!</p>
                </div>
              ) : (
                recentRecords.map((record, idx) => (
                  <motion.div
                    key={record._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="group bg-white p-5 rounded-[2rem] border border-gray-100 hover:border-medBlue/20 hover:shadow-2xl hover:shadow-medBlue/5 transition-all flex items-center gap-5 cursor-pointer"
                  >
                    <div className="w-16 h-16 bg-medGrey rounded-2xl flex items-center justify-center font-black text-medDark text-xs uppercase overflow-hidden ring-4 ring-transparent group-hover:ring-medBlue/10 transition-all">
                      {record.fileType.includes('pdf') ? 'PDF' : 'IMG'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-lg font-black text-medDark truncate leading-tight group-hover:text-medBlue transition-colors">{record.originalName}</h4>
                      <div className="flex items-center gap-4 mt-1.5">
                        <span className="flex items-center gap-1.5 text-xs font-bold text-gray-400 uppercase tracking-tighter">
                          <CalendarCheck className="w-3.5 h-3.5 text-medTeal" /> {new Date(record.createdAt).toLocaleDateString()}
                        </span>
                        <span className="w-1 h-1 bg-gray-200 rounded-full"></span>
                        <span className="text-[10px] font-black italic text-gray-300 uppercase underline">
                          {record.sharedWith?.length > 0 ? 'Shared' : 'Private'}
                        </span>
                      </div>
                    </div>
                    <Link to={`/records`} className="p-3 bg-medGrey text-gray-400 rounded-xl group-hover:bg-medBlue group-hover:text-white transition-all shadow-sm">
                      <ChevronRight className="w-6 h-6" />
                    </Link>
                  </motion.div>
                ))
              )}
            </div>
          </section>

          {/* Sidebar Schedule / Tips */}
          <section className="space-y-8">
            {/* Access Card */}
            <AccessCard />
            
            <div className="grad-hero p-8 rounded-[3rem] text-white shadow-2xl relative overflow-hidden">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
              <Clock className="w-10 h-10 mb-6 opacity-30" />
              <h3 className="text-2xl font-black mb-3 italic">Health Tip</h3>
              <p className="text-white/80 font-medium leading-relaxed italic">
                "Drinking enough water is essential for your kidneys and overall health. Aim for 8 glasses a day!"
              </p>
              <button className="mt-8 text-sm font-black underline underline-offset-8 uppercase tracking-widest hover:text-white transition-colors">
                Discover More Tips
              </button>
            </div>

            <div className="glass p-8 rounded-[3rem] border-white/50 border shadow-inner">
              <h3 className="text-lg font-black text-medDark mb-6 uppercase tracking-tight flex items-center gap-2">
                <CalendarCheck className="w-5 h-5 text-medTeal" /> Quick Actions
              </h3>
              <div className="grid grid-cols-2 gap-4 text-center">
                <button
                  onClick={() => navigate('/share')}
                  className="p-5 bg-white rounded-3xl border border-gray-100 hover:border-medBlue hover:text-medBlue transition-all group shadow-sm"
                >
                  <div className="w-10 h-10 bg-medGrey rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:bg-medBlue/10 transition-colors">
                    <Share2 className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-black uppercase tracking-tighter">Share Access</span>
                </button>
                <button
                  onClick={() => navigate('/timeline')}
                  className="p-5 bg-white rounded-3xl border border-gray-100 hover:border-medBlue hover:text-medBlue transition-all group shadow-sm"
                >
                  <div className="w-10 h-10 bg-medGrey rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:bg-medBlue/10 transition-colors">
                    <History className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-black uppercase tracking-tighter">Timeline</span>
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </Layout>
  );
}
