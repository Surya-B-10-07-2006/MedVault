import { motion } from 'framer-motion';
import { ShieldCheck } from 'lucide-react';

export default function Loader({ text = 'Preparing Vault...' }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] gap-8">
      <div className="relative">
        {/* Pulsing rings */}
        <motion.div
          animate={{ scale: [1, 1.5, 1], opacity: [0.1, 0.3, 0.1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute -inset-8 bg-medBlue rounded-full blur-2xl"
        />
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
          className="absolute -inset-4 bg-medTeal rounded-full blur-xl"
        />

        {/* Core Icon */}
        <motion.div
          animate={{
            rotateY: [0, 180, 360],
          }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="relative w-20 h-20 grad-hero rounded-[1.5rem] flex items-center justify-center shadow-2xl shadow-medBlue/30 border border-white/30 z-10"
        >
          <ShieldCheck className="text-white w-10 h-10" />
        </motion.div>
      </div>

      <div className="text-center space-y-2">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-medDark font-black text-xl italic uppercase tracking-widest"
        >
          {text}
        </motion.p>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: 120 }}
          className="h-1 grad-primary mx-auto rounded-full overflow-hidden"
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <motion.div
            animate={{ x: [-120, 120] }}
            transition={{ duration: 1, repeat: Infinity }}
            className="w-1/2 h-full bg-white/50"
          />
        </motion.div>
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em] mt-4">
          End-to-End Encryption Active
        </p>
      </div>
    </div>
  );
}
