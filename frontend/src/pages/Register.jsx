import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { User, UserRoundCog, Mail, Lock, UserCircle, ShieldCheck, ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react';
import api from '../utils/api';
import Button from '../components/Button';

export default function Register() {
  const [step, setStep] = useState(1);
  const [role, setRole] = useState('patient');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRoleSelect = (selectedRole) => {
    setRole(selectedRole);
    setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/auth/register', { ...formData, role });
      login(data.user, { accessToken: data.accessToken, refreshToken: data.refreshToken });
      toast.success('Account created! Welcome to MedVault.');
      const redirect = data.user.role === 'doctor' ? '/doctor/dashboard' : '/dashboard';
      navigate(redirect, { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.error || 'Registration failed. Please check your data.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white font-sans overflow-hidden">
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
          <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/30 shadow-lg overflow-hidden p-2">
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSd_mP4WmzlK0cbChhAP2zR5vVjlGo0xjfQzQ&s"
              alt="MedVault Logo"
              className="w-full h-full object-contain"
            />
          </div>
          <span className="text-3xl font-black text-white tracking-tight uppercase italic">Med<span className="text-green-400">Vault</span></span>
        </div>

        <div className="relative z-10 max-w-lg mb-12">
          <motion.h2
            initial={{ y: 20 }}
            animate={{ y: 0 }}
            className="text-5xl font-black text-white leading-tight mb-6 italic tracking-tighter uppercase"
          >
            Universal <br />
            Health ID.
          </motion.h2>
          <p className="text-xl text-slate-300 leading-relaxed font-bold italic">
            Join the global network of secured medical nodes. Claim your digital health sovereignty today.
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
        <div className="w-full max-w-md">
          <div className="mb-12 text-center lg:text-left">
            <h1 className="text-4xl font-black text-slate-900 mb-3 tracking-tighter italic uppercase">Create Account</h1>
            <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest italic">Initialize your secure medical vault</p>
          </div>

          {/* Progress Tracker */}
          <div className="flex items-center gap-4 mb-10">
            {[1, 2].map((i) => (
              <div key={i} className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-black transition-all ${step >= i ? 'bg-slate-900 text-teal-400 shadow-xl' : 'bg-slate-100 text-slate-400'}`}>
                  {step > i ? <CheckCircle2 className="w-5 h-5" /> : i}
                </div>
                {i === 1 && <div className={`h-1 w-12 rounded-full transition-all ${step > 1 ? 'bg-slate-900' : 'bg-slate-100'}`}></div>}
              </div>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight italic mb-6">Select Identity Protocol</h3>
                <div className="grid grid-cols-1 gap-4">
                  <button
                    onClick={() => handleRoleSelect('patient')}
                    className="group flex flex-col items-start p-6 rounded-[2rem] bg-white border border-slate-100 hover:border-blue-500 hover:shadow-2xl transition-all text-left"
                  >
                    <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-600 transition-colors">
                      <User className="w-6 h-6 text-slate-600 group-hover:text-white" />
                    </div>
                    <h3 className="text-lg font-black text-slate-900 italic uppercase leading-none">Patient Node</h3>
                    <p className="text-[10px] text-slate-400 font-bold mt-2 uppercase tracking-widest">Personal Healthcare Management</p>
                  </button>

                  <button
                    onClick={() => handleRoleSelect('doctor')}
                    className="group flex flex-col items-start p-6 rounded-[2rem] bg-white border border-slate-100 hover:border-green-500 hover:shadow-2xl transition-all text-left"
                  >
                    <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-green-500 transition-colors">
                      <UserRoundCog className="w-6 h-6 text-slate-600 group-hover:text-white" />
                    </div>
                    <h3 className="text-lg font-black text-slate-900 italic uppercase leading-none">Doctor Node</h3>
                    <p className="text-[10px] text-slate-400 font-bold mt-2 uppercase tracking-widest">Clinical Practice & Authorization</p>
                  </button>
                </div>

                <div className="mt-10 pt-8 border-t border-slate-100 text-center lg:text-left">
                  <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest">
                    Authorized Node Access? <Link to="/login" className="text-blue-600 font-black hover:underline italic ml-2">Sign In</Link>
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <button onClick={() => setStep(1)} className="flex items-center gap-2 text-slate-400 hover:text-slate-900 font-black text-[10px] uppercase tracking-widest mb-6 transition-colors">
                  <ArrowLeft className="w-4 h-4" /> Initialize Again
                </button>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 leading-none">Identity Name</label>
                    <div className="relative group/field">
                      <UserCircle className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within/field:text-blue-500 transition-all" />
                      <input
                        name="name"
                        type="text"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full pl-14 pr-6 py-4 rounded-2xl bg-slate-50/50 border border-slate-100 focus:bg-white focus:ring-8 focus:ring-blue-500/5 focus:border-blue-500 font-bold text-slate-900 outline-none transition-all uppercase tracking-tight"
                        placeholder="Dr. John Doe / Patient Jane"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 leading-none">Node Email Registry</label>
                    <div className="relative group/field">
                      <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within/field:text-blue-500 transition-all" />
                      <input
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full pl-14 pr-6 py-4 rounded-2xl bg-slate-50/50 border border-slate-100 focus:bg-white focus:ring-8 focus:ring-blue-500/5 focus:border-blue-500 font-bold text-slate-900 outline-none transition-all"
                        placeholder="name@example.com"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 leading-none">Access Firewall Key</label>
                    <div className="relative group/field">
                      <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within/field:text-blue-500 transition-all" />
                      <input
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        required
                        minLength={8}
                        className="w-full pl-14 pr-6 py-4 rounded-2xl bg-slate-50/50 border border-slate-100 focus:bg-white focus:ring-8 focus:ring-blue-500/5 focus:border-blue-500 font-bold text-slate-900 outline-none transition-all"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-5 bg-slate-900 text-white text-lg font-black rounded-2xl shadow-2xl shadow-slate-900/20 mt-6 flex items-center justify-center gap-3 active:scale-95 transition-all italic uppercase tracking-widest disabled:opacity-50"
                  >
                    {loading ? 'Decrypting...' : 'Claim Node Account'} <ArrowRight className="w-5 h-5 text-green-400" />
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
