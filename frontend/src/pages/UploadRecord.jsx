import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileText, X, CheckCircle2, ShieldAlert, Loader2, Info, UploadCloud, ShieldCheck } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import Layout from '../components/Layout';
import Button from '../components/Button';
import api from '../utils/api';
import { toast } from 'react-hot-toast';

export default function UploadRecord() {
  const [file, setFile] = useState(null);
  const [description, setDescription] = useState('');
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const onDrop = (acceptedFiles) => {
    setFile(acceptedFiles[0]);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: 1,
    accept: {
      'application/pdf': ['.pdf'],
      'image/*': ['.jpeg', '.jpg', '.png']
    }
  });

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;

    setUploading(true);
    setProgress(20);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('description', description);

    try {
      setProgress(50);
      await api.post('/records/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setProgress(100);
      toast.success('Medical record uploaded and encrypted successfully!');
      setFile(null);
      setDescription('');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to upload record');
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  return (
    <Layout title="Upload Medical Record">
      <div className="max-w-4xl mx-auto pb-20">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-black text-medDark tracking-tight mb-4 flex items-center justify-center gap-3">
            <UploadCloud className="w-10 h-10 text-medBlue" /> Add to Your Vault
          </h1>
          <p className="text-gray-500 font-medium">Your files are automatically encrypted before storage.</p>
        </div>

        <div className="grid md:grid-cols-5 gap-10">
          {/* Upload Area */}
          <div className="md:col-span-3 space-y-8">
            <div
              {...getRootProps()}
              className={`
                relative group cursor-pointer transition-all duration-500
                rounded-[3rem] border-4 border-dashed p-12 text-center
                ${isDragActive ? 'border-medBlue bg-medBlue/5 scale-[0.98]' : 'border-gray-200 bg-white hover:border-medBlue/30 hover:bg-medGrey/30'}
              `}
            >
              <input {...getInputProps()} />

              <AnimatePresence mode="wait">
                {file ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="space-y-6"
                  >
                    <div className="w-24 h-24 bg-medTeal/10 rounded-3xl flex items-center justify-center mx-auto shadow-inner">
                      <FileText className="w-12 h-12 text-medTeal" />
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-medDark truncate max-w-xs mx-auto">{file.name}</h3>
                      <p className="text-xs font-bold text-gray-400 mt-1 uppercase tracking-widest">{(file.size / (1024 * 1024)).toFixed(2)} MB • Ready</p>
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); setFile(null); }}
                      className="inline-flex items-center gap-2 px-6 py-2 bg-rose-50 text-rose-500 rounded-full text-sm font-black border border-rose-100 hover:bg-rose-100 transition-colors"
                    >
                      <X className="w-4 h-4" /> Remove File
                    </button>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-6"
                  >
                    <div className="w-24 h-24 bg-medBlue/5 rounded-3xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-500">
                      <Upload className={`w-12 h-12 text-medBlue ${isDragActive ? 'animate-bounce' : ''}`} />
                    </div>
                    <div>
                      <h3 className="text-2xl font-black text-medDark">Drop, Paste or Browse</h3>
                      <p className="text-gray-400 font-medium mt-2 italic px-8">Drag your medical report here or click to select from your device.</p>
                    </div>
                    <div className="flex justify-center gap-3">
                      <span className="px-3 py-1 bg-white border border-gray-100 rounded-lg text-[10px] font-bold text-gray-400 uppercase tracking-tighter shadow-sm">PDF Only</span>
                      <span className="px-3 py-1 bg-white border border-gray-100 rounded-lg text-[10px] font-bold text-gray-400 uppercase tracking-tighter shadow-sm">Max 10MB</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {uploading && (
              <div className="space-y-3 px-6">
                <div className="flex justify-between items-end">
                  <span className="text-sm font-black text-medBlue uppercase tracking-widest flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" /> {progress < 100 ? 'Encrypting & Uploading...' : 'Finalizing...'}
                  </span>
                  <span className="text-lg font-black text-medDark italic">{progress}%</span>
                </div>
                <div className="h-4 w-full bg-medGrey rounded-full overflow-hidden shadow-inner p-1">
                  <motion.div
                    className="h-full grad-primary rounded-full shadow-lg"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Form Area */}
          <div className="md:col-span-2 space-y-8">
            <div className="glass p-8 rounded-[3rem] border-white/50 shadow-2xl shadow-medBlue/5">
              <h3 className="text-xl font-black text-medDark mb-6 flex items-center gap-2">
                <Info className="w-5 h-5 text-medBlue" /> Document Details
              </h3>

              <form onSubmit={handleUpload} className="space-y-8">
                <div className="space-y-3">
                  <label className="block text-sm font-black text-medDark ml-1 uppercase tracking-tight">Short Memo / Description</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    className="w-full rounded-[2rem] border border-gray-100 bg-white/50 px-6 py-5 focus:ring-4 focus:ring-medBlue/10 focus:border-medBlue shadow-sm outline-none transition-all font-medium text-medDark placeholder:text-gray-300 italic"
                    placeholder="e.g. Blood Test - General Health Checkup, Jan 2024"
                  />
                </div>

                <div className="p-6 bg-medTeal/5 rounded-3xl border border-medTeal/10 flex gap-4">
                  <ShieldCheck className="w-6 h-6 text-medTeal flex-shrink-0" />
                  <p className="text-xs font-semibold text-teal-800 leading-relaxed italic">
                    Your file content is encrypted using AES-256 standards. Not even MedVault staff can view your actual records without your explicit permission.
                  </p>
                </div>

                <Button
                  type="submit"
                  disabled={!file || uploading}
                  loading={uploading}
                  className="w-full py-5 text-lg font-black rounded-[2rem] shadow-2xl shadow-medBlue/20"
                >
                  Confirm Secure Upload
                </Button>
              </form>
            </div>

            <div className="p-8 bg-medDark rounded-[3rem] text-white shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-medBlue/20 rounded-full blur-3xl -mr-16 -mt-16"></div>
              <ShieldAlert className="w-8 h-8 mb-4 text-amber-400" />
              <h4 className="text-lg font-black mb-2 italic tracking-tight uppercase">Upload Warning</h4>
              <p className="text-white/60 text-xs font-medium leading-relaxed italic">
                Make sure your document name does not contain sensitive personal ID numbers for extra security. Metadata is searchable by you.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
