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
        className="hidden lg:flex lg:w-1/2 mesh-gradient-dark p-12 flex-col justify-between relative overflow-hidden"
      >
        <div className="absolute inset-0 opacity-40 pointer-events-none">
          <img src="/login-bg.png" alt="Decoration" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-slate-900/40"></div>
        </div>

        <div className="relative z-10 flex items-center gap-3">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/30 shadow-lg group-hover:scale-110 transition-transform overflow-hidden p-2">
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSd_mP4WmzlK0cbChhAP2zR5vVjlGo0xjfQzQ&s"
                alt="MedVault Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <span className="text-3xl font-black text-white tracking-tighter uppercase italic">Med<span className="text-green-400">Vault</span></span>
          </Link>
        </div>

        <div className="relative z-10 max-w-lg mb-12">
          <motion.h2
            initial={{ y: 20 }}
            animate={{ y: 0 }}
            className="text-5xl font-black text-white leading-tight mb-6 italic tracking-tighter uppercase"
          >
            Digital Health <br />
            Ecosystem.
          </motion.h2>
          <p className="text-xl text-slate-300 leading-relaxed font-bold italic">
            Access your secure patient records and manage health communications in one centralized platform.
          </p>
        </div>

        <div className="relative z-10 flex gap-4 text-white/40 font-black text-[10px] uppercase tracking-widest">
          <span>GDPR Compliant</span>
          <span className="text-blue-500">Node v2.4</span>
          <span>AES-256</span>
        </div>
      </motion.div>

      {/* Right Form Section */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-16 grad-surface overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md"
        >
          <div className="mb-12 text-center lg:text-left">
            <h1 className="text-4xl font-black text-slate-900 mb-3 tracking-tighter italic uppercase">Authorized Access Portal</h1>
            <p className="text-slate-500 font-bold mt-2 uppercase text-[10px] tracking-widest italic flex items-center justify-center lg:justify-start gap-2">
              <ShieldCheck className="w-4 h-4 text-green-500" /> HIPAA & GDPR Secure Protocol
            </p>
          </div>

          {/* Role Tabs */}
          <div className="flex p-1 bg-slate-100 rounded-2xl mb-8 border border-slate-200/50 shadow-sm">
            <button
              onClick={() => setRole('patient')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-black uppercase text-[11px] tracking-widest transition-all ${role === 'patient' ? 'bg-white text-blue-600 shadow-md transform scale-[1.02]' : 'text-slate-400 hover:text-slate-600'}`}
            >
              <User className="w-4 h-4" /> Patient Node
            </button>
            <button
              onClick={() => setRole('doctor')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-black uppercase text-[11px] tracking-widest transition-all ${role === 'doctor' ? 'bg-white text-blue-600 shadow-md transform scale-[1.02]' : 'text-slate-400 hover:text-slate-600'}`}
            >
              <UserRoundCog className="w-4 h-4" /> Doctor Node
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 leading-none">Security Email ID</label>
              <div className="relative group/field">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-slate-400 group-focus-within/field:text-blue-500 transition-colors">
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-14 py-4 focus:ring-8 focus:ring-blue-500/5 focus:border-blue-500 outline-none transition-all font-bold text-slate-900 placeholder:text-slate-300"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Access Firewall Key</label>
                <Link to="/forgot-password" relaxation className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline italic">
                  Pass Recovery?
                </Link>
              </div>
              <div className="relative group/field">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-slate-400 group-focus-within/field:text-blue-500 transition-colors">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-14 py-4 focus:ring-8 focus:ring-blue-500/5 focus:border-blue-500 outline-none transition-all font-bold text-slate-900 placeholder:text-slate-300"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-5 bg-slate-900 text-white text-lg font-black rounded-2xl shadow-2xl shadow-slate-900/20 mt-6 flex items-center justify-center gap-3 active:scale-95 transition-all italic uppercase tracking-widest"
            >
              {loading ? 'Decrypting...' : 'Initialize Portal'} <ArrowRight className="w-5 h-5 text-green-400" />
            </button>
          </form>

          <div className="mt-12 text-center border-t border-slate-100 pt-8">
            <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest italic">
              New to the platform? <Link to="/register" className="text-blue-600 font-black hover:underline ml-2">Claim Global ID</Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
