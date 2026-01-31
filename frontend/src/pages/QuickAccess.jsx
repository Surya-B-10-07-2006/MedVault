import { useState } from 'react';
import { motion } from 'framer-motion';
import { Key, FileText, Download, User, Calendar, Shield } from 'lucide-react';
import Layout from '../components/Layout';
import api from '../utils/api';
import { toast } from 'react-hot-toast';
import Button from '../components/Button';

export default function QuickAccess() {
  const [accessCode, setAccessCode] = useState('');
  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(false);

  const accessRecord = async (e) => {
    e.preventDefault();
    if (!accessCode.trim()) {
      toast.error('Please enter access code');
      return;
    }

    setLoading(true);
    try {
      const { data } = await api.post('/code/quick-access', {
        shareCode: accessCode.trim()
      });
      setRecord(data.record);
      toast.success('Record accessed successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Invalid access code');
      setRecord(null);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    try {
      const response = await api.get(`/records/download/${record._id}`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', record.originalName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success('Download started');
    } catch (error) {
      toast.error('Download failed');
    }
  };

  return (
    <Layout title="Quick Access">
      <div className="max-w-4xl mx-auto space-y-10">
        
        {/* Header */}
        <div className="text-center">
          <div className="w-20 h-20 bg-medTeal/10 rounded-[2rem] flex items-center justify-center mx-auto mb-6">
            <Key className="w-10 h-10 text-medTeal" />
          </div>
          <h1 className="text-4xl font-black text-medDark mb-4 italic">Quick Access</h1>
          <p className="text-gray-500 font-bold">Enter 5-digit code to access medical records</p>
        </div>

        {/* Access Form */}
        <div className="bg-white rounded-[3rem] p-12 shadow-2xl shadow-slate-200/50 border border-gray-100">
          <form onSubmit={accessRecord} className="space-y-8">
            <div className="max-w-md mx-auto">
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 text-center">Access Code</label>
              <div className="relative">
                <Key className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
                <input
                  type="text"
                  value={accessCode}
                  onChange={(e) => setAccessCode(e.target.value.replace(/\D/g, '').slice(0, 5))}
                  placeholder="Enter 5-digit code"
                  className="w-full pl-20 pr-6 py-6 rounded-[2rem] border border-gray-200 focus:ring-4 focus:ring-medTeal/10 focus:border-medTeal font-black text-3xl tracking-[0.5em] text-center"
                  maxLength={5}
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading || accessCode.length !== 5}
              className="w-full py-6 rounded-[2rem] text-lg font-black uppercase tracking-widest bg-medTeal hover:bg-medTeal/90"
            >
              {loading ? 'Accessing...' : 'Access Record'}
            </Button>
          </form>
        </div>

        {/* Record Display */}
        {record && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-[3rem] p-12 shadow-2xl shadow-slate-200/50 border border-gray-100"
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="w-16 h-16 bg-medTeal rounded-2xl flex items-center justify-center">
                <FileText className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-black text-medDark italic">{record.originalName}</h3>
                <p className="text-gray-500 font-bold">Patient: {record.patient.name}</p>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="p-6 bg-medGrey/30 rounded-2xl">
                <div className="flex items-center gap-3 mb-2">
                  <Calendar className="w-5 h-5 text-medTeal" />
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Upload Date</span>
                </div>
                <p className="font-black text-medDark">{new Date(record.createdAt).toLocaleDateString()}</p>
              </div>
              
              <div className="p-6 bg-medGrey/30 rounded-2xl">
                <div className="flex items-center gap-3 mb-2">
                  <User className="w-5 h-5 text-medBlue" />
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Patient Email</span>
                </div>
                <p className="font-black text-medDark">{record.patient.email}</p>
              </div>
              
              <div className="p-6 bg-medGrey/30 rounded-2xl">
                <div className="flex items-center gap-3 mb-2">
                  <Shield className="w-5 h-5 text-green-500" />
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">File Size</span>
                </div>
                <p className="font-black text-medDark">{(record.fileSize / 1024).toFixed(1)} KB</p>
              </div>
            </div>

            {record.description && (
              <div className="p-6 bg-medTeal/5 rounded-2xl mb-8">
                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Description</h4>
                <p className="text-gray-700 font-bold italic">{record.description}</p>
              </div>
            )}

            <Button
              onClick={handleDownload}
              className="w-full py-5 rounded-[2rem] flex items-center justify-center gap-3 bg-medTeal hover:bg-medTeal/90"
            >
              <Download className="w-5 h-5" />
              Download Medical Record
            </Button>
          </motion.div>
        )}
      </div>
    </Layout>
  );
}