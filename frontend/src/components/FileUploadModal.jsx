import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from './Button';

const ALLOWED_TYPES = ['application/pdf', 'image/jpeg', 'image/png', 'image/gif', 'image/webp'];
const MAX_SIZE = 10 * 1024 * 1024;

export default function FileUploadModal({ isOpen, onClose, onUpload, loading }) {
  const [file, setFile] = useState(null);
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    setError('');
    const f = e.target.files?.[0];
    if (!f) {
      setFile(null);
      return;
    }
    if (!ALLOWED_TYPES.includes(f.type)) {
      setError('Invalid file type. Allowed: PDF, JPEG, PNG, GIF, WEBP');
      setFile(null);
      return;
    }
    if (f.size > MAX_SIZE) {
      setError('File size must be under 10MB');
      setFile(null);
      return;
    }
    setFile(f);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (!file) {
      setError('Please select a file');
      return;
    }
    onUpload(file, description);
    setFile(null);
    setDescription('');
  };

  const handleClose = () => {
    setFile(null);
    setDescription('');
    setError('');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={handleClose}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6"
            >
              <h3 className="text-xl font-bold text-primary-700 mb-4">Upload Medical Record</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">File (PDF or Image)</label>
                  <input
                    type="file"
                    accept=".pdf,image/jpeg,image/png,image/gif,image/webp"
                    onChange={handleFileChange}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-primary-100 file:text-primary-700"
                  />
                  {file && <p className="text-sm text-gray-600 mt-1">{file.name}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description (optional)</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={2}
                    maxLength={500}
                    className="w-full rounded-xl border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Brief description..."
                  />
                </div>
                {error && <p className="text-sm text-red-600">{error}</p>}
                <div className="flex gap-3 pt-2">
                  <Button type="button" variant="secondary" onClick={handleClose} className="flex-1">
                    Cancel
                  </Button>
                  <Button type="submit" loading={loading} className="flex-1">
                    Upload
                  </Button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
