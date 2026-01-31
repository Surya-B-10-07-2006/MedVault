import { useState } from 'react';
import { motion } from 'framer-motion';
import { Key, FileText, Download, User, Calendar, Shield } from 'lucide-react';
import api from '../utils/api';
import { toast } from 'react-hot-toast';
import Button from './Button';

export default function QuickAccessCard() {
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

  const resetCard = () => {
    setRecord(null);
    setAccessCode('');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-slate-200/50 border border-gray-100"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-medTeal rounded-2xl flex items-center justify-center">
          <Key className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-black text-medDark">Quick Access</h3>
          <p className="text-sm text-gray-500 font-medium">Enter 5-digit code to access records</p>
        </div>
      </div>

      {!record ? (
        <form onSubmit={accessRecord} className="space-y-6">
          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Access Code</label>
            <div className="relative">
              <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={accessCode}
                onChange={(e) => setAccessCode(e.target.value.replace(/\D/g, '').slice(0, 5))}
                placeholder="Enter 5-digit code"
                className="w-full pl-14 pr-4 py-4 rounded-2xl border border-gray-200 focus:ring-4 focus:ring-medTeal/10 focus:border-medTeal font-black text-xl tracking-[0.3em] text-center"
                maxLength={5}
                required
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading || accessCode.length !== 5}
            className="w-full py-4 rounded-2xl font-black uppercase tracking-widest bg-medTeal hover:bg-medTeal/90"
          >
            {loading ? 'Accessing...' : 'Access Record'}
          </Button>
        </form>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center gap-3 p-4 bg-medTeal/5 rounded-2xl">
            <FileText className="w-8 h-8 text-medTeal" />
            <div className="flex-1">
              <h4 className="font-black text-medDark">{record.originalName}</h4>
              <p className="text-sm text-gray-500">Patient: {record.patient.name}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-medGrey/30 rounded-xl">
              <div className="flex items-center gap-2 mb-1">
                <Calendar className="w-4 h-4 text-medTeal" />
                <span className="text-xs font-black text-gray-400 uppercase">Date</span>
              </div>
              <p className="font-bold text-medDark text-sm">{new Date(record.createdAt).toLocaleDateString()}</p>
            </div>
            
            <div className="p-3 bg-medGrey/30 rounded-xl">
              <div className="flex items-center gap-2 mb-1">
                <Shield className="w-4 h-4 text-green-500" />
                <span className="text-xs font-black text-gray-400 uppercase">Size</span>
              </div>
              <p className="font-bold text-medDark text-sm">{(record.fileSize / 1024).toFixed(1)} KB</p>
            </div>
          </div>

          {record.description && (
            <div className="p-4 bg-medTeal/5 rounded-xl">
              <h5 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Description</h5>
              <p className="text-gray-700 font-bold text-sm italic">{record.description}</p>
            </div>
          )}

          <div className="flex gap-3">
            <Button
              onClick={handleDownload}
              className="flex-1 py-3 rounded-xl flex items-center justify-center gap-2 bg-medTeal hover:bg-medTeal/90"
            >
              <Download className="w-4 h-4" />
              Download
            </Button>
            <button
              onClick={resetCard}
              className="px-4 py-3 bg-gray-100 text-gray-600 font-bold rounded-xl hover:bg-gray-200 transition-colors"
            >
              New Code
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
}