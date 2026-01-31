import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    MessageCircle,
    Search,
    Send,
    User,
    MoreVertical,
    Paperclip,
    Smile,
    ShieldCheck,
    CheckCheck,
    Phone,
    Video,
    Info
} from 'lucide-react';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';

export default function Messages() {
    const { user } = useAuth();
    const [selectedChat, setSelectedChat] = useState(null);
    const [message, setMessage] = useState('');

    const chats = [
        { id: 1, name: 'Dr. Sarah Smith', lastMsg: 'Your latest blood report looks great.', time: '10:30 AM', unread: 2, online: true },
        { id: 2, name: 'John Smith (Patient)', lastMsg: 'When can I expect the results?', time: 'Yesterday', unread: 0, online: false },
        { id: 3, name: 'Dr. Elena Rodriguez', lastMsg: 'Please confirm the appointment.', time: 'Mon', unread: 0, online: true },
    ];

    const messages = [
        { id: 1, sender: 'other', text: 'Hello, how can I help you today?', time: '10:00 AM' },
        { id: 2, sender: 'me', text: 'I wanted to discuss my recent checkup results.', time: '10:05 AM' },
        { id: 3, sender: 'other', text: 'Of course. Your latest blood report looks great. All parameters are within normal range.', time: '10:30 AM' },
    ];

    return (
        <Layout title="Secure Communication Channel">
            <div className="h-[calc(100vh-12rem)] flex gap-8 pb-10">

                {/* Chat List */}
                <div className="w-full lg:w-96 flex flex-col bg-white rounded-[3rem] border border-gray-100 shadow-2xl shadow-slate-200/50 overflow-hidden">
                    <div className="p-8 border-b border-gray-50">
                        <h2 className="text-xl font-black text-medDark italic mb-6">Messages</h2>
                        <div className="relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-medBlue" />
                            <input
                                type="text"
                                placeholder="Search conversations..."
                                className="w-full pl-12 pr-6 py-4 rounded-2xl border-none bg-medGrey/50 focus:ring-4 focus:ring-medBlue/5 font-bold text-sm"
                            />
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto divide-y divide-gray-50">
                        {chats.map(chat => (
                            <button
                                key={chat.id}
                                onClick={() => setSelectedChat(chat)}
                                className={`w-full p-6 flex items-center gap-4 hover:bg-medGrey/30 transition-all text-left group ${selectedChat?.id === chat.id ? 'bg-medBlue/5' : ''}`}
                            >
                                <div className="relative">
                                    <div className="w-14 h-14 rounded-2xl bg-medGrey border border-gray-100 shadow-inner flex items-center justify-center font-black text-medBlue text-lg group-hover:scale-105 transition-transform overflow-hidden">
                                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${chat.name}`} className="w-full h-full object-cover" />
                                    </div>
                                    {chat.online && <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-medTeal border-4 border-white rounded-full"></div>}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-center mb-1">
                                        <h4 className="font-black text-medDark truncate italic group-hover:text-medBlue transition-colors">{chat.name}</h4>
                                        <span className="text-[10px] font-bold text-gray-400 uppercase italic">{chat.time}</span>
                                    </div>
                                    <p className="text-xs font-medium text-gray-500 truncate italic">{chat.lastMsg}</p>
                                </div>
                                {chat.unread > 0 && (
                                    <div className="w-6 h-6 bg-medBlue text-white rounded-full flex items-center justify-center text-[10px] font-black shadow-lg shadow-medBlue/20">
                                        {chat.unread}
                                    </div>
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Chat Window */}
                <div className="hidden lg:flex flex-1 flex-col bg-white rounded-[3rem] border border-gray-100 shadow-2xl shadow-slate-200/50 overflow-hidden relative">
                    {!selectedChat ? (
                        <div className="flex-1 flex flex-col items-center justify-center text-center p-20">
                            <div className="w-32 h-32 bg-medGrey rounded-[3rem] flex items-center justify-center mb-8 shadow-inner ring-8 ring-white">
                                <MessageCircle className="w-14 h-14 text-gray-200" />
                            </div>
                            <h3 className="text-3xl font-black text-medDark italic mb-3">Select a Protocol</h3>
                            <p className="text-gray-400 font-bold italic max-w-xs leading-relaxed uppercase text-[10px] tracking-widest">
                                All communications are protected by end-to-end medical grade encryption.
                            </p>
                        </div>
                    ) : (
                        <>
                            {/* Chat Header */}
                            <div className="p-6 border-b border-gray-50 flex items-center justify-between px-10">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-medGrey shadow-inner overflow-hidden border border-gray-100">
                                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedChat.name}`} className="w-full h-full object-cover" />
                                    </div>
                                    <div>
                                        <h4 className="font-black text-medDark italic leading-tight">{selectedChat.name}</h4>
                                        <p className="text-[10px] font-black text-medTeal uppercase tracking-widest mt-0.5 flex items-center gap-1.5">
                                            <ShieldCheck className="w-3.5 h-3.5" /> Secure Channel Active
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <button className="p-3 bg-medGrey text-gray-400 rounded-xl hover:bg-medBlue hover:text-white transition-all shadow-sm">
                                        <Phone className="w-5 h-5" />
                                    </button>
                                    <button className="p-3 bg-medGrey text-gray-400 rounded-xl hover:bg-medBlue hover:text-white transition-all shadow-sm">
                                        <Video className="w-5 h-5" />
                                    </button>
                                    <button className="p-3 bg-medGrey text-gray-400 rounded-xl hover:bg-medBlue hover:text-white transition-all shadow-sm">
                                        <Info className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>

                            {/* Messages Area */}
                            <div className="flex-1 overflow-y-auto p-10 space-y-8 bg-medGrey/10">
                                {messages.map(msg => (
                                    <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`max-w-[70%] space-y-2`}>
                                            <div className={`p-6 rounded-[2rem] shadow-xl text-sm font-bold leading-relaxed italic ${msg.sender === 'me' ? 'bg-medDark text-white rounded-br-none' : 'bg-white text-medDark rounded-bl-none border border-gray-50'}`}>
                                                {msg.text}
                                            </div>
                                            <div className={`flex items-center gap-2 px-2 ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                                                <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{msg.time}</span>
                                                {msg.sender === 'me' && <CheckCheck className="w-3 h-3 text-medBlue" />}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Input Area */}
                            <div className="p-8 border-t border-gray-50 bg-white shadow-[0_-20px_40px_-20px_rgba(0,0,0,0.05)]">
                                <form
                                    onSubmit={(e) => { e.preventDefault(); setMessage(''); }}
                                    className="flex items-center gap-4 bg-medGrey/50 p-2 pl-6 rounded-[2rem] focus-within:ring-4 focus-within:ring-medBlue/5 transition-all"
                                >
                                    <button type="button" className="p-2 text-gray-400 hover:text-medBlue transition-colors"><Smile className="w-6 h-6" /></button>
                                    <button type="button" className="p-2 text-gray-400 hover:text-medBlue transition-colors"><Paperclip className="w-6 h-6" /></button>
                                    <input
                                        type="text"
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        placeholder="Communicate securely..."
                                        className="flex-1 bg-transparent border-none focus:ring-0 font-bold text-medDark text-sm italic"
                                    />
                                    <button
                                        type="submit"
                                        className="p-4 bg-medBlue text-white rounded-2xl shadow-xl shadow-medBlue/30 hover:scale-110 active:scale-95 transition-all"
                                    >
                                        <Send className="w-5 h-5" />
                                    </button>
                                </form>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </Layout>
    );
}
