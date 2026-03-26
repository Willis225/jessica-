import React, { useState, FormEvent } from 'react';
import { Asset, TransactionType } from '../types';
import { XMarkIcon, PlusIcon, MinusIcon } from './Icons';
import AssetLogo from './AssetLogo';

interface ManageBalanceModalProps {
  asset: Asset;
  onClose: () => void;
  onUpdateBalance: (assetId: string, amount: number, type: TransactionType, description?: string) => void;
}

const ManageBalanceModal: React.FC<ManageBalanceModalProps> = ({ asset, onClose, onUpdateBalance }) => {
  const [amount, setAmount] = useState<number | string>('');
  const [description, setDescription] = useState('');
  const [transactionType, setTransactionType] = useState<TransactionType>(TransactionType.ADD);
  const [error, setError] = useState('');
  const [view, setView] = useState<'main' | 'confirmCode'>('main');
  const [secretCode, setSecretCode] = useState('');

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError('');
    const value = e.target.value;
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setAmount(value);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError('');
    const numericAmount = parseFloat(amount as string);

    if (isNaN(numericAmount) || numericAmount <= 0) {
      setError('Please enter a valid, positive amount.');
      return;
    }
    
    if (transactionType === TransactionType.REMOVE) {
      if (numericAmount > asset.balance) {
        setError(`Cannot remove more than the current balance of ${asset.balance.toLocaleString()} ${asset.ticker}.`);
        return;
      }
      onUpdateBalance(asset.id, numericAmount, transactionType, description);
      onClose();
    } else { // It's an ADD transaction, so ask for secret code
      setView('confirmCode');
    }
  };

  const handleConfirmAdd = (e: FormEvent) => {
    e.preventDefault();
    if (secretCode.toLowerCase() !== 'funds') {
      setError('Invalid secret code. Please try again.');
      return;
    }
    const numericAmount = parseFloat(amount as string);
    onUpdateBalance(asset.id, numericAmount, TransactionType.ADD, description);
    onClose();
  };

  const handleBackToMain = () => {
    setError('');
    setSecretCode('');
    setView('main');
  };
  
  const value = asset.balance * asset.price;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div className="bg-white dark:bg-[#0f172a] rounded-[2rem] shadow-2xl w-full max-w-md border border-gray-200 dark:border-blue-900/20 overflow-hidden relative">
        <div className="spotlight-bg opacity-30" />
        
        <div className="flex justify-between items-center p-6 border-b border-gray-100 dark:border-blue-900/10 relative z-10">
          <h2 className="text-xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            {view === 'main' ? `Manage ${asset.name}` : 'Authorization'}
          </h2>
          <button onClick={onClose} className="p-2 rounded-xl text-gray-400 hover:text-gray-700 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-blue-900/30 transition-all">
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {view === 'main' ? (
          <form onSubmit={handleSubmit} className="relative z-10">
            <div className="p-6 space-y-6">
              <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-blue-900/10 rounded-2xl border border-gray-100 dark:border-blue-900/10">
                <div className="p-2 bg-white dark:bg-blue-900/30 rounded-xl shadow-sm">
                  <AssetLogo asset={asset} size="lg" />
                </div>
                <div>
                  <p className="font-bold text-gray-900 dark:text-white text-lg leading-tight">{asset.name}</p>
                  <p className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mt-1">
                    Balance: {asset.balance.toLocaleString()} {asset.ticker}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label htmlFor="amount" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 ml-1">
                    Amount ({asset.ticker})
                  </label>
                  <input
                    id="amount"
                    type="text"
                    value={amount}
                    onChange={handleAmountChange}
                    placeholder="0.00"
                    required
                    className="w-full bg-gray-50 dark:bg-black/50 border border-gray-200 dark:border-blue-900/30 rounded-2xl px-5 py-4 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  />
                </div>
                
                <div>
                  <label htmlFor="description" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 ml-1">
                      Note (Optional)
                  </label>
                  <input
                      id="description"
                      type="text"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="e.g., Portfolio rebalancing"
                      maxLength={50}
                      className="w-full bg-gray-50 dark:bg-black/50 border border-gray-200 dark:border-blue-900/30 rounded-2xl px-5 py-4 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  />
                </div>
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-xs py-3 px-4 rounded-xl font-bold text-center">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 pt-2">
                  <button
                      type="submit"
                      onClick={() => setTransactionType(TransactionType.ADD)}
                      className="flex flex-col items-center justify-center gap-2 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-4 rounded-2xl transition-all shadow-lg shadow-blue-500/20 active:scale-95"
                  >
                      <PlusIcon className="w-5 h-5" />
                      <span className="text-xs">Add Funds</span>
                  </button>
                  <button
                      type="submit"
                      onClick={() => setTransactionType(TransactionType.REMOVE)}
                      className="flex flex-col items-center justify-center gap-2 w-full bg-gray-900 dark:bg-white text-white dark:text-black font-bold py-4 px-4 rounded-2xl transition-all shadow-lg active:scale-95"
                  >
                      <MinusIcon className="w-5 h-5" />
                      <span className="text-xs">Remove</span>
                  </button>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-blue-900/10 p-4 flex justify-center">
               <button type="button" onClick={onClose} className="text-sm font-bold text-gray-500 dark:text-blue-400/60 hover:text-gray-900 dark:hover:text-white transition-colors">
                Close Manager
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleConfirmAdd} className="relative z-10">
            <div className="p-8 space-y-6 text-center">
              <div className="w-16 h-16 bg-blue-600/10 rounded-2xl flex items-center justify-center mx-auto mb-2">
                <PlusIcon className="w-8 h-8 text-blue-600" />
              </div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                A secure authorization code is required to add funds to your investment portfolio.
              </p>
              <div className="text-left">
                <label htmlFor="secretCode" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 ml-1">
                  Authorization Code
                </label>
                <input
                  id="secretCode"
                  type="password"
                  value={secretCode}
                  onChange={(e) => {
                    setSecretCode(e.target.value);
                    setError('');
                  }}
                  placeholder="••••••••"
                  required
                  autoFocus
                  className="w-full bg-gray-50 dark:bg-black/50 border border-gray-200 dark:border-blue-900/30 rounded-2xl px-5 py-4 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-center tracking-[0.5em]"
                />
              </div>
              {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-xs py-3 px-4 rounded-xl font-bold">
                  {error}
                </div>
              )}
            </div>
            <div className="p-6 pt-0 flex flex-col gap-3">
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-2xl transition-all shadow-xl shadow-blue-500/20 active:scale-95"
              >
                Confirm Deposit
              </button>
              <button type="button" onClick={handleBackToMain} className="w-full py-3 text-sm font-bold text-gray-500 dark:text-blue-400/60 hover:text-gray-900 dark:hover:text-white transition-colors">
                Go Back
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ManageBalanceModal;