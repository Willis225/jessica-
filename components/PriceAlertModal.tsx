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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div className="bg-white dark:bg-[#0f172a] rounded-[2.5rem] shadow-2xl w-full max-w-md border border-gray-200 dark:border-blue-900/20 overflow-hidden relative">
        <div className="spotlight-bg opacity-30" />
        
        <div className="flex justify-between items-center p-8 border-b border-gray-100 dark:border-blue-900/10 relative z-10">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-600/10 rounded-2xl border border-blue-600/20">
              <BellAlertIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight">Price Alerts</h2>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl text-gray-400 hover:text-gray-700 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-blue-900/30 transition-all">
            <XMarkIcon className="w-7 h-7" />
          </button>
        </div>

        <div className="p-8 max-h-[70vh] overflow-y-auto space-y-8 relative z-10 scrollbar-hide">
            <div className="flex items-center gap-5 p-5 bg-gray-50 dark:bg-blue-900/10 rounded-2xl border border-gray-100 dark:border-blue-900/10">
                <AssetLogo asset={asset} size="lg" />
                <div>
                    <p className="font-extrabold text-gray-900 dark:text-white tracking-tight text-lg">{asset.name}</p>
                    <p className="text-xs font-bold text-gray-500 dark:text-blue-400/40 uppercase tracking-widest mt-1">
                        Current: {asset.price.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest ml-1">Set a New Alert</h3>
                  <div className="grid grid-cols-2 gap-3">
                      <button 
                        type="button" 
                        onClick={() => setAlertType('above')} 
                        className={`py-4 rounded-2xl text-sm font-bold transition-all border ${alertType === 'above' ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-500/20' : 'bg-gray-50 dark:bg-black/50 text-gray-500 dark:text-blue-400/40 border-gray-200 dark:border-blue-900/20 hover:border-blue-600/50'}`}
                      >
                          Price Above
                      </button>
                      <button 
                        type="button" 
                        onClick={() => setAlertType('below')} 
                        className={`py-4 rounded-2xl text-sm font-bold transition-all border ${alertType === 'below' ? 'bg-red-600 text-white border-red-600 shadow-lg shadow-red-500/20' : 'bg-gray-50 dark:bg-black/50 text-gray-500 dark:text-blue-400/40 border-gray-200 dark:border-blue-900/20 hover:border-red-600/50'}`}
                      >
                          Price Below
                      </button>
                  </div>
                </div>

                <div className="flex gap-3">
                    <div className="relative flex-1">
                      <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 font-bold">$</span>
                      <input
                        type="text"
                        value={targetPrice}
                        onChange={handlePriceChange}
                        placeholder="0.00"
                        required
                        className="w-full bg-gray-50 dark:bg-black/50 border border-gray-200 dark:border-blue-900/30 rounded-2xl pl-10 pr-5 py-4 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all font-bold"
                      />
                    </div>
                    <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-2xl transition-all shadow-xl shadow-blue-500/20 active:scale-95">
                        Set
                    </button>
                </div>
                 {error && (
                   <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-xs py-3 px-4 rounded-xl font-bold text-center">
                     {error}
                   </div>
                 )}
            </form>

            <div className="space-y-4">
                <h3 className="text-xs font-bold text-gray-500 dark:text-blue-400/40 uppercase tracking-widest ml-1">Active Alerts</h3>
                {activeAlerts.length > 0 ? (
                    <ul className="space-y-3">
                        {activeAlerts.map(alert => (
                            <li key={alert.id} className="flex items-center justify-between p-5 bg-gray-50 dark:bg-blue-900/10 rounded-2xl border border-gray-100 dark:border-blue-900/10 group/item">
                                <div className="flex items-center gap-3">
                                    <div className={`w-2 h-2 rounded-full ${alert.type === 'above' ? 'bg-blue-600' : 'bg-red-600'} animate-pulse`} />
                                    <span className={`text-sm font-bold ${alert.type === 'above' ? 'text-blue-600 dark:text-blue-400' : 'text-red-600 dark:text-red-400'}`}>
                                        {alert.type === 'above' ? 'Above' : 'Below'}
                                    </span>
                                    <span className="text-gray-900 dark:text-white font-extrabold tracking-tight">
                                      {alert.targetPrice.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                                    </span>
                                </div>
                                <button onClick={() => onDeleteAlert(asset.id, alert.id)} className="p-2 rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-500/10 transition-all opacity-0 group-hover/item:opacity-100">
                                    <XMarkIcon className="w-5 h-5" />
                                </button>
                            </li>
                        ))}
                    </ul>
                ) : (
                  <div className="text-center py-8 bg-gray-50 dark:bg-blue-900/5 rounded-2xl border border-dashed border-gray-200 dark:border-blue-900/20">
                    <p className="text-sm font-bold text-gray-400 dark:text-blue-400/30 uppercase tracking-widest">No active alerts</p>
                  </div>
                )}
            </div>

            {triggeredAlerts.length > 0 && (
                <div className="pt-6 border-t border-gray-100 dark:border-blue-900/10 space-y-4">
                    <h3 className="text-xs font-bold text-gray-400 dark:text-blue-400/20 uppercase tracking-widest ml-1">Triggered History</h3>
                     <ul className="space-y-2">
                        {triggeredAlerts.map(alert => (
                            <li key={alert.id} className="p-4 bg-gray-50/50 dark:bg-blue-900/5 rounded-xl text-gray-400 dark:text-blue-400/20 border border-transparent">
                                <span className="line-through text-sm font-bold">
                                    {alert.type === 'above' ? 'Above' : 'Below'}: {alert.targetPrice.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>

        <div className="p-8 pt-0 relative z-10">
          <button onClick={onClose} className="w-full bg-gray-100 dark:bg-blue-900/20 hover:bg-gray-200 dark:hover:bg-blue-900/30 text-gray-900 dark:text-blue-400 font-bold py-4 px-8 rounded-2xl transition-all border border-transparent dark:border-blue-900/10">
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default PriceAlertModal;
