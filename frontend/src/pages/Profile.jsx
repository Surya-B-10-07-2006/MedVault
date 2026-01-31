import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  User,
  Mail,
  Shield,
  Lock,
  CheckCircle2,
  Save,
  Hospital,
  Smartphone,
  Globe,
  MapPin,
  Users,
  X
} from 'lucide-react';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import Button from '../components/Button';
import api from '../utils/api';

const avatars = {
  patient: {
    male: '/avatars/patient-male.svg',
    female: '/avatars/patient-female.svg'
  },
  doctor: {
    male: '/avatars/doctor-male.svg',
    female: '/avatars/doctor-female.svg'
  }
};

export default function Profile() {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showAvatarSelector, setShowAvatarSelector] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    hospital: '',
    specialization: '',
    licenseNumber: ''
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data } = await api.get('/user/profile');
      const profile = data.user;
      setFormData({
        name: profile.name || '',
        email: profile.email || '',
        phone: profile.phone || '',
        address: profile.address || '',
        hospital: profile.hospital || '',
        specialization: profile.specialization || '',
        licenseNumber: profile.licenseNumber || ''
      });
    } catch (err) {
      toast.error('Failed to load profile');
    }
  };

  const selectAvatar = async (avatarUrl) => {
    try {
      const { data } = await api.patch('/user/avatar', { avatar: avatarUrl });
      updateUser(data.user);
      setShowAvatarSelector(false);
      toast.success('Avatar updated successfully!');
    } catch (err) {
      toast.error('Failed to update avatar');
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.patch('/user/profile', formData);
      updateUser(data.user);
      toast.success('Profile updated successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout title="Account Settings">
      <div className="max-w-6xl mx-auto pb-24 space-y-12">
        {/* Profile Header Card */}
        <section className="relative">
          <div className="px-6 md:px-12 flex flex-col items-center md:items-end md:flex-row gap-6 md:gap-10 relative z-10">
            <div className="relative group">
              <div className="w-32 h-32 md:w-44 md:h-44 bg-white rounded-[2rem] md:rounded-[3rem] p-1.5 shadow-2xl overflow-hidden ring-8 ring-white/50 relative">
                <img
                  src={user?.avatar || avatars[user?.role]?.male}
                  className="w-full h-full object-cover rounded-[1.5rem] md:rounded-[2.5rem]"
                  alt="Profile"
                />
              </div>
              <button
                onClick={() => setShowAvatarSelector(true)}
                className="absolute bottom-1 right-1 md:bottom-2 md:right-2 p-3 bg-slate-900 text-white rounded-2xl shadow-xl hover:scale-110 active:scale-95 transition-all border border-white/20"
              >
                <Users className="w-5 h-5 text-green-400" />
              </button>
            </div>

            <div className="pb-4 flex-1 text-center md:text-left">
              <div className="flex flex-col md:flex-row items-center gap-3 md:gap-4">
                <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter italic uppercase leading-tight">
                  {user?.name}
                </h1>
                <div className="flex items-center gap-2 px-3 py-1 bg-green-500/10 text-green-600 rounded-full text-[9px] font-black uppercase tracking-[0.2em] border border-green-500/20 shadow-sm">
                  <Shield className="w-3 h-3" /> Verified {user?.role} Node
                </div>
              </div>
              <p className="text-slate-400 font-bold mt-2 uppercase text-[10px] md:text-xs tracking-[0.3em] flex items-center justify-center md:justify-start gap-2 italic">
                <Mail className="w-3.5 h-3.5 text-blue-500" /> {user?.email}
              </p>
            </div>
          </div>

          <AnimatePresence>
            {showAvatarSelector && (
              <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-xl flex items-center justify-center z-[100] p-4">
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  className="bg-white rounded-[3rem] md:rounded-[4rem] p-8 md:p-12 max-w-2xl w-full shadow-2xl relative border border-white/20"
                >
                  <button onClick={() => setShowAvatarSelector(false)} className="absolute top-8 right-8 text-slate-300 hover:text-slate-900 transition-colors">
                    <X className="w-8 h-8" />
                  </button>
                  <h3 className="text-3xl font-black text-slate-900 mb-10 text-center italic tracking-tight uppercase">Authorized Avatars</h3>

                  <div className="grid grid-cols-2 gap-10">
                    <div className="text-center">
                      <h4 className="text-[10px] font-black text-slate-400 mb-4 uppercase tracking-[0.3em]">Protocol Beta</h4>
                      <button
                        onClick={() => selectAvatar(avatars[user?.role]?.male)}
                        className="w-full aspect-square rounded-[3rem] overflow-hidden border-4 border-slate-50 hover:border-blue-500 hover:scale-105 transition-all shadow-xl"
                      >
                        <img src={avatars[user?.role]?.male} className="w-full h-full object-cover" alt="Male avatar" />
                      </button>
                    </div>

                    <div className="text-center">
                      <h4 className="text-[10px] font-black text-slate-400 mb-4 uppercase tracking-[0.3em]">Protocol Gamma</h4>
                      <button
                        onClick={() => selectAvatar(avatars[user?.role]?.female)}
                        className="w-full aspect-square rounded-[3rem] overflow-hidden border-4 border-slate-50 hover:border-green-500 hover:scale-105 transition-all shadow-xl"
                      >
                        <img src={avatars[user?.role]?.female} className="w-full h-full object-cover" alt="Female avatar" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>
        </section>

        <div className="grid lg:grid-cols-4 gap-12">
          {/* Navigation Tracks */}
          <div className="lg:col-span-1 space-y-4">
            <h4 className="text-[10px] font-black text-slate-400 mb-6 uppercase tracking-[0.4em] px-4">Sector Channels</h4>
            {[
              { label: 'Identity Profile', icon: <User className="w-5 h-5" />, path: '/profile' },
            ].map((nav, i) => (
              <NavLink
                key={i}
                to={nav.path}
                className={({ isActive }) =>
                  `w-full flex items-center gap-4 p-6 rounded-[2rem] transition-all font-black text-[11px] uppercase tracking-widest leading-none ${isActive
                    ? 'bg-slate-900 text-white shadow-2xl shadow-slate-900/20 scale-[1.03] italic'
                    : 'bg-white text-slate-400 hover:text-slate-900 hover:bg-slate-50 border border-slate-50 shadow-sm'
                  }`
                }
              >
                <span className={({ isActive }) => `p-2 rounded-xl ${isActive ? 'bg-white/10 text-teal-400' : 'bg-slate-50 text-slate-300'}`}>
                  {nav.icon}
                </span>
                {nav.label}
              </NavLink>
            ))}
          </div>

          {/* Configuration Workspace */}
          <div className="lg:col-span-3 space-y-12">
            <section className="glass-md p-8 md:p-12 rounded-[3.5rem] border-white/60 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-[100px] -z-0"></div>

              <h3 className="text-2xl font-black text-slate-900 mb-10 flex items-center gap-4 italic tracking-tight relative z-10">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-lg border border-slate-100">
                  <CheckCircle2 className="w-6 h-6 text-green-500" />
                </div>
                Core Identity Matrix
              </h3>

              <form onSubmit={handleUpdate} className="space-y-10 relative z-10">
                <div className="grid md:grid-cols-2 gap-8 md:gap-12">
                  <div className="space-y-4">
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] ml-2 leading-none">Registered Nomophore</label>
                    <div className="relative group/field">
                      <User className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within/field:text-blue-500 transition-all" />
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full pl-16 pr-6 py-5 rounded-2xl md:rounded-3xl bg-slate-50/50 border border-slate-100 focus:bg-white focus:ring-8 focus:ring-blue-500/5 focus:border-blue-500 font-bold text-slate-900 outline-none transition-all shadow-inner uppercase tracking-wide"
                      />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] ml-2 leading-none">Cellular Link</label>
                    <div className="relative group/field">
                      <Smartphone className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within/field:text-blue-500 transition-all" />
                      <input
                        type="text"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full pl-16 pr-6 py-5 rounded-2xl md:rounded-3xl bg-slate-50/50 border border-slate-100 focus:bg-white focus:ring-8 focus:ring-blue-500/5 focus:border-blue-500 font-bold text-slate-900 outline-none transition-all shadow-inner"
                      />
                    </div>
                  </div>
                </div>

                {user?.role === 'doctor' && (
                  <div className="grid md:grid-cols-2 gap-8 md:gap-12">
                    <div className="space-y-4">
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] ml-2 leading-none">Clinical Focus</label>
                      <div className="relative group/field">
                        <Hospital className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within/field:text-blue-500 transition-all" />
                        <input
                          type="text"
                          value={formData.specialization}
                          onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                          className="w-full pl-16 pr-6 py-5 rounded-2xl md:rounded-3xl bg-slate-50/50 border border-slate-100 focus:bg-white focus:ring-8 focus:ring-blue-500/5 focus:border-blue-500 font-bold text-slate-900 outline-none transition-all shadow-inner uppercase italic"
                        />
                      </div>
                    </div>
                    <div className="space-y-4">
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] ml-2 leading-none">State License Key</label>
                      <div className="relative group/field">
                        <Shield className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within/field:text-blue-500 transition-all" />
                        <input
                          type="text"
                          value={formData.licenseNumber}
                          onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
                          className="w-full pl-16 pr-6 py-5 rounded-2xl md:rounded-3xl bg-slate-50/50 border border-slate-100 focus:bg-white focus:ring-8 focus:ring-blue-500/5 focus:border-blue-500 font-bold text-slate-900 outline-none transition-all shadow-inner font-mono tracking-widest"
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div className="space-y-4">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] ml-2 leading-none">Affiliated Medical Facility</label>
                  <div className="relative group/field">
                    <Hospital className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within/field:text-blue-500 transition-all" />
                    <input
                      type="text"
                      value={formData.hospital}
                      onChange={(e) => setFormData({ ...formData, hospital: e.target.value })}
                      className="w-full pl-16 pr-6 py-5 rounded-2xl md:rounded-3xl bg-slate-50/50 border border-slate-100 focus:bg-white focus:ring-8 focus:ring-blue-500/5 focus:border-blue-500 font-bold text-slate-900 outline-none transition-all shadow-inner uppercase"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] ml-2 leading-none">Node Physical Vector (Address)</label>
                  <div className="relative group/field">
                    <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within/field:text-blue-500 transition-all" />
                    <input
                      type="text"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="w-full pl-16 pr-6 py-5 rounded-2xl md:rounded-3xl bg-slate-50/50 border border-slate-100 focus:bg-white focus:ring-8 focus:ring-blue-500/5 focus:border-blue-500 font-bold text-slate-900 outline-none transition-all shadow-inner italic"
                    />
                  </div>
                </div>

                <div className="pt-10 border-t border-slate-100 flex justify-end">
                  <button
                    type="submit"
                    disabled={loading}
                    className="group flex items-center justify-center gap-3 px-12 py-5 bg-slate-900 text-white font-black rounded-2xl md:rounded-3xl shadow-2xl shadow-slate-900/20 hover:scale-[1.05] active:scale-95 transition-all disabled:opacity-50 italic uppercase tracking-[0.3em] text-sm"
                  >
                    <Save className="w-5 h-5 text-green-400" />
                    {loading ? 'Saving Node...' : 'Commit Changes'}
                  </button>
                </div>
              </form>
            </section>

            <div className="mesh-gradient-dark p-10 md:p-12 rounded-[3.5rem] text-white shadow-2xl relative overflow-hidden group border border-white/10">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-[100px] -mr-32 -mt-32 group-hover:scale-125 transition-transform duration-1000"></div>
              <div className="flex items-start gap-6 relative z-10">
                <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md">
                  <Shield className="w-8 h-8 text-green-400" />
                </div>
                <div>
                  <h4 className="text-2xl font-black mb-3 italic tracking-tight uppercase">Encryption Layer Active</h4>
                  <p className="text-slate-400 text-sm font-bold leading-relaxed italic mb-8 max-w-xl">
                    Your identity metadata is protected by end-to-end medical encryption. All profile adjustments are instantly synced across the MedVault cloud network.
                  </p>
                  <button onClick={() => navigate('/profile/security')} className="px-10 py-4 bg-white text-slate-900 font-black text-[11px] uppercase tracking-[0.3em] rounded-2xl shadow-xl hover:bg-slate-50 transition-all active:scale-95">
                    Reinforce Security
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
