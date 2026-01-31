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
          <div className="w-20 h-20 grad-hero rounded-[2rem] flex items-center justify-center text-white mx-auto shadow-2xl shadow-medBlue/20 mb-8 border border-white/20">
            <LockKeyhole className="w-10 h-10" />
          </div>
          <h1 className="text-4xl font-black text-medDark tracking-tight italic uppercase italic">Authorized Access Portal</h1>
          <p className="text-gray-500 font-bold mt-2 uppercase text-xs tracking-[0.2em] flex items-center justify-center gap-2">
            <ShieldCheck className="w-4 h-4 text-medTeal" /> HIPAA & GDPR Secure Protocol
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-12">
          {/* Form Area */}
          <div className="lg:col-span-3">
            <motion.form
              onSubmit={handleRequest}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass p-10 rounded-[3rem] border-white/50 shadow-2xl shadow-medBlue/5 space-y-8"
            >
              <div className="space-y-3">
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Search Patient by Name</label>
                <div className="relative group">
                  <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-medBlue transition-colors" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Type patient name to search..."
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
                  <div className="mt-2 bg-white rounded-2xl border border-gray-100 shadow-lg max-h-60 overflow-y-auto">
                    {searchResults.map((patient) => (
                      <button
                        key={patient._id}
                        onClick={() => selectPatient(patient)}
                        className="w-full p-4 text-left hover:bg-medGrey/30 transition-colors flex items-center gap-3 border-b border-gray-50 last:border-b-0"
                      >
                        <div className="w-10 h-10 rounded-xl bg-medBlue/10 flex items-center justify-center">
                          <User className="w-5 h-5 text-medBlue" />
                        </div>
                        <div>
                          <p className="font-bold text-medDark">{patient.name}</p>
                          <p className="text-xs text-gray-500">{patient.email}</p>
                        </div>
                        <Plus className="w-4 h-4 text-medTeal ml-auto" />
                      </button>
                    ))}
                  </div>
                )}
                
                {/* Selected Patient */}
                {selectedPatient && (
                  <div className="mt-2 p-4 bg-medTeal/10 rounded-2xl border border-medTeal/20">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-medTeal flex items-center justify-center">
                        <User className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-bold text-medDark">Selected: {selectedPatient.name}</p>
                        <p className="text-xs text-gray-600">{selectedPatient.email}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Patient Identifier (Auto-filled)</label>
                <div className="relative group">
                  <User className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-medBlue transition-colors" />
                  <input
                    type="text"
                    value={patientId}
                    onChange={(e) => setPatientId(e.target.value)}
                    required
                    placeholder="Select patient above or enter ID manually"
                    className="w-full pl-14 pr-6 py-4 rounded-3xl bg-medGrey/50 border-none focus:ring-4 focus:ring-medBlue/10 font-bold text-medDark placeholder:text-gray-300"
                    readOnly={!!selectedPatient}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Requested File Archive ID (Optional)</label>
                <div className="relative group">
                  <FileText className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-medBlue transition-colors" />
                  <input
                    type="text"
                    value={recordId}
                    onChange={(e) => setRecordId(e.target.value)}
                    placeholder="Leave empty for general access request"
                    className="w-full pl-14 pr-6 py-4 rounded-3xl bg-medGrey/50 border-none focus:ring-4 focus:ring-medBlue/10 font-bold text-medDark placeholder:text-gray-300"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Clinical Context / Note</label>
                <div className="relative group">
                  <MessageSquare className="absolute left-5 top-6 w-4 h-4 text-gray-400 group-focus-within:text-medBlue transition-colors" />
                  <textarea
                    value={requestMessage}
                    onChange={(e) => setRequestMessage(e.target.value)}
                    rows={3}
                    className="w-full pl-14 pr-6 py-5 rounded-[2rem] bg-medGrey/50 border-none focus:ring-4 focus:ring-medBlue/10 font-bold text-medDark placeholder:text-gray-300 italic"
                    placeholder="Brief reason for clinical record request..."
                  />
                </div>
              </div>

              <Button
                type="submit"
                loading={loading}
                className="w-full py-5 rounded-[2rem] shadow-xl shadow-medBlue/20 flex items-center justify-center gap-3"
              >
                <Send className="w-5 h-5" /> Submit Authorized Request
              </Button>
            </motion.form>
          </div>

          {/* Info Area */}
          <div className="lg:col-span-2 space-y-8">
            <div className="p-8 bg-medDark rounded-[3rem] text-white shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-medBlue/20 rounded-full blur-3xl -mr-16 -mt-16"></div>
              <Info className="w-10 h-10 mb-6 text-medTeal" />
              <h3 className="text-xl font-black mb-4 italic tracking-tight uppercase">How it works</h3>
              <ul className="space-y-4 text-sm font-medium text-white/70 italic">
                <li className="flex gap-3">
                  <CheckCircle2 className="w-5 h-5 text-medTeal flex-shrink-0" />
                  Search for patients by name using the search box.
                </li>
                <li className="flex gap-3">
                  <CheckCircle2 className="w-5 h-5 text-medTeal flex-shrink-0" />
                  Select a patient or enter their Vault ID manually.
                </li>
                <li className="flex gap-3">
                  <CheckCircle2 className="w-5 h-5 text-medTeal flex-shrink-0" />
                  Optionally specify a record ID, or leave empty for general access.
                </li>
                <li className="flex gap-3">
                  <CheckCircle2 className="w-5 h-5 text-medTeal flex-shrink-0" />
                  Patient will receive your request and can approve access.
                </li>
              </ul>
            </div>

            <div className="p-8 bg-amber-50 rounded-[3rem] border border-amber-100 flex gap-4 shadow-xl shadow-amber-500/5">
              <AlertCircle className="w-8 h-8 text-amber-500 flex-shrink-0" />
              <p className="text-xs font-bold text-amber-900 leading-relaxed italic">
                Access requests are audited and recorded permanently in the patient's medical history. Misuse of access may lead to license revocation.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
