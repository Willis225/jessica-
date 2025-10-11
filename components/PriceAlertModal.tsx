import React, { useState, FormEvent } from 'react';
import { Asset, PriceAlert } from '../types';
import { XMarkIcon, BellAlertIcon } from './Icons';
import AssetLogo from './AssetLogo';

interface PriceAlertModalProps {
  asset: Asset;
  onClose: () => void;
  onAddAlert: (assetId: string, alert: Omit<PriceAlert, 'id' | 'status' | 'createdAt'>) => void;
  onDeleteAlert: (assetId: string, alertId: string) => void;
}

const PriceAlertModal: React.FC<PriceAlertModalProps> = ({ asset, onClose, onAddAlert, onDeleteAlert }) => {
  const [alertType, setAlertType] = useState<'above' | 'below'>('above');
  const [targetPrice, setTargetPrice] = useState<string>('');
  const [error, setError] = useState('');

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError('');
    const value = e.target.value;
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setTargetPrice(value);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError('');
    const numericTarget = parseFloat(targetPrice);

    if (isNaN(numericTarget) || numericTarget <= 0) {
      setError('Please enter a valid, positive price.');
      return;
    }
    
    const alreadyExists = asset.priceAlerts.some(
      alert => alert.status === 'active' && alert.type === alertType && alert.targetPrice === numericTarget
    );
    if (alreadyExists) {
        setError('An identical active alert already exists.');
        return;
    }

    onAddAlert(asset.id, { type: alertType, targetPrice: numericTarget });
    setTargetPrice('');
  };

  const activeAlerts = asset.priceAlerts.filter(a => a.status === 'active');
  const triggeredAlerts = asset.priceAlerts.filter(a => a.status === 'triggered');

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md border border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <BellAlertIcon className="w-6 h-6 text-emerald-600 dark:text-emerald-500" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Price Alerts</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
            <XMarkIcon className="w-7 h-7" />
          </button>
        </div>

        <div className="p-6 max-h-[70vh] overflow-y-auto">
            <div className="flex items-center gap-4 mb-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <AssetLogo asset={asset} size="md" />
                <div>
                    <p className="font-bold text-gray-900 dark:text-white">{asset.name} ({asset.ticker})</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Current Price: {asset.price.toLocaleString('en-GB', { style: 'currency', currency: 'GBP' })}
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="mb-6 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <h3 className="font-semibold mb-3 text-gray-800 dark:text-gray-200">Set a New Alert</h3>
                <div className="grid grid-cols-2 gap-2 mb-3">
                    <button type="button" onClick={() => setAlertType('above')} className={`w-full py-2 rounded-md text-sm font-medium transition-colors ${alertType === 'above' ? 'bg-emerald-600 text-white' : 'bg-gray-200 dark:bg-gray-600'}`}>
                        Price Above
                    </button>
                    <button type="button" onClick={() => setAlertType('below')} className={`w-full py-2 rounded-md text-sm font-medium transition-colors ${alertType === 'below' ? 'bg-red-600 text-white' : 'bg-gray-200 dark:bg-gray-600'}`}>
                        Price Below
                    </button>
                </div>
                <div className="flex gap-2">
                    <input
                      type="text"
                      value={targetPrice}
                      onChange={handlePriceChange}
                      placeholder="e.g., 56000"
                      required
                      className="flex-grow w-full bg-white dark:bg-gray-900/50 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                    />
                    <button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded-lg transition-colors">
                        Set
                    </button>
                </div>
                 {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            </form>

            <div>
                <h3 className="font-semibold mb-2 text-gray-800 dark:text-gray-200">Active Alerts</h3>
                {activeAlerts.length > 0 ? (
                    <ul className="space-y-2">
                        {activeAlerts.map(alert => (
                            <li key={alert.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-md">
                                <div>
                                    <span className={`font-medium ${alert.type === 'above' ? 'text-emerald-600' : 'text-red-600'}`}>
                                        {alert.type === 'above' ? 'Above' : 'Below'}:
                                    </span>
                                    <span className="ml-2 text-gray-800 dark:text-gray-200">{alert.targetPrice.toLocaleString('en-GB', { style: 'currency', currency: 'GBP' })}</span>
                                </div>
                                <button onClick={() => onDeleteAlert(asset.id, alert.id)} className="text-gray-400 hover:text-red-500">
                                    <XMarkIcon className="w-5 h-5" />
                                </button>
                            </li>
                        ))}
                    </ul>
                ) : <p className="text-sm text-gray-500 dark:text-gray-400">No active alerts.</p>}
            </div>

            {triggeredAlerts.length > 0 && (
                <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-4">
                    <h3 className="font-semibold mb-2 text-gray-500 dark:text-gray-400">Triggered Alerts</h3>
                     <ul className="space-y-2">
                        {triggeredAlerts.map(alert => (
                            <li key={alert.id} className="p-3 bg-gray-100 dark:bg-gray-900/50 rounded-md text-gray-500 dark:text-gray-500">
                                <span className="line-through">
                                    {alert.type === 'above' ? 'Above' : 'Below'}: {alert.targetPrice.toLocaleString('en-GB', { style: 'currency', currency: 'GBP' })}
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>

        <div className="bg-blue-50 dark:bg-gray-800/50 p-4 rounded-b-2xl flex justify-end">
          <button onClick={onClose} className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-bold py-2 px-6 rounded-lg transition-colors">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default PriceAlertModal;
