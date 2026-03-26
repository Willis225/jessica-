import React from 'react';
import { Asset } from '../types';
import { StockIcon } from './Icons';

interface AssetLogoProps {
  asset: Asset;
  size?: 'sm' | 'md' | 'lg';
}

const sizeClasses = {
  sm: 'w-8 h-8',
  md: 'w-10 h-10',
  lg: 'w-12 h-12',
}

const AssetLogo: React.FC<AssetLogoProps> = ({ asset, size = 'md' }) => {
  const containerSize = sizeClasses[size];

  if (asset.logoUrl) {
    const isCrypto = ['BTC', 'ETH', 'SOL', 'XRP'].includes(asset.ticker);
    const imageClass = isCrypto
      ? `${containerSize} rounded-full shadow-lg border border-gray-100 dark:border-blue-900/20`
      : `${containerSize} rounded-full bg-white p-1.5 object-contain shadow-lg border border-gray-100 dark:border-blue-900/20`;

    return (
      <div className="relative">
        <img 
          src={asset.logoUrl} 
          alt={`${asset.name} logo`} 
          className={imageClass} 
          referrerPolicy="no-referrer"
        />
      </div>
    );
  }

  return (
    <div className={`${containerSize} rounded-full bg-gray-100 dark:bg-blue-900/20 flex items-center justify-center border border-gray-200 dark:border-blue-900/10 shadow-inner`}>
      <StockIcon className="w-3/5 h-3/5 text-gray-400 dark:text-blue-400/40" />
    </div>
  );
};

export default AssetLogo;