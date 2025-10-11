import React from 'react';
import { Asset, Transaction, TransactionType } from '../types';
import { XMarkIcon } from './Icons';
import AssetLogo from './AssetLogo';

interface TransactionHistoryModalProps {
  asset: Asset;
  onClose: () => void;
}

const TransactionHistoryModal: React.FC<TransactionHistoryModalProps> = ({ asset, onClose }) => {

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const sortedTransactions = [...asset.transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg border border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-4">
                <AssetLogo asset={asset} size="md" />
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    {asset.name} History
                </h2>
            </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
            <XMarkIcon className="w-7 h-7" />
          </button>
        </div>

        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {sortedTransactions.length > 0 ? (
            <ul className="space-y-4">
              {sortedTransactions.map((tx) => {
                const isAdd = tx.type === TransactionType.ADD;
                const amountClass = isAdd ? 'text-emerald-600 dark:text-emerald-500' : 'text-red-600 dark:text-red-500';
                const prefix = isAdd ? '+' : '-';
                
                return (
                  <li key={tx.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <div>
                      <p className={`font-bold text-lg ${amountClass}`}>
                        {prefix}{tx.amount.toLocaleString()} {asset.ticker}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {isAdd ? 'Added to balance' : 'Removed from balance'}
                      </p>
                      {tx.description && (
                        <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 italic">
                            "{tx.description}"
                        </p>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 text-right">
                      {formatDate(tx.date)}
                    </p>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="text-center py-10">
              <p className="text-gray-500 dark:text-gray-400">No transaction history for this asset yet.</p>
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

export default TransactionHistoryModal;