import { motion } from 'framer-motion';

export default function Card({ children, className = '', hover = true, ...props }) {
  const hoverProps = hover
    ? { whileHover: { scale: 1.01, boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' } }
    : {};
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      {...hoverProps}
      className={'bg-white rounded-xl shadow-card p-6 transition-shadow ' + className}
      {...props}
    >
      {children}
    </motion.div>
  );
}
