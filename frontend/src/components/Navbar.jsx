import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import {
  LogOut,
  ShieldCheck,
  User,
  Activity,
  FileText,
  Plus,
  LayoutDashboard,
  Key
} from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function Navbar({ title }) {
  const { user, logout, isDoctor } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Signed out successfully');
      navigate('/login');
    } catch (err) {
      toast.error('Sign out failed');
    }
  };

  const navLinks = isDoctor ? [
    { name: 'Dashboard', path: '/doctor/dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { name: 'Scan Vault', path: '/doctor/quick-access', icon: <Key className="w-4 h-4" /> },
    { name: 'Activity', path: '/activity', icon: <Activity className="w-4 h-4" /> },
    { name: 'Profile', path: '/profile', icon: <User className="w-4 h-4" /> },
  ] : [
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { name: 'Vault', path: '/records', icon: <FileText className="w-4 h-4" /> },
    { name: 'Activity', path: '/activity', icon: <Activity className="w-4 h-4" /> },
    { name: 'Profile', path: '/profile', icon: <User className="w-4 h-4" /> },
  ];

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-40 glass-sm border-b border-white/20 shadow-xl"
    >
      {/* Main Navbar Container - Maximized */}
      <div className="max-w-[1800px] mx-auto px-4 lg:px-12">
        {/* Top Row - Primary Navigation */}
        <div className="flex items-center justify-between min-h-24 py-5 gap-6">

          {/* Left: Enhanced Branding */}
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-3 group/logo">
              <div className="relative">
                <div className="absolute inset-0 bg-blue-600 rounded-2xl blur-lg opacity-40 group-hover/logo:opacity-60 transition-opacity"></div>
                <div className="relative w-14 h-14 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center shadow-2xl shadow-blue-500/30 group-hover/logo:scale-110 group-hover/logo:rotate-12 transition-all duration-300 border-2 border-white/20 overflow-hidden p-2">
                  <img
                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSd_mP4WmzlK0cbChhAP2zR5vVjlGo0xjfQzQ&s"
                    alt="MedVault Logo"
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">
                  Med<span className="text-blue-600">Vault</span>
                </span>
                <span className="text-[8px] font-black text-slate-400 uppercase tracking-[0.3em] mt-1">
                  {isDoctor ? 'Clinical Portal' : 'Patient Portal'}
                </span>
              </div>
            </Link>

            {/* Page Title - Simple Display */}
            <div className="hidden lg:flex items-center px-6 py-3 rounded-2xl bg-white/60 border border-slate-100 shadow-sm">
              <h2 className="text-xl font-black text-slate-900 tracking-tight leading-none uppercase">
                {title || 'Network Hub'}
              </h2>
            </div>
          </div>

          {/* Center: Enhanced Navigation Links */}
          <nav className="hidden xl:flex items-center gap-3 bg-white/70 backdrop-blur-md px-4 py-3 rounded-[2rem] border border-white/80 shadow-lg">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="flex items-center gap-2.5 px-5 py-3 text-[11px] font-black text-slate-600 uppercase tracking-widest hover:text-blue-600 transition-all group/link rounded-xl hover:bg-blue-50 relative"
              >
                <span className="p-2 rounded-xl bg-slate-50 border border-slate-100 group-hover/link:bg-blue-100 group-hover/link:border-blue-200 group-hover/link:scale-110 transition-all shadow-sm">
                  {link.icon}
                </span>
                <span className="font-black">{link.name}</span>
                {link.badge && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[8px] font-black rounded-full flex items-center justify-center shadow-lg">
                    {link.badge}
                  </span>
                )}
              </Link>
            ))}
          </nav>

          {/* Right: User Profile & Actions */}
          <div className="flex items-center gap-5">
            {/* User Profile */}
            <div className="hidden md:flex items-center gap-4 px-5 py-2.5 bg-gradient-to-br from-slate-50 to-white rounded-2xl border border-slate-100 shadow-sm">
              <div className="flex flex-col items-end">
                <span className={`text-[9px] font-black uppercase tracking-[0.2em] ${isDoctor ? 'text-green-600' : 'text-blue-600'}`}>
                  {isDoctor ? 'Dr.' : 'Patient'} {user?.name.split(' ')[0]}
                </span>
                <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">
                  ID: {user?.email.substring(0, 8)}...
                </span>
              </div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-black text-lg shadow-lg border-2 border-white/50 overflow-hidden">
                <img
                  src={user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email}`}
                  className="w-full h-full object-cover"
                  alt="User avatar"
                />
              </div>
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="p-4 rounded-2xl text-blue-500 hover:bg-blue-50 border border-transparent hover:border-blue-200 transition-all active:scale-95 group/logout shadow-sm bg-white/60"
              title="Logout Protocol"
            >
              <LogOut className="w-5 h-5 group-hover/logout:rotate-12 transition-transform" />
            </button>
          </div>
        </div>

        {/* Bottom Row - Mobile Navigation */}
        <div className="xl:hidden pb-4">
          <nav className="flex items-center gap-2 bg-white/70 backdrop-blur-md px-3 py-2.5 rounded-[2rem] border border-white/80 shadow-lg overflow-x-auto no-scrollbar">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="flex items-center gap-2 px-4 py-2.5 text-[10px] font-black text-slate-600 uppercase tracking-widest hover:text-blue-600 transition-all group/link rounded-xl hover:bg-blue-50 flex-shrink-0 relative"
              >
                <span className="p-1.5 rounded-lg bg-slate-50 border border-slate-100 group-hover/link:bg-blue-100 group-hover/link:border-blue-200 transition-all">
                  {link.icon}
                </span>
                <span>{link.name}</span>
                {link.badge && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[7px] font-black rounded-full flex items-center justify-center">
                    {link.badge}
                  </span>
                )}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </motion.header>
  );
}
