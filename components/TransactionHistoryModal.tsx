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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div className="bg-white dark:bg-[#0f172a] rounded-[2.5rem] shadow-2xl w-full max-w-lg border border-gray-200 dark:border-blue-900/20 overflow-hidden relative">
        <div className="spotlight-bg opacity-30" />
        
        <div className="flex justify-between items-center p-8 border-b border-gray-100 dark:border-blue-900/10 relative z-10">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-2xl">
              <AssetLogo asset={asset} size="md" />
            </div>
            <div>
              <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                {asset.name}
              </h2>
              <p className="text-xs font-bold text-gray-500 dark:text-blue-400/60 uppercase tracking-widest">Transaction History</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl text-gray-400 hover:text-gray-700 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-blue-900/30 transition-all">
            <XMarkIcon className="w-7 h-7" />
          </button>
        </div>

        <div className="p-8 max-h-[60vh] overflow-y-auto relative z-10 custom-scrollbar">
          {sortedTransactions.length > 0 ? (
            <ul className="space-y-4">
              {sortedTransactions.map((tx) => {
                const isAdd = tx.type === TransactionType.ADD;
                const amountClass = isAdd ? 'text-blue-600 dark:text-blue-400' : 'text-red-600 dark:text-red-400';
                const prefix = isAdd ? '+' : '-';
                
                return (
                  <li key={tx.id} className="flex items-center justify-between p-5 bg-gray-50 dark:bg-black/40 border border-gray-100 dark:border-blue-900/20 rounded-[1.5rem] transition-all hover:border-blue-500/30 group">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${isAdd ? 'bg-blue-500' : 'bg-red-500'}`} />
                        <p className={`font-black text-xl tracking-tight ${amountClass}`}>
                          {prefix}{tx.amount.toLocaleString()} {asset.ticker}
                        </p>
                      </div>
                      <p className="text-xs font-bold text-gray-500 dark:text-blue-400/40 uppercase tracking-wider">
                        {isAdd ? 'Deposit' : 'Withdrawal'}
                      </p>
                      {tx.description && (
                        <p className="text-sm text-gray-600 dark:text-blue-100/60 mt-2 italic bg-white/50 dark:bg-blue-900/10 p-2 rounded-xl border border-gray-100 dark:border-blue-900/10">
                          "{tx.description}"
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold text-gray-400 dark:text-blue-400/30 uppercase tracking-tighter">
                        {new Date(tx.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                      </p>
                      <p className="text-sm font-bold text-gray-600 dark:text-blue-100/80">
                        {new Date(tx.date).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-gray-50 dark:bg-blue-900/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-100 dark:border-blue-900/20">
                <XMarkIcon className="w-10 h-10 text-gray-300 dark:text-blue-900/40" />
              </div>
              <p className="text-gray-500 dark:text-blue-400/60 font-bold">No transaction history yet.</p>
            </div>
          )}
        </div>

        <div className="p-8 border-t border-gray-100 dark:border-blue-900/10 relative z-10">
          <button onClick={onClose} className="w-full bg-gray-100 dark:bg-blue-900/20 hover:bg-gray-200 dark:hover:bg-blue-900/40 text-gray-900 dark:text-white font-bold py-4 rounded-2xl transition-all active:scale-95">
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default TransactionHistoryModal;