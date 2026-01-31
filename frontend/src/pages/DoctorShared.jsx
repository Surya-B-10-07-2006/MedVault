import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  FolderHeart,
  Search,
  Download,
  User,
  Calendar,
  FileText,
  Filter,
  ChevronRight,
  ShieldCheck,
  FileSearch
} from 'lucide-react';
import Layout from '../components/Layout';
import api from '../utils/api';
import { toast } from 'react-hot-toast';

export default function DoctorShared() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchSharedRecords();
  }, []);

  const fetchSharedRecords = async () => {
    try {
      const { data } = await api.get('/doctor/shared');
      setRecords(data.records || []);
    } catch (err) {
      toast.error('Failed to load shared records');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (rec) => {
    try {
      const { data } = await api.get(`/records/download/${rec._id}`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([data]));
      const a = document.createElement('a');
      a.href = url;
      a.download = rec.originalName || 'download';
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      toast.error('Download failed');
    }
  };

  const filteredRecords = records.filter(rec =>
    rec.originalName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    rec.patientId?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout title="Patient Records Repository">
      <div className="space-y-10 pb-24">
        {/* Header Section */}
        <section className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 grad-primary rounded-2xl flex items-center justify-center text-white shadow-xl shadow-medBlue/20">
              <FolderHeart className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-medDark tracking-tight italic">Patient Records</h1>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2 mt-0.5">
                <ShieldCheck className="w-4 h-4 text-medTeal" /> Secure Read-Only Access
              </p>
            </div>
          </div>
          <div className="relative group flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-medBlue" />
            <input
              type="text"
              placeholder="Search by patient name or record title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-6 py-4 rounded-[1.5rem] border-none bg-white shadow-xl shadow-slate-200/50 focus:ring-4 focus:ring-medBlue/10 font-bold text-sm"
            />
          </div>
        </section>

        {/* Records Content */}
        <AnimatePresence mode="wait">
          {loading ? (
            <div key="loader" className="flex justify-center p-24">
              <span className="w-10 h-10 border-4 border-medBlue border-t-transparent rounded-full animate-spin"></span>
            </div>
          ) : filteredRecords.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-32 text-center"
            >
              <FileSearch className="w-20 h-20 text-gray-200 mx-auto mb-6" />
              <h3 className="text-2xl font-black text-medDark mb-2 italic">Nothing found in shared storage</h3>
              <p className="text-gray-400 font-medium">Wait for patients to share their medical data with you.</p>
            </motion.div>
          ) : (
            <motion.div
              key="grid"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
            >
              {filteredRecords.map((rec, idx) => (
                <motion.div
                  key={rec._id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="group bg-white rounded-[2.5rem] p-7 border border-gray-100 shadow-xl shadow-slate-200/50 hover:shadow-medBlue/20 transition-all flex flex-col justify-between"
                >
                  <div className="mb-8">
                    <div className="flex justify-between items-start mb-6">
                      <div className="w-16 h-16 bg-medGrey rounded-2xl flex items-center justify-center text-medDark font-black text-xs uppercase shadow-inner group-hover:scale-110 transition-transform">
                        {rec.fileType.includes('pdf') ? 'PDF' : 'IMG'}
                      </div>
                      <span className="px-3 py-1 bg-medBlue/5 text-medBlue rounded-full text-[9px] font-black uppercase tracking-tighter transition-colors group-hover:bg-medBlue group-hover:text-white">Authorized</span>
                    </div>

                    <h4 className="text-lg font-black text-medDark leading-tight mb-3 truncate group-hover:text-medBlue transition-colors">{rec.originalName}</h4>

                    <div className="space-y-2.5">
                      <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-tighter">
                        <User className="w-3.5 h-3.5 text-medBlue" /> {rec.patientId?.name || 'Unknown Patient'}
                      </div>
                      <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-tighter">
                        <Calendar className="w-3.5 h-3.5 text-medTeal" /> {new Date(rec.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDownload(rec)}
                    className="w-full py-4 bg-medGrey text-medDark font-black text-xs uppercase tracking-widest rounded-2xl flex items-center justify-center gap-2 hover:bg-medBlue hover:text-white transition-all shadow-sm mb-2"
                  >
                    <Download className="w-4 h-4" /> Download Access
                  </button>
                  <Link
                    to={`/doctor/record/${rec._id}`}
                    className="w-full py-3 bg-medTeal text-white font-black text-xs uppercase tracking-widest rounded-2xl flex items-center justify-center gap-2 hover:bg-medTeal/90 transition-all shadow-sm"
                  >
                    <FileText className="w-4 h-4" /> View Details
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Layout>
  );
}
