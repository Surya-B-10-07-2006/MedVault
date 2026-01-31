import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { NavLink } from 'react-router-dom';
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
  Users
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
      <div className="max-w-5xl mx-auto pb-24 space-y-10">
        {/* Profile Header Card */}
        <section className="relative">
          <div className="h-44 grad-hero rounded-[3rem] shadow-xl overflow-hidden relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full blur-3xl -ml-32 -mb-32"></div>
          </div>

          <div className="px-12 -mt-20 flex flex-col md:flex-row items-end gap-8 relative z-10">
            <div className="relative group">
              <div className="w-40 h-40 bg-white rounded-[2.5rem] p-2 shadow-2xl overflow-hidden ring-8 ring-white">
                <img
                  src={user?.avatar || avatars[user?.role]?.male}
                  className="w-full h-full object-cover rounded-[2rem]"
                  alt="Profile"
                />
              </div>
              <button 
                onClick={() => setShowAvatarSelector(true)}
                className="absolute bottom-2 right-2 p-3 bg-medBlue text-white rounded-2xl shadow-xl hover:scale-110 transition-transform"
              >
                <Users className="w-5 h-5" />
              </button>
            </div>

            <div className="pb-4 flex-1">
              <h1 className="text-4xl font-black text-medDark tracking-tight flex items-center gap-3">
                {user?.name}
                <div className="flex items-center gap-1.5 px-3 py-1 bg-medTeal text-white rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg shadow-medTeal/20">
                  <Shield className="w-3 h-3" /> Verified {user?.role}
                </div>
              </h1>
              <p className="text-gray-500 font-bold mt-1 uppercase text-xs tracking-[0.2em]">{user?.email}</p>
            </div>
          </div>

          {/* Avatar Selector Modal */}
          {showAvatarSelector && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-[3rem] p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
                <h3 className="text-2xl font-black text-medDark mb-6 text-center">Choose Your Avatar</h3>
                
                <div className="space-y-8">
                  <div>
                    <h4 className="text-lg font-bold text-medDark mb-4">Male</h4>
                    <button
                      onClick={() => selectAvatar(avatars[user?.role]?.male)}
                      className="w-24 h-24 rounded-2xl overflow-hidden border-2 border-gray-200 hover:border-medBlue transition-colors"
                    >
                      <img src={avatars[user?.role]?.male} className="w-full h-full object-cover" alt="Male avatar" />
                    </button>
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-bold text-medDark mb-4">Female</h4>
                    <button
                      onClick={() => selectAvatar(avatars[user?.role]?.female)}
                      className="w-24 h-24 rounded-2xl overflow-hidden border-2 border-gray-200 hover:border-medBlue transition-colors"
                    >
                      <img src={avatars[user?.role]?.female} className="w-full h-full object-cover" alt="Female avatar" />
                    </button>
                  </div>
                </div>
                
                <button
                  onClick={() => setShowAvatarSelector(false)}
                  className="w-full mt-6 py-3 bg-gray-200 text-gray-700 rounded-2xl font-bold hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </section>

        <div className="grid lg:grid-cols-3 gap-10">
          {/* Navigation Cards */}
          <div className="space-y-6">
            {[
              { label: 'Personal Information', icon: <User className="w-5 h-5" />, active: true, path: '/profile' },
              { label: 'Security & 2FA', icon: <Lock className="w-5 h-5" />, active: false, path: '/profile/security' },
              { label: 'Linked Accounts', icon: <Globe className="w-5 h-5" />, active: false, path: '/profile/accounts' },
              { label: 'Privacy Settings', icon: <Shield className="w-5 h-5" />, active: false, path: '/profile/privacy' },
            ].map((nav, i) => (
              <NavLink
                key={i}
                to={nav.path}
                className={({ isActive }) =>
                  `w-full flex items-center gap-4 p-6 rounded-[2rem] transition-all font-black text-sm uppercase tracking-tight text-left ${
                    isActive
                      ? 'bg-medBlue text-white shadow-xl shadow-medBlue/20 scale-105'
                      : 'bg-white text-gray-400 hover:text-medDark hover:bg-medGrey border border-gray-50'
                  }`
                }
              >
                {nav.icon} {nav.label}
              </NavLink>
            ))}
          </div>

          {/* Form Section */}
          <div className="lg:col-span-2 space-y-10">
            <section className="glass p-10 rounded-[3rem] border-white/50 shadow-2xl shadow-medBlue/5">
              <h3 className="text-xl font-black text-medDark mb-8 flex items-center gap-3 italic">
                <CheckCircle2 className="w-6 h-6 text-medTeal" /> Profile Details
              </h3>

              <form onSubmit={handleUpdate} className="space-y-8">
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Full Identity Name</label>
                    <div className="relative group">
                      <User className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-medBlue transition-all" />
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full pl-14 pr-6 py-4 rounded-[1.5rem] bg-medGrey/30 border-none focus:ring-4 focus:ring-medBlue/10 font-bold text-medDark"
                      />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Contact Number</label>
                    <div className="relative group">
                      <Smartphone className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-medBlue transition-all" />
                      <input
                        type="text"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full pl-14 pr-6 py-4 rounded-[1.5rem] bg-medGrey/30 border-none focus:ring-4 focus:ring-medBlue/10 font-bold text-medDark"
                      />
                    </div>
                  </div>
                </div>

                {user?.role === 'doctor' && (
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="block text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Specialization</label>
                      <div className="relative group">
                        <Hospital className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-medBlue transition-all" />
                        <input
                          type="text"
                          value={formData.specialization}
                          onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                          className="w-full pl-14 pr-6 py-4 rounded-[1.5rem] bg-medGrey/30 border-none focus:ring-4 focus:ring-medBlue/10 font-bold text-medDark"
                        />
                      </div>
                    </div>
                    <div className="space-y-3">
                      <label className="block text-xs font-black text-gray-400 uppercase tracking-widest ml-1">License Number</label>
                      <div className="relative group">
                        <Shield className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-medBlue transition-all" />
                        <input
                          type="text"
                          value={formData.licenseNumber}
                          onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
                          className="w-full pl-14 pr-6 py-4 rounded-[1.5rem] bg-medGrey/30 border-none focus:ring-4 focus:ring-medBlue/10 font-bold text-medDark"
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div className="space-y-3">
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Primary Healthcare Provider</label>
                  <div className="relative group">
                    <Hospital className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-medBlue transition-all" />
                    <input
                      type="text"
                      value={formData.hospital}
                      onChange={(e) => setFormData({ ...formData, hospital: e.target.value })}
                      className="w-full pl-14 pr-6 py-4 rounded-[1.5rem] bg-medGrey/30 border-none focus:ring-4 focus:ring-medBlue/10 font-bold text-medDark"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Current Residential Address</label>
                  <div className="relative group">
                    <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-medBlue transition-all" />
                    <input
                      type="text"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="w-full pl-14 pr-6 py-4 rounded-[1.5rem] bg-medGrey/30 border-none focus:ring-4 focus:ring-medBlue/10 font-bold text-medDark"
                    />
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-50 flex justify-end">
                  <Button
                    type="submit"
                    loading={loading}
                    className="px-12 py-4 rounded-2xl font-black shadow-xl shadow-medBlue/20 flex items-center gap-2"
                  >
                    <Save className="w-5 h-5" /> Save Changes
                  </Button>
                </div>
              </form>
            </section>

            <div className="grad-hero p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20 group-hover:scale-125 transition-transform duration-700"></div>
              <h4 className="text-2xl font-black mb-4 italic">Security Level: Maximum</h4>
              <p className="text-white/60 text-sm font-medium leading-relaxed italic mb-8">
                Your profile data is protected by biometric encryption and multi-factor authentication.
              </p>
              <button className="px-8 py-3 bg-white text-medBlue font-black text-xs uppercase tracking-widest rounded-full shadow-lg hover:scale-105 transition-all">
                Update Security
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
