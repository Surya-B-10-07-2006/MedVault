import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LockKeyhole,
  User,
  FileText,
  MessageSquare,
  Send,
  ShieldCheck,
  Info,
  CheckCircle2,
  AlertCircle,
  Search,
  Mail,
  Plus
} from 'lucide-react';
import Layout from '../components/Layout';
import api from '../utils/api';
import { toast } from 'react-hot-toast';
import Button from '../components/Button';

export default function DoctorRequestAccess() {
  const [patientId, setPatientId] = useState('');
  const [recordId, setRecordId] = useState('');
  const [requestMessage, setRequestMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);

  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      if (searchTerm.trim().length >= 2) {
        searchPatients();
      } else {
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(delayedSearch);
  }, [searchTerm]);

  const searchPatients = async () => {
    if (searchTerm.trim().length < 2) return;

    setSearching(true);
    try {
      const { data } = await api.get(`/doctor/search-patients?name=${encodeURIComponent(searchTerm)}`);
      setSearchResults(data.patients || []);
    } catch (err) {
      toast.error('Failed to search patients');
    } finally {
      setSearching(false);
    }
  };

  const selectPatient = (patient) => {
    setSelectedPatient(patient);
    setPatientId(patient._id);
    setSearchTerm('');
    setSearchResults([]);
  };

  const handleRequest = async (e) => {
    e.preventDefault();
    if (!patientId) {
      toast.error('Patient selection is required');
      return;
    }

    setLoading(true);
    try {
      await api.post('/doctor/request', {
        patientId,
        recordId: recordId || null,
        message: requestMessage || 'Requesting access to your medical records for consultation.'
      });
      toast.success('Access request submitted successfully!');
      setRecordId('');
      setPatientId('');
      setRequestMessage('');
      setSelectedPatient(null);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout title="Request Secure Access">
      <div className="max-w-4xl mx-auto pb-24">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="w-20 h-20 mesh-gradient-dark rounded-[2rem] flex items-center justify-center text-white mx-auto shadow-2xl shadow-slate-900/20 mb-8 border border-white/20 group hover:rotate-6 transition-transform">
            <LockKeyhole className="w-10 h-10 text-teal-400 group-hover:scale-110 transition-transform" />
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight italic uppercase italic">Authorized Access Portal</h1>
          <p className="text-slate-500 font-bold mt-2 uppercase text-[10px] tracking-[0.3em] flex items-center justify-center gap-2 italic">
            <ShieldCheck className="w-4 h-4 text-teal-500" /> HIPAA & GDPR Secure Protocol
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-12">
          {/* Form Area */}
          <div className="lg:col-span-3">
            <motion.form
              onSubmit={handleRequest}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-md p-10 rounded-[3rem] border-white/60 shadow-2xl shadow-slate-200/40 space-y-8"
            >
              <div className="space-y-3">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 leading-none">Search Patient by Name</label>
                <div className="relative group/field">
                  <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within/field:text-blue-500 transition-colors" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Type patient name to search..."
                    className="w-full pl-14 pr-6 py-4 rounded-3xl bg-slate-50/50 border border-slate-100 focus:bg-white focus:ring-8 focus:ring-blue-500/5 focus:border-blue-500 font-bold text-slate-900 outline-none transition-all italic"
                  />
                  {searching && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2">
                      <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  )}
                </div>

                {/* Search Results */}
                {searchResults.length > 0 && (
                  <div className="mt-2 bg-white rounded-2xl border border-slate-100 shadow-xl max-h-60 overflow-y-auto no-scrollbar">
                    {searchResults.map((patient) => (
                      <button
                        key={patient._id}
                        onClick={() => selectPatient(patient)}
                        className="w-full p-4 text-left hover:bg-slate-50 transition-colors flex items-center gap-4 border-b border-slate-50 last:border-b-0 group/item"
                      >
                        <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center group-hover/item:bg-blue-600 transition-colors">
                          <User className="w-5 h-5 text-slate-400 group-hover/item:text-white" />
                        </div>
                        <div>
                          <p className="font-black text-slate-900 uppercase italic text-sm tracking-tight">{patient.name}</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{patient.email}</p>
                        </div>
                        <Plus className="w-4 h-4 text-teal-400 ml-auto group-hover/item:scale-125 transition-transform" />
                      </button>
                    ))}
                  </div>
                )}

                {/* Selected Patient */}
                {selectedPatient && (
                  <div className="mt-2 p-5 bg-teal-500/10 rounded-2xl border border-teal-500/20 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-teal-500/5 rounded-full blur-2xl group-hover:scale-150 transition-transform"></div>
                    <div className="flex items-center justify-between relative z-10">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-teal-500 flex items-center justify-center text-white shadow-lg">
                          <User className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="font-black text-slate-900 uppercase italic tracking-tight">Selected: {selectedPatient.name}</p>
                          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{selectedPatient.email}</p>
                        </div>
                      </div>
                      <button onClick={() => setSelectedPatient(null)} className="text-slate-300 hover:text-rose-500 transition-colors font-black text-[10px] uppercase tracking-widest">Remove</button>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 leading-none">Patient Identifier (Auto-filled)</label>
                <div className="relative group/field">
                  <User className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within/field:text-blue-500 transition-colors" />
                  <input
                    type="text"
                    value={patientId}
                    onChange={(e) => setPatientId(e.target.value)}
                    required
                    placeholder="Select patient above or enter ID manually"
                    className="w-full pl-14 pr-6 py-4 rounded-3xl bg-slate-50/50 border border-slate-100 focus:bg-white focus:ring-8 focus:ring-blue-500/5 focus:border-blue-500 font-bold text-slate-900 outline-none transition-all placeholder:text-slate-300"
                    readOnly={!!selectedPatient}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 leading-none">Requested File Archive ID (Optional)</label>
                <div className="relative group/field">
                  <FileText className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within/field:text-blue-500 transition-colors" />
                  <input
                    type="text"
                    value={recordId}
                    onChange={(e) => setRecordId(e.target.value)}
                    placeholder="Leave empty for general access request"
                    className="w-full pl-14 pr-6 py-4 rounded-3xl bg-slate-50/50 border border-slate-100 focus:bg-white focus:ring-8 focus:ring-blue-500/5 focus:border-blue-500 font-bold text-slate-900 outline-none transition-all placeholder:text-slate-300"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 leading-none">Clinical Context / Note</label>
                <div className="relative group/field">
                  <MessageSquare className="absolute left-5 top-6 w-4 h-4 text-slate-400 group-focus-within/field:text-blue-500 transition-colors" />
                  <textarea
                    value={requestMessage}
                    onChange={(e) => setRequestMessage(e.target.value)}
                    rows={3}
                    className="w-full pl-14 pr-6 py-6 rounded-[2.5rem] bg-slate-50/50 border border-slate-100 focus:bg-white focus:ring-8 focus:ring-blue-500/5 focus:border-blue-500 font-bold text-slate-900 outline-none transition-all italic placeholder:text-slate-300"
                    placeholder="Brief reason for clinical record request..."
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-6 bg-slate-900 text-white font-black rounded-[2.5rem] shadow-2xl shadow-slate-900/20 flex items-center justify-center gap-4 active:scale-95 transition-all italic uppercase tracking-widest hover:bg-blue-600"
              >
                {loading ? 'Transmitting...' : <><Send className="w-5 h-5 text-teal-400" /> Submit Authorized Request</>}
              </button>
            </motion.form>
          </div>

          {/* Info Area */}
          <div className="lg:col-span-2 space-y-8">
            <div className="p-10 mesh-gradient-dark rounded-[4rem] text-white shadow-2xl relative overflow-hidden group border border-white/5">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-1000"></div>
              <Info className="w-12 h-12 mb-8 text-teal-400 opacity-50" />
              <h3 className="text-2xl font-black mb-6 italic tracking-tight uppercase">Protocol <br /> Instructions</h3>
              <ul className="space-y-6 text-[12px] font-bold text-slate-400 italic">
                <li className="flex gap-4">
                  <CheckCircle2 className="w-5 h-5 text-teal-500 flex-shrink-0" />
                  Search for patients by name using the global node registry.
                </li>
                <li className="flex gap-4">
                  <CheckCircle2 className="w-5 h-5 text-teal-500 flex-shrink-0" />
                  Select a specific patient identity to secure their Vault ID.
                </li>
                <li className="flex gap-4">
                  <CheckCircle2 className="w-5 h-5 text-teal-500 flex-shrink-0" />
                  Optionally specify a file archive ID for precise diagnostic retrieval.
                </li>
                <li className="flex gap-4">
                  <CheckCircle2 className="w-5 h-5 text-teal-500 flex-shrink-0" />
                  Patient nodes will receive your request via secure notification.
                </li>
              </ul>
            </div>

            <div className="p-10 bg-white rounded-[4rem] border border-slate-100 flex gap-6 shadow-xl shadow-slate-200/40 relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-1.5 h-full bg-amber-500 opacity-50"></div>
              <AlertCircle className="w-10 h-10 text-amber-500 flex-shrink-0" />
              <div>
                <h4 className="font-black text-slate-900 text-[10px] uppercase tracking-widest mb-2 italic">Legal Advisory</h4>
                <p className="text-[11px] font-bold text-slate-500 leading-relaxed italic uppercase tracking-tight">
                  Access requests are audited and recorded permanently in the patient's medical history. Unauthorized access may lead to immediate license revocation and legal prosecution.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
