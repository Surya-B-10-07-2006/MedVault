import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Calendar,
    Clock,
    User,
    ChevronRight,
    Plus,
    Search,
    MapPin,
    Phone,
    CheckCircle2,
    XCircle,
    MoreVertical,
    CalendarCheck
} from 'lucide-react';
import Layout from '../components/Layout';
import Button from '../components/Button';

export default function Appointments() {
    const [activeTab, setActiveTab] = useState('upcoming');
    const [searchTerm, setSearchTerm] = useState('');

    const appointments = [
        { id: 1, patient: 'John Smith', time: '09:00 AM', date: '2024-02-15', type: 'General Checkup', status: 'confirmed' },
        { id: 2, patient: 'Emma Watson', time: '11:30 AM', date: '2024-02-15', type: 'Follow-up', status: 'pending' },
        { id: 3, patient: 'Michael Jordan', time: '02:00 PM', date: '2024-02-16', type: 'Consultation', status: 'confirmed' },
        { id: 4, patient: 'Serena Williams', time: '04:15 PM', date: '2024-02-16', type: 'Urgent', status: 'confirmed' },
    ];

    const filtered = appointments.filter(app =>
        app.patient.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Layout title="Clinical Schedule">
            <div className="space-y-10 pb-24">
                {/* Header Section */}
                <section className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-medTeal shadow-xl shadow-medTeal/20 rounded-2xl flex items-center justify-center text-white">
                            <CalendarCheck className="w-8 h-8" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-black text-medDark tracking-tight italic">Upcoming Sessions</h1>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2 mt-0.5">
                                <span className="w-2 h-2 bg-medTeal rounded-full animate-pulse"></span> Synchronized with Practice Management
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <div className="relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-medBlue" />
                            <input
                                type="text"
                                placeholder="Search patients..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-12 pr-6 py-4 rounded-[1.5rem] border-none bg-white shadow-xl shadow-slate-200/50 focus:ring-4 focus:ring-medBlue/10 font-bold text-sm"
                            />
                        </div>
                        <Button className="px-8 rounded-2xl flex items-center gap-2">
                            <Plus className="w-5 h-5" /> Add
                        </Button>
                    </div>
                </section>

                {/* Calendar Mini View & Tabs */}
                <div className="grid lg:grid-cols-4 gap-10">
                    <div className="lg:col-span-1 space-y-8">
                        <div className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-2xl shadow-slate-200/50">
                            <h3 className="text-sm font-black text-medDark uppercase tracking-widest mb-6 border-b border-gray-50 pb-4">Filters</h3>
                            <div className="space-y-2">
                                {['upcoming', 'completed', 'cancelled'].map(tab => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab)}
                                        className={`w-full text-left px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-medBlue text-white shadow-lg shadow-medBlue/20 scale-105 ml-2' : 'text-gray-400 hover:bg-medGrey'}`}
                                    >
                                        {tab}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="bg-medDark p-8 rounded-[3rem] text-white shadow-2xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-medBlue/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-1000"></div>
                            <h4 className="text-xl font-black mb-4 italic leading-tight">Practice <br /> Capacity</h4>
                            <div className="space-y-4 relative z-10">
                                <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                                    <div className="h-full w-3/4 bg-medTeal rounded-full"></div>
                                </div>
                                <p className="text-[10px] font-bold text-white/50 uppercase italic tracking-widest">75% slots filled this week</p>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-3 space-y-6">
                        <AnimatePresence mode="wait">
                            {filtered.map((app, idx) => (
                                <motion.div
                                    key={app.id}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                    className="group bg-white p-8 rounded-[3rem] border border-gray-100 shadow-2xl shadow-slate-200/50 hover:shadow-medBlue/10 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6"
                                >
                                    <div className="flex items-center gap-6">
                                        <div className="w-20 h-20 rounded-[2rem] bg-medGrey border border-gray-200 shadow-inner flex items-center justify-center text-medBlue font-black text-2xl group-hover:bg-medBlue group-hover:text-white transition-all overflow-hidden p-1">
                                            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${app.patient}`} className="w-full h-full object-cover rounded-[1.5rem]" />
                                        </div>
                                        <div>
                                            <h4 className="text-xl font-black text-medDark group-hover:text-medBlue transition-colors italic leading-tight">{app.patient}</h4>
                                            <div className="flex flex-wrap items-center gap-4 mt-2">
                                                <span className="flex items-center gap-1.5 text-xs font-bold text-gray-400 uppercase tracking-tighter">
                                                    <Clock className="w-4 h-4 text-medBlue" /> {app.time}
                                                </span>
                                                <span className="w-1 h-1 bg-gray-200 rounded-full"></span>
                                                <span className="flex items-center gap-1.5 text-xs font-bold text-gray-400 uppercase tracking-tighter">
                                                    <Calendar className="w-4 h-4 text-medTeal" /> {app.date}
                                                </span>
                                                <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest shadow-sm ${app.status === 'confirmed' ? 'bg-medTeal/10 text-medTeal' : 'bg-amber-100 text-amber-600'}`}>
                                                    {app.status}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 border-t md:border-t-0 pt-6 md:pt-0 border-gray-50">
                                        <button className="flex-1 md:flex-none px-6 py-3 bg-medGrey text-medDark font-black text-[10px] uppercase tracking-widest rounded-2xl hover:bg-medTeal hover:text-white transition-all shadow-sm">
                                            Start Consult
                                        </button>
                                        <button className="p-3 bg-white border border-gray-100 rounded-2xl text-gray-400 hover:text-rose-500 transition-all">
                                            <MoreVertical className="w-5 h-5" />
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>

                        {filtered.length === 0 && (
                            <div className="py-32 text-center bg-white rounded-[3rem] border border-dashed border-gray-200">
                                <Calendar className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                                <p className="text-gray-400 font-bold italic uppercase text-xs tracking-widest">No scheduled appointments found</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Layout>
    );
}
