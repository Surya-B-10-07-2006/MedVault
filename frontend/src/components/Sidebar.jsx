import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  FolderHeart,
  UploadCloud,
  Share2,
  BellRing,
  UserCircle,
  History,
  Activity,
  Users,
  LogOut,
  ShieldCheck,
  Stethoscope,
  CalendarCheck,
  MessageCircle,
  Settings,
  Shield,
  Link as LinkIcon,
  Eye,
  FileText,
  UserCheck,
  Key,
  HelpCircle,
  Search,
  X,
  CreditCard,
  Lock,
  ChevronRight
} from 'lucide-react';

const patientLinks = [
  { to: '/dashboard', icon: <LayoutDashboard className="w-5 h-5" />, label: 'Dashboard', badge: 'Live' },
  { to: '/records', icon: <FolderHeart className="w-5 h-5" />, label: 'Medical Vault' },
  { to: '/upload', icon: <UploadCloud className="w-5 h-5" />, label: 'Upload Data' },
  { to: '/activity', icon: <Activity className="w-5 h-5" />, label: 'Audit Log' },
  { to: '/help', icon: <HelpCircle className="w-5 h-5" />, label: 'Help Node' },
  { to: '/profile', icon: <Settings className="w-5 h-5" />, label: 'Security' },
];

const doctorLinks = [
  { to: '/doctor/dashboard', icon: <LayoutDashboard className="w-5 h-5" />, label: 'Overview', badge: 'Live' },
  { to: '/doctor/quick-access', icon: <Key className="w-5 h-5" />, label: 'Vault Access' },
  { to: '/activity', icon: <Activity className="w-5 h-5" />, label: 'Activity' },
  { to: '/help', icon: <HelpCircle className="w-5 h-5" />, label: 'Resource Hub' },
  { to: '/profile', icon: <Settings className="w-5 h-5" />, label: 'Configuration' },
];

export default function Sidebar({ open, onClose }) {
  const { user, isDoctor, logout } = useAuth();
  const links = isDoctor ? doctorLinks : patientLinks;

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 lg:hidden"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      <motion.aside
        initial={false}
        animate={{ x: open ? 0 : -320 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className={`
          fixed top-0 left-0 z-50 h-full w-80 mesh-gradient-dark
          flex flex-col border-r border-white/10 shadow-2xl
          lg:translate-x-0 lg:static lg:z-0
        `}
      >
        {/* Sidebar Header */}
        <div className="p-8 pb-10 flex items-center justify-between">
          <div className="flex items-center gap-3 group px-2 cursor-pointer">
            <div className="w-10 h-10 grad-primary rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:rotate-6 transition-transform">
              <ShieldCheck className="text-white w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight leading-none uppercase italic">MedVault</h1>
              <span className="text-[9px] font-black text-teal-400 tracking-[0.3em] uppercase mt-1 block opacity-70">Core Engine</span>
            </div>
          </div>
          <button onClick={onClose} className="lg:hidden p-2 rounded-xl bg-white/5 text-slate-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto custom-scrollbar">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={() => onClose?.()}
              className={({ isActive }) =>
                `flex items-center gap-4 px-6 py-4 rounded-[1.5rem] transition-all duration-300 font-bold group relative ${isActive
                  ? 'bg-blue-600 text-white shadow-xl shadow-blue-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`
              }
            >
              <span className="transition-transform duration-300 group-hover:scale-110 z-10">{link.icon}</span>
              <span className="text-[14px] uppercase tracking-widest z-10">{link.label}</span>
              {link.badge && (
                <span className="ml-auto px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-400 text-[8px] font-black uppercase tracking-widest border border-teal-500/30">
                  {link.badge}
                </span>
              )}
              {({ isActive }) => isActive && (
                <motion.div
                  layoutId="active-indicator"
                  className="absolute inset-0 bg-blue-600 rounded-[1.5rem] -z-0"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
            </NavLink>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-6">
          <div className="p-6 rounded-[2rem] glass-md border-white/5 bg-white/5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500/10 rounded-full blur-2xl group-hover:bg-blue-500/20 transition-all"></div>

            <div className="flex items-center gap-4 mb-6 relative z-10">
              <div className="w-12 h-12 rounded-2xl grad-primary flex items-center justify-center font-black text-white shadow-lg overflow-hidden ring-2 ring-white/10 group-hover:scale-105 transition-transform">
                {user?.avatar ? <img src={user.avatar} className="w-full h-full object-cover" /> : user?.name?.[0]?.toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-white truncate leading-tight tracking-tight">{user?.name}</p>
                <div className="flex items-center gap-1.5 mt-1">
                  <div className={`w-1.5 h-1.5 rounded-full ${isDoctor ? 'bg-teal-400' : 'bg-blue-400'} animate-pulse`}></div>
                  <p className="text-[10px] font-bold text-slate-400 truncate uppercase tracking-widest">
                    {isDoctor ? 'Medical Pro' : 'Patient User'}
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={logout}
              className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl bg-slate-900 text-rose-400 font-black text-xs uppercase tracking-widest border border-rose-500/10 hover:bg-rose-500/10 hover:text-rose-300 transition-all active:scale-95 relative z-10"
            >
              <LogOut className="w-4 h-4" /> Sign Out Protocol
            </button>
          </div>

          <div className="mt-6 flex justify-center gap-6 px-4">
            <div className="flex items-center gap-1.5">
              <Shield className="w-3 h-3 text-slate-500" />
              <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">E2E Encrypted</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Lock className="w-3 h-3 text-slate-500" />
              <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">v2.0 Premium</span>
            </div>
          </div>
        </div>
      </motion.aside>
    </>
  );
}
