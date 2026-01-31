import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BellRing,
  Search,
  ShieldCheck,
  User,
  Clock,
  CheckCircle2,
  XCircle,
  Activity,
  FileSearch,
  ChevronRight,
  ShieldAlert,
  Calendar,
  Eye,
  Check,
  X,
  Stethoscope,
  FileText
} from 'lucide-react';
import Layout from '../components/Layout';
import api from '../utils/api';
import { toast } from 'react-hot-toast';
import Button from '../components/Button';

export default function ViewRequests() {
  const [requests, setRequests] = useState([]);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [responding, setResponding] = useState(null);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [selectedRecords, setSelectedRecords] = useState([]);

  useEffect(() => {
    fetchRequests();
    fetchRecords();
  }, []);

  const fetchRequests = async () => {
    try {
      const { data } = await api.get('/requests');
      setRequests(data.requests || []);
    } catch (err) {
      toast.error('Failed to load access requests');
    } finally {
      setLoading(false);
    }
  };

  const fetchRecords = async () => {
    try {
      const { data } = await api.get('/records/my-records');
      setRecords(data.records || []);
    } catch (err) {
      console.error('Failed to load records');
    }
  };

  const respond = async (id, action) => {
    setResponding(id);
    try {
      const payload = { action };
      if (action === 'approve' && selectedRecords.length > 0) {
        payload.selectedRecords = selectedRecords;
      }
      await api.patch(`/requests/${id}/respond`, payload);
      toast.success(`Access ${action === 'approve' ? 'granted' : 'denied'} successfully`);
      setRequests((prev) => prev.map((r) => (r._id === id ? { ...r, status: action === 'approve' ? 'approved' : 'rejected' } : r)));
      setSelectedRequest(null);
      setSelectedRecords([]);
    } catch (err) {
      toast.error('Action failed. Please try again.');
    } finally {
      setResponding(null);
    }
  };

  const handleApprove = (request) => {
    if (!request.recordId) {
      // General request - show record selection
      setSelectedRequest(request);
    } else {
      // Specific record request - approve directly
      respond(request._id, 'approve');
    }
  };

  const toggleRecordSelection = (recordId) => {
    setSelectedRecords(prev => 
      prev.includes(recordId) 
        ? prev.filter(id => id !== recordId)
        : [...prev, recordId]
    );
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'approved':
        return <span className="px-4 py-1.5 bg-medTeal text-white rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg shadow-medTeal/20">Approved</span>;
      case 'rejected':
        return <span className="px-4 py-1.5 bg-rose-500 text-white rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg shadow-rose-500/20">Rejected</span>;
      default:
        return <span className="px-4 py-1.5 bg-amber-100 text-amber-700 rounded-full text-[10px] font-black uppercase tracking-widest">Pending Decision</span>;
    }
  };

  return (
    <Layout title="Privacy Controls">
      <div className="max-w-4xl mx-auto pb-24 space-y-10">
        {/* Header Section */}
        <section className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-medBlue shadow-xl shadow-medBlue/20 rounded-2xl flex items-center justify-center text-white">
              <ShieldAlert className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-medDark tracking-tight italic">Access Registry</h1>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2 mt-0.5">
                <ShieldCheck className="w-4 h-4 text-medTeal" /> Personal Privacy Guard
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-2xl shadow-xl shadow-slate-200/50 border border-gray-50">
            <div className="w-2 h-2 bg-medTeal rounded-full animate-pulse"></div>
            <span className="text-[10px] font-black text-medDark uppercase tracking-widest">Encryption Active</span>
          </div>
        </section>

        {/* Info Card */}
        <div className="bg-medDark p-8 rounded-[3rem] text-white shadow-2xl relative overflow-hidden group">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-medBlue/20 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-700"></div>
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <div className="w-20 h-20 bg-white/10 rounded-3xl flex items-center justify-center backdrop-blur-md border border-white/20">
              <Stethoscope className="w-10 h-10 text-medBlue" />
            </div>
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-xl font-black mb-2 italic">Clinical Verification Required</h3>
              <p className="text-white/60 text-sm font-medium leading-relaxed italic">
                Doctors can only view your records once you provide explicit authorization. You have full control to revoke access at any time.
              </p>
            </div>
          </div>
        </div>

        {/* Content List */}
        <div className="bg-white rounded-[3rem] border border-gray-100 shadow-2xl shadow-slate-200/50 overflow-hidden">
          <AnimatePresence mode="wait">
            {loading ? (
              <div key="loader" className="p-24 text-center">
                <span className="inline-block w-8 h-8 border-4 border-medBlue border-t-transparent rounded-full animate-spin"></span>
              </div>
            ) : requests.length === 0 ? (
              <div key="empty" className="py-32 text-center px-10">
                <FileSearch className="w-20 h-20 text-gray-200 mx-auto mb-6" />
                <h3 className="text-2xl font-black text-medDark mb-2 italic">Your Privacy Log is Empty</h3>
                <p className="text-gray-400 font-medium">Any doctor attempting to access your vault will appear here for authorization.</p>
              </div>
            ) : (
              <div key="list" className="divide-y divide-gray-50">
                {requests.map((req, idx) => (
                  <motion.div
                    key={req._id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.03 }}
                    className="p-10 hover:bg-medGrey/30 transition-all flex flex-col group"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 mb-8">
                      <div className="flex items-center gap-6">
                        <div className="w-16 h-16 rounded-[1.5rem] bg-white border border-gray-100 shadow-xl overflow-hidden group-hover:scale-105 transition-transform p-1">
                          <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${req.doctorId?.name}`} className="w-full h-full object-cover rounded-[1.2rem]" />
                        </div>
                        <div>
                          <h4 className="text-xl font-black text-medDark group-hover:text-medBlue transition-colors">Dr. {req.doctorId?.name}</h4>
                          <p className="text-sm font-bold text-gray-400 uppercase tracking-tighter mt-1">{req.doctorId?.email}</p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        {getStatusBadge(req.status)}
                        <span className="flex items-center gap-1.5 text-[10px] font-black text-gray-300 uppercase italic tracking-widest">
                          <Calendar className="w-3.5 h-3.5" /> {new Date(req.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <div className="bg-white/50 border border-gray-100 rounded-[2rem] p-6 mb-8 relative">
                      <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
                        <Activity className="w-3.5 h-3.5" /> Requested Access
                      </p>
                      <h5 className="text-lg font-black text-medDark italic">
                        {req.recordId?.originalName || 'General Medical Records Access'}
                      </h5>
                      {req.message && (
                        <p className="text-sm font-bold text-gray-400 mt-4 italic border-t border-gray-50 pt-4 leading-relaxed">
                          "{req.message}"
                        </p>
                      )}
                    </div>

                    {req.status === 'pending' && (
                      <div className="flex flex-col sm:flex-row gap-4">
                        <Button
                          onClick={() => handleApprove(req)}
                          loading={responding === req._id}
                          className="flex-1 py-4 rounded-2xl flex items-center justify-center gap-2"
                        >
                          <Check className="w-5 h-5" /> {req.recordId ? 'Confirm Authorization' : 'Select Records to Share'}
                        </Button>
                        <button
                          onClick={() => respond(req._id, 'reject')}
                          disabled={responding === req._id}
                          className="px-10 py-4 bg-white border border-rose-100 text-rose-500 font-black text-xs uppercase tracking-[0.2em] rounded-2xl hover:bg-rose-50 transition-all flex items-center justify-center gap-2"
                        >
                          <X className="w-5 h-5" /> Deny Access
                        </button>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Record Selection Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[3rem] p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <h3 className="text-2xl font-black text-medDark mb-2">Select Records to Share</h3>
            <p className="text-gray-500 mb-6">Choose which medical records Dr. {selectedRequest.doctorId?.name} can access:</p>
            
            <div className="space-y-4 mb-8">
              {records.map((record) => (
                <div
                  key={record._id}
                  className={`p-4 border-2 rounded-2xl cursor-pointer transition-all ${
                    selectedRecords.includes(record._id)
                      ? 'border-medBlue bg-medBlue/5'
                      : 'border-gray-200 hover:border-medBlue/50'
                  }`}
                  onClick={() => toggleRecordSelection(record._id)}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-medGrey rounded-xl flex items-center justify-center text-medDark font-bold text-xs">
                      {record.fileType.includes('pdf') ? 'PDF' : 'IMG'}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-medDark">{record.originalName}</h4>
                      <p className="text-sm text-gray-500">{new Date(record.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      selectedRecords.includes(record._id)
                        ? 'border-medBlue bg-medBlue'
                        : 'border-gray-300'
                    }`}>
                      {selectedRecords.includes(record._id) && (
                        <Check className="w-4 h-4 text-white" />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex gap-4">
              <Button
                onClick={() => respond(selectedRequest._id, 'approve')}
                disabled={selectedRecords.length === 0}
                loading={responding === selectedRequest._id}
                className="flex-1 py-3 rounded-2xl"
              >
                Grant Access ({selectedRecords.length} records)
              </Button>
              <button
                onClick={() => {
                  setSelectedRequest(null);
                  setSelectedRecords([]);
                }}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-2xl font-bold hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
