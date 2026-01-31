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
    <div className="min-h-screen grad-medical flex flex-col items-center justify-center p-6 font-sans">
      {/* Head */}
      <div className="mb-12 flex items-center gap-3">
        <div className="w-12 h-12 grad-primary rounded-2xl flex items-center justify-center shadow-lg">
          <ShieldCheck className="text-white w-7 h-7" />
        </div>
        <span className="text-3xl font-black text-medDark tracking-tight">MedVault</span>
      </div>

      <div className="w-full max-w-xl">
        {/* Progress Tracker */}
        <div className="flex items-center justify-between mb-10 px-4">
          {[1, 2].map((i) => (
            <div key={i} className="flex items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${step >= i ? 'bg-medBlue text-white shadow-lg shadow-medBlue/30 scale-110' : 'bg-white text-gray-400 border border-gray-200'}`}>
                {step > i ? <CheckCircle2 className="w-6 h-6" /> : i}
              </div>
              {i === 1 && (
                <div className={`h-1 w-24 mx-4 rounded-full transition-all ${step > 1 ? 'bg-medBlue' : 'bg-gray-200'}`}></div>
              )}
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
              className="glass p-10 rounded-[2.5rem] shadow-2xl border-white/50 text-center"
            >
              <h1 className="text-3xl font-extrabold text-medDark mb-3">Join MedVault</h1>
              <p className="text-gray-500 font-medium mb-10">Select your account type to begin your journey.</p>

              <div className="grid grid-cols-2 gap-6">
                <button
                  onClick={() => handleRoleSelect('patient')}
                  className="group flex flex-col items-center p-8 rounded-3xl bg-white border-2 border-transparent hover:border-medBlue hover:shadow-xl transition-all"
                >
                  <div className="w-20 h-20 bg-medBlue/10 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <User className="w-10 h-10 text-medBlue" />
                  </div>
                  <h3 className="text-xl font-bold text-medDark mb-1">Patient</h3>
                  <p className="text-sm text-gray-500 font-medium">I want to manage my medical records.</p>
                </button>

                <button
                  onClick={() => handleRoleSelect('doctor')}
                  className="group flex flex-col items-center p-8 rounded-3xl bg-white border-2 border-transparent hover:border-medBlue hover:shadow-xl transition-all"
                >
                  <div className="w-20 h-20 bg-medTeal/10 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <UserRoundCog className="w-10 h-10 text-medTeal" />
                  </div>
                  <h3 className="text-xl font-bold text-medDark mb-1">Doctor</h3>
                  <p className="text-sm text-gray-500 font-medium">I want to treat my patients securely.</p>
                </button>
              </div>

              <div className="mt-10 border-t border-gray-100 pt-8">
                <p className="text-gray-500 font-medium">
                  Already have an account? <Link to="/login" className="text-medBlue font-extrabold hover:underline">Sign In</Link>
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="glass p-10 rounded-[2.5rem] shadow-2xl border-white/50"
            >
              <button onClick={() => setStep(1)} className="flex items-center gap-2 text-gray-500 hover:text-medDark font-bold mb-6 transition-colors">
                <ArrowLeft className="w-5 h-5" /> Back
              </button>

              <div className="mb-8">
                <h1 className="text-3xl font-extrabold text-medDark mb-2">Account Details</h1>
                <p className="text-gray-500 font-medium">
                  Registering as a <span className="text-medBlue font-bold capitalize">{role}</span>
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-medDark ml-1">Full Name</label>
                  <div className="relative">
                    <UserCircle className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full rounded-2xl border border-gray-200 bg-white px-12 py-4 focus:ring-4 focus:ring-medBlue/10 focus:border-medBlue outline-none transition-all font-medium text-medDark"
                      placeholder="Dr. John Doe / Patient Jane"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-bold text-medDark ml-1">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full rounded-2xl border border-gray-200 bg-white px-12 py-4 focus:ring-4 focus:ring-medBlue/10 focus:border-medBlue outline-none transition-all font-medium text-medDark"
                      placeholder="name@example.com"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-bold text-medDark ml-1">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      name="password"
                      type="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                      minLength={8}
                      className="w-full rounded-2xl border border-gray-200 bg-white px-12 py-4 focus:ring-4 focus:ring-medBlue/10 focus:border-medBlue outline-none transition-all font-medium text-medDark"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  loading={loading}
                  className="w-full py-5 text-lg font-extrabold rounded-2xl shadow-xl shadow-medBlue/30 mt-6 flex items-center justify-center gap-2"
                >
                  Create Account <ArrowRight className="w-5 h-5" />
                </Button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
