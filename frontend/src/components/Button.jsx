import { motion } from 'framer-motion';

const variants = {
  primary: 'grad-primary text-white shadow-xl shadow-medBlue/20 hover:brightness-110',
  secondary: 'bg-white border-2 border-medBlue text-medBlue hover:bg-medBlue/5',
  danger: 'bg-rose-500 hover:bg-rose-600 text-white shadow-xl shadow-rose-500/20',
  ghost: 'bg-transparent hover:bg-medBlue/5 text-medBlue',
};

export default function Button({
  children,
  variant = 'primary',
  type = 'button',
  disabled = false,
  loading = false,
  className = '',
  size = 'md',
  ...props
}) {
  const sizeClass = size === 'sm' ? 'px-4 py-2 text-sm' : size === 'lg' ? 'px-10 py-5 text-xl' : 'px-6 py-3.5';

  return (
    <motion.button
      type={type}
      disabled={disabled || loading}
      whileHover={disabled || loading ? {} : { scale: 1.03, y: -2 }}
      whileTap={disabled || loading ? {} : { scale: 0.98 }}
      className={`
        inline-flex items-center justify-center rounded-2xl font-black uppercase tracking-tight transition-all duration-300
        disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed
        ${variants[variant]} ${sizeClass} ${className}
      `}
      {...props}
    >
      {loading ? (
        <span className="flex items-center justify-center">
          <svg className="animate-spin h-5 w-5 mr-0 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </span>
      ) : (
        children
      )}
    </motion.button>
  );
}
