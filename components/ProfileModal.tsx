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
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg border border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Profile Settings</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
            <XMarkIcon className="w-7 h-7" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="flex flex-col items-center mb-6">
            <div className="relative">
              {imagePreview ? (
                <img src={imagePreview} alt="Profile Preview" className="w-24 h-24 rounded-full object-cover" />
              ) : (
                <UserCircleIcon className="w-24 h-24 text-gray-400 dark:text-gray-500" />
              )}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute -bottom-1 -right-1 bg-emerald-600 hover:bg-emerald-700 rounded-full p-2 text-white border-2 border-white dark:border-gray-800"
                aria-label="Change profile picture"
              >
                <CameraIcon className="w-5 h-5" />
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                accept="image/png, image/jpeg, image/gif"
                className="hidden"
              />
            </div>
          </div>
        
          <div className="space-y-4">
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Full Name</label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName || ''}
                onChange={handleInputChange}
                placeholder="Your full name"
                className="w-full bg-white dark:bg-gray-900/50 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email || ''}
                onChange={handleInputChange}
                placeholder="your.email@example.com"
                className="w-full bg-white dark:bg-gray-900/50 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
              />
            </div>
            <div>
              <label htmlFor="bio" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Investment Bio/Notes</label>
              <textarea
                id="bio"
                name="bio"
                rows={3}
                value={formData.bio || ''}
                onChange={handleInputChange}
                placeholder="Your investment strategy, goals, etc."
                className="w-full bg-white dark:bg-gray-900/50 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none resize-none"
              />
            </div>
          </div>

          <div className="flex justify-end gap-4 mt-8">
            <button type="button" onClick={onClose} className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-bold py-2 px-6 rounded-lg transition-colors">
              Cancel
            </button>
            <button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-6 rounded-lg transition-colors">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileModal;