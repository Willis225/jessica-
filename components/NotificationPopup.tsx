import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Notification } from '../types';
import { XMarkIcon } from './Icons';

interface NotificationPopupProps {
  notification: Notification;
  onRemove: (id: string) => void;
}

const NotificationPopup: React.FC<NotificationPopupProps> = ({ notification, onRemove }) => {
  const [isExiting, setIsExiting] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  
  const { id, icon: Icon, title, message, timestamp } = notification;

  useEffect(() => {
    // Trigger enter animation
    const enterTimeout = setTimeout(() => setIsVisible(true), 100);

    // Set timer to start exit animation
    const exitTimer = setTimeout(() => {
      handleClose();
    }, 7000); // Popup stays for 7 seconds

    return () => {
      clearTimeout(enterTimeout);
      clearTimeout(exitTimer);
    };
  }, []);

  const handleClose = () => {
    setIsExiting(true);
    // Wait for animation to finish before removing from parent state
    setTimeout(() => {
      onRemove(id);
    }, 400); // Must match the duration of the exit animation
  };

  const iconColorClass = 
    notification.type === 'investment' ? 'text-emerald-500' :
    notification.type === 'withdrawal' ? 'text-blue-500' :
    notification.type === 'price_alert' ? 'text-yellow-500' :
    notification.type === 'new_member' ? 'text-indigo-500' :
    'text-gray-500';

  return (
    <div 
        className={`bg-white/90 dark:bg-black/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200 dark:border-blue-900/20 w-full overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] relative group ${
        isVisible && !isExiting ? 'translate-x-0 opacity-100 scale-100' : '-translate-x-full opacity-0 scale-95'
      }`}
      role="alert"
      aria-live="assertive"
    >
      <div className="spotlight-bg opacity-10 group-hover:opacity-20 transition-opacity" />
      
      <div className="flex items-start p-5 relative z-10">
        <div className="flex-shrink-0 relative">
          <div className={`absolute -inset-2 blur-lg opacity-20 ${iconColorClass.replace('text-', 'bg-')}`} />
          <Icon className={`w-8 h-8 relative z-10 ${iconColorClass}`} />
        </div>
        <div className="ml-4 w-0 flex-1">
          <p className="text-sm font-extrabold text-gray-900 dark:text-white tracking-tight">{title}</p>
          <p className="mt-1 text-sm font-medium text-gray-600 dark:text-blue-400/60 leading-relaxed">{message}</p>
          <p className="mt-2 text-[10px] font-bold text-gray-400 dark:text-blue-400/30 uppercase tracking-widest">{timestamp}</p>
        </div>
        <div className="ml-4 flex-shrink-0 flex">
          <button
            onClick={handleClose}
            className="inline-flex text-gray-400 dark:text-blue-400/40 hover:text-gray-600 dark:hover:text-white transition-colors p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-blue-900/20"
          >
            <span className="sr-only">Close</span>
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 h-1 bg-blue-600/20 w-full">
        <motion.div 
          initial={{ width: '100%' }}
          animate={{ width: '0%' }}
          transition={{ duration: 7, ease: 'linear' }}
          className="h-full bg-blue-600"
        />
      </div>
    </div>
  );
};

export default NotificationPopup;