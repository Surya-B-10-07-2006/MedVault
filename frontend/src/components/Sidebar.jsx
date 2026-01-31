import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
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
  Link,
  Eye,
  FileText,
  UserCheck,
  Key,
  HelpCircle,
  Search
} from 'lucide-react';

const patientLinks = [
  { to: '/dashboard', icon: <LayoutDashboard className="w-5 h-5" />, label: 'Dashboard' },
  { to: '/records', icon: <FolderHeart className="w-5 h-5" />, label: 'My Records' },
  { to: '/upload', icon: <UploadCloud className="w-5 h-5" />, label: 'Upload' },
  { to: '/help', icon: <HelpCircle className="w-5 h-5" />, label: 'Help Center' },
  { to: '/activity', icon: <Activity className="w-5 h-5" />, label: 'Activity' },
  { to: '/profile', icon: <UserCircle className="w-5 h-5" />, label: 'Profile' },
];

const doctorLinks = [
  { to: '/doctor/dashboard', icon: <LayoutDashboard className="w-5 h-5" />, label: 'Dashboard' },
  { to: '/doctor/quick-access', icon: <Key className="w-5 h-5" />, label: 'Quick Access' },
  { to: '/help', icon: <HelpCircle className="w-5 h-5" />, label: 'Help Center' },
  { to: '/activity', icon: <Activity className="w-5 h-5" />, label: 'Activity' },
  { to: '/profile', icon: <UserCircle className="w-5 h-5" />, label: 'Profile' },
];

export default function Sidebar({ open, onClose }) {
  const { user, isDoctor, logout } = useAuth();
  const links = isDoctor ? doctorLinks : patientLinks;

  return (
    <>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-medDark/40 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      <motion.aside
        initial={false}
        animate={{ x: open ? 0 : -280 }}
        className={`
          fixed top-0 left-0 z-50 h-full w-72 bg-white shadow-2xl shadow-medBlue/5
          flex flex-col border-r border-gray-100
          lg:translate-x-0 lg:static lg:z-0
        `}
      >
        <div className="p-8 border-b border-gray-50 flex items-center gap-3">
          <img 
            src="/assets/logo.svg" 
            alt="MedVault Logo" 
            className="h-8 w-auto"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
          <div className="flex items-center gap-3" style={{display: 'none'}}>
            <div className="w-10 h-10 grad-primary rounded-xl flex items-center justify-center shadow-lg shadow-medBlue/20">
              <ShieldCheck className="text-white w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-black text-medDark tracking-tight leading-none">MedVault</h1>
              <span className="text-[10px] font-bold text-medBlue tracking-widest uppercase mt-1 block">Safe & Secure</span>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={() => onClose?.()}
              className={({ isActive }) =>
                `flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 font-bold group ${isActive
                  ? 'bg-medBlue text-white shadow-xl shadow-medBlue/20 scale-105 ml-2'
                  : 'text-gray-500 hover:text-medDark hover:bg-medGrey'
                }`
              }
            >
              <span className={`transition-transform duration-300 group-hover:scale-110`}>{link.icon}</span>
              <span className="text-[15px]">{link.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="p-6 border-t border-gray-50 bg-medGrey/30">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-white border border-gray-200 flex items-center justify-center font-black text-medBlue shadow-sm overflow-hidden">
              {user?.avatar ? <img src={user.avatar} className="w-full h-full object-cover" /> : user?.name?.[0]?.toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-black text-medDark truncate leading-tight">{user?.name}</p>
              <p className="text-xs font-medium text-gray-500 truncate mt-0.5">{user?.role === 'doctor' ? 'Medical Professional' : 'Patient'}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-white text-rose-500 font-extrabold text-sm border border-rose-100 hover:bg-rose-50 transition-all shadow-sm"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </motion.aside>
    </>
  );
}
