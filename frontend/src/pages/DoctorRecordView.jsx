import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FileText,
  User,
  Calendar,
  Download,
  Eye,
  ArrowLeft,
  Shield,
  Clock,
  FileType,
  HardDrive
} from 'lucide-react';
import Layout from '../components/Layout';
import api from '../utils/api';
import { toast } from 'react-hot-toast';

export default function DoctorRecordView() {
  const { recordId } = useParams();
  const navigate = useNavigate();
  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecord();
  }, [recordId]);

  const fetchRecord = async () => {
    try {
      const { data } = await api.get(`/records/view/${recordId}`);
      setRecord(data.record);
    } catch (err) {
      toast.error('Failed to load record details');
      navigate('/doctor/shared');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    try {
      const { data } = await api.get(`/records/download/${recordId}`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([data]));
      const a = document.createElement('a');
      a.href = url;
      a.download = record.originalName || 'download';
      a.click();
      window.URL.revokeObjectURL(url);
      toast.success('Download started');
    } catch (err) {
      toast.error('Download failed');
    }
  };

  if (loading) {
    return (
      <Layout title="Loading Record...">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="w-12 h-12 border-4 border-medBlue border-t-transparent rounded-full animate-spin"></div>
        </div>
      </Layout>
    );
  }

  if (!record) {
    return (
      <Layout title="Record Not Found">
        <div className="text-center py-20">
          <FileText className="w-20 h-20 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-black text-medDark mb-2">Record Not Found</h2>
          <p className="text-gray-500">The requested record could not be found or you don't have access.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Medical Record Details">
      <div className="max-w-4xl mx-auto pb-24 space-y-8">
        {/* Header */}
        <section className="flex items-center gap-4">
          <button
            onClick={() => navigate('/doctor/shared')}
            className="p-3 bg-white rounded-2xl shadow-lg border border-gray-100 hover:bg-medGrey transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-medDark" />
          </button>
          <div>
            <h1 className="text-3xl font-black text-medDark tracking-tight">Medical Record</h1>
            <p className="text-gray-500 font-bold mt-1 uppercase text-xs tracking-[0.2em] flex items-center gap-2">
              <Shield className="w-4 h-4 text-medTeal" /> Authorized Access
            </p>
          </div>
        </section>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Record Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-[3rem] p-8 shadow-xl shadow-slate-200/50 border border-gray-100"
            >
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-medBlue rounded-2xl flex items-center justify-center text-white font-black text-sm">
                    {record.fileType.includes('pdf') ? 'PDF' : 'IMG'}
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-medDark mb-1">{record.originalName}</h2>
                    <p className="text-gray-500 font-medium">Medical Document</p>
                  </div>
                </div>
                <div className="px-4 py-2 bg-medTeal/10 text-medTeal rounded-full text-sm font-bold">
                  Authorized
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-4 bg-medGrey/30 rounded-2xl">
                    <FileType className="w-5 h-5 text-medBlue" />
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">File Type</p>
                      <p className="font-bold text-medDark">{record.fileType}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-medGrey/30 rounded-2xl">
                    <HardDrive className="w-5 h-5 text-medBlue" />
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">File Size</p>
                      <p className="font-bold text-medDark">{(record.fileSize / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-4 bg-medGrey/30 rounded-2xl">
                    <Calendar className="w-5 h-5 text-medBlue" />
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Upload Date</p>
                      <p className="font-bold text-medDark">{new Date(record.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-medGrey/30 rounded-2xl">
                    <Clock className="w-5 h-5 text-medBlue" />
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Last Modified</p>
                      <p className="font-bold text-medDark">{new Date(record.updatedAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              </div>

              {record.description && (
                <div className="mt-6 p-4 bg-medGrey/30 rounded-2xl">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Description</p>
                  <p className="text-medDark font-medium">{record.description}</p>
                </div>
              )}
            </motion.div>

            {/* Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-[3rem] p-8 shadow-xl shadow-slate-200/50 border border-gray-100"
            >
              <h3 className="text-xl font-black text-medDark mb-6">Available Actions</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <button
                  onClick={handleDownload}
                  className="flex items-center gap-3 p-6 bg-medBlue text-white rounded-2xl font-bold hover:bg-medBlue/90 transition-colors shadow-lg"
                >
                  <Download className="w-5 h-5" />
                  Download Record
                </button>
                <button className="flex items-center gap-3 p-6 bg-medGrey text-medDark rounded-2xl font-bold hover:bg-medGrey/80 transition-colors">
                  <Eye className="w-5 h-5" />
                  Preview (Coming Soon)
                </button>
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Patient Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-[3rem] p-6 shadow-xl shadow-slate-200/50 border border-gray-100"
            >
              <h3 className="text-lg font-black text-medDark mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-medTeal" />
                Patient Information
              </h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-medTeal rounded-xl flex items-center justify-center text-white font-bold">
                    {record.patientId?.name?.[0]?.toUpperCase() || 'P'}
                  </div>
                  <div>
                    <p className="font-bold text-medDark">{record.patientId?.name || 'Patient'}</p>
                    <p className="text-sm text-gray-500">{record.patientId?.email || 'No email'}</p>
                  </div>
                </div>
                <div className="pt-4 border-t border-gray-100">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Patient ID</p>
                  <p className="font-mono text-sm text-medDark bg-medGrey/30 p-2 rounded-lg">
                    {record.patientId?._id?.slice(-8).toUpperCase() || 'N/A'}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Access Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-medDark rounded-[3rem] p-6 text-white shadow-xl relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-medBlue/20 rounded-full blur-3xl -mr-16 -mt-16"></div>
              <Shield className="w-8 h-8 mb-4 text-medTeal" />
              <h3 className="text-lg font-black mb-3">Access Status</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-white/70">Status:</span>
                  <span className="font-bold text-medTeal">Authorized</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">Access Level:</span>
                  <span className="font-bold">Read-Only</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">Expires:</span>
                  <span className="font-bold">
                    {record.sharedWith?.[0]?.expiresAt 
                      ? new Date(record.sharedWith[0].expiresAt).toLocaleDateString()
                      : 'N/A'
                    }
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </Layout>
  );
}