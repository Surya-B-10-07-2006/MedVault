import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FolderHeart,
  Search,
  Share2,
  User,
  Calendar,
  FileText,
  Eye,
  EyeOff,
  Clock,
  ShieldCheck,
  FileSearch,
  Users
} from 'lucide-react';
import Layout from '../components/Layout';
import api from '../utils/api';
import { toast } from 'react-hot-toast';

export default function PatientSharedRecords() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchSharedRecords();
  }, []);

  const fetchSharedRecords = async () => {
    try {
      const { data } = await api.get('/records/my-records');
      // Filter only records that have been shared
      const sharedRecords = data.records?.filter(record => 
        record.sharedWith && record.sharedWith.length > 0
      ) || [];
      setRecords(sharedRecords);
    } catch (err) {
      toast.error('Failed to load shared records');
    } finally {
      setLoading(false);
    }
  };

  const revokeAccess = async (recordId, doctorId) => {
    try {
      await api.patch(`/records/${recordId}/revoke`, { doctorId });
      toast.success('Access revoked successfully');
      fetchSharedRecords();
    } catch (err) {
      toast.error('Failed to revoke access');
    }
  };

  const filteredRecords = records.filter(rec =>
    rec.originalName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout title="Shared Medical Records">
      <div className="space-y-10 pb-24">
        {/* Header Section */}
        <section className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-medTeal shadow-xl shadow-medTeal/20 rounded-2xl flex items-center justify-center text-white">
              <Share2 className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-medDark tracking-tight italic">Shared Records</h1>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2 mt-0.5">
                <ShieldCheck className="w-4 h-4 text-medTeal" /> Records Shared with Doctors
              </p>
            </div>
          </div>
          <div className="relative group flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-medBlue" />
            <input
              type="text"
              placeholder="Search shared records..."
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
              <h3 className="text-2xl font-black text-medDark mb-2 italic">No shared records found</h3>
              <p className="text-gray-400 font-medium">You haven't shared any medical records with doctors yet.</p>
            </motion.div>
          ) : (
            <motion.div
              key="list"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {filteredRecords.map((record, idx) => (
                <motion.div
                  key={record._id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-xl shadow-slate-200/50"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    {/* Record Info */}
                    <div className="flex items-center gap-6">
                      <div className="w-16 h-16 bg-medGrey rounded-2xl flex items-center justify-center text-medDark font-black text-xs uppercase shadow-inner">
                        {record.fileType.includes('pdf') ? 'PDF' : 'IMG'}
                      </div>
                      <div>
                        <h4 className="text-xl font-black text-medDark mb-2">{record.originalName}</h4>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-medTeal" />
                            <span className="font-bold">Uploaded: {new Date(record.createdAt).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-medBlue" />
                            <span className="font-bold">Shared with {record.sharedWith.length} doctor(s)</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Shared With Details */}
                    <div className="lg:max-w-md">
                      <h5 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-3">Shared With:</h5>
                      <div className="space-y-2">
                        {record.sharedWith.map((share, shareIdx) => (
                          <div
                            key={shareIdx}
                            className="flex items-center justify-between p-3 bg-medGrey/30 rounded-xl"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-medBlue rounded-lg flex items-center justify-center text-white font-bold text-xs">
                                Dr
                              </div>
                              <div>
                                <p className="font-bold text-medDark text-sm">Doctor Access</p>
                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                  <Clock className="w-3 h-3" />
                                  <span>Expires: {new Date(share.expiresAt).toLocaleDateString()}</span>
                                </div>
                              </div>
                            </div>
                            <button
                              onClick={() => revokeAccess(record._id, share.sharedWith)}
                              className="px-3 py-1 bg-rose-100 text-rose-600 rounded-lg text-xs font-bold hover:bg-rose-200 transition-colors"
                            >
                              Revoke
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Layout>
  );
}