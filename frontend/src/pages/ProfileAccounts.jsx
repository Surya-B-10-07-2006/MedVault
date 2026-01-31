import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Link,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Shield,
  Globe
} from 'lucide-react';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import Button from '../components/Button';

export default function ProfileAccounts() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [linkedAccounts, setLinkedAccounts] = useState([
    {
      id: 1,
      provider: 'Google',
      email: 'user@gmail.com',
      connected: true,
      icon: '🔗',
      color: 'bg-blue-500'
    },
    {
      id: 2,
      provider: 'Microsoft',
      email: 'user@outlook.com',
      connected: false,
      icon: '🔗',
      color: 'bg-blue-600'
    }
  ]);

  const toggleConnection = (accountId) => {
    setLinkedAccounts(accounts =>
      accounts.map(account =>
        account.id === accountId
          ? { ...account, connected: !account.connected }
          : account
      )
    );
    toast.success('Account connection updated');
  };

  const removeAccount = (accountId) => {
    setLinkedAccounts(accounts => accounts.filter(account => account.id !== accountId));
    toast.success('Account removed successfully');
  };

  return (
    <Layout title="Linked Accounts">
      <div className="max-w-4xl mx-auto pb-24 space-y-10">
        {/* Header */}
        <section className="text-center">
          <div className="w-20 h-20 bg-medTeal rounded-[2rem] flex items-center justify-center text-white mx-auto shadow-2xl shadow-medTeal/20 mb-8">
            <Link className="w-10 h-10" />
          </div>
          <h1 className="text-4xl font-black text-medDark tracking-tight italic">Linked Accounts</h1>
          <p className="text-gray-500 font-bold mt-2 uppercase text-xs tracking-[0.2em]">Manage Connected Services</p>
        </section>

        <div className="grid lg:grid-cols-3 gap-10">
          {/* Connected Accounts */}
          <div className="lg:col-span-2 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass p-8 rounded-[3rem] border-white/50 shadow-2xl shadow-medBlue/5"
            >
              <h3 className="text-xl font-black text-medDark mb-6 flex items-center gap-3">
                <Globe className="w-6 h-6 text-medTeal" /> Connected Services
              </h3>

              <div className="space-y-4">
                {linkedAccounts.map((account) => (
                  <div
                    key={account.id}
                    className="flex items-center justify-between p-6 bg-medGrey/30 rounded-2xl hover:bg-medGrey/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 ${account.color} rounded-xl flex items-center justify-center text-white font-bold shadow-lg`}>
                        {account.provider[0]}
                      </div>
                      <div>
                        <h4 className="font-black text-medDark">{account.provider}</h4>
                        <p className="text-sm text-gray-500">{account.email}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {account.connected ? (
                        <div className="flex items-center gap-2 px-3 py-1 bg-medTeal/10 text-medTeal rounded-full text-xs font-bold">
                          <CheckCircle2 className="w-3 h-3" />
                          Connected
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 px-3 py-1 bg-gray-100 text-gray-500 rounded-full text-xs font-bold">
                          <AlertCircle className="w-3 h-3" />
                          Disconnected
                        </div>
                      )}

                      <button
                        onClick={() => toggleConnection(account.id)}
                        className={`px-4 py-2 rounded-xl font-bold text-xs transition-colors ${
                          account.connected
                            ? 'bg-rose-100 text-rose-600 hover:bg-rose-200'
                            : 'bg-medBlue text-white hover:bg-medBlue/90'
                        }`}
                      >
                        {account.connected ? 'Disconnect' : 'Connect'}
                      </button>

                      <button
                        onClick={() => removeAccount(account.id)}
                        className="p-2 text-gray-400 hover:text-rose-500 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <button className="w-full mt-6 p-4 border-2 border-dashed border-gray-200 rounded-2xl text-gray-400 hover:border-medBlue hover:text-medBlue transition-colors flex items-center justify-center gap-2 font-bold">
                <Plus className="w-5 h-5" />
                Add New Account
              </button>
            </motion.div>
          </div>

          {/* Info Panel */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="p-6 bg-medDark rounded-[2rem] text-white shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-medBlue/20 rounded-full blur-3xl -mr-16 -mt-16"></div>
              <Shield className="w-8 h-8 mb-4 text-medTeal" />
              <h3 className="text-lg font-black mb-3 italic">Security Benefits</h3>
              <ul className="space-y-2 text-sm text-white/70">
                <li className="flex gap-2">
                  <CheckCircle2 className="w-4 h-4 text-medTeal flex-shrink-0 mt-0.5" />
                  Single sign-on access
                </li>
                <li className="flex gap-2">
                  <CheckCircle2 className="w-4 h-4 text-medTeal flex-shrink-0 mt-0.5" />
                  Enhanced security
                </li>
                <li className="flex gap-2">
                  <CheckCircle2 className="w-4 h-4 text-medTeal flex-shrink-0 mt-0.5" />
                  Automatic backups
                </li>
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="p-6 bg-amber-50 rounded-[2rem] border border-amber-100"
            >
              <AlertCircle className="w-6 h-6 text-amber-500 mb-3" />
              <h4 className="font-black text-amber-900 mb-2">Important Note</h4>
              <p className="text-xs text-amber-800 leading-relaxed">
                Disconnecting accounts may affect your ability to access certain features. 
                Make sure you have alternative access methods configured.
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </Layout>
  );
}