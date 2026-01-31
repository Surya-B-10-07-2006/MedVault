import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  HelpCircle, 
  Search, 
  ChevronDown, 
  ChevronRight,
  Book,
  MessageCircle,
  Mail,
  Phone
} from 'lucide-react';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';

const patientFAQs = [
  {
    question: "How do I upload medical records?",
    answer: "Go to 'Upload' in the sidebar, select your file (PDF or image), add a description, and click upload. Your records are encrypted and stored securely."
  },
  {
    question: "How do I generate access codes for doctors?",
    answer: "View your records, click on any record to open details, then click 'Generate Access Code'. Share the 5-digit code with your doctor along with your name."
  },
  {
    question: "Can I delete my medical records?",
    answer: "Yes, you can delete your records anytime. Click on a record and select 'Purge Record'. This action cannot be undone."
  },
  {
    question: "How secure are my medical records?",
    answer: "All records are encrypted with AES-256 encryption, stored securely, and only accessible with proper authentication and access codes."
  }
];

const doctorFAQs = [
  {
    question: "How do I access patient records?",
    answer: "Use 'Code Access' in the sidebar. Enter the patient's full name and the 5-digit access code they provided. You can then view and download the record."
  },
  {
    question: "What if the access code doesn't work?",
    answer: "Ensure you have the correct patient name (exact spelling) and 5-digit code. Ask the patient to generate a new code if needed."
  },
  {
    question: "Can I save patient records to my device?",
    answer: "Yes, once you access a record, you can download it securely to your device for offline viewing."
  },
  {
    question: "How long do access codes remain valid?",
    answer: "Access codes remain valid until the patient generates a new one for the same record. Each record has its own unique code."
  }
];

export default function HelpCenter() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [openFAQ, setOpenFAQ] = useState(null);
  
  const faqs = user?.role === 'doctor' ? doctorFAQs : patientFAQs;
  const filteredFAQs = faqs.filter(faq => 
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout title="Help Center">
      <div className="max-w-4xl mx-auto space-y-10">
        
        {/* Header */}
        <div className="text-center">
          <div className="w-20 h-20 bg-medBlue/10 rounded-[2rem] flex items-center justify-center mx-auto mb-6">
            <HelpCircle className="w-10 h-10 text-medBlue" />
          </div>
          <h1 className="text-4xl font-black text-medDark mb-4 italic">Help Center</h1>
          <p className="text-gray-500 font-bold">
            {user?.role === 'doctor' ? 'Doctor' : 'Patient'} Support & Documentation
          </p>
        </div>

        {/* Search */}
        <div className="bg-white rounded-[3rem] p-8 shadow-2xl shadow-slate-200/50 border border-gray-100">
          <div className="relative">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search help articles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-16 pr-6 py-5 rounded-[2rem] border border-gray-200 focus:ring-4 focus:ring-medBlue/10 focus:border-medBlue font-bold"
            />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded-[2rem] p-6 shadow-xl shadow-slate-200/50 border border-gray-100 text-center">
            <Book className="w-8 h-8 text-medBlue mx-auto mb-4" />
            <h3 className="font-black text-medDark mb-2">User Guide</h3>
            <p className="text-gray-500 text-sm">Step-by-step instructions</p>
          </div>
          
          <div className="bg-white rounded-[2rem] p-6 shadow-xl shadow-slate-200/50 border border-gray-100 text-center">
            <MessageCircle className="w-8 h-8 text-medTeal mx-auto mb-4" />
            <h3 className="font-black text-medDark mb-2">Live Chat</h3>
            <p className="text-gray-500 text-sm">Get instant support</p>
          </div>
          
          <div className="bg-white rounded-[2rem] p-6 shadow-xl shadow-slate-200/50 border border-gray-100 text-center">
            <Mail className="w-8 h-8 text-medBlue mx-auto mb-4" />
            <h3 className="font-black text-medDark mb-2">Email Support</h3>
            <p className="text-gray-500 text-sm">support@medvault.com</p>
          </div>
        </div>

        {/* FAQs */}
        <div className="bg-white rounded-[3rem] p-8 shadow-2xl shadow-slate-200/50 border border-gray-100">
          <h2 className="text-2xl font-black text-medDark mb-8 flex items-center gap-3">
            <HelpCircle className="w-6 h-6 text-medBlue" />
            Frequently Asked Questions
          </h2>
          
          <div className="space-y-4">
            {filteredFAQs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="border border-gray-100 rounded-2xl overflow-hidden"
              >
                <button
                  onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
                  className="w-full p-6 text-left flex items-center justify-between hover:bg-medGrey/30 transition-colors"
                >
                  <span className="font-bold text-medDark">{faq.question}</span>
                  {openFAQ === index ? (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  )}
                </button>
                
                {openFAQ === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="px-6 pb-6"
                  >
                    <div className="pt-4 border-t border-gray-100">
                      <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
          
          {filteredFAQs.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-400 font-bold">No results found for "{searchTerm}"</p>
            </div>
          )}
        </div>

        {/* Contact Support */}
        <div className="bg-medBlue rounded-[3rem] p-8 text-white text-center">
          <h3 className="text-2xl font-black mb-4">Still need help?</h3>
          <p className="text-white/80 mb-6">Our support team is available 24/7 to assist you</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-6 py-3 bg-white text-medBlue font-black rounded-2xl hover:scale-105 transition-transform flex items-center gap-2 justify-center">
              <Phone className="w-4 h-4" />
              Call Support
            </button>
            <button className="px-6 py-3 bg-white/10 text-white font-black rounded-2xl hover:bg-white/20 transition-colors flex items-center gap-2 justify-center">
              <Mail className="w-4 h-4" />
              Email Us
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}