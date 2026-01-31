import { useState } from 'react';
import { motion } from 'framer-motion';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const pageVariants = {
  initial: { opacity: 0, x: -10 },
  in: { opacity: 1, x: 0 },
  out: { opacity: 0, x: 10 },
};

const pageTransition = { type: 'tween', duration: 0.25 };

export default function Layout({ children, title }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col lg:ml-0 min-w-0">
        <Navbar title={title} onMenuClick={() => setSidebarOpen((o) => !o)} />
        <motion.main
          variants={pageVariants}
          initial="initial"
          animate="in"
          exit="out"
          transition={pageTransition}
          className="flex-1 p-4 lg:p-8 max-w-7xl w-full mx-auto"
        >
          {children}
        </motion.main>
      </div>
    </div>
  );
}
