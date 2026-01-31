import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  Search,
  Mail,
  ShieldCheck,
  ChevronRight,
  Activity,
  UserCircle,
  Stethoscope,
  Filter,
  FileSearch,
  Plus
} from 'lucide-react';
import Layout from '../components/Layout';
import api from '../utils/api';
import { toast } from 'react-hot-toast';

export default function DoctorPatients() {
  const [patients, setPatients] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);

  useEffect(() => {
    fetchPatients();
  }, []);

  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      if (searchTerm.trim().length >= 2) {
        searchPatients();
      } else {
        setShowSearchResults(false);
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(delayedSearch);
  }, [searchTerm]);

  const fetchPatients = async () => {
    try {
      const { data } = await api.get('/doctor/patients');
      setPatients(data.patients || []);
    } catch (err) {
      toast.error('Failed to load patient list');
    } finally {
      setLoading(false);
    }
  };

  const searchPatients = async () => {
    if (searchTerm.trim().length < 2) return;
    
    setSearching(true);
    try {
      const { data } = await api.get(`/doctor/search-patients?name=${encodeURIComponent(searchTerm)}`);
      setSearchResults(data.patients || []);
      setShowSearchResults(true);
    } catch (err) {
      toast.error('Failed to search patients');
    } finally {
      setSearching(false);
    }
  };

  const requestAccess = async (patientId) => {
    try {
      await api.post('/doctor/request', {
        patientId,
        message: 'Requesting access to your medical records for consultation.'
      });
      toast.success('Access request sent successfully!');
    } catch (err) {
      if (err.response?.status === 400 && err.response?.data?.message?.includes('already sent')) {
        toast.error('Access request already pending for this patient');
      } else {
        toast.error(err.response?.data?.message || 'Failed to send access request');
      }
    }
  };

  const displayPatients = showSearchResults ? searchResults : patients.filter(p =>
    p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout title="Patient Directory">
      <div className="space-y-10 pb-24">
        {/* Header Section */}
        <section className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-medTeal shadow-xl shadow-medTeal/20 rounded-2xl flex items-center justify-center text-white">
              <Users className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-medDark tracking-tight italic">My Patients</h1>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2 mt-0.5">
                <ShieldCheck className="w-4 h-4 text-medTeal" /> Active Consultations
              </p>
            </div>
          </div>
          <div className="relative group flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-medBlue" />
            <input
              type="text"
              placeholder="Search all patients by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-6 py-4 rounded-[1.5rem] border-none bg-white shadow-xl shadow-slate-200/50 focus:ring-4 focus:ring-medBlue/10 font-bold text-sm"
            />
            {searching && (
              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                <div className="w-4 h-4 border-2 border-medBlue border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
          </div>
        </section>

        {/* Content List */}
        <div className="bg-white rounded-[3rem] border border-gray-100 shadow-2xl shadow-slate-200/50 overflow-hidden">
          {showSearchResults && searchTerm && (
            <div className="px-8 py-4 bg-medBlue/5 border-b border-medBlue/10">
              <p className="text-sm font-bold text-medBlue">
                Search results for "{searchTerm}" ({searchResults.length} found)
              </p>
            </div>
          )}
          
          <AnimatePresence mode="wait">
            {loading ? (
              <div key="loader" className="p-24 text-center">
                <span className="inline-block w-8 h-8 border-4 border-medBlue border-t-transparent rounded-full animate-spin"></span>
              </div>
            ) : displayPatients.length === 0 ? (
              <div key="empty" className="py-32 text-center px-10">
                <FileSearch className="w-20 h-20 text-gray-200 mx-auto mb-6" />
                <h3 className="text-2xl font-black text-medDark mb-2 italic">
                  {showSearchResults ? 'No patients found' : 'No active patients found'}
                </h3>
                <p className="text-gray-400 font-medium">
                  {showSearchResults 
                    ? 'Try searching with a different name or check spelling.'
                    : 'Patients who share their records with you will automatically appear in this directory.'
                  }
                </p>
              </div>
            ) : (
              <div key="list" className="divide-y divide-gray-50">
                {displayPatients.map((p, idx) => {
                  const isExistingPatient = patients.some(patient => patient._id === p._id);
                  return (
                    <motion.div
                      key={p._id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.03 }}
                      className="p-8 hover:bg-medGrey/30 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-6 group"
                    >
                      <div className="flex items-center gap-7">
                        <div className="w-16 h-16 rounded-[2rem] bg-white border border-gray-100 shadow-xl overflow-hidden group-hover:scale-110 transition-transform p-1">
                          <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${p.name}`} className="w-full h-full object-cover rounded-[1.5rem]" />
                        </div>
                        <div>
                          <h4 className="text-xl font-black text-medDark group-hover:text-medBlue transition-colors">{p.name}</h4>
                          <div className="flex items-center gap-4 mt-2">
                            <span className="flex items-center gap-1.5 text-xs font-bold text-gray-400 uppercase tracking-tighter">
                              <Mail className="w-3.5 h-3.5 text-medTeal" /> {p.email}
                            </span>
                            <span className="w-1 h-1 bg-gray-200 rounded-full"></span>
                            <span className="text-[10px] font-black italic text-medTeal uppercase italic">Patient ID: {p._id.slice(-6).toUpperCase()}</span>
                            {!isExistingPatient && (
                              <span className="px-2 py-1 bg-orange-100 text-orange-600 text-[10px] font-black rounded-full uppercase">New</span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        {isExistingPatient ? (
                          <>
                            <button className="flex items-center gap-2 px-6 py-3 bg-white text-medDark font-black text-xs uppercase tracking-widest rounded-2xl border border-gray-100 shadow-sm hover:bg-medBlue hover:text-white hover:border-medBlue transition-all">
                              <Stethoscope className="w-4 h-4" /> Medical History
                            </button>
                            <button className="p-3 bg-medGrey text-gray-400 rounded-xl hover:bg-medBlue hover:text-white transition-all">
                              <ChevronRight className="w-6 h-6" />
                            </button>
                          </>
                        ) : (
                          <>
                            <button 
                              onClick={() => requestAccess(p._id)}
                              className="flex items-center gap-2 px-6 py-3 bg-medTeal text-white font-black text-xs uppercase tracking-widest rounded-2xl shadow-sm hover:bg-medTeal/90 transition-all"
                            >
                              <Plus className="w-4 h-4" /> Request Access
                            </button>
                          </>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </Layout>
  );
}
