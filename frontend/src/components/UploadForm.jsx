import { useState, useRef } from "react";
import { UploadCloud, Image as ImageIcon, X, FileVideo } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const UploadForm = ({ onSubmit, isLoading = false }) => {
  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const dropped = e.dataTransfer.files?.[0];
    if (dropped && (dropped.type.startsWith("image/") || dropped.type.startsWith("video/"))) {
      setFile(dropped);
      setPreview(URL.createObjectURL(dropped));
    }
  };

  const clearFile = () => {
    setFile(null);
    setPreview("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const submit = async (event) => {
    event.preventDefault();
    if (!title || !file) return;
    await onSubmit({ title, file });
    setTitle("");
    clearFile();
  };

  return (
    <form onSubmit={submit} className="glass-card p-6 md:p-8 space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2.5 bg-indigo-100 rounded-xl text-indigo-600">
          <UploadCloud className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900">Upload Content</h2>
          <p className="text-sm text-slate-500">Share your latest video or image</p>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold text-slate-700 ml-1">Content Title</label>
        <input 
          className="field text-lg font-medium" 
          placeholder="Enter a catchy title..." 
          value={title} 
          onChange={(e) => setTitle(e.target.value)} 
          required 
          disabled={isLoading}
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold text-slate-700 ml-1">Media File</label>
        
        <AnimatePresence mode="wait">
          {!file ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={`relative flex flex-col items-center justify-center p-10 border-2 border-dashed rounded-2xl transition-colors ${
                isDragging ? "border-indigo-500 bg-indigo-50" : "border-slate-300 bg-slate-50 hover:bg-slate-100"
              }`}
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
            >
              <input 
                ref={fileInputRef}
                type="file" 
                accept="image/*,video/*" 
                onChange={handleFileChange} 
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                required 
                disabled={isLoading}
              />
              <div className="p-4 bg-white rounded-full shadow-sm mb-4 text-indigo-500">
                <UploadCloud className="w-8 h-8" />
              </div>
              <p className="text-slate-700 font-medium mb-1">Click or drag file to upload</p>
              <p className="text-slate-400 text-xs">Supports Images and Videos up to 50MB</p>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-50"
            >
              {file.type.startsWith("video/") ? (
                <div className="relative aspect-video bg-slate-900 flex items-center justify-center">
                  <video src={preview} controls className="w-full h-full object-contain" />
                  <div className="absolute top-3 left-3 bg-black/60 backdrop-blur text-white text-xs px-2.5 py-1 rounded-md flex items-center gap-1">
                    <FileVideo className="w-3 h-3" /> Video
                  </div>
                </div>
              ) : (
                <div className="relative aspect-video bg-slate-100 flex items-center justify-center">
                  <img src={preview} alt="Preview" className="w-full h-full object-contain" />
                  <div className="absolute top-3 left-3 bg-black/60 backdrop-blur text-white text-xs px-2.5 py-1 rounded-md flex items-center gap-1">
                    <ImageIcon className="w-3 h-3" /> Image
                  </div>
                </div>
              )}
              
              <button 
                type="button"
                onClick={clearFile}
                className="absolute top-3 right-3 p-1.5 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-md transition-colors"
                title="Remove file"
                disabled={isLoading}
              >
                <X className="w-4 h-4" />
              </button>
              
              <div className="px-4 py-3 bg-white border-t border-slate-100 text-sm font-medium text-slate-700 truncate">
                {file.name}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <button 
        className="btn w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/30 py-3.5 text-lg" 
        disabled={isLoading || !file || !title}
      >
        {isLoading ? (
          <>
            <span className="spinner w-5 h-5 border-2" />
            Uploading Content...
          </>
        ) : (
          "Publish Content"
        )}
      </button>
    </form>
  );
};

export default UploadForm;
