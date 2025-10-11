
import React from 'react';

interface WelcomeScreenProps {
  username: string;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ username }) => {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
        Welcome back, {username}!
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mt-2">
        Here's an overview of your investment.
      </p>
    </div>
  );
};

export default WelcomeScreen;
