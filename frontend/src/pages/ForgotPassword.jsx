import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../utils/api';
import Button from '../components/Button';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      await api.post('/auth/forgot', { email });
      setMessage('If an account exists, you will receive a reset link.');
    } catch (_e) {
      setMessage('If an account exists, you will receive a reset link.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-teal-100 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-soft p-8 border border-primary-100">
          <h1 className="text-2xl font-bold text-primary-700 text-center mb-2">Forgot Password</h1>
          <form onSubmit={handleSubmit} className="space-y-4 mt-6">
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="Email" className="w-full rounded-xl border border-gray-300 px-4 py-3" />
            {message && <p className="text-sm text-green-600">{message}</p>}
            <Button type="submit" className="w-full" loading={loading}>Send Reset Link</Button>
          </form>
          <p className="text-center text-sm text-gray-500 mt-4">
            <Link to="/login" className="text-primary-600 font-semibold">Back to Login</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
