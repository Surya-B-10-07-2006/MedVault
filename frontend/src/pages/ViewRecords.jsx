import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Grid,
  List,
  FileText,
  Download,
  Share2,
  Trash2,
  Eye,
  Calendar,
  User,
  MoreVertical,
  X,
  FileSearch,
  ChevronDown,
  ShieldCheck,
  MoreHorizontal,
  Clock,
  ExternalLink,
  Key
} from 'lucide-react';
import Layout from '../components/Layout';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import Button from '../components/Button';

function GenerateCodeButton({ recordId }) {
  const [code, setCode] = useState(null);
  const [loading, setLoading] = useState(false);

  const generateCode = async () => {
    setLoading(true);
    try {
      const { data } = await api.post(`/code/generate/${recordId}`);
      setCode(data.shareCode);
      toast.success('Access code generated!');
    } catch (error) {
      toast.error('Failed to generate code');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <button
        onClick={generateCode}
        disabled={loading}
        className="w-full py-5 bg-slate-900 hover:bg-slate-800 text-white font-black text-[11px] uppercase tracking-[0.3em] rounded-2xl md:rounded-3xl shadow-xl flex items-center justify-center gap-3 transition-all active:scale-95 disabled:opacity-50 italic"
      >
        <Key className="w-5 h-5 text-teal-400" />
        {loading ? 'Initializing...' : 'Generate Vault Key'}
      </button>
      {code && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 bg-teal-500/5 rounded-[2rem] border border-teal-500/10 shadow-inner text-center"
        >
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.4em] mb-3 italic">Authorized Key</p>
          <p className="text-3xl font-black text-slate-900 tracking-[0.5em] font-mono">{code}</p>
        </motion.div>
      )}
    </div>
  );
}

export default function ViewRecords() {
  const [records, setRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState('grid');
  const [selectedRecord, setSelectedRecord] = useState(null);

  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const search = params.get('search');
    if (search) setSearchTerm(search);
    fetchRecords();
  }, [location.search]);

  useEffect(() => {
    let results = records.filter(record =>
      record.originalName.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (filterType === 'all' || record.fileType.toLowerCase().includes(filterType.toLowerCase()))
    );

    results.sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.createdAt) - new Date(a.createdAt);
      if (sortBy === 'oldest') return new Date(a.createdAt) - new Date(b.createdAt);
      if (sortBy === 'name') return a.originalName.localeCompare(b.originalName);
      return 0;
    });

    setFilteredRecords(results);
  }, [searchTerm, filterType, sortBy, records]);

  const fetchRecords = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/records/my-records');
      setRecords(data.records || []);
    } catch (err) {
      toast.error('Failed to load records from vault');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (id, name) => {
    try {
      const response = await api.get(`/records/download/${id}`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', name);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success('Download initialized');
    } catch (err) {
      toast.error('Secure download failed');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to permanently delete this record? This action cannot be undone.')) return;
    try {
      await api.delete(`/records/${id}`);
      toast.success('Record purged from vault');
      setRecords(prev => prev.filter(r => r._id !== id));
      if (selectedRecord?._id === id) setSelectedRecord(null);
    } catch (err) {
      toast.error('Deletion failed');
    }
  };

  return (
    <Layout title="Medical Vault Library">
      <div className="space-y-10 pb-24">

        {/* TOP CONTROLS */}
        <section className="flex flex-col xl:flex-row gap-6 xl:items-center justify-between">
          <div className="relative flex-1 max-w-2xl group">
            <div className="absolute left-6 top-1/2 -translate-y-1/2 w-10 h-10 bg-slate-100 rounded-2xl flex items-center justify-center group-focus-within:bg-blue-500/10 transition-colors">
              <Search className="w-5 h-5 text-slate-400 group-focus-within:text-blue-600" />
            </div>
            <input
              type="text"
              placeholder="Search by title, clinical tag, or date..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-20 pr-10 py-5 rounded-[2.5rem] border-transparent bg-white shadow-2xl shadow-slate-200/50 focus:ring-4 focus:ring-blue-500/5 focus:border-blue-200/50 font-bold text-slate-800 placeholder:text-slate-400"
            />
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <div className="flex bg-white p-2 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-3 rounded-xl transition-all ${viewMode === 'grid' ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'text-slate-400 hover:bg-slate-50'}`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-3 rounded-xl transition-all ${viewMode === 'list' ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'text-slate-400 hover:bg-slate-50'}`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center gap-3 bg-white p-2 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="bg-transparent border-none text-[10px] font-black uppercase tracking-widest text-slate-600 focus:ring-0 cursor-pointer pl-4 py-2"
              >
                <option value="all">Categories: All</option>
                <option value="pdf">Type: PDF</option>
                <option value="image">Type: Image</option>
              </select>
              <div className="w-px h-6 bg-slate-100"></div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent border-none text-[10px] font-black uppercase tracking-widest text-slate-600 focus:ring-0 cursor-pointer pr-4 py-2"
              >
                <option value="newest">Sort: Newest</option>
                <option value="oldest">Sort: Oldest</option>
                <option value="name">Sort: A-Z</option>
              </select>
            </div>
          </div>
        </section>

        {/* CONTENT GRID/LIST */}
        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
              <div key={i} className="h-80 w-full glass-md rounded-[2.5rem] p-8 flex flex-col justify-between overflow-hidden relative">
                <div className="flex justify-between items-start">
                  <div className="w-16 h-16 skeleton rounded-2xl" />
                  <div className="w-10 h-10 skeleton rounded-xl" />
                </div>
                <div className="space-y-3">
                  <div className="h-6 w-3/4 skeleton" />
                  <div className="h-4 w-1/2 skeleton" />
                </div>
                <div className="grid grid-cols-2 gap-3 mt-6">
                  <div className="h-12 skeleton rounded-2xl" />
                  <div className="h-12 skeleton rounded-2xl" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredRecords.length === 0 ? (
          <div className="py-40 text-center glass-md rounded-[3rem] border-dashed border-2 border-slate-200">
            <div className="w-32 h-32 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
              <FileSearch className="w-14 h-14 text-slate-300" />
            </div>
            <h3 className="text-3xl font-black text-slate-800 mb-3 tracking-tight">Vault Sector Empty</h3>
            <p className="text-slate-500 font-medium italic">No records match your current security filters.</p>
          </div>
        ) : viewMode === 'grid' ? (
          <section className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredRecords.map((record, idx) => (
              <motion.div
                key={record._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="group glass-md rounded-[2.5rem] p-8 hover-lift flex flex-col justify-between relative overflow-hidden active:scale-95"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-bl-[4rem] group-hover:bg-blue-500/10 transition-colors"></div>

                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-8">
                    <div className="w-16 h-16 bg-white border border-slate-100 rounded-2xl flex items-center justify-center text-blue-600 font-black text-[10px] uppercase shadow-sm group-hover:rotate-6 transition-transform">
                      {record.fileType.includes('pdf') ? (
                        <FileText className="w-8 h-8" />
                      ) : (
                        <Grid className="w-8 h-8" />
                      )}
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDelete(record._id); }}
                      className="p-3 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>

                  <h4 className="text-lg font-bold text-slate-900 leading-tight mb-3 truncate group-hover:text-blue-600 transition-colors tracking-tight">
                    {record.originalName}
                  </h4>

                  <div className="space-y-2.5">
                    <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      <Calendar className="w-3.5 h-3.5 text-teal-500" /> {new Date(record.createdAt).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      <ShieldCheck className="w-3.5 h-3.5 text-blue-500" /> Verified Record
                    </div>
                  </div>
                </div>

                <div className="relative z-10 grid grid-cols-2 gap-3 mt-10">
                  <button
                    onClick={() => setSelectedRecord(record)}
                    className="py-4 bg-white border border-slate-100 text-slate-700 font-bold text-[10px] uppercase tracking-widest rounded-2xl hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all shadow-sm flex items-center justify-center gap-2"
                  >
                    <Eye className="w-4 h-4" /> Inspect
                  </button>
                  <button
                    onClick={() => handleDownload(record._id, record.originalName)}
                    className="py-4 bg-white border border-slate-100 text-slate-700 font-bold text-[10px] uppercase tracking-widest rounded-2xl hover:bg-teal-500 hover:text-white hover:border-teal-500 transition-all shadow-sm flex items-center justify-center gap-2"
                  >
                    <Download className="w-4 h-4" /> Fetch
                  </button>
                </div>
              </motion.div>
            ))}
          </section>
        ) : (
          <section className="glass-md rounded-[3rem] overflow-hidden divide-y divide-slate-100">
            {filteredRecords.map((record, idx) => (
              <motion.div
                key={record._id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.03 }}
                className="p-6 hover:bg-slate-50 transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-6">
                  <div className="w-14 h-14 bg-white border border-slate-100 rounded-2xl flex items-center justify-center text-blue-600 font-bold text-[9px] uppercase group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm">
                    {record.fileType.includes('pdf') ? 'PDF' : 'IMG'}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors tracking-tight">{record.originalName}</h4>
                    <div className="flex items-center gap-4 mt-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> {new Date(record.createdAt).toLocaleDateString()}
                      </span>
                      <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
                      <span className="text-[10px] font-bold text-teal-600 uppercase tracking-widest">Authorized Access</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button onClick={() => setSelectedRecord(record)} className="p-3 bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-blue-600 hover:border-blue-200 transition-all shadow-sm">
                    <Eye className="w-5 h-5" />
                  </button>
                  <button onClick={() => handleDownload(record._id, record.originalName)} className="p-3 bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-teal-600 hover:border-teal-200 transition-all shadow-sm">
                    <Download className="w-5 h-5" />
                  </button>
                  <button onClick={() => handleDelete(record._id)} className="p-3 bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-rose-500 hover:border-rose-200 hover:bg-rose-50 transition-all shadow-sm">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </section>
        )}
      </div>

      {/* PREVIEW MODAL */}
      <AnimatePresence>
        {selectedRecord && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10 pointer-events-none">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-medDark/70 backdrop-blur-xl pointer-events-auto"
              onClick={() => setSelectedRecord(null)}
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 50 }}
              className="relative w-full max-w-6xl h-[90vh] md:h-[85vh] bg-white rounded-[2.5rem] md:rounded-[4rem] shadow-2xl overflow-hidden flex flex-col md:flex-row pointer-events-auto border border-white/20"
            >
              <button
                onClick={() => setSelectedRecord(null)}
                className="absolute top-6 md:top-8 right-6 md:right-8 z-50 p-3 bg-white/80 hover:bg-white rounded-full text-slate-900 shadow-2xl transition-all active:scale-95 border border-slate-100"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="flex-1 bg-slate-50/50 p-8 md:p-12 flex flex-col items-center justify-center text-center overflow-y-auto border-b md:border-b-0 md:border-r border-slate-100 relative">
                <div className="absolute top-8 md:top-10 left-8 md:left-10 flex items-center gap-2">
                  <div className="w-2 h-2 bg-teal-500 rounded-full animate-pulse"></div>
                  <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest italic">Live Encrypted Stream</span>
                </div>

                <div className="w-32 h-32 md:w-40 md:h-40 bg-white rounded-[2rem] md:rounded-[2.5rem] shadow-2xl flex items-center justify-center mb-8 md:mb-10 scale-110 md:scale-125 ring-8 ring-white/50">
                  <FileText className="w-16 h-16 md:w-20 md:h-20 text-blue-600" />
                </div>

                <h2 className="text-2xl md:text-4xl font-black text-slate-900 mb-4 italic tracking-tighter leading-tight px-4 md:px-10 uppercase">
                  {selectedRecord.originalName}
                </h2>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-8 md:mb-12">
                  Node ID: {selectedRecord._id.toUpperCase()}
                </p>

                <div className="grid grid-cols-2 gap-4 w-full max-w-md">
                  <div className="p-4 md:p-6 bg-white rounded-2xl md:rounded-3xl border border-slate-100 shadow-sm">
                    <p className="text-[9px] font-black text-slate-300 uppercase mb-2 tracking-widest leading-none">Extension</p>
                    <p className="text-xs md:text-sm font-black text-slate-900 uppercase tracking-widest italic">{selectedRecord.fileType.split('/')[1]}</p>
                  </div>
                  <div className="p-4 md:p-6 bg-white rounded-2xl md:rounded-3xl border border-slate-100 shadow-sm">
                    <p className="text-[9px] font-black text-slate-300 uppercase mb-2 tracking-widest leading-none">Security</p>
                    <p className="text-xs md:text-sm font-black text-teal-600 uppercase tracking-widest italic">AES-256</p>
                  </div>
                </div>
              </div>

              <div className="w-full md:w-96 p-8 md:p-12 bg-white flex flex-col justify-between overflow-y-auto">
                <div className="space-y-10">
                  <h3 className="text-xs font-black text-slate-300 uppercase tracking-[0.3em] italic leading-none">Secure Metadata</h3>

                  <div className="space-y-6 md:space-y-8">
                    <div className="flex gap-4">
                      <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-blue-600 flex-shrink-0 border border-slate-100">
                        <Clock className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[10px] font-black text-slate-300 uppercase tracking-tighter mb-1">Time Logged</p>
                        <p className="text-sm font-black text-slate-900 italic truncate">{new Date(selectedRecord.createdAt).toLocaleString()}</p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-teal-600 flex-shrink-0 border border-slate-100">
                        <User className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[10px] font-black text-slate-300 uppercase tracking-tighter mb-1">Creator</p>
                        <p className="text-sm font-black text-slate-900 italic truncate">{selectedRecord.uploadedBy?.name || 'Vault Master'}</p>
                      </div>
                    </div>

                    <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 italic relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-16 h-16 bg-blue-500/5 rounded-bl-full"></div>
                      <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-3 leading-none underline">Medical Summary</p>
                      <p className="text-xs font-bold text-slate-500 leading-relaxed italic relative z-10">
                        "{selectedRecord.description || 'No clinical context provided for this record.'}"
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 mt-10 md:mt-0 pt-10 border-t border-slate-100">
                  <button
                    onClick={() => handleDownload(selectedRecord._id, selectedRecord.originalName)}
                    className="w-full py-5 rounded-2xl md:rounded-3xl grad-primary text-white font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 shadow-2xl shadow-blue-500/20 hover:scale-[1.02] active:scale-95 transition-all italic"
                  >
                    <Download className="w-5 h-5" /> Fetch Vault Data
                  </button>
                  <GenerateCodeButton recordId={selectedRecord._id} />
                  <button
                    onClick={() => handleDelete(selectedRecord._id)}
                    className="w-full py-4 text-rose-500 font-black text-[10px] uppercase tracking-[0.3em] hover:bg-rose-50 rounded-2xl transition-all italic underline-offset-8 underline decoration-rose-200"
                  >
                    Purge Terminal Node
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </Layout>
  );
}
