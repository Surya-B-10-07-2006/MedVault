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

// Generate Code Button Component
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
    <div className="space-y-3">
      <button
        onClick={generateCode}
        disabled={loading}
        className="w-full py-5 bg-medGrey hover:bg-medBlue/5 text-medDark font-black text-[11px] uppercase tracking-[0.2em] rounded-[2rem] border border-gray-100 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
      >
        <Key className="w-5 h-5 text-medBlue" /> 
        {loading ? 'Generating...' : 'Generate Access Code'}
      </button>
      {code && (
        <div className="p-4 bg-medBlue/5 rounded-2xl border border-medBlue/10">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Share Code</p>
          <p className="text-2xl font-black text-medBlue tracking-[0.3em] text-center">{code}</p>
        </div>
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
            <div className="absolute left-6 top-1/2 -translate-y-1/2 w-10 h-10 bg-medGrey rounded-xl flex items-center justify-center group-focus-within:bg-medBlue/10 transition-colors">
              <Search className="w-5 h-5 text-gray-400 group-focus-within:text-medBlue" />
            </div>
            <input
              type="text"
              placeholder="Search by title, clinical tag, or date..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-20 pr-10 py-5 rounded-[2.5rem] border-none bg-white shadow-2xl shadow-slate-200/50 focus:ring-4 focus:ring-medBlue/5 font-bold text-medDark italic"
            />
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <div className="flex bg-white p-2 rounded-2xl shadow-xl shadow-slate-200/50 border border-gray-100">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-3 rounded-xl transition-all ${viewMode === 'grid' ? 'bg-medBlue text-white shadow-lg shadow-medBlue/20' : 'text-gray-400 hover:bg-medGrey'}`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-3 rounded-xl transition-all ${viewMode === 'list' ? 'bg-medBlue text-white shadow-lg shadow-medBlue/20' : 'text-gray-400 hover:bg-medGrey'}`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center gap-3 bg-white p-2 rounded-2xl shadow-xl shadow-slate-200/50 border border-gray-100">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="bg-transparent border-none text-[10px] font-black uppercase tracking-widest text-medDark focus:ring-0 cursor-pointer pl-4 py-2"
              >
                <option value="all">Categories: All</option>
                <option value="pdf">Type: PDF</option>
                <option value="image">Type: Image</option>
              </select>
              <div className="w-px h-6 bg-gray-100"></div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent border-none text-[10px] font-black uppercase tracking-widest text-medDark focus:ring-0 cursor-pointer pr-4 py-2"
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
            {[1, 2, 3, 4, 8].map(i => <div key={i} className="h-80 w-full bg-white rounded-[3rem] animate-pulse border border-gray-100"></div>)}
          </div>
        ) : filteredRecords.length === 0 ? (
          <div className="py-40 text-center">
            <div className="w-32 h-32 bg-medGrey rounded-[3rem] flex items-center justify-center mx-auto mb-8 shadow-inner ring-8 ring-white">
              <FileSearch className="w-14 h-14 text-gray-200" />
            </div>
            <h3 className="text-3xl font-black text-medDark mb-3 italic">Vault Sector Empty</h3>
            <p className="text-gray-400 font-bold italic">No records match your current security filters.</p>
          </div>
        ) : viewMode === 'grid' ? (
          <section className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredRecords.map((record, idx) => (
              <motion.div
                key={record._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="group bg-white rounded-[3rem] p-8 border border-gray-100 shadow-xl shadow-slate-200/50 hover:shadow-medBlue/10 transition-all flex flex-col justify-between relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-medBlue/5 rounded-bl-[4rem] group-hover:bg-medBlue/10 transition-colors"></div>

                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-8">
                    <div className="w-16 h-16 bg-medGrey rounded-2xl flex items-center justify-center text-medDark font-black text-[10px] uppercase shadow-inner group-hover:rotate-6 transition-transform">
                      {record.fileType.includes('pdf') ? 'PDF' : 'IMG'}
                    </div>
                    <button onClick={() => handleDelete(record._id)} className="p-3 text-gray-200 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>

                  <h4 className="text-lg font-black text-medDark leading-tight mb-3 truncate group-hover:text-medBlue transition-colors italic">
                    {record.originalName}
                  </h4>

                  <div className="space-y-2.5">
                    <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-tighter">
                      <Calendar className="w-3.5 h-3.5 text-medTeal" /> {new Date(record.createdAt).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-tighter">
                      <ShieldCheck className="w-3.5 h-3.5 text-medBlue" /> Verified Record
                    </div>
                  </div>
                </div>

                <div className="relative z-10 grid grid-cols-2 gap-3 mt-10">
                  <button
                    onClick={() => setSelectedRecord(record)}
                    className="py-4 bg-medGrey text-medDark font-black text-[10px] uppercase tracking-widest rounded-2xl hover:bg-medBlue hover:text-white transition-all shadow-sm flex items-center justify-center gap-2"
                  >
                    <Eye className="w-4 h-4" /> Inspect
                  </button>
                  <button
                    onClick={() => handleDownload(record._id, record.originalName)}
                    className="py-4 bg-medGrey text-medDark font-black text-[10px] uppercase tracking-widest rounded-2xl hover:bg-medTeal hover:text-white transition-all shadow-sm flex items-center justify-center gap-2"
                  >
                    <Download className="w-4 h-4" /> Fetch
                  </button>
                </div>
              </motion.div>
            ))}
          </section>
        ) : (
          <section className="bg-white rounded-[3rem] border border-gray-100 shadow-2xl shadow-slate-200/50 overflow-hidden divide-y divide-gray-50">
            {filteredRecords.map((record, idx) => (
              <motion.div
                key={record._id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.03 }}
                className="p-6 hover:bg-medGrey/30 transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-6">
                  <div className="w-14 h-14 bg-medGrey rounded-2xl flex items-center justify-center text-medDark font-black text-[9px] uppercase group-hover:bg-medBlue group-hover:text-white transition-colors shadow-inner">
                    {record.fileType.includes('pdf') ? 'PDF' : 'IMG'}
                  </div>
                  <div>
                    <h4 className="font-black text-medDark italic group-hover:text-medBlue transition-colors">{record.originalName}</h4>
                    <div className="flex items-center gap-4 mt-1">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> {new Date(record.createdAt).toLocaleDateString()}
                      </span>
                      <span className="w-1 h-1 bg-gray-200 rounded-full"></span>
                      <span className="text-[10px] font-black text-medTeal uppercase italic">Authorized</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button onClick={() => setSelectedRecord(record)} className="p-3 bg-white border border-gray-100 rounded-xl text-gray-400 hover:text-medBlue hover:border-medBlue transition-all shadow-sm">
                    <Eye className="w-5 h-5" />
                  </button>
                  <button onClick={() => handleDownload(record._id, record.originalName)} className="p-3 bg-white border border-gray-100 rounded-xl text-gray-400 hover:text-medTeal hover:border-medTeal transition-all shadow-sm">
                    <Download className="w-5 h-5" />
                  </button>
                  <button onClick={() => handleDelete(record._id)} className="p-3 bg-white border border-gray-100 rounded-xl text-gray-400 hover:text-rose-500 hover:border-rose-100 hover:bg-rose-50 transition-all shadow-sm">
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
              className="relative w-full max-w-6xl h-[85vh] bg-white rounded-[4rem] shadow-2xl overflow-hidden flex flex-col md:flex-row pointer-events-auto border border-white/20"
            >
              <button
                onClick={() => setSelectedRecord(null)}
                className="absolute top-8 right-8 z-50 p-3 bg-white/80 hover:bg-white rounded-full text-medDark shadow-2xl transition-all active:scale-95"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="flex-1 bg-medGrey/30 p-12 flex flex-col items-center justify-center text-center overflow-auto border-r border-gray-50 relative">
                <div className="absolute top-10 left-10 flex items-center gap-2">
                  <div className="w-2 h-2 bg-medTeal rounded-full animate-pulse"></div>
                  <span className="text-[10px] font-black text-medDark uppercase tracking-widest italic">Live Encrypted Stream</span>
                </div>

                <div className="w-40 h-40 bg-white rounded-[2.5rem] shadow-2xl flex items-center justify-center mb-10 scale-125 ring-8 ring-white">
                  <FileText className="w-20 h-20 text-medBlue" />
                </div>

                <h2 className="text-4xl font-black text-medDark mb-4 italic tracking-tighter leading-tight px-10">
                  {selectedRecord.originalName}
                </h2>
                <p className="text-[11px] font-black text-gray-400 uppercase tracking-[0.3em] mb-12">
                  Node ID: {selectedRecord._id.toUpperCase()}
                </p>

                <div className="grid grid-cols-2 gap-4 w-full max-w-md">
                  <div className="p-6 bg-white rounded-3xl border border-gray-50 shadow-sm">
                    <p className="text-[9px] font-black text-gray-300 uppercase mb-2 tracking-widest">Extension</p>
                    <p className="text-sm font-black text-medDark uppercase tracking-widest">{selectedRecord.fileType.split('/')[1]}</p>
                  </div>
                  <div className="p-6 bg-white rounded-3xl border border-gray-100 shadow-sm">
                    <p className="text-[9px] font-black text-gray-300 uppercase mb-2 tracking-widest">Security</p>
                    <p className="text-sm font-black text-medTeal uppercase tracking-widest">AES-256</p>
                  </div>
                </div>
              </div>

              <div className="w-full md:w-96 p-12 bg-white flex flex-col justify-between">
                <div>
                  <h3 className="text-xs font-black text-gray-300 uppercase tracking-[0.3em] mb-10 italic">Secure Metadata</h3>

                  <div className="space-y-8">
                    <div className="flex gap-4">
                      <div className="w-10 h-10 bg-medGrey rounded-xl flex items-center justify-center text-medBlue flex-shrink-0">
                        <Clock className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-gray-300 uppercase tracking-tighter mb-1">Time Logged</p>
                        <p className="text-sm font-black text-medDark italic">{new Date(selectedRecord.createdAt).toLocaleString()}</p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="w-10 h-10 bg-medGrey rounded-xl flex items-center justify-center text-medTeal flex-shrink-0">
                        <User className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-gray-300 uppercase tracking-tighter mb-1">Creator</p>
                        <p className="text-sm font-black text-medDark italic">{selectedRecord.uploadedBy?.name || 'Vault Master'}</p>
                      </div>
                    </div>

                    <div className="p-6 bg-medGrey/50 rounded-3xl border border-gray-50 italic">
                      <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-3">Medical Summary</p>
                      <p className="text-xs font-bold text-gray-500 leading-relaxed italic">
                        "{selectedRecord.description || 'No clinical context provided for this record.'}"
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 pt-10 border-t border-gray-50">
                  <Button
                    onClick={() => handleDownload(selectedRecord._id, selectedRecord.originalName)}
                    className="w-full py-5 rounded-[2rem] flex items-center justify-center gap-2 shadow-2xl shadow-medBlue/20"
                  >
                    <Download className="w-5 h-5" /> Secure Download
                  </Button>
                  <GenerateCodeButton recordId={selectedRecord._id} />
                  <button
                    onClick={() => handleDelete(selectedRecord._id)}
                    className="w-full py-4 text-rose-500 font-black text-[10px] uppercase tracking-[0.3em] hover:bg-rose-50 rounded-2xl transition-all italic underline-offset-8 underline"
                  >
                    Purge Record
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
