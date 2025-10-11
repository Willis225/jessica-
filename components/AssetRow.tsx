import React from 'react';
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
    <tr className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-100/50 dark:hover:bg-gray-700/50 transition-colors duration-200">
      <td className="p-4">
        <div className="flex items-center gap-4">
          <AssetLogo asset={asset} />
          <div>
            <p className="font-bold text-gray-900 dark:text-white">{asset.name}</p>
            {asset.ticker === 'BTC' ? (
              <div className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
                <BitcoinIcon className="w-4 h-4 text-orange-500" />
                <span>{asset.ticker}</span>
              </div>
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400">{asset.ticker}</p>
            )}
          </div>
        </div>
      </td>
      <td className="p-4 text-right">
        <p className="font-medium text-gray-800 dark:text-gray-300">{asset.price.toLocaleString('en-GB', { style: 'currency', currency: 'GBP' })}</p>
      </td>
      <td className="p-4 text-right">
        <p className="font-medium text-gray-800 dark:text-gray-300">{asset.balance.toLocaleString()} {asset.ticker}</p>
        <p className="text-sm text-gray-500 dark:text-gray-400">{value.toLocaleString('en-GB', { style: 'currency', currency: 'GBP' })}</p>
      </td>
      <td className="p-4 hidden lg:table-cell">
        <TradingChartPreview />
      </td>
      <td className="p-4 text-right hidden md:table-cell">
        <div className="flex flex-col items-end">
          <p className="font-medium text-gray-800 dark:text-gray-300">{allocation.toFixed(2)}%</p>
          <div className="w-24 bg-gray-200 dark:bg-gray-600 rounded-full h-1.5 mt-1">
            <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: `${Math.max(0, allocation)}%` }}></div>
          </div>
        </div>
      </td>
      <td className="p-4 text-right">
        <div className="flex justify-end items-center gap-2">
            <button 
                onClick={() => onSetAlert(asset)}
                className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-bold p-2 rounded-lg transition-colors duration-200"
                aria-label="Set price alert"
            >
                <BellAlertIcon className="w-5 h-5" />
            </button>
            <button 
                onClick={() => onViewChart(asset)}
                className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-bold p-2 rounded-lg transition-colors duration-200"
                aria-label="View live chart"
            >
                <ChartPieIcon className="w-5 h-5" />
            </button>
            <button 
                onClick={() => onViewHistory(asset)}
                className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-bold p-2 rounded-lg transition-colors duration-200"
                aria-label="View history"
            >
                <ListBulletIcon className="w-5 h-5" />
            </button>
            <button 
                onClick={() => onManageBalance(asset)} 
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200 text-sm"
            >
                Manage
            </button>
        </div>
      </td>
    </tr>
  );
};

export default AssetRow;