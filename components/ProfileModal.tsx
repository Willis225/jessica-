import React, { useState, FormEvent, useRef } from 'react';
import { UserProfile } from '../types';
import { XMarkIcon, CameraIcon, UserCircleIcon } from './Icons';

interface ProfileModalProps {
  profile: UserProfile;
  onClose: () => void;
  onSave: (updatedProfile: UserProfile) => void;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ profile, onClose, onSave }) => {
  const [formData, setFormData] = useState<UserProfile>(profile);
  const [imagePreview, setImagePreview] = useState<string | null>(profile.profilePicture || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setImagePreview(base64String);
        setFormData(prev => ({ ...prev, profilePicture: base64String }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div className="bg-white dark:bg-[#0f172a] rounded-[2.5rem] shadow-2xl w-full max-lg border border-gray-200 dark:border-blue-900/20 overflow-hidden relative">
        <div className="spotlight-bg opacity-30" />
        
        <div className="flex justify-between items-center p-8 border-b border-gray-100 dark:border-blue-900/10 relative z-10">
          <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight">Profile Settings</h2>
          <button onClick={onClose} className="p-2 rounded-xl text-gray-400 hover:text-gray-700 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-blue-900/30 transition-all">
            <XMarkIcon className="w-7 h-7" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 relative z-10 space-y-8">
          <div className="flex flex-col items-center gap-6">
            <div className="relative group">
              <div className="absolute -inset-1 bg-blue-500/20 rounded-full blur opacity-0 group-hover:opacity-100 transition-opacity" />
              {imagePreview ? (
                <img src={imagePreview} alt="Profile Preview" className="w-32 h-32 rounded-full object-cover border-4 border-white dark:border-blue-900/30 shadow-2xl relative z-10" />
              ) : (
                <UserCircleIcon className="w-32 h-32 text-gray-200 dark:text-blue-900/30 relative z-10" />
              )}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl shadow-xl transition-all hover:scale-110 active:scale-95 z-20 border-4 border-white dark:border-[#0f172a]"
              >
                <CameraIcon className="w-5 h-5" />
              </button>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageChange}
              accept="image/png, image/jpeg, image/gif"
              className="hidden"
            />
          </div>
        
          <div className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="fullName" className="block text-xs font-bold text-gray-500 dark:text-blue-400/60 uppercase tracking-widest ml-1">Full Name</label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName || ''}
                onChange={handleInputChange}
                placeholder="Your full name"
                className="w-full bg-gray-50 dark:bg-black/50 border border-gray-200 dark:border-blue-900/30 rounded-2xl px-5 py-4 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all font-bold"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="email" className="block text-xs font-bold text-gray-500 dark:text-blue-400/60 uppercase tracking-widest ml-1">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email || ''}
                onChange={handleInputChange}
                placeholder="your.email@example.com"
                className="w-full bg-gray-50 dark:bg-black/50 border border-gray-200 dark:border-blue-900/30 rounded-2xl px-5 py-4 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all font-bold"
              />
            </div>
          </div>

          <div className="flex flex-col gap-3 pt-4">
            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-2xl transition-all shadow-xl shadow-blue-500/20 active:scale-95">
              Save Changes
            </button>
            <button type="button" onClick={onClose} className="w-full py-3 text-sm font-bold text-gray-500 dark:text-blue-400/60 hover:text-gray-900 dark:hover:text-white transition-colors">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileModal;