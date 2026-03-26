import React from 'react';
import { motion } from 'motion/react';
import { Asset } from '../types';
import AssetLogo from './AssetLogo';
import TradingChartPreview from './TradingChartPreview';
import { ListBulletIcon, ChartPieIcon, BellAlertIcon, BitcoinIcon } from './Icons';

interface AssetRowProps {
  asset: Asset;
  totalPortfolioValue: number;
  onManageBalance: (asset: Asset) => void;
  onViewHistory: (asset: Asset) => void;
  onViewChart: (asset: Asset) => void;
  onSetAlert: (asset: Asset) => void;
}

const AssetRow: React.FC<AssetRowProps> = ({ asset, totalPortfolioValue, onManageBalance, onViewHistory, onViewChart, onSetAlert }) => {
  const value = asset.balance * asset.price;
  const allocation = totalPortfolioValue > 0 ? (value / totalPortfolioValue) * 100 : 0;

  return (
    <motion.tr 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ backgroundColor: 'rgba(59, 130, 246, 0.05)' }}
      className="border-b border-gray-100 dark:border-blue-900/10 transition-colors duration-200 group"
    >
      <td className="p-6">
        <div className="flex items-center gap-5">
          <div className="relative">
            <AssetLogo asset={asset} />
            <div className="absolute -inset-1 bg-blue-500/20 rounded-full blur opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <div>
            <p className="font-extrabold text-gray-900 dark:text-white tracking-tight">{asset.name}</p>
            {asset.ticker === 'BTC' ? (
              <div className="flex items-center gap-1.5 text-xs font-bold text-gray-500 dark:text-blue-400/40 uppercase tracking-widest">
                <BitcoinIcon className="w-3 h-3 text-orange-500" />
                <span>{asset.ticker}</span>
              </div>
            ) : (
              <p className="text-xs font-bold text-gray-500 dark:text-blue-400/40 uppercase tracking-widest">{asset.ticker}</p>
            )}
          </div>
        </div>
      </td>
      <td className="p-6 text-right">
        <p className="font-bold text-gray-900 dark:text-white tracking-tight">{asset.price.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</p>
      </td>
      <td className="p-6 text-right">
        <p className="font-bold text-gray-900 dark:text-white tracking-tight">{asset.balance.toLocaleString()} {asset.ticker}</p>
        <p className="text-xs font-bold text-gray-500 dark:text-blue-400/40 uppercase tracking-widest">{value.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</p>
      </td>
      <td className="p-6 hidden lg:table-cell">
        <div className="opacity-50 group-hover:opacity-100 transition-opacity">
          <TradingChartPreview />
        </div>
      </td>
      <td className="p-6 text-right hidden md:table-cell">
        <div className="flex flex-col items-end gap-2">
          <p className="font-bold text-gray-900 dark:text-white text-sm">{allocation.toFixed(2)}%</p>
          <div className="w-24 bg-gray-100 dark:bg-blue-900/20 rounded-full h-1.5 overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${Math.max(0, allocation)}%` }}
              className="bg-blue-600 h-full rounded-full"
            />
          </div>
        </div>
      </td>
      <td className="p-6 text-right">
        <div className="flex justify-end items-center gap-3">
            <motion.button 
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => onSetAlert(asset)}
                className="bg-gray-100 dark:bg-blue-900/20 hover:bg-gray-200 dark:hover:bg-blue-900/30 text-gray-600 dark:text-blue-400 p-2.5 rounded-xl transition-all"
                aria-label="Set price alert"
            >
                <BellAlertIcon className="w-5 h-5" />
            </motion.button>
            <motion.button 
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => onViewChart(asset)}
                className="bg-gray-100 dark:bg-blue-900/20 hover:bg-gray-200 dark:hover:bg-blue-900/30 text-gray-600 dark:text-blue-400 p-2.5 rounded-xl transition-all"
                aria-label="View live chart"
            >
                <ChartPieIcon className="w-5 h-5" />
            </motion.button>
            <motion.button 
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => onViewHistory(asset)}
                className="bg-gray-100 dark:bg-blue-900/20 hover:bg-gray-200 dark:hover:bg-blue-900/30 text-gray-600 dark:text-blue-400 p-2.5 rounded-xl transition-all"
                aria-label="View history"
            >
                <ListBulletIcon className="w-5 h-5" />
            </motion.button>
            <motion.button 
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onManageBalance(asset)} 
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-5 rounded-xl transition-all shadow-lg shadow-blue-500/20 text-sm"
            >
                Manage
            </motion.button>
        </div>
      </td>
    </motion.tr>
  );
};

export default AssetRow;