import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, User, UserRoundCog, ArrowRight, ShieldCheck } from 'lucide-react';
import api from '../utils/api';
import Button from '../components/Button';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('patient');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', { email, password });
      login(data.user, { accessToken: data.accessToken, refreshToken: data.refreshToken });
      toast.success('Welcome back, ' + data.user.name);
      const redirect = data.user.role === 'doctor' ? '/doctor/dashboard' : from;
      navigate(redirect, { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.error || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white font-sans">
      {/* Left Decoration Section */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="hidden lg:flex lg:w-1/2 grad-hero p-12 flex-col justify-between relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <img src="/login-bg.png" alt="Decoration" className="w-full h-full object-cover" />
        </div>

        <div className="relative z-10 flex items-center gap-3">
          <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/30 shadow-lg">
            <ShieldCheck className="text-white w-7 h-7" />
          </div>
          <span className="text-3xl font-black text-white tracking-tight">MedVault</span>
        </div>

        <div className="relative z-10 max-w-lg mb-12">
          <motion.h2
            initial={{ y: 20 }}
            animate={{ y: 0 }}
            className="text-5xl font-extrabold text-white leading-tight mb-6"
          >
            Digital Health <br />
            Infrastructure for <br />
            <span className="text-medTeal">Modern Medicine.</span>
          </motion.h2>
          <p className="text-xl text-white/80 leading-relaxed font-medium">
            Access your secure patient records and manage health communications in one centralized platform.
          </p>
        </div>

        <div className="relative z-10 flex gap-4 text-white/60 font-semibold text-sm">
          <span>GDPR Compliant</span>
          <span>•</span>
          <span>HIPAA Secure</span>
          <span>•</span>
          <span>AES-256</span>
        </div>
      </motion.div>

      {/* Right Form Section */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-16 grad-surface">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md"
        >
          <div className="mb-10 text-center lg:text-left">
            <h1 className="text-4xl font-extrabold text-medDark mb-3">Sign In</h1>
            <p className="text-gray-500 font-medium">Welcome back! Please enter your details.</p>
          </div>

          {/* Role Tabs */}
          <div className="flex p-1 bg-medGrey rounded-2xl mb-8 border border-gray-100 shadow-sm">
            <button
              onClick={() => setRole('patient')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all ${role === 'patient' ? 'bg-white text-medBlue shadow-md' : 'text-gray-500 hover:text-medDark'}`}
            >
              <User className="w-5 h-5" /> Patient
            </button>
            <button
              onClick={() => setRole('doctor')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all ${role === 'doctor' ? 'bg-white text-medBlue shadow-md' : 'text-gray-500 hover:text-medDark'}`}
            >
              <UserRoundCog className="w-5 h-5" /> Doctor
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-bold text-medDark ml-1">Email Address</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-medBlue transition-colors">
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full rounded-2xl border border-gray-200 bg-white px-12 py-4 focus:ring-4 focus:ring-medBlue/10 focus:border-medBlue outline-none transition-all font-medium text-medDark placeholder:text-gray-300"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="block text-sm font-bold text-medDark">Password</label>
                <Link to="/forgot-password" title="Recover password" className="text-sm font-bold text-medBlue hover:underline decoration-2">
                  Forgot Password?
                </Link>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-medBlue transition-colors">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full rounded-2xl border border-gray-200 bg-white px-12 py-4 focus:ring-4 focus:ring-medBlue/10 focus:border-medBlue outline-none transition-all font-medium text-medDark placeholder:text-gray-300"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <Button
              type="submit"
              loading={loading}
              className="w-full py-5 text-lg font-extrabold rounded-2xl shadow-xl shadow-medBlue/30 mt-4 flex items-center justify-center gap-2 group"
            >
              Sign In to Your Account <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </form>

          <div className="mt-10 text-center border-t border-gray-100 pt-8">
            <p className="text-gray-500 font-medium">
              New to MedVault? <Link to="/register" className="text-medBlue font-extrabold hover:underline decoration-2 ml-1">Create an Account</Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
