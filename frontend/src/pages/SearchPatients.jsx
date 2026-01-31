import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, User, FileText, Calendar, Download, Key } from 'lucide-react';
import Layout from '../components/Layout';
import api from '../utils/api';
import { toast } from 'react-hot-toast';
import Button from '../components/Button';

export default function SearchPatients() {
  const [searchTerm, setSearchTerm] = useState('');
  const [shareCode, setShareCode] = useState('');
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);

  const searchPatients = async () => {
    if (!searchTerm.trim()) {
      toast.error('Please enter a patient name');
      return;
    }

    setLoading(true);
    try {
      const { data } = await api.get(`/doctor/search-patients?name=${searchTerm}`);
      setPatients(data.patients || []);
      if (data.patients?.length === 0) {
        toast.error('No patients found');
      }
    } catch (error) {
      toast.error('Search failed');
      setPatients([]);
    } finally {
      setLoading(false);
    }
  };

  const accessWithCode = async () => {
    if (!searchTerm.trim() || !shareCode.trim()) {
      toast.error('Please enter patient name and access code');
      return;
    }

    setLoading(true);
    try {
      const { data } = await api.post('/code/access', {
        patientName: searchTerm.trim(),
        shareCode: shareCode.trim()
      });
      setRecords([data.record]);
      setSelectedPatient({ name: data.record.patient.name });
      toast.success('Record accessed successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Access denied');
      setRecords([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (recordId, fileName) => {
    try {
      const response = await api.get(`/records/download/${recordId}`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success('Download started');
    } catch (error) {
      toast.error('Download failed');
    }
  };

  return (
    <Layout title="Search Patients">
      <div className="max-w-6xl mx-auto space-y-10">
        
        {/* Header */}
        <div className="text-center">
          <div className="w-20 h-20 bg-medBlue/10 rounded-[2rem] flex items-center justify-center mx-auto mb-6">
            <Search className="w-10 h-10 text-medBlue" />
          </div>
          <h1 className="text-4xl font-black text-medDark mb-4 italic">Patient Search</h1>
          <p className="text-gray-500 font-bold">Search patients and access their medical records</p>
        </div>

        {/* Search Form */}
        <div className="bg-white rounded-[3rem] p-12 shadow-2xl shadow-slate-200/50 border border-gray-100">
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="md:col-span-2">
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Patient Name</label>
              <div className="relative">
                <User className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Enter patient full name"
                  className="w-full pl-16 pr-6 py-5 rounded-[2rem] border border-gray-200 focus:ring-4 focus:ring-medBlue/10 focus:border-medBlue font-bold"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Access Code (Optional)</label>
              <div className="relative">
                <Key className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={shareCode}
                  onChange={(e) => setShareCode(e.target.value.replace(/\D/g, '').slice(0, 5))}
                  placeholder="5-digit code"
                  className="w-full pl-16 pr-6 py-5 rounded-[2rem] border border-gray-200 focus:ring-4 focus:ring-medBlue/10 focus:border-medBlue font-black text-2xl tracking-[0.3em] text-center"
                  maxLength={5}
                />
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <Button
              onClick={searchPatients}
              disabled={loading}
              className="flex-1 py-5 rounded-[2rem] font-black uppercase tracking-widest"
            >
              {loading ? 'Searching...' : 'Search Patients'}
            </Button>
            
            {shareCode && (
              <Button
                onClick={accessWithCode}
                disabled={loading}
                className="flex-1 py-5 rounded-[2rem] font-black uppercase tracking-widest bg-medTeal hover:bg-medTeal/90"
              >
                Access with Code
              </Button>
            )}
          </div>
        </div>

        {/* Search Results */}
        {patients.length > 0 && (
          <div className="bg-white rounded-[3rem] p-8 shadow-2xl shadow-slate-200/50 border border-gray-100">
            <h2 className="text-2xl font-black text-medDark mb-6">Search Results</h2>
            <div className="grid gap-4">
              {patients.map((patient, idx) => (
                <motion.div
                  key={patient._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="p-6 border border-gray-100 rounded-2xl hover:bg-medGrey/30 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-medBlue/10 rounded-xl flex items-center justify-center">
                        <User className="w-6 h-6 text-medBlue" />
                      </div>
                      <div>
                        <h3 className="font-black text-medDark">{patient.name}</h3>
                        <p className="text-gray-500 text-sm">{patient.email}</p>
                      </div>
                    </div>
                    <p className="text-xs text-gray-400 font-bold">
                      Registered: {new Date(patient.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
            <div className="mt-6 p-4 bg-medBlue/5 rounded-2xl">
              <p className="text-sm text-gray-600 italic">
                To access patient records, you need their 5-digit access code. Ask the patient to generate and share the code with you.
              </p>
            </div>
          </div>
        )}

        {/* Accessed Records */}
        {records.length > 0 && (
          <div className="bg-white rounded-[3rem] p-8 shadow-2xl shadow-slate-200/50 border border-gray-100">
            <h2 className="text-2xl font-black text-medDark mb-6">
              Medical Records - {selectedPatient?.name}
            </h2>
            <div className="grid gap-6">
              {records.map((record, idx) => (
                <motion.div
                  key={record._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="p-6 border border-gray-100 rounded-2xl"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 bg-medGrey rounded-2xl flex items-center justify-center">
                      <FileText className="w-8 h-8 text-medBlue" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-black text-medDark">{record.originalName}</h3>
                      <p className="text-gray-500 font-bold">Patient: {record.patient.name}</p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-4 mb-6">
                    <div className="p-4 bg-medGrey/30 rounded-xl">
                      <div className="flex items-center gap-2 mb-2">
                        <Calendar className="w-4 h-4 text-medBlue" />
                        <span className="text-xs font-black text-gray-400 uppercase">Upload Date</span>
                      </div>
                      <p className="font-black text-medDark">{new Date(record.createdAt).toLocaleDateString()}</p>
                    </div>
                    
                    <div className="p-4 bg-medGrey/30 rounded-xl">
                      <div className="flex items-center gap-2 mb-2">
                        <User className="w-4 h-4 text-medTeal" />
                        <span className="text-xs font-black text-gray-400 uppercase">Patient Email</span>
                      </div>
                      <p className="font-black text-medDark">{record.patient.email}</p>
                    </div>
                    
                    <div className="p-4 bg-medGrey/30 rounded-xl">
                      <div className="flex items-center gap-2 mb-2">
                        <FileText className="w-4 h-4 text-green-500" />
                        <span className="text-xs font-black text-gray-400 uppercase">File Size</span>
                      </div>
                      <p className="font-black text-medDark">{(record.fileSize / 1024).toFixed(1)} KB</p>
                    </div>
                  </div>

                  {record.description && (
                    <div className="p-4 bg-medBlue/5 rounded-xl mb-6">
                      <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Description</h4>
                      <p className="text-gray-700 font-bold italic">{record.description}</p>
                    </div>
                  )}

                  <Button
                    onClick={() => handleDownload(record._id, record.originalName)}
                    className="w-full py-4 rounded-2xl flex items-center justify-center gap-3"
                  >
                    <Download className="w-5 h-5" />
                    Download Medical Record
                  </Button>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}