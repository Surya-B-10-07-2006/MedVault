import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Share2, Upload, ChevronRight, Activity, Lock, FlaskConical, LayoutDashboard, Menu } from 'lucide-react';
import Button from '../components/Button';
import { useAuth } from '../context/AuthContext';

export default function Home() {
    const { user } = useAuth();
    const navigate = useNavigate();

    const features = [
        {
            icon: <Lock className="w-8 h-8 text-medBlue" />,
            title: 'Secure Cloud Storage',
            description: 'Your medical data is encrypted and stored securely in the cloud, accessible only by you.',
        },
        {
            icon: <Share2 className="w-8 h-8 text-medBlue" />,
            title: 'Easy Sharing',
            description: 'Share your records with doctors and family members instantly with granular access control.',
        },
        {
            icon: <Upload className="w-8 h-8 text-medBlue" />,
            title: 'Upload Any File',
            description: 'Support for PDFs, Scans, X-rays, and Lab reports. Keep everything in one place.',
        },
    ];

    return (
        <div className="min-h-screen bg-white overflow-x-hidden">
            {/* Navbar */}
            <nav className="sticky top-0 w-full z-50 bg-white shadow-xl border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-11 h-11 grad-primary rounded-2xl flex items-center justify-center shadow-lg shadow-medBlue/20">
                            <Shield className="text-white w-6 h-6" />
                        </div>
                        <span className="text-2xl font-black text-medDark tracking-tight italic">MedVault</span>
                    </div>

                    <div className="flex items-center gap-6">
                        {user ? (
                            <Link to={user.role === 'doctor' ? '/doctor/dashboard' : '/dashboard'}>
                                <Button className="rounded-full px-8 flex items-center gap-2">
                                    <LayoutDashboard className="w-4 h-4" /> Go to Dashboard
                                </Button>
                            </Link>
                        ) : (
                            <>
                                <Link to="/login" className="text-sm font-black text-medDark hover:text-medBlue transition-colors uppercase tracking-widest px-4">
                                    Sign In
                                </Link>
                                <Link to="/register">
                                    <Button className="rounded-full px-8">Create Account</Button>
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="pt-20 pb-20 px-4 grad-medical">
                <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h1 className="text-6xl font-extrabold text-medDark leading-tight mb-6">
                            Your Medical Records. <br />
                            <span className="text-medBlue underline decoration-medBlue/20">Secured.</span> Accessible. <br />
                            <span className="text-medTeal">Anytime.</span>
                        </h1>
                        <p className="text-xl text-gray-600 mb-10 max-w-lg leading-relaxed">
                            Take control of your health journey with our secure, patient-centric digital vault. Store reports, share with doctors, and access your history instantly.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <Link to="/register">
                                <Button className="px-10 py-4 text-lg rounded-full shadow-xl shadow-medBlue/20">
                                    Get Started Free
                                </Button>
                            </Link>
                            <Link to="/login">
                                <button className="px-10 py-4 text-lg font-bold text-medDark hover:bg-medBlue/5 rounded-full transition-all flex items-center gap-2">
                                    View Demo <ChevronRight className="w-5 h-5" />
                                </button>
                            </Link>
                        </div>

                        <div className="mt-12 flex items-center gap-8 border-t border-gray-100 pt-8">
                            <div className="flex items-center gap-2">
                                <Activity className="text-medTeal w-5 h-5" />
                                <span className="text-sm font-medium text-gray-500">Live Tracking</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Lock className="text-medBlue w-5 h-5" />
                                <span className="text-sm font-medium text-gray-500">AES-256 Encryption</span>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="relative"
                    >
                        <div className="absolute -inset-4 bg-medBlue/10 rounded-full blur-3xl animate-pulse"></div>
                        <img
                            src="/hero-doctor.png"
                            alt="Medical Professional"
                            className="relative w-full drop-shadow-2xl z-10"
                        />
                        {/* Animated floating icons */}
                        <motion.div
                            animate={{ y: [0, -20, 0] }}
                            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                            className="absolute top-20 right-10 bg-white p-4 rounded-2xl shadow-lg z-20"
                        >
                            <FlaskConical className="w-8 h-8 text-purple-500" />
                        </motion.div>
                        <motion.div
                            animate={{ y: [0, 20, 0] }}
                            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                            className="absolute bottom-20 left-0 bg-white p-4 rounded-2xl shadow-lg z-20"
                        >
                            <Shield className="w-8 h-8 text-medTeal" />
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-24 px-4 bg-white">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-medDark mb-4">Why MedVault?</h2>
                        <div className="w-20 h-1.5 grad-primary mx-auto rounded-full"></div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {features.map((feature, idx) => (
                            <motion.div
                                key={idx}
                                whileHover={{ y: -10 }}
                                className="p-10 rounded-3xl bg-medGrey border border-gray-100 hover:border-medBlue/20 hover:shadow-2xl hover:shadow-medBlue/10 transition-all cursor-default"
                            >
                                <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-6">
                                    {feature.icon}
                                </div>
                                <h3 className="text-2xl font-bold text-medDark mb-4">{feature.title}</h3>
                                <p className="text-gray-600 leading-relaxed font-medium">
                                    {feature.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Footer */}
            <section className="py-20 px-4">
                <div className="max-w-5xl mx-auto rounded-[3rem] grad-hero p-16 text-center text-white shadow-2xl overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full blur-3xl -ml-32 -mb-32"></div>

                    <div className="relative z-10">
                        <h2 className="text-5xl font-extrabold mb-8 italic">Ready to secure your health data?</h2>
                        <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto">
                            Join thousands of patients and doctors today. Registration takes less than 2 minutes.
                        </p>
                        <div className="flex flex-wrap justify-center gap-6">
                            <Link to="/register">
                                <button className="px-12 py-5 bg-white text-medBlue font-extrabold text-xl rounded-full shadow-2xl hover:scale-105 transition-transform">
                                    Create Account Now
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Sub Footer */}
            <footer className="py-12 border-t border-gray-100 text-center text-gray-400 font-medium">
                <p>© 2026 MedVault. Your privacy is our priority.</p>
            </footer>
        </div>
    );
}
