import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { motion, useScroll, useSpring } from 'framer-motion';
import { useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Loader from './components/Loader';

import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import NotFound from './pages/NotFound';

import PatientDashboard from './pages/PatientDashboard';
import DoctorDashboard from './pages/DoctorDashboard';
import UploadRecord from './pages/UploadRecord';
import ViewRecords from './pages/ViewRecords';
import PatientSharedRecords from './pages/PatientSharedRecords';
import ShareRecord from './pages/ShareRecord';
import ViewRequests from './pages/ViewRequests';
import Profile from './pages/Profile';
import ProfileSecurity from './pages/ProfileSecurity';
import ProfileAccounts from './pages/ProfileAccounts';
import ProfilePrivacy from './pages/ProfilePrivacy';
import ActivityLogs from './pages/ActivityLogs';
import Timeline from './pages/Timeline';

import QuickAccess from './pages/QuickAccess';
import SearchPatients from './pages/SearchPatients';
import HelpCenter from './pages/HelpCenter';
import DoctorShared from './pages/DoctorShared';
import DoctorRequests from './pages/DoctorRequests';
import DoctorPatients from './pages/DoctorPatients';
import DoctorRequestAccess from './pages/DoctorRequestAccess';
import DoctorRecordView from './pages/DoctorRecordView';
import SimpleAccess from './pages/SimpleAccess';
import CodeAccess from './pages/CodeAccess';
import DoctorDirectory from './pages/DoctorDirectory';
import Appointments from './pages/Appointments';
import Messages from './pages/Messages';

function AppRoutes() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader text="Loading..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen mesh-gradient relative">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={user ? <Navigate to={user.role === 'doctor' ? '/doctor/dashboard' : '/dashboard'} replace /> : <Login />} />
        <Route path="/register" element={user ? <Navigate to={user.role === 'doctor' ? '/doctor/dashboard' : '/dashboard'} replace /> : <Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        <Route path="/dashboard" element={<ProtectedRoute allowedRoles={['patient', 'admin']}><PatientDashboard /></ProtectedRoute>} />
        <Route path="/records" element={<ProtectedRoute allowedRoles={['patient', 'admin']}><ViewRecords /></ProtectedRoute>} />
        <Route path="/upload" element={<ProtectedRoute allowedRoles={['patient', 'admin']}><UploadRecord /></ProtectedRoute>} />
        <Route path="/help" element={<ProtectedRoute><HelpCenter /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/activity" element={<ProtectedRoute><ActivityLogs /></ProtectedRoute>} />

        <Route path="/doctor/dashboard" element={<ProtectedRoute allowedRoles={['doctor', 'admin']}><DoctorDashboard /></ProtectedRoute>} />
        <Route path="/doctor/quick-access" element={<ProtectedRoute allowedRoles={['doctor', 'admin']}><QuickAccess /></ProtectedRoute>} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

function App() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <>
      <motion.div className="scroll-progress" style={{ scaleX }} />
      <AppRoutes />
    </>
  );
}
export default App;
