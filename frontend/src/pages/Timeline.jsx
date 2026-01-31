import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Calendar,
    FileText,
    ChevronRight,
    ArrowRight,
    History,
    Activity,
    CheckCircle2,
    Clock
} from 'lucide-react';
import Layout from '../components/Layout';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

export default function MedicalTimeline() {
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    useEffect(() => {
        const fetchRecords = async () => {
            try {
                const { data } = await api.get(`/records/${user.id}`);
                setRecords(data.records);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchRecords();
    }, [user.id]);

    return (
        <Layout title="Medical History Timeline">
            <div className="max-w-4xl mx-auto pb-24">
                <div className="flex items-center gap-4 mb-16">
                    <div className="w-16 h-16 bg-medTeal shadow-xl shadow-medTeal/20 rounded-[2rem] flex items-center justify-center text-white">
                        <Activity className="w-8 h-8" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-black text-medDark tracking-tight italic uppercase italic">Your Health Journey</h1>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] flex items-center gap-2 mt-1">
                            <History className="w-3.5 h-3.5" /> Chronological Records Archive
                        </p>
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center p-20"><span className="w-10 h-10 border-4 border-medBlue border-t-transparent rounded-full animate-spin"></span></div>
                ) : records.length === 0 ? (
                    <div className="bg-white rounded-[3rem] p-20 text-center border border-gray-100 shadow-2xl">
                        <Calendar className="w-20 h-20 text-gray-100 mx-auto mb-6" />
                        <h3 className="text-2xl font-black text-medDark mb-2 italic">Timeline is Empty</h3>
                        <p className="text-gray-400 font-medium">Your medical journey will start appearing here as you upload records.</p>
                    </div>
                ) : (
                    <div className="relative">
                        {/* The Vertical Line */}
                        <div className="absolute left-8 top-0 bottom-0 w-1.5 bg-gradient-to-b from-medBlue via-medTeal to-transparent rounded-full opacity-20 hidden sm:block"></div>

                        <div className="space-y-12 relative z-10">
                            {records.map((record, idx) => (
                                <motion.div
                                    key={record._id}
                                    initial={{ opacity: 0, x: -30 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="flex flex-col sm:flex-row gap-8 items-start relative group"
                                >
                                    {/* Date Circle */}
                                    <div className="w-16 h-16 rounded-[1.5rem] bg-white shadow-2xl flex flex-col items-center justify-center border border-gray-50 z-20 group-hover:scale-110 transition-transform flex-shrink-0">
                                        <span className="text-[10px] font-black text-medBlue uppercase leading-none">
                                            {new Date(record.createdAt).toLocaleDateString(undefined, { month: 'short' })}
                                        </span>
                                        <span className="text-2xl font-black text-medDark leading-none mt-1">
                                            {new Date(record.createdAt).toLocaleDateString(undefined, { day: 'numeric' })}
                                        </span>
                                    </div>

                                    {/* Record Card */}
                                    <div className="flex-1 bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-xl group-hover:shadow-2xl transition-all relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-medBlue/5 rounded-bl-[4rem] -mr-8 -mt-8"></div>

                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                                            <div className="flex items-center gap-5">
                                                <div className="w-14 h-14 bg-medGrey rounded-2xl flex items-center justify-center text-medDark font-black text-xs uppercase shadow-inner">
                                                    {record.fileType.includes('pdf') ? 'PDF' : 'IMG'}
                                                </div>
                                                <div>
                                                    <h3 className="text-xl font-black text-medDark group-hover:text-medBlue transition-colors">{record.originalName}</h3>
                                                    <p className="text-gray-400 font-bold text-xs uppercase tracking-widest mt-1 flex items-center gap-2">
                                                        <Clock className="w-3.5 h-3.5" /> Uploaded at {new Date(record.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-3">
                                                <span className="px-4 py-2 bg-medGrey rounded-full text-[10px] font-black uppercase tracking-widest text-gray-500">
                                                    {record.sharedWith?.length > 0 ? 'Shared' : 'Private'}
                                                </span>
                                                <button className="p-3 bg-medBlue text-white rounded-xl shadow-lg shadow-medBlue/20 group-hover:translate-x-1 transition-transform">
                                                    <ArrowRight className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </div>

                                        {record.description && (
                                            <div className="mt-6 p-5 bg-medGrey/30 rounded-2xl border border-gray-50 italic text-sm text-gray-500 font-medium relative italic">
                                                <span className="absolute -top-3 left-4 bg-white px-2 text-[10px] font-black text-gray-300 uppercase tracking-widest">Medical Note</span>
                                                "{record.description}"
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    );
}
