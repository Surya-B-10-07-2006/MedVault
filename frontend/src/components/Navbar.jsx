import { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import {
  Menu,
  Bell,
  Search,
  Settings,
  HelpCircle,
  User,
  LogOut,
  History,
  ShieldCheck,
  X,
  ChevronRight,
  Info,
  CheckCircle2,
  Lock
} from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function Navbar({ onMenuClick, title }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const profileRef = useRef(null);
  const notifyRef = useRef(null);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) setShowProfileMenu(false);
      if (notifyRef.current && !notifyRef.current.contains(event.target)) setShowNotifications(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      navigate(`/records?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Signed out successfully');
      navigate('/login');
    } catch (err) {
      toast.error('Sign out failed');
    }
  };

  const notifications = [
    { id: 1, type: 'status', title: 'Vault Synced', msg: 'Your medical records are fully encrypted.', time: '2m ago', icon: <Lock className="w-4 h-4 text-medBlue" /> },
    { id: 2, type: 'record', title: 'New Report', msg: 'Lab Results from General Hospital added.', time: '1h ago', icon: <CheckCircle2 className="w-4 h-4 text-medTeal" /> },
    { id: 3, type: 'security', title: 'Security Alert', msg: 'New sign-in detected from Windows.', time: '3h ago', icon: <ShieldCheck className="w-4 h-4 text-rose-500" /> }
  ];

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm"
    >
      <div className="flex items-center justify-between h-20 px-6 lg:px-10 max-w-7xl mx-auto">

        {/* Left: Mobile Menu & Breadcrumbs */}
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-3 rounded-2xl hover:bg-medBlue/5 text-medDark transition-all active:scale-95 shadow-sm bg-white border border-gray-100"
          >
            <Menu className="w-6 h-6" />
          </button>

          <div className="hidden md:flex flex-col">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-[10px] font-black text-medBlue uppercase tracking-[0.2em]">MedVault Portal</span>
              <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Global Node</span>
            </div>
            <h2 className="text-xl font-black text-medDark tracking-tight leading-none italic uppercase text-[15px]">
              {title || 'Infrastructure Overview'}
            </h2>
          </div>
        </div>

        {/* Center: Global Search Bar */}
        <div className="hidden lg:flex flex-1 max-w-md mx-12">
          <div className="relative w-full group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center rounded-xl bg-medGrey/80 group-focus-within:bg-medBlue/10 transition-colors">
              <Search className="w-4 h-4 text-gray-400 group-focus-within:text-medBlue" />
            </div>
            <input
              type="text"
              placeholder="Search health records, doctors, or reports..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearch}
              className="w-full bg-medGrey/50 border-none rounded-2xl py-3.5 pl-16 pr-6 text-sm font-bold text-medDark focus:ring-4 focus:ring-medBlue/5 transition-all placeholder:text-gray-400 italic"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-rose-500">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Right: Notification & Profile */}
        <div className="flex items-center gap-4">

          {/* Notifications Trigger */}
          <div className="relative" ref={notifyRef}>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className={`p-3.5 rounded-2xl transition-all relative ${showNotifications ? 'bg-medBlue text-white shadow-lg shadow-medBlue/20 scale-110' : 'text-gray-500 hover:text-medBlue hover:bg-medBlue/5 shadow-sm bg-white border border-gray-50'}`}
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white animate-pulse"></span>
            </button>

            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: 15, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 15, scale: 0.95 }}
                  className="absolute right-0 mt-4 w-80 sm:w-96 bg-white rounded-[2.5rem] shadow-2xl shadow-medDark/10 border border-gray-100 overflow-hidden"
                >
                  <div className="p-6 border-b border-gray-50 flex items-center justify-between bg-medGrey/30">
                    <h3 className="font-black text-medDark uppercase text-[11px] tracking-[0.2em] italic">System Alerts</h3>
                    <span className="px-3 py-1 bg-medBlue text-white text-[9px] font-black rounded-full uppercase italic">3 New</span>
                  </div>
                  <div className="max-h-[400px] overflow-y-auto divide-y divide-gray-50">
                    {notifications.map(n => (
                      <div key={n.id} className="p-5 hover:bg-medGrey/20 transition-all cursor-pointer group">
                        <div className="flex gap-4">
                          <div className="w-10 h-10 rounded-xl bg-white border border-gray-100 shadow-sm flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                            {n.icon}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-0.5">
                              <h4 className="text-sm font-black text-medDark uppercase tracking-tighter">{n.title}</h4>
                              <span className="text-[10px] font-bold text-gray-400 uppercase italic">{n.time}</span>
                            </div>
                            <p className="text-xs font-medium text-gray-500 line-clamp-2 italic leading-relaxed">{n.msg}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button className="w-full py-4 text-[10px] font-black text-medBlue uppercase tracking-[0.3em] hover:bg-medBlue hover:text-white transition-all">
                    View Complete Audit Log
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="hidden sm:block h-8 w-px bg-gray-100 mx-1"></div>

          {/* User Profile Dropdown */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-3 p-1.5 pr-4 rounded-2xl hover:bg-medGrey transition-all group active:scale-95"
            >
              <div className="w-11 h-11 rounded-2xl grad-primary flex items-center justify-center text-white font-black shadow-xl shadow-medBlue/20 overflow-hidden ring-4 ring-white transition-transform group-hover:rotate-6">
                {user?.avatar ? <img src={user.avatar} className="w-full h-full object-cover" /> : user?.name?.[0]?.toUpperCase()}
              </div>
              <div className="hidden lg:flex flex-col text-left">
                <span className="text-[11px] font-bold text-gray-400 capitalize tracking-widest">{user?.role} Mode</span>
                <span className="text-sm font-black text-medDark leading-none group-hover:text-medBlue transition-colors">{user?.name}</span>
              </div>
            </button>

            <AnimatePresence>
              {showProfileMenu && (
                <motion.div
                  initial={{ opacity: 0, y: 15, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 15, scale: 0.95 }}
                  className="absolute right-0 mt-4 w-72 bg-white rounded-[2.5rem] shadow-2xl shadow-medDark/10 border border-gray-100 overflow-hidden p-3"
                >
                  <div className="p-5 bg-medDark rounded-[2rem] text-white mb-3 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-medBlue/20 rounded-full blur-2xl"></div>
                    <p className="text-[9px] font-black text-medTeal uppercase tracking-[0.3em] mb-1">Encrypted Identity</p>
                    <h4 className="text-lg font-black truncate italic leading-tight">{user?.name}</h4>
                    <p className="text-[10px] font-medium text-white/50 truncate italic mt-1">{user?.email}</p>
                  </div>

                  <div className="space-y-1">
                    <Link
                      to="/profile"
                      onClick={() => setShowProfileMenu(false)}
                      className="flex items-center justify-between p-4 rounded-xl hover:bg-medGrey transition-all group"
                    >
                      <div className="flex items-center gap-3">
                        <User className="w-4 h-4 text-medBlue" />
                        <span className="text-xs font-black text-medDark uppercase tracking-widest">Profile Shield</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-medBlue group-hover:translate-x-1 transition-all" />
                    </Link>

                    <Link
                      to="/activity"
                      onClick={() => setShowProfileMenu(false)}
                      className="flex items-center justify-between p-4 rounded-xl hover:bg-medGrey transition-all group"
                    >
                      <div className="flex items-center gap-3">
                        <History className="w-4 h-4 text-medTeal" />
                        <span className="text-xs font-black text-medDark uppercase tracking-widest">Audit Registry</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-medTeal group-hover:translate-x-1 transition-all" />
                    </Link>

                    <button className="w-full flex items-center justify-between p-4 rounded-xl hover:bg-medGrey transition-all group">
                      <div className="flex items-center gap-3">
                        <HelpCircle className="w-4 h-4 text-amber-500" />
                        <span className="text-xs font-black text-medDark uppercase tracking-widest">Help Center</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-amber-500 transition-all" />
                    </button>

                    <div className="h-px bg-gray-50 my-2 mx-4"></div>

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 p-4 rounded-xl text-rose-500 hover:bg-rose-50 transition-all active:scale-95 group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-rose-100 flex items-center justify-center group-hover:bg-rose-500 group-hover:text-white transition-colors">
                        <LogOut className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-black uppercase tracking-[0.2em]">Sign Protocols Off</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </div>
    </motion.header>
  );
}
