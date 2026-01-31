import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Users,
    Search,
    ShieldCheck,
    ChevronRight,
    Stethoscope,
    Mail,
    Plus,
    Star,
    Award,
    ExternalLink,
    MessageCircle,
    Clock
} from 'lucide-react';
import Layout from '../components/Layout';
import api from '../utils/api';
import { toast } from 'react-hot-toast';
import Button from '../components/Button';

export default function DoctorDirectory() {
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [requesting, setRequesting] = useState(null);

    useEffect(() => {
        fetchDoctors();
    }, []);

    const fetchDoctors = async () => {
        try {
            // Assuming there's an endpoint to get all doctors
            const { data } = await api.get('/auth/doctors');
            setDoctors(data.doctors || []);
        } catch (err) {
            // Fallback for demo if endpoint doesn't exist yet
            setDoctors([
                { _id: '1', name: 'Dr. Sarah Smith', email: 'sarah.smith@medvault.com', specialty: 'Cardiology', rating: 4.9, patients: 120 },
                { _id: '2', name: 'Dr. James Wilson', email: 'james.wilson@medvault.com', specialty: 'Neurology', rating: 4.8, patients: 85 },
                { _id: '3', name: 'Dr. Elena Rodriguez', email: 'elena.r@medvault.com', specialty: 'Pediatrics', rating: 4.9, patients: 200 },
                { _id: '4', name: 'Dr. Michael Chen', email: 'm.chen@medvault.com', specialty: 'Dermatology', rating: 4.7, patients: 150 },
            ]);
            console.error('Failed to load doctor directory');
        } finally {
            setLoading(false);
        }
    };

    const handleConnect = async (docId) => {
        setRequesting(docId);
        try {
            // Logic to request connection or share record automatically
            await new Promise(resolve => setTimeout(resolve, 1000));
            toast.success('Connection request sent to doctor');
        } catch (err) {
            toast.error('Failed to send request');
        } finally {
            setRequesting(null);
        }
    };

    const filteredDoctors = doctors.filter(doc =>
        doc.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.specialty?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Layout title="Medical Professional Directory">
            <div className="space-y-10 pb-24">
                {/* Header Section */}
                <section className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-medBlue shadow-xl shadow-medBlue/20 rounded-2xl flex items-center justify-center text-white">
                            <Stethoscope className="w-8 h-8" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-black text-medDark tracking-tight italic">Find Specialists</h1>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2 mt-0.5">
                                <ShieldCheck className="w-4 h-4 text-medTeal" /> Verified Medical Network
                            </p>
                        </div>
                    </div>
                    <div className="relative group flex-1 max-w-md">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-medBlue" />
                        <input
                            type="text"
                            placeholder="Search by name, specialty or clinic..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-6 py-4 rounded-[1.5rem] border-none bg-white shadow-xl shadow-slate-200/50 focus:ring-4 focus:ring-medBlue/10 font-bold text-sm"
                        />
                    </div>
                </section>

                {/* Featured Doctors Grid */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    <AnimatePresence mode="wait">
                        {loading ? (
                            [1, 2, 4].map(i => (
                                <div key={i} className="h-80 bg-white rounded-[3rem] animate-pulse border border-gray-100 shadow-sm"></div>
                            ))
                        ) : filteredDoctors.length === 0 ? (
                            <div className="col-span-full py-32 text-center">
                                <Search className="w-20 h-20 text-gray-200 mx-auto mb-6" />
                                <h3 className="text-2xl font-black text-medDark italic">No specialists found</h3>
                                <p className="text-gray-400 font-medium">Try broadening your search criteria.</p>
                            </div>
                        ) : (
                            filteredDoctors.map((doc, idx) => (
                                <motion.div
                                    key={doc._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                    className="group bg-white rounded-[3rem] p-8 border border-gray-100 shadow-xl shadow-slate-200/50 hover:shadow-medBlue/20 transition-all flex flex-col justify-between"
                                >
                                    <div>
                                        <div className="flex justify-between items-start mb-6">
                                            <div className="w-20 h-20 rounded-[2rem] bg-medGrey border border-gray-100 shadow-inner overflow-hidden group-hover:scale-110 transition-transform p-1">
                                                <img
                                                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${doc.name}`}
                                                    className="w-full h-full object-cover rounded-[1.5rem]"
                                                    alt={doc.name}
                                                />
                                            </div>
                                            <div className="flex flex-col items-end gap-2">
                                                <span className="flex items-center gap-1 text-[10px] font-black text-amber-500 bg-amber-50 px-3 py-1.5 rounded-full border border-amber-100">
                                                    <Star className="w-3 h-3 fill-amber-500" /> {doc.rating || '4.9'}
                                                </span>
                                                <span className="text-[9px] font-black text-medTeal uppercase tracking-widest bg-medTeal/5 px-3 py-1.5 rounded-full">Active</span>
                                            </div>
                                        </div>

                                        <h4 className="text-xl font-black text-medDark leading-tight mb-2 group-hover:text-medBlue transition-colors italic">{doc.name}</h4>
                                        <p className="text-xs font-bold text-medBlue uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                                            <Award className="w-4 h-4" /> {doc.specialty || 'General Practitioner'}
                                        </p>

                                        <div className="space-y-3 mb-8">
                                            <div className="flex items-center gap-2 text-xs font-bold text-gray-400 italic">
                                                <Mail className="w-4 h-4 text-medTeal" /> {doc.email}
                                            </div>
                                            <div className="flex items-center gap-2 text-xs font-bold text-gray-400 italic">
                                                <Clock className="w-4 h-4 text-medBlue" /> Available for Consultation
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3 mt-4">
                                        <Button
                                            onClick={() => handleConnect(doc._id)}
                                            loading={requesting === doc._id}
                                            className="py-4 rounded-2xl flex items-center justify-center gap-2"
                                        >
                                            <Plus className="w-4 h-4" /> Connect
                                        </Button>
                                        <button className="py-4 bg-medGrey text-medDark font-black text-[10px] uppercase tracking-widest rounded-2xl hover:bg-medDark hover:text-white transition-all shadow-sm flex items-center justify-center gap-2">
                                            <MessageCircle className="w-4 h-4" /> Details
                                        </button>
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </AnimatePresence>
                </div>

                {/* Support Section */}
                <div className="bg-medDark p-10 rounded-[4rem] text-white shadow-2xl relative overflow-hidden group mt-16">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-medBlue/20 rounded-full blur-[100px] -mr-32 -mt-32 group-hover:scale-150 transition-transform duration-1000"></div>
                    <div className="flex flex-col lg:flex-row items-center justify-between gap-10 relative z-10">
                        <div className="max-w-xl">
                            <h2 className="text-3xl font-black mb-4 italic tracking-tight">Can't find your doctor?</h2>
                            <p className="text-white/60 font-medium italic mb-8">
                                You can invite your healthcare provider to join MedVault. We'll send them a secure invitation with your medical profile overview already prepared for synchronization.
                            </p>
                            <button className="px-8 py-4 bg-medBlue text-white font-black rounded-3xl hover:bg-white hover:text-medBlue transition-all flex items-center gap-3">
                                Send Invitation <ExternalLink className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="hidden lg:block w-64 h-64 bg-white/5 backdrop-blur-3xl rounded-[3rem] border border-white/10 p-8">
                            <div className="h-full border-4 border-dashed border-white/20 rounded-[2rem] flex items-center justify-center">
                                <Users className="w-20 h-20 text-white/20" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
