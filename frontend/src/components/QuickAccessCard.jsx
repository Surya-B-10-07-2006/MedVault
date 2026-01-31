import { useState } from 'react';
import { motion } from 'framer-motion';
import { Key, FileText, Download } from 'lucide-react';
import api from '../utils/api';
import { toast } from 'react-hot-toast';

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
      toast.success('Access Granted');
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
      toast.success('Syncing file to local storage');
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
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-md p-6 md:p-10 rounded-[2.5rem] md:rounded-[3.5rem] border-white/60 shadow-2xl shadow-slate-200/40 relative overflow-hidden group/card"
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/5 rounded-bl-full blur-2xl group-hover/card:bg-teal-500/10 transition-colors duration-700"></div>

      <div className="flex items-center gap-5 mb-10 relative z-10">
        <div className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center shadow-2xl group-hover/card:rotate-6 transition-transform">
          <Key className="w-7 h-7 text-teal-400" />
        </div>
        <div>
          <h3 className="text-xl font-black text-slate-900 tracking-tight uppercase italic leading-none">Quick Access</h3>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-2 italic">Sector Vault Entry</p>
        </div>
      </div>

      {!record ? (
        <form onSubmit={accessRecord} className="space-y-8 relative z-10">
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-4 ml-1">Key Authorization</label>
            <div className="relative group/input">
              <Key className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-300 group-focus-within/input:text-teal-500 transition-colors" />
              <input
                type="text"
                value={accessCode}
                onChange={(e) => setAccessCode(e.target.value.replace(/\D/g, '').slice(0, 5))}
                placeholder="_ _ _ _ _"
                className="w-full pl-16 pr-6 py-5 rounded-2xl md:rounded-3xl border border-slate-100 bg-slate-50/50 focus:bg-white focus:ring-8 focus:ring-teal-500/5 focus:border-teal-500 font-black text-2xl md:text-3xl tracking-[0.4em] text-center text-slate-900 outline-none transition-all placeholder:text-slate-200 shadow-inner"
                maxLength={5}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || accessCode.length !== 5}
            className="w-full py-5 rounded-2xl md:rounded-3xl grad-teal text-white font-black uppercase tracking-[0.3em] text-sm shadow-xl shadow-teal-500/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:scale-100 italic"
          >
            {loading ? 'Decrypting...' : 'Initialize Access'}
          </button>
        </form>
      ) : (
        <div className="space-y-8 relative z-10">
          <div className="flex items-center gap-5 p-6 bg-teal-500/5 rounded-3xl border border-teal-500/10">
            <div className="w-16 h-16 grad-primary rounded-2xl flex items-center justify-center shadow-lg shrink-0">
              <FileText className="w-7 h-7 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-black text-slate-900 truncate uppercase italic tracking-tight">{record.originalName}</h4>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Patient: {record.patient.name}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-5 bg-white rounded-2xl border border-slate-100 shadow-sm flex flex-col gap-1">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">Sync Date</span>
              <p className="font-black text-slate-800 text-sm italic">{new Date(record.createdAt).toLocaleDateString()}</p>
            </div>

            <div className="p-5 bg-white rounded-2xl border border-slate-100 shadow-sm flex flex-col gap-1">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">Data Volume</span>
              <p className="font-black text-slate-800 text-sm italic">{(record.fileSize / 1024).toFixed(1)} KB</p>
            </div>
          </div>

          {record.description && (
            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 italic">
              <h5 className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3 leading-none underline">Subject Metadata</h5>
              <p className="text-slate-600 font-bold text-xs leading-relaxed">"{record.description}"</p>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 pt-2">
            <button
              onClick={handleDownload}
              className="flex-1 py-4 rounded-2xl grad-primary text-white font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 shadow-xl shadow-blue-500/20 hover:scale-[1.02] active:scale-95 transition-all outline-none"
            >
              <Download className="w-5 h-5" />
              Download Node
            </button>
            <button
              onClick={resetCard}
              className="px-8 py-4 bg-slate-100 text-slate-500 font-black uppercase tracking-widest text-[10px] rounded-2xl hover:bg-slate-200 transition-all active:scale-95"
            >
              Reset
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
}