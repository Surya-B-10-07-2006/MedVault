import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../utils/api';
import Button from '../components/Button';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      setMessage({ type: 'error', text: 'Invalid reset link.' });
      return;
    }
    setLoading(true);
    setMessage({ type: '', text: '' });
    try {
      await api.post('/auth/reset', { token, password });
      setMessage({ type: 'success', text: 'Password reset. You can log in now.' });
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.error || 'Reset failed' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-teal-100 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-soft p-8 border border-primary-100">
          <h1 className="text-2xl font-bold text-primary-700 text-center mb-2">Reset Password</h1>
          <form onSubmit={handleSubmit} className="space-y-4 mt-6">
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} placeholder="New password" className="w-full rounded-xl border border-gray-300 px-4 py-3" />
            {message.text && <p className={`text-sm ${message.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>{message.text}</p>}
            <Button type="submit" className="w-full" loading={loading}>Reset Password</Button>
          </form>
          <p className="text-center text-sm text-gray-500 mt-4">
            <Link to="/login" className="text-primary-600 font-semibold">Back to Login</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
