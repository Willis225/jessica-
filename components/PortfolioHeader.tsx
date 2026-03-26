import React from 'react';
import { motion } from 'motion/react';
import { BanknotesIcon, ChatBubbleLeftRightIcon } from './Icons';

interface PortfolioHeaderProps {
  totalValue: number;
  onWithdrawClick: () => void;
}

const PortfolioHeader: React.FC<PortfolioHeaderProps> = ({ totalValue, onWithdrawClick }) => {
  const formattedValue = totalValue.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  // Mock data for 24h change
  const changePercentage = 2.53;
  const changeValue = totalValue * (changePercentage / 100);

  const handleInvestClick = () => {
    // window.open('https://wa.link/zzgy5z', '_blank');
    console.log('Reinvest button disabled');
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/80 dark:bg-black/40 backdrop-blur-3xl p-8 rounded-[2.5rem] mb-12 border border-gray-200 dark:border-blue-900/20 shadow-2xl relative overflow-hidden group"
    >
      <div className="spotlight-bg opacity-20 group-hover:opacity-30 transition-opacity" />
      
      <div className="flex flex-wrap justify-between items-center gap-8 relative z-10">
        <div className="space-y-2">
          <h2 className="text-sm font-bold text-gray-500 dark:text-blue-400/60 uppercase tracking-widest reveal-text">Total Portfolio Value</h2>
          <motion.p 
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            className="text-5xl lg:text-7xl font-extrabold text-gray-900 dark:text-white tracking-tighter shimmer-text"
          >
            {formattedValue}
          </motion.p>
          <div className="flex items-center gap-3 reveal-text">
            <div className="flex items-center gap-1.5 px-3 py-1 bg-green-500/10 rounded-full border border-green-500/20">
              <span className="text-green-600 dark:text-green-400 font-bold text-sm">
                +{changePercentage}%
              </span>
            </div>
            <span className="text-gray-500 dark:text-blue-400/40 text-xs font-bold uppercase tracking-wider">
              (+{changeValue.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}) 24h
            </span>
          </div>
        </div>
        
        <div className="flex items-center flex-wrap justify-center sm:justify-end gap-4">
            <motion.button
              whileHover={{ scale: 1 }}
              whileTap={{ scale: 1 }}
              onClick={handleInvestClick}
              className="flex items-center justify-center gap-3 bg-gray-400 dark:bg-gray-800 text-white font-bold py-4 px-8 rounded-2xl transition-all shadow-none cursor-not-allowed opacity-60 group/btn"
              disabled
            >
              <ChatBubbleLeftRightIcon className="w-6 h-6 group-hover/btn:rotate-12 transition-transform" />
              <span>Reinvest Now</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={onWithdrawClick}
              className="flex items-center justify-center gap-3 bg-gray-100 dark:bg-blue-900/20 hover:bg-gray-200 dark:hover:bg-blue-900/30 text-gray-900 dark:text-blue-400 font-bold py-4 px-8 rounded-2xl transition-all border border-transparent dark:border-blue-900/10"
            >
              <BanknotesIcon className="w-6 h-6" />
              <span>Withdraw</span>
            </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default PortfolioHeader;