import React, { useState, FormEvent, useRef } from 'react';
import { UserProfile } from '../types';
import { XMarkIcon, CameraIcon, UserCircleIcon, TrashIcon } from './Icons';
import { ImageEditorModal } from './ImageEditorModal';

interface ProfileModalProps {
  profile: UserProfile;
  onClose: () => void;
  onSave: (updatedProfile: UserProfile) => void;
}

// Sleek SVG avatar presets
const PRESET_AVATARS = [
  {
    id: 'gold',
    name: 'Gold VIP',
    url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%23f59e0b"/><stop offset="100%" stop-color="%23d97706"/></linearGradient></defs><circle cx="50" cy="50" r="50" fill="url(%23g)"/><circle cx="50" cy="38" r="18" fill="%23ffffff" opacity="0.95"/><path d="M 22 82 C 22 62 34 52 50 52 C 66 52 78 62 78 82 Z" fill="%23ffffff" opacity="0.95"/></svg>',
  },
  {
    id: 'sapphire',
    name: 'Sapphire Pro',
    url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><linearGradient id="b" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%233b82f6"/><stop offset="100%" stop-color="%231d4ed8"/></linearGradient></defs><circle cx="50" cy="50" r="50" fill="url(%23b)"/><circle cx="50" cy="38" r="18" fill="%23ffffff" opacity="0.95"/><path d="M 22 82 C 22 62 34 52 50 52 C 66 52 78 62 78 82 Z" fill="%23ffffff" opacity="0.95"/></svg>',
  },
  {
    id: 'emerald',
    name: 'Emerald Growth',
    url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><linearGradient id="e" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%2310b981"/><stop offset="100%" stop-color="%23047857"/></linearGradient></defs><circle cx="50" cy="50" r="50" fill="url(%23e)"/><circle cx="50" cy="38" r="18" fill="%23ffffff" opacity="0.95"/><path d="M 22 82 C 22 62 34 52 50 52 C 66 52 78 62 78 82 Z" fill="%23ffffff" opacity="0.95"/></svg>',
  },
  {
    id: 'amethyst',
    name: 'Amethyst Trader',
    url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><linearGradient id="p" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%238b5cf6"/><stop offset="100%" stop-color="%236d28d9"/></linearGradient></defs><circle cx="50" cy="50" r="50" fill="url(%23p)"/><circle cx="50" cy="38" r="18" fill="%23ffffff" opacity="0.95"/><path d="M 22 82 C 22 62 34 52 50 52 C 66 52 78 62 78 82 Z" fill="%23ffffff" opacity="0.95"/></svg>',
  },
  {
    id: 'rose',
    name: 'Sunset Rose',
    url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><linearGradient id="r" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%23ec4899"/><stop offset="100%" stop-color="%23be185d"/></linearGradient></defs><circle cx="50" cy="50" r="50" fill="url(%23r)"/><circle cx="50" cy="38" r="18" fill="%23ffffff" opacity="0.95"/><path d="M 22 82 C 22 62 34 52 50 52 C 66 52 78 62 78 82 Z" fill="%23ffffff" opacity="0.95"/></svg>',
  },
  {
    id: 'midnight',
    name: 'Midnight Lux',
    url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><linearGradient id="m" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%23334155"/><stop offset="100%" stop-color="%230f172a"/></linearGradient></defs><circle cx="50" cy="50" r="50" fill="url(%23m)"/><circle cx="50" cy="38" r="18" fill="%23ffffff" opacity="0.95"/><path d="M 22 82 C 22 62 34 52 50 52 C 66 52 78 62 78 82 Z" fill="%23ffffff" opacity="0.95"/></svg>',
  },
];

const compressAndResizeImage = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_DIM = 300;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_DIM) {
            height = Math.round((height * MAX_DIM) / width);
            width = MAX_DIM;
          }
        } else {
          if (height > MAX_DIM) {
            width = Math.round((width * MAX_DIM) / height);
            height = MAX_DIM;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
          resolve(dataUrl);
        } else {
          resolve(event.target?.result as string);
        }
      };
      img.onerror = () => reject(new Error('Failed to parse image'));
      img.src = event.target?.result as string;
    };
    reader.onerror = () => reject(new Error('Failed to read image file'));
    reader.readAsDataURL(file);
  });
};

const ProfileModal: React.FC<ProfileModalProps> = ({ profile, onClose, onSave }) => {
  const [formData, setFormData] = useState<UserProfile>(profile);
  const [imagePreview, setImagePreview] = useState<string | null>(profile.profilePicture || null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  
  // Image Editor modal state
  const [showEditor, setShowEditor] = useState<boolean>(false);
  const [editorImageSrc, setEditorImageSrc] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const processFile = async (file: File) => {
    if (!file.type.startsWith('image/')) return;
    try {
      setIsProcessing(true);
      const compressedBase64 = await compressAndResizeImage(file);
      // Automatically open editor modal with uploaded file
      setEditorImageSrc(compressedBase64);
      setShowEditor(true);
    } catch (err) {
      console.error('Error compressing image:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleOpenCustomizer = () => {
    if (imagePreview) {
      setEditorImageSrc(imagePreview);
      setShowEditor(true);
    } else {
      fileInputRef.current?.click();
    }
  };

  const handleSaveCustomizedImage = (customizedDataUrl: string) => {
    setImagePreview(customizedDataUrl);
    setFormData(prev => ({ ...prev, profilePicture: customizedDataUrl }));
    setShowEditor(false);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleRemovePhoto = () => {
    setImagePreview(null);
    setFormData(prev => ({ ...prev, profilePicture: null }));
  };

  const handleSelectPreset = (presetUrl: string) => {
    setImagePreview(presetUrl);
    setFormData(prev => ({ ...prev, profilePicture: presetUrl }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4 overflow-y-auto">
      <div className="bg-white dark:bg-[#0f172a] rounded-[2.5rem] shadow-2xl w-full max-w-lg border border-gray-200 dark:border-blue-900/20 overflow-hidden relative my-auto">
        <div className="spotlight-bg opacity-30" />
        
        <div className="flex justify-between items-center p-6 sm:p-8 border-b border-gray-100 dark:border-blue-900/10 relative z-10">
          <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight">Profile Settings</h2>
          <button onClick={onClose} className="p-2 rounded-xl text-gray-400 hover:text-gray-700 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-blue-900/30 transition-all">
            <XMarkIcon className="w-7 h-7" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 sm:p-8 relative z-10 space-y-8">
          <div className="flex flex-col items-center gap-4">
            <div 
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              className={`relative group cursor-pointer transition-transform ${isDragging ? 'scale-105' : ''}`}
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="absolute -inset-1.5 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full blur opacity-40 group-hover:opacity-80 transition-opacity" />
              {imagePreview ? (
                <img 
                  src={imagePreview} 
                  alt="Profile Preview" 
                  className="w-32 h-32 rounded-full object-cover border-4 border-white dark:border-blue-900/40 shadow-2xl relative z-10" 
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-blue-600 flex items-center justify-center text-white text-4xl font-extrabold border-4 border-white dark:border-blue-900/40 shadow-2xl relative z-10">
                  {formData.fullName ? formData.fullName.charAt(0).toUpperCase() : '?'}
                </div>
              )}
              
              {isProcessing ? (
                <div className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center z-20 text-white font-bold text-xs">
                  Uploading...
                </div>
              ) : (
                <div className="absolute bottom-0 right-0 p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl shadow-xl transition-all hover:scale-110 active:scale-95 z-20 border-4 border-white dark:border-[#0f172a]">
                  <CameraIcon className="w-5 h-5" />
                </div>
              )}
            </div>

            <div className="flex items-center justify-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-xs font-extrabold text-blue-600 dark:text-blue-400 hover:underline px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-900/30"
              >
                Upload Photo
              </button>
              {imagePreview && (
                <>
                  <button
                    type="button"
                    onClick={handleOpenCustomizer}
                    className="text-xs font-extrabold text-indigo-600 dark:text-indigo-400 hover:underline px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-900/30"
                  >
                    Customize Photo
                  </button>
                  <button
                    type="button"
                    onClick={handleRemovePhoto}
                    className="text-xs font-bold text-red-500 hover:text-red-600 dark:hover:text-red-400 flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-50 dark:bg-red-950/30"
                  >
                    <TrashIcon className="w-3.5 h-3.5" />
                    Remove
                  </button>
                </>
              )}
            </div>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageChange}
              accept="image/png, image/jpeg, image/webp, image/gif"
              className="hidden"
            />

            {/* Avatar Presets */}
            <div className="w-full pt-2">
              <p className="text-[10px] font-bold text-gray-400 dark:text-blue-400/50 uppercase tracking-widest text-center mb-2">Or Choose an Avatar Preset</p>
              <div className="flex items-center justify-center gap-2 overflow-x-auto py-1 px-2">
                {PRESET_AVATARS.map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => handleSelectPreset(preset.url)}
                    className={`w-10 h-10 rounded-full p-0.5 transition-all border-2 flex-shrink-0 ${
                      imagePreview === preset.url 
                        ? 'border-blue-500 scale-110 shadow-lg' 
                        : 'border-transparent opacity-70 hover:opacity-100 hover:scale-105'
                    }`}
                    title={preset.name}
                  >
                    <img src={preset.url} alt={preset.name} className="w-full h-full rounded-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="fullName" className="block text-xs font-bold text-gray-500 dark:text-blue-400/60 uppercase tracking-widest ml-1">Full Name</label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName || ''}
                onChange={handleInputChange}
                placeholder="Your full name"
                className="w-full bg-gray-50 dark:bg-black/50 border border-gray-200 dark:border-blue-900/30 rounded-2xl px-5 py-3.5 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all font-bold"
              />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="email" className="block text-xs font-bold text-gray-500 dark:text-blue-400/60 uppercase tracking-widest ml-1">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email || ''}
                onChange={handleInputChange}
                placeholder="your.email@example.com"
                className="w-full bg-gray-50 dark:bg-black/50 border border-gray-200 dark:border-blue-900/30 rounded-2xl px-5 py-3.5 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all font-bold"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2 pt-2">
            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-2xl transition-all shadow-xl shadow-blue-500/20 active:scale-95">
              Save Changes
            </button>
            <button type="button" onClick={onClose} className="w-full py-2.5 text-sm font-bold text-gray-500 dark:text-blue-400/60 hover:text-gray-900 dark:hover:text-white transition-colors">
              Cancel
            </button>
          </div>
        </form>
      </div>

      {showEditor && editorImageSrc && (
        <ImageEditorModal
          imageSrc={editorImageSrc}
          onSave={handleSaveCustomizedImage}
          onClose={() => setShowEditor(false)}
        />
      )}
    </div>
  );
};

export default ProfileModal;
