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
      ? `${containerSize} rounded-full`
      : `${containerSize} rounded-full bg-white p-1 object-contain`;

    return <img src={asset.logoUrl} alt={`${asset.name} logo`} className={imageClass} />;
  }

  return (
    <div className={`${containerSize} rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center`}>
      <StockIcon className="w-3/5 h-3/5 text-gray-500 dark:text-gray-400" />
    </div>
  );
};

export default AssetLogo;