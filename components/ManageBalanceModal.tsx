
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
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md border border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {view === 'main' ? `Manage ${asset.name} Balance` : 'Authorization Required'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
            <XMarkIcon className="w-7 h-7" />
          </button>
        </div>

        {view === 'main' ? (
          <form onSubmit={handleSubmit}>
            <div className="p-6">
              <div className="flex items-center gap-4 mb-6">
                <AssetLogo asset={asset} size="lg" />
                <div>
                  <p className="font-bold text-gray-900 dark:text-white text-lg">{asset.name} ({asset.ticker})</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Current Balance: {asset.balance.toLocaleString()} {asset.ticker} ({value.toLocaleString('en-GB', { style: 'currency', currency: 'GBP' })})
                  </p>
                </div>
              </div>

              <div className="mb-4">
                <label htmlFor="amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Amount in {asset.ticker}
                </label>
                <input
                  id="amount"
                  type="text"
                  value={amount}
                  onChange={handleAmountChange}
                  placeholder="e.g., 0.5"
                  required
                  className="w-full bg-white dark:bg-gray-900/50 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                />
              </div>
              
              <div className="mb-6">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Description (Optional)
                </label>
                <input
                    id="description"
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="e.g., Monthly savings"
                    maxLength={50}
                    className="w-full bg-white dark:bg-gray-900/50 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                />
              </div>

              {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

              <div className="grid grid-cols-2 gap-4">
                  <button
                      type="submit"
                      onClick={() => setTransactionType(TransactionType.ADD)}
                      className="flex items-center justify-center gap-2 w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200 shadow-sm"
                  >
                      <PlusIcon className="w-5 h-5" />
                      <span>Add to Balance</span>
                  </button>
                  <button
                      type="submit"
                      onClick={() => setTransactionType(TransactionType.REMOVE)}
                      className="flex items-center justify-center gap-2 w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200 shadow-sm"
                  >
                      <MinusIcon className="w-5 h-5" />
                      <span>Remove from Balance</span>
                  </button>
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-gray-800/50 p-4 rounded-b-2xl flex justify-end">
               <button type="button" onClick={onClose} className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-bold py-2 px-6 rounded-lg transition-colors">
                Cancel
              </button>
            </div>
          </form>
        ) : ( // view === 'confirmCode'
          <form onSubmit={handleConfirmAdd}>
            <div className="p-6">
              <p className="text-center text-gray-700 dark:text-gray-300 mb-4">
                A secret code is required to add funds to your investment.
              </p>
              <div className="mb-4">
                <label htmlFor="secretCode" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Secret Code
                </label>
                <input
                  id="secretCode"
                  type="password"
                  value={secretCode}
                  onChange={(e) => {
                    setSecretCode(e.target.value);
                    setError('');
                  }}
                  placeholder="Enter authorization code"
                  required
                  autoFocus
                  className="w-full bg-white dark:bg-gray-900/50 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                />
              </div>
              {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
            </div>
            <div className="bg-blue-50 dark:bg-gray-800/50 p-4 rounded-b-2xl flex justify-end gap-4">
              <button type="button" onClick={handleBackToMain} className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-bold py-2 px-6 rounded-lg transition-colors">
                Back
              </button>
              <button
                type="submit"
                className="flex items-center justify-center gap-2 w-auto bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-6 rounded-lg transition-colors duration-200 shadow-sm"
              >
                Authorize & Add
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ManageBalanceModal;