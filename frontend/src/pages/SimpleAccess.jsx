import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  UserCheck,
  Search,
  FileText,
  Download,
  User,
  Calendar,
  CheckCircle2
} from 'lucide-react';
import Layout from '../components/Layout';
import api from '../utils/api';
import { toast } from 'react-hot-toast';
import Button from '../components/Button';

export default function SimpleAccess() {
  const [patientName, setPatientName] = useState('');
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [requesting, setRequesting] = useState(false);

  useEffect(() => {
    fetchAccessibleRecords();
  }, []);

  const fetchAccessibleRecords = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/access/my-accessible-records');
      setRecords(data.records || []);
    } catch (err) {
      console.error('Failed to load records');
    } finally {
      setLoading(false);
    }
  };

  const requestAccess = async (e) => {
    e.preventDefault();
    if (!patientName.trim()) {
      toast.error('Please enter patient name');
      return;
    }

    setRequesting(true);
    try {
      const { data } = await api.post('/access/request-by-name', {
        patientName: patientName.trim()
      });
      toast.success(data.message);
      setPatientName('');
      fetchAccessibleRecords();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to get access');
    } finally {
      setRequesting(false);
    }
  };

  const downloadRecord = async (recordId, fileName) => {
    try {
      const { data } = await api.get(`/records/download/${recordId}`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([data]));
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      a.click();
      window.URL.revokeObjectURL(url);
      toast.success('Download started');
    } catch (err) {
      toast.error('Download failed');
    }
  };

  return (
    <Layout title="Simple Access">
      <div className="max-w-6xl mx-auto pb-24 space-y-10">
        {/* Header */}
        <section className="text-center">
          <div className="w-20 h-20 bg-medBlue rounded-[2rem] flex items-center justify-center text-white mx-auto shadow-2xl shadow-medBlue/20 mb-8">
            <UserCheck className="w-10 h-10" />
          </div>
          <h1 className="text-4xl font-black text-medDark tracking-tight italic">Simple Access</h1>
          <p className="text-gray-500 font-bold mt-2 uppercase text-xs tracking-[0.2em]">Enter Patient Name → Get Access</p>
        </section>

        {/* Request Access Form */}
        <div className="bg-white rounded-[3rem] p-8 shadow-xl shadow-slate-200/50 border border-gray-100 max-w-2xl mx-auto">
          <form onSubmit={requestAccess} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-medDark mb-3">Patient Name</label>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  placeholder="Enter patient's full name..."
                  className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-200 focus:ring-4 focus:ring-medBlue/10 focus:border-medBlue font-bold"
                  required
                />
              </div>
            </div>
            <Button
              type="submit"
              loading={requesting}
              className="w-full py-4 rounded-2xl flex items-center justify-center gap-2"
            >
              <UserCheck className="w-5 h-5" />
              Get Access to All Records
            </Button>
          </form>
        </div>

        {/* Accessible Records */}
        <div className="bg-white rounded-[3rem] shadow-xl shadow-slate-200/50 border border-gray-100 overflow-hidden">
          <div className="p-8 border-b border-gray-100">
            <h2 className="text-2xl font-black text-medDark flex items-center gap-3">
              <FileText className="w-7 h-7 text-medTeal" />
              My Accessible Records ({records.length})
            </h2>
          </div>

          {loading ? (
            <div className="p-24 text-center">
              <div className="w-8 h-8 border-4 border-medBlue border-t-transparent rounded-full animate-spin mx-auto"></div>
            </div>
          ) : records.length === 0 ? (
            <div className="p-24 text-center">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-500 mb-2">No Records Available</h3>
              <p className="text-gray-400">Request access to patient records to see them here</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {records.map((record, idx) => (
                <motion.div
                  key={record._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="p-6 hover:bg-medGrey/30 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-medBlue rounded-xl flex items-center justify-center text-white font-bold text-xs">
                        {record.fileType.includes('pdf') ? 'PDF' : 'IMG'}
                      </div>
                      <div>
                        <h4 className="font-bold text-medDark">{record.originalName}</h4>
                        <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <User className="w-4 h-4" />
                            <span>{record.patientId?.name}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>{new Date(record.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-600 rounded-full text-xs font-bold">
                        <CheckCircle2 className="w-3 h-3" />
                        Accessible
                      </div>
                      <button
                        onClick={() => downloadRecord(record._id, record.originalName)}
                        className="px-4 py-2 bg-medBlue text-white rounded-xl font-bold text-sm hover:bg-medBlue/90 transition-colors flex items-center gap-2"
                      >
                        <Download className="w-4 h-4" />
                        Download
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}