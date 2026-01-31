import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Share2, Upload, ChevronRight, Activity, Lock, FlaskConical, LayoutDashboard, Search } from 'lucide-react';
import Button from '../components/Button';
import { useAuth } from '../context/AuthContext';

export default function Home() {
    const { user } = useAuth();
    const navigate = useNavigate();

    const features = [
        {
            icon: <Lock className="w-8 h-8 text-blue-600" />,
            title: 'Secure Cloud Vault',
            description: 'Your medical data is encrypted with AES-256 and stored in a decentralized secure vault.',
        },
        {
            icon: <Share2 className="w-8 h-8 text-green-500" />,
            title: 'Dynamic Sharing',
            description: 'Share records with doctors instantly using secure, time-limited access codes.',
        },
        {
            icon: <Activity className="w-8 h-8 text-blue-500" />,
            title: 'Health Analytics',
            description: 'Keep track of your health timeline with a modern, data-driven medical dashboard.',
        },
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <div className="min-h-screen mesh-gradient overflow-x-hidden">
            {/* Navbar */}
            <nav className="sticky top-0 w-full z-50 glass-md border-b border-white/40">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-3 group cursor-pointer" onClick={() => navigate('/')}>
                        <div className="w-11 h-11 grad-primary rounded-2xl flex items-center justify-center shadow-lg shadow-blue-200 group-hover:rotate-6 transition-transform overflow-hidden p-2">
                            <img
                                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSd_mP4WmzlK0cbChhAP2zR5vVjlGo0xjfQzQ&s"
                                alt="MedVault Logo"
                                className="w-full h-full object-contain"
                            />
                        </div>
                        <span className="text-2xl font-bold text-slate-900 tracking-tight grad-text uppercase">MedVault</span>
                    </div>

                    <div className="hidden md:flex items-center gap-8">
                        {['Features', 'Security', 'About'].map((link) => (
                            <a key={link} href={`#${link.toLowerCase()}`} className="text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors uppercase tracking-widest">
                                {link}
                            </a>
                        ))}
                    </div>

                    <div className="flex items-center gap-4">
                        {user ? (
                            <Link to={user.role === 'doctor' ? '/doctor/dashboard' : '/dashboard'}>
                                <Button variant="premium" className="rounded-2xl flex items-center gap-2">
                                    <LayoutDashboard className="w-4 h-4" /> Portal
                                </Button>
                            </Link>
                        ) : (
                            <>
                                <Link to="/login" className="hidden sm:block text-xs font-bold text-slate-600 hover:text-blue-600 transition-colors uppercase tracking-widest px-4">
                                    Sign In
                                </Link>
                                <Link to="/register">
                                    <Button variant="premium" className="rounded-2xl">Join Now</Button>
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative pt-24 pb-32 px-6">
                <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-[10px] font-black uppercase tracking-[0.2em] mb-8">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                            </span>
                            Next-Gen Medical Security
                        </div>
                        <h1 className="text-6xl md:text-7xl font-bold text-slate-900 leading-[1.1] mb-8 tracking-tight">
                            The Future of <br />
                            <span className="grad-text italic">Health Data</span> <br />
                            is Personalized.
                        </h1>
                        <p className="text-xl text-slate-600 mb-12 max-w-lg leading-relaxed font-medium">
                            Experience a premium, secure, and intuitive digital vault for all your medical records. Designed for patients who value privacy and accessibility.
                        </p>
                        <div className="flex flex-wrap gap-5">
                            <Link to="/register">
                                <Button size="lg" variant="primary" className="rounded-2xl shadow-2xl shadow-blue-200">
                                    Get Early Access
                                </Button>
                            </Link>
                            <Link to="/login">
                                <Button size="lg" variant="outline" className="rounded-2xl flex items-center gap-3">
                                    Watch Flow <ChevronRight className="w-5 h-5" />
                                </Button>
                            </Link>
                        </div>

                        <div className="mt-16 flex items-center gap-10 border-t border-slate-200 pt-10">
                            {[
                                { icon: <Activity className="text-green-500 w-5 h-5" />, label: 'Real-time Sync' },
                                { icon: <Lock className="text-blue-500 w-5 h-5" />, label: 'End-to-End Encryption' }
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-white shadow-sm border border-slate-100">{item.icon}</div>
                                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{item.label}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, rotate: -5 }}
                        animate={{ opacity: 1, scale: 1, rotate: 0 }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="relative"
                    >
                        <div className="absolute -inset-10 bg-gradient-to-r from-blue-500/20 to-green-500/20 rounded-full blur-[100px] animate-pulse"></div>
                        <div className="relative glass-lg rounded-[4rem] p-4 shadow-2xl border border-white/50 overflow-hidden group">
                            <div className="absolute inset-0 bg-blue-600/5 group-hover:bg-blue-600/0 transition-colors duration-700"></div>
                            <img
                                src="/hero-doctor.png"
                                alt="Medical Professional"
                                className="relative w-full rounded-[3rem] drop-shadow-2xl z-10 hover:scale-[1.02] transition-transform duration-700"
                            />
                        </div>

                        {/* Floating Interaction Cards */}
                        <motion.div
                            animate={{ y: [0, -15, 0] }}
                            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                            className="absolute -top-10 -right-10 glass-lg p-6 rounded-3xl shadow-xl z-20 border border-white/60"
                        >
                            <FlaskConical className="w-10 h-10 text-blue-600" />
                            <div className="mt-3">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Lab Report</p>
                                <p className="text-sm font-bold text-slate-800 tracking-tight">Synced Successfully</p>
                            </div>
                        </motion.div>

                        <motion.div
                            animate={{ y: [0, 15, 0] }}
                            transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1 }}
                            className="absolute -bottom-6 -left-12 glass-lg p-6 rounded-3xl shadow-xl z-20 border border-white/60"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                                    <Shield className="w-6 h-6 text-green-600" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Security Status</p>
                                    <p className="text-sm font-bold text-slate-800 tracking-tight">Maximum Shield</p>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Features Grid */}
            <section id="features" className="py-32 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-20">
                        <h2 className="text-4xl font-bold text-slate-900 mb-6 tracking-tight">Engineered for Excellence</h2>
                        <div className="w-24 h-2 bg-gradient-to-r from-blue-600 to-green-400 mx-auto rounded-full shadow-lg shadow-blue-100"></div>
                    </div>

                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="grid md:grid-cols-3 gap-10"
                    >
                        {features.map((feature, idx) => (
                            <motion.div
                                key={idx}
                                variants={itemVariants}
                                className="group p-12 rounded-[3rem] glass-md hover-lift cursor-default text-center border-white/40"
                            >
                                <div className="w-20 h-20 bg-white rounded-[2rem] shadow-sm flex items-center justify-center mb-8 mx-auto group-hover:scale-110 group-hover:rotate-3 transition-all">
                                    {feature.icon}
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900 mb-4 tracking-tight">{feature.title}</h3>
                                <p className="text-slate-500 leading-relaxed font-medium italic">
                                    {feature.description}
                                </p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-32 px-6">
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="max-w-6xl mx-auto rounded-[4rem] mesh-gradient-dark p-20 text-center text-white shadow-2xl overflow-hidden relative border border-white/10"
                >
                    <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/20 rounded-full blur-[120px] -mr-48 -mt-48"></div>
                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-green-500/10 rounded-full blur-[120px] -ml-48 -mb-48"></div>

                    <div className="relative z-10">
                        <h2 className="text-5xl md:text-6xl font-bold mb-8 tracking-tighter leading-tight">
                            Ready to Claim Your <br />
                            <span className="text-green-400 italic font-black">Digital Sovereignty?</span>
                        </h2>
                        <p className="text-xl text-slate-300 mb-12 max-w-2xl mx-auto font-medium">
                            Join the global movement of patients taking control of their medical records. Secure, private, and powerful.
                        </p>
                        <div className="flex flex-wrap justify-center gap-6">
                            <Link to="/register">
                                <Button size="lg" variant="secondary" className="rounded-full px-16 shadow-2xl shadow-green-500/20 active:scale-95">
                                    Initialize My Vault
                                </Button>
                            </Link>
                        </div>
                    </div>
                </motion.div>
            </section>

            {/* Sub Footer */}
            <footer className="py-16 border-t border-slate-200/50 text-center">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-12 text-slate-400 text-xs font-bold uppercase tracking-[0.3em]">
                        <div className="flex items-center gap-8">
                            <a href="#" className="hover:text-blue-600 transition-colors">Privacy Protocol</a>
                            <a href="#" className="hover:text-blue-600 transition-colors">Security Audit</a>
                            <a href="#" className="hover:text-blue-600 transition-colors">Compliance</a>
                        </div>
                        <p>© 2026 MedVault Platform. All Protocols Reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
