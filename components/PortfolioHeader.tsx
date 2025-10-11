import React from 'react';
import { BanknotesIcon, ChatBubbleLeftRightIcon } from './Icons';

interface PortfolioHeaderProps {
  totalValue: number;
  onWithdrawClick: () => void;
}

const PortfolioHeader: React.FC<PortfolioHeaderProps> = ({ totalValue, onWithdrawClick }) => {
  const formattedValue = totalValue.toLocaleString('en-GB', {
    style: 'currency',
    currency: 'GBP',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  // Mock data for 24h change
  const changePercentage = 2.53;
  const changeValue = totalValue * (changePercentage / 100);

  const handleInvestClick = () => {
    // Replace with the actual phone number
    const phoneNumber = '1234567890'; 
    const message = encodeURIComponent("Hello! I'm interested in investing with INVEST EMPOWERMENT.");
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl mb-8 border border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div>
          <h2 className="text-lg font-medium text-gray-500 dark:text-gray-400 mb-2">Total Investment Value</h2>
          <p className="text-4xl lg:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-2">{formattedValue}</p>
          <div className="flex items-center gap-2">
            <span className="text-green-600 dark:text-green-500 font-semibold text-base">
              +{changePercentage}%
            </span>
            <span className="text-gray-500 dark:text-gray-400 text-sm">
              (+{changeValue.toLocaleString('en-GB', { style: 'currency', currency: 'GBP' })}) 24h
            </span>
          </div>
        </div>
        <div className="flex items-center flex-wrap justify-center sm:justify-end gap-4">
            <button
              onClick={handleInvestClick}
              className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
            >
              <ChatBubbleLeftRightIcon className="w-6 h-6" />
              <span>Invest Now</span>
            </button>
            <button
              onClick={onWithdrawClick}
              className="flex items-center justify-center gap-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-bold py-3 px-6 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
            >
              <BanknotesIcon className="w-6 h-6" />
              <span>Withdraw Funds</span>
            </button>
        </div>
      </div>
    </div>
  );
};

export default PortfolioHeader;