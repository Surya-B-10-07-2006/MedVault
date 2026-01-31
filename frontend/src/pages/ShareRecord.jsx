import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Share2,
  User,
  FileText,
  Calendar,
  ShieldCheck,
  Info,
  CheckCircle2,
  AlertCircle,
  Stethoscope,
  Send,
  Link as LinkIcon
} from 'lucide-react';
import Layout from '../components/Layout';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import Button from '../components/Button';

export default function ShareRecord() {
  const { user } = useAuth();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [shareLoading, setShareLoading] = useState(false);
  const [recordId, setRecordId] = useState('');
  const [doctorName, setDoctorName] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [expiresAt, setExpiresAt] = useState('');

  useEffect(() => {
    if (!user?.id) return;
    const fetchRecords = async () => {
      try {
        const { data } = await api.get('/records/my-records');
        setRecords(data.records || []);
      } catch (err) {
        toast.error('Failed to load records for sharing');
      } finally {
        setLoading(false);
      }
    };
    fetchRecords();
  }, [user?.id]);

  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      if (doctorName.trim().length >= 2) {
        searchDoctors();
      } else {
        setSearchResults([]);
      }
    }, 300);
    return () => clearTimeout(delayedSearch);
  }, [doctorName]);

  const searchDoctors = async () => {
    if (doctorName.trim().length < 2) return;
    setSearching(true);
    try {
      const { data } = await api.get(`/doctor/search-doctors?name=${encodeURIComponent(doctorName)}`);
      setSearchResults(data.doctors || []);
    } catch (err) {
      console.error('Failed to search doctors');
    } finally {
      setSearching(false);
    }
  };

  const handleShare = async (e) => {
    e.preventDefault();
    if (!recordId || !doctorName) {
      toast.error('Please select a record and enter doctor name');
      return;
    }

    setShareLoading(true);
    try {
      const exp = expiresAt ? new Date(expiresAt).toISOString() : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
      await api.post(`/records/share/${recordId}`, { doctorName, expiresAt: exp });
      toast.success('Record shared with doctor successfully!');
      setRecordId('');
      setDoctorName('');
      setExpiresAt('');
      setSearchResults([]);
      // Refresh records
      const { data } = await api.get('/records/my-records');
      setRecords(data.records || []);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to share record');
    } finally {
      setShareLoading(false);
    }
  };

  return (
    <Layout title="Secure Sharing Vault">
      <div className="max-w-5xl mx-auto pb-24">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-16">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-medTeal shadow-xl shadow-medTeal/20 rounded-2xl flex items-center justify-center text-white">
              <Share2 className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-medDark tracking-tight italic uppercase italic">Share Medical Data</h1>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1.5 mt-0.5">
                <ShieldCheck className="w-3.5 h-3.5 text-medTeal" /> P2P Encrypted Authorization
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4 bg-white p-2 rounded-2xl shadow-xl shadow-slate-200/50 border border-gray-50">
            <div className="w-10 h-10 grad-primary rounded-xl flex items-center justify-center text-white font-black text-xs">
              {records.length}
            </div>
            <span className="text-[10px] font-black text-medDark uppercase tracking-widest pr-4">Sharable Objects</span>
          </div>
        </div>

        <div className="grid lg:grid-cols-5 gap-12">
          {/* Form Area */}
          <div className="lg:col-span-3">
            <motion.form
              onSubmit={handleShare}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass p-10 rounded-[3rem] border-white/50 shadow-2xl shadow-medBlue/5 space-y-8"
            >
              <div className="space-y-3">
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Select Vault File</label>
                <div className="relative group">
                  <FileText className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-medBlue transition-colors" />
                  <select
                    value={recordId}
                    onChange={(e) => setRecordId(e.target.value)}
                    required
                    className="w-full pl-14 pr-6 py-4 rounded-3xl bg-medGrey/50 border-none focus:ring-4 focus:ring-medBlue/10 font-bold text-medDark appearance-none cursor-pointer"
                  >
                    <option value="">Select a medical record...</option>
                    {records.map((r) => (
                      <option key={r._id} value={r._id}>{r.originalName} ({r.fileType.split('/')[1].toUpperCase()})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-3">
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Doctor Name</label>
                <div className="relative group">
                  <Stethoscope className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-medBlue transition-colors" />
                  <input
                    type="text"
                    value={doctorName}
                    onChange={(e) => setDoctorName(e.target.value)}
                    required
                    placeholder="Enter doctor's full name..."
                    className="w-full pl-14 pr-6 py-4 rounded-3xl bg-medGrey/50 border-none focus:ring-4 focus:ring-medBlue/10 font-bold text-medDark placeholder:text-gray-300"
                  />
                  {searching && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2">
                      <div className="w-4 h-4 border-2 border-medBlue border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  )}
                </div>
                
                {/* Search Results */}
                {searchResults.length > 0 && (
                  <div className="mt-2 bg-white rounded-2xl border border-gray-100 shadow-lg max-h-40 overflow-y-auto">
                    {searchResults.map((doctor) => (
                      <button
                        key={doctor._id}
                        onClick={() => {
                          setDoctorName(doctor.name);
                          setSearchResults([]);
                        }}
                        className="w-full p-3 text-left hover:bg-medGrey/30 transition-colors flex items-center gap-3 border-b border-gray-50 last:border-b-0"
                      >
                        <Stethoscope className="w-4 h-4 text-medBlue" />
                        <div>
                          <p className="font-bold text-medDark">{doctor.name}</p>
                          <p className="text-xs text-gray-500">{doctor.specialization || 'General Practice'}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
                
                <p className="text-[9px] font-bold text-gray-400 italic px-2">Type doctor's name to search and select from results.</p>
              </div>

              <div className="space-y-3">
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Access Expiry Date (Optional)</label>
                <div className="relative group">
                  <Calendar className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-medBlue transition-colors" />
                  <input
                    type="date"
                    value={expiresAt}
                    onChange={(e) => setExpiresAt(e.target.value)}
                    className="w-full pl-14 pr-6 py-4 rounded-3xl bg-medGrey/50 border-none focus:ring-4 focus:ring-medBlue/10 font-bold text-medDark"
                  />
                </div>
                <p className="text-[9px] font-bold text-gray-400 italic px-2">Defaults to 30 days if not specified.</p>
              </div>

              <Button
                type="submit"
                loading={shareLoading}
                className="w-full py-5 rounded-[2rem] shadow-xl shadow-medBlue/20 flex items-center justify-center gap-3 mt-4"
              >
                <Send className="w-5 h-5" /> Grant Secure Access
              </Button>
            </motion.form>
          </div>

          {/* Info Area */}
          <div className="lg:col-span-2 space-y-8">
            <div className="p-8 bg-medDark rounded-[3rem] text-white shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-medTeal/20 rounded-full blur-3xl -mr-16 -mt-16"></div>
              <LinkIcon className="w-10 h-10 mb-6 text-medBlue" />
              <h3 className="text-xl font-black mb-4 italic tracking-tight uppercase">Sharing Protocol</h3>
              <ul className="space-y-5 text-sm font-medium text-white/70 italic">
                <li className="flex gap-4">
                  <div className="w-6 h-6 rounded-full bg-medBlue/20 flex items-center justify-center text-[10px] font-black text-medBlue flex-shrink-0 border border-medBlue/30">01</div>
                  Sharing generates a temporary decryption key for the physician.
                </li>
                <li className="flex gap-4">
                  <div className="w-6 h-6 rounded-full bg-medBlue/20 flex items-center justify-center text-[10px] font-black text-medBlue flex-shrink-0 border border-medBlue/30">02</div>
                  Access is read-only. Your original data remains untouched.
                </li>
                <li className="flex gap-4">
                  <div className="w-6 h-6 rounded-full bg-medBlue/20 flex items-center justify-center text-[10px] font-black text-medBlue flex-shrink-0 border border-medBlue/30">03</div>
                  You can revoke this connection at any time in the 'Library' tab.
                </li>
              </ul>
            </div>

            <div className="p-8 bg-medGrey/50 rounded-[3rem] border border-gray-100 flex gap-4 shadow-xl">
              <AlertCircle className="w-8 h-8 text-medBlue flex-shrink-0" />
              <p className="text-xs font-bold text-gray-500 leading-relaxed italic">
                Sharing records is a significant privacy action. Ensure you trust the recipient before granting access to your sensitive medical data.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
