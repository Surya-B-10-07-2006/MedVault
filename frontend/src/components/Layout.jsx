import { motion, AnimatePresence } from 'framer-motion';
import Navbar from './Navbar';

const pageVariants = {
  initial: { opacity: 0, scale: 0.98, y: 10 },
  in: { opacity: 1, scale: 1, y: 0 },
  out: { opacity: 0, scale: 1.02, y: -10 },
};

const pageTransition = {
  type: 'spring',
  stiffness: 260,
  damping: 30
};

export default function Layout({ children, title }) {
  return (
    <div className="min-h-screen mesh-gradient flex flex-col overflow-hidden">
      <Navbar title={title} />

      <main className="flex-1 overflow-y-auto custom-scrollbar p-6 lg:p-10">
        <div className="max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={title}
              variants={pageVariants}
              initial="initial"
              animate="in"
              exit="out"
              transition={pageTransition}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Decorative corner glow */}
      <div className="fixed bottom-0 right-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[120px] -z-10 pointer-events-none"></div>
      <div className="fixed top-0 left-0 w-[300px] h-[300px] bg-teal-500/5 rounded-full blur-[100px] -z-10 pointer-events-none"></div>
    </div>
  );
}
