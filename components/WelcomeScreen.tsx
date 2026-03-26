
import React from 'react';

interface WelcomeScreenProps {
  username: string;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ username }) => {
  return (
    <div className="px-8 pt-10 pb-4">
      <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight leading-tight">
        Welcome back, <span className="text-blue-600 dark:text-blue-500">{username}</span>!
      </h1>
      <p className="text-gray-500 dark:text-blue-400/60 mt-3 font-bold text-lg max-w-md leading-relaxed">
        Your portfolio is performing well today. Here's your latest overview.
      </p>
    </div>
  );
};

export default WelcomeScreen;
