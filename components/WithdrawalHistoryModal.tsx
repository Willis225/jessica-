import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Receipt } from '../types';
import { XMarkIcon, BanknotesIcon, ArrowRightIcon } from './Icons';

interface WithdrawalHistoryModalProps {
  history: Receipt[];
  onClose: () => void;
  onViewReceipt: (receipt: Receipt) => void;
}

const WithdrawalHistoryModal: React.FC<WithdrawalHistoryModalProps> = ({ history, onClose, onViewReceipt }) => {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-md"
      />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative w-full max-w-lg bg-white dark:bg-[#0f172a] rounded-[2.5rem] shadow-2xl border border-gray-100 dark:border-blue-900/20 overflow-hidden"
      >
        <div className="p-6 border-b border-gray-100 dark:border-blue-900/10 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600/10 rounded-xl">
              <BanknotesIcon className="w-6 h-6 text-blue-600" />
            </div>
            <h2 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">Withdrawal History</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-blue-900/20 rounded-xl transition-colors">
            <XMarkIcon className="w-6 h-6 text-gray-400" />
          </button>
        </div>

        <div className="p-4 max-h-[60vh] overflow-y-auto scrollbar-hide">
          {history.length === 0 ? (
            <div className="py-12 text-center">
              <div className="w-16 h-16 bg-gray-100 dark:bg-blue-900/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <BanknotesIcon className="w-8 h-8 text-gray-300 dark:text-blue-900/40" />
              </div>
              <p className="text-gray-500 dark:text-blue-400/60 font-bold">No withdrawals yet.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {history.map((receipt) => (
                <motion.div
                  key={receipt.transactionId}
                  whileHover={{ x: 4 }}
                  className="p-4 bg-gray-50 dark:bg-blue-900/10 rounded-3xl border border-transparent hover:border-blue-500/20 transition-all group cursor-pointer"
                  onClick={() => onViewReceipt(receipt)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-green-500/10 rounded-2xl flex items-center justify-center">
                        <BanknotesIcon className="w-5 h-5 text-green-500" />
                      </div>
                      <div>
                        <p className="font-black text-gray-900 dark:text-white leading-tight">
                          {receipt.amountUSD.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                        </p>
                        <p className="text-[10px] font-bold text-gray-400 dark:text-blue-400/40 uppercase tracking-widest mt-0.5">
                          {new Date(receipt.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right hidden sm:block">
                        <p className="text-xs font-black text-blue-600 dark:text-blue-400">
                          {receipt.amountLocal.toLocaleString('en-US', { style: 'currency', currency: receipt.currency })}
                        </p>
                        <p className="text-[9px] font-bold text-gray-400 dark:text-blue-400/30 uppercase tracking-tighter">
                          {receipt.status}
                        </p>
                      </div>
                      <ArrowRightIcon className="w-4 h-4 text-gray-300 group-hover:text-blue-500 transition-colors" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        <div className="p-6 bg-gray-50/50 dark:bg-blue-900/10 border-t border-gray-100 dark:border-blue-900/10">
          <p className="text-[10px] text-center font-bold text-gray-400 dark:text-blue-400/40 uppercase tracking-widest">
            Showing {history.length} recent transactions
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default WithdrawalHistoryModal;
