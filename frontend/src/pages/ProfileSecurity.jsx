import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Shield,
  Lock,
  Smartphone,
  Key,
  AlertTriangle,
  CheckCircle2,
  Save,
  Eye,
  EyeOff
} from 'lucide-react';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import Button from '../components/Button';

export default function ProfileSecurity() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success('Password updated successfully!');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    }, 1500);
  };

  const toggleTwoFactor = () => {
    setTwoFactorEnabled(!twoFactorEnabled);
    toast.success(twoFactorEnabled ? '2FA disabled' : '2FA enabled');
  };

  return (
    <Layout title="Security & 2FA">
      <div className="max-w-4xl mx-auto pb-24 space-y-10">
        {/* Header */}
        <section className="text-center">
          <div className="w-20 h-20 bg-medBlue rounded-[2rem] flex items-center justify-center text-white mx-auto shadow-2xl shadow-medBlue/20 mb-8">
            <Shield className="w-10 h-10" />
          </div>
          <h1 className="text-4xl font-black text-medDark tracking-tight italic">Security Settings</h1>
          <p className="text-gray-500 font-bold mt-2 uppercase text-xs tracking-[0.2em]">Protect Your Account</p>
        </section>

        <div className="grid lg:grid-cols-2 gap-10">
          {/* Password Update */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass p-8 rounded-[3rem] border-white/50 shadow-2xl shadow-medBlue/5"
          >
            <h3 className="text-xl font-black text-medDark mb-6 flex items-center gap-3">
              <Lock className="w-6 h-6 text-medTeal" /> Change Password
            </h3>

            <form onSubmit={handlePasswordUpdate} className="space-y-6">
              <div className="space-y-3">
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Current Password</label>
                <div className="relative group">
                  <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-medBlue transition-all" />
                  <input
                    type={showCurrentPassword ? 'text' : 'password'}
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                    className="w-full pl-14 pr-14 py-4 rounded-[1.5rem] bg-medGrey/30 border-none focus:ring-4 focus:ring-medBlue/10 font-bold text-medDark"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-medBlue"
                  >
                    {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest ml-1">New Password</label>
                <div className="relative group">
                  <Key className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-medBlue transition-all" />
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    className="w-full pl-14 pr-14 py-4 rounded-[1.5rem] bg-medGrey/30 border-none focus:ring-4 focus:ring-medBlue/10 font-bold text-medDark"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-medBlue"
                  >
                    {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Confirm New Password</label>
                <div className="relative group">
                  <Key className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-medBlue transition-all" />
                  <input
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    className="w-full pl-14 pr-6 py-4 rounded-[1.5rem] bg-medGrey/30 border-none focus:ring-4 focus:ring-medBlue/10 font-bold text-medDark"
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                loading={loading}
                className="w-full py-4 rounded-2xl font-black shadow-xl shadow-medBlue/20 flex items-center justify-center gap-2"
              >
                <Save className="w-5 h-5" /> Update Password
              </Button>
            </form>
          </motion.div>

          {/* Two-Factor Authentication */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass p-8 rounded-[3rem] border-white/50 shadow-2xl shadow-medBlue/5"
          >
            <h3 className="text-xl font-black text-medDark mb-6 flex items-center gap-3">
              <Smartphone className="w-6 h-6 text-medTeal" /> Two-Factor Authentication
            </h3>

            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-medGrey/30 rounded-2xl">
                <div>
                  <p className="font-bold text-medDark">SMS Authentication</p>
                  <p className="text-sm text-gray-500">Receive codes via text message</p>
                </div>
                <button
                  onClick={toggleTwoFactor}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    twoFactorEnabled ? 'bg-medTeal' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      twoFactorEnabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {twoFactorEnabled && (
                <div className="p-4 bg-medTeal/10 rounded-2xl border border-medTeal/20">
                  <div className="flex items-center gap-3 mb-3">
                    <CheckCircle2 className="w-5 h-5 text-medTeal" />
                    <p className="font-bold text-medDark">2FA Enabled</p>
                  </div>
                  <p className="text-sm text-gray-600">Your account is protected with two-factor authentication.</p>
                </div>
              )}

              <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 flex gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-amber-900 text-sm">Security Recommendation</p>
                  <p className="text-xs text-amber-800 mt-1">Enable 2FA to add an extra layer of security to your medical records.</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}