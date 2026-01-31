import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Shield,
  User,
  Clock,
  Eye,
  FileText,
  AlertCircle,
  CheckCircle2,
  Bell
} from 'lucide-react';
import api from '../utils/api';
import { toast } from 'react-hot-toast';

export default function AccessCard() {
  const [accessData, setAccessData] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAccessData();
    fetchPendingRequests();
  }, []);

  const fetchAccessData = async () => {
    try {
      const { data } = await api.get('/records/access-summary');
      setAccessData(data.accessSummary || []);
    } catch (err) {
      console.error('Failed to load access data');
    }
  };

  const fetchPendingRequests = async () => {
    try {
      const { data } = await api.get('/requests');
      const pending = data.requests?.filter(req => req.status === 'pending') || [];
      setPendingRequests(pending);
    } catch (err) {
      console.error('Failed to load pending requests');
    } finally {
      setLoading(false);
    }
  };

  const revokeAccess = async (recordId) => {
    try {
      await api.patch(`/records/${recordId}/revoke`);
      toast.success('Access code removed - record no longer accessible');
      fetchAccessData();
    } catch (err) {
      toast.error('Failed to revoke access');
    }
  };

  const clearPendingRequests = async () => {
    try {
      await api.delete('/requests/clear-pending');
      setPendingRequests([]);
      toast.success('All pending requests cleared');
    } catch (err) {
      toast.error('Failed to clear requests');
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-slate-200/50 border border-gray-100">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/2"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-slate-200/50 border border-gray-100"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-medTeal rounded-2xl flex items-center justify-center">
          <Shield className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-black text-medDark">Record Access</h3>
          <p className="text-sm text-gray-500 font-medium">Records with access codes</p>
        </div>
        {pendingRequests.length > 0 && (
          <div className="ml-auto flex items-center gap-1 px-2 py-1 bg-amber-100 text-amber-600 rounded-full text-xs font-bold">
            <Bell className="w-3 h-3" />
            {pendingRequests.length} pending
          </div>
        )}
      </div>

      {/* Pending Requests */}
      {pendingRequests.length > 0 && (
        <div className="mb-6">
          <h4 className="text-sm font-bold text-gray-600 mb-3 flex items-center gap-2">
            <Bell className="w-4 h-4 text-amber-500" />
            Pending Requests
          </h4>
          <div className="space-y-2">
            {pendingRequests.map((request, idx) => (
              <div key={idx} className="p-3 bg-amber-50 rounded-xl border border-amber-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-amber-600" />
                    <span className="font-bold text-amber-900 text-sm">Dr. {request.doctorId?.name}</span>
                  </div>
                  <span className="text-xs text-amber-600 font-bold">Awaiting Response</span>
                </div>
              </div>
            ))}
            <button
              onClick={clearPendingRequests}
              className="w-full mt-2 py-2 text-xs font-bold text-amber-600 hover:bg-amber-100 rounded-lg transition-colors"
            >
              Clear All Pending
            </button>
          </div>
        </div>
      )}

      {accessData.length === 0 && pendingRequests.length === 0 ? (
        <div className="text-center py-8">
          <Eye className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">No records with access codes</p>
          <p className="text-xs text-gray-400 mt-1">Generate codes to share records</p>
        </div>
      ) : (
        <div className="space-y-4">
          {accessData.map((access, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="flex items-center justify-between p-4 bg-medGrey/30 rounded-2xl"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-medBlue rounded-xl flex items-center justify-center">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-bold text-medDark text-sm">{access.recordName}</p>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span>Code: {access.shareCode}</span>
                    <Clock className="w-3 h-3 ml-2" />
                    <span>Created: {new Date(access.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-600 rounded-full text-xs font-bold">
                  <CheckCircle2 className="w-3 h-3" />
                  Accessible
                </div>
                <button
                  onClick={() => revokeAccess(access.recordId)}
                  className="px-3 py-1 bg-rose-100 text-rose-600 rounded-lg text-xs font-bold hover:bg-rose-200 transition-colors"
                >
                  Remove Code
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <div className="mt-6 p-4 bg-amber-50 rounded-2xl border border-amber-100 flex gap-3">
        <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-bold text-amber-900 text-sm">Privacy Control</p>
          <p className="text-xs text-amber-800 mt-1">
            You can revoke doctor access at any time. Doctors can only view records you've explicitly shared.
          </p>
        </div>
      </div>
    </motion.div>
  );
}