import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Eye,
  EyeOff,
  Shield,
  Users,
  Globe,
  Lock,
  CheckCircle2,
  AlertTriangle,
  Save
} from 'lucide-react';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import Button from '../components/Button';

export default function ProfilePrivacy() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: 'private',
    shareAnalytics: false,
    allowMarketing: false,
    dataRetention: '5years',
    shareWithResearch: false,
    publicDirectory: false
  });

  const handleSettingChange = (setting, value) => {
    setPrivacySettings(prev => ({
      ...prev,
      [setting]: value
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success('Privacy settings updated successfully!');
    }, 1500);
  };

  const ToggleSwitch = ({ enabled, onChange, label, description }) => (
    <div className="flex items-center justify-between p-4 bg-medGrey/30 rounded-2xl">
      <div className="flex-1">
        <p className="font-bold text-medDark">{label}</p>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
      <button
        onClick={() => onChange(!enabled)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
          enabled ? 'bg-medTeal' : 'bg-gray-300'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            enabled ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );

  return (
    <Layout title="Privacy Settings">
      <div className="max-w-4xl mx-auto pb-24 space-y-10">
        {/* Header */}
        <section className="text-center">
          <div className="w-20 h-20 bg-medDark rounded-[2rem] flex items-center justify-center text-white mx-auto shadow-2xl shadow-medDark/20 mb-8">
            <Eye className="w-10 h-10" />
          </div>
          <h1 className="text-4xl font-black text-medDark tracking-tight italic">Privacy Settings</h1>
          <p className="text-gray-500 font-bold mt-2 uppercase text-xs tracking-[0.2em]">Control Your Data</p>
        </section>

        <form onSubmit={handleSave} className="space-y-10">
          <div className="grid lg:grid-cols-2 gap-10">
            {/* Profile Privacy */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass p-8 rounded-[3rem] border-white/50 shadow-2xl shadow-medBlue/5"
            >
              <h3 className="text-xl font-black text-medDark mb-6 flex items-center gap-3">
                <Users className="w-6 h-6 text-medTeal" /> Profile Visibility
              </h3>

              <div className="space-y-4">
                <div className="space-y-3">
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Who can see your profile</label>
                  <select
                    value={privacySettings.profileVisibility}
                    onChange={(e) => handleSettingChange('profileVisibility', e.target.value)}
                    className="w-full px-4 py-4 rounded-2xl bg-medGrey/30 border-none focus:ring-4 focus:ring-medBlue/10 font-bold text-medDark"
                  >
                    <option value="private">Private - Only me</option>
                    <option value="doctors">Healthcare providers only</option>
                    <option value="public">Public directory</option>
                  </select>
                </div>

                <ToggleSwitch
                  enabled={privacySettings.publicDirectory}
                  onChange={(value) => handleSettingChange('publicDirectory', value)}
                  label="Public Directory Listing"
                  description="Allow others to find you in the public directory"
                />
              </div>
            </motion.div>

            {/* Data Sharing */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="glass p-8 rounded-[3rem] border-white/50 shadow-2xl shadow-medBlue/5"
            >
              <h3 className="text-xl font-black text-medDark mb-6 flex items-center gap-3">
                <Globe className="w-6 h-6 text-medTeal" /> Data Sharing
              </h3>

              <div className="space-y-4">
                <ToggleSwitch
                  enabled={privacySettings.shareAnalytics}
                  onChange={(value) => handleSettingChange('shareAnalytics', value)}
                  label="Usage Analytics"
                  description="Help improve our services with anonymous usage data"
                />

                <ToggleSwitch
                  enabled={privacySettings.shareWithResearch}
                  onChange={(value) => handleSettingChange('shareWithResearch', value)}
                  label="Medical Research"
                  description="Contribute anonymized data to medical research"
                />

                <ToggleSwitch
                  enabled={privacySettings.allowMarketing}
                  onChange={(value) => handleSettingChange('allowMarketing', value)}
                  label="Marketing Communications"
                  description="Receive updates about new features and services"
                />
              </div>
            </motion.div>
          </div>

          {/* Data Retention */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass p-8 rounded-[3rem] border-white/50 shadow-2xl shadow-medBlue/5"
          >
            <h3 className="text-xl font-black text-medDark mb-6 flex items-center gap-3">
              <Lock className="w-6 h-6 text-medTeal" /> Data Retention
            </h3>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Keep my data for</label>
                <select
                  value={privacySettings.dataRetention}
                  onChange={(e) => handleSettingChange('dataRetention', e.target.value)}
                  className="w-full px-4 py-4 rounded-2xl bg-medGrey/30 border-none focus:ring-4 focus:ring-medBlue/10 font-bold text-medDark"
                >
                  <option value="1year">1 Year</option>
                  <option value="3years">3 Years</option>
                  <option value="5years">5 Years</option>
                  <option value="10years">10 Years</option>
                  <option value="forever">Forever</option>
                </select>
              </div>

              <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 flex gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-amber-900 text-sm">Legal Requirement</p>
                  <p className="text-xs text-amber-800 mt-1">Medical records must be retained for a minimum of 7 years as per healthcare regulations.</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Save Button */}
          <div className="flex justify-center">
            <Button
              type="submit"
              loading={loading}
              className="px-12 py-4 rounded-2xl font-black shadow-xl shadow-medBlue/20 flex items-center gap-2"
            >
              <Save className="w-5 h-5" /> Save Privacy Settings
            </Button>
          </div>
        </form>

        {/* Privacy Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="p-8 bg-medDark rounded-[3rem] text-white shadow-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-40 h-40 bg-medBlue/20 rounded-full blur-3xl -mr-20 -mt-20"></div>
          <div className="flex items-start gap-4">
            <Shield className="w-8 h-8 text-medTeal flex-shrink-0" />
            <div>
              <h3 className="text-xl font-black mb-3 italic">Your Privacy Status</h3>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-medTeal" />
                  <span className="text-white/80">Profile: {privacySettings.profileVisibility}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-medTeal" />
                  <span className="text-white/80">Data retention: {privacySettings.dataRetention}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-medTeal" />
                  <span className="text-white/80">Analytics: {privacySettings.shareAnalytics ? 'Enabled' : 'Disabled'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-medTeal" />
                  <span className="text-white/80">Research: {privacySettings.shareWithResearch ? 'Enabled' : 'Disabled'}</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
}