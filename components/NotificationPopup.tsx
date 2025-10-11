import React, { useState, useEffect } from 'react';
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
        className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 w-full overflow-hidden transition-all duration-300 ease-out ${
        isVisible && !isExiting ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'
      }`}
      role="alert"
      aria-live="assertive"
    >
      <div className="flex items-start p-4">
        <div className="flex-shrink-0">
          <Icon className={`w-7 h-7 ${iconColorClass}`} />
        </div>
        <div className="ml-3 w-0 flex-1">
          <p className="text-sm font-bold text-gray-900 dark:text-white">{title}</p>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">{message}</p>
          <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">{timestamp}</p>
        </div>
        <div className="ml-4 flex-shrink-0 flex">
          <button
            onClick={handleClose}
            className="inline-flex text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 rounded-md"
          >
            <span className="sr-only">Close</span>
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationPopup;