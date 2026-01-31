import { motion } from 'framer-motion';

const variants = {
  primary: 'bg-blue-600 text-white shadow-lg shadow-blue-200 hover:shadow-blue-300 hover:bg-blue-700 active:bg-blue-800',
  secondary: 'bg-teal-500 text-white shadow-lg shadow-teal-200 hover:shadow-teal-300 hover:bg-teal-600 active:bg-teal-700',
  outline: 'bg-white border-2 border-slate-200 text-slate-700 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50',
  danger: 'bg-rose-500 text-white shadow-lg shadow-rose-200 hover:bg-rose-600',
  premium: 'grad-primary text-white shadow-xl shadow-blue-200 hover:brightness-110 ring-1 ring-white/20',
  ghost: 'bg-transparent hover:bg-slate-100 text-slate-600',
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
  const sizeClass =
    size === 'sm' ? 'px-4 py-2 text-[10px]' :
      size === 'lg' ? 'px-10 py-5 text-lg' :
        'px-8 py-4 text-xs';

  return (
    <motion.button
      type={type}
      disabled={disabled || loading}
      whileHover={disabled || loading ? {} : { scale: 1.02, y: -2 }}
      whileTap={disabled || loading ? {} : { scale: 0.96 }}
      transition={{ type: 'spring', stiffness: 400, damping: 15 }}
      className={`
        inline-flex items-center justify-center rounded-2xl font-bold uppercase tracking-widest transition-all
        disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed
        ${variants[variant]} ${sizeClass} ${className}
      `}
      {...props}
    >
      {loading ? (
        <span className="flex items-center justify-center">
          <svg className="animate-spin h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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
