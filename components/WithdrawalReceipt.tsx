import React, { useRef } from 'react';
import { Receipt } from '../types';
import { ClockIcon, UserCircleIcon, ArrowDownTrayIcon } from './Icons';

interface WithdrawalReceiptProps {
  receipt: Receipt;
  onBack: () => void;
}

// Declare the htmlToImage library which is loaded from a script tag in index.html
declare const htmlToImage: any;

const WithdrawalReceipt: React.FC<WithdrawalReceiptProps> = ({ receipt, onBack }) => {
  const { userProfile } = receipt;
  const receiptRef = useRef<HTMLDivElement>(null);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-GB', {
      dateStyle: 'long',
      timeStyle: 'short',
    });
  };
  
  const maskAccountNumber = (accountNumber: string) => {
    return `**** **** **** ${accountNumber.slice(-4)}`;
  };

  const handleDownload = async () => {
    if (receiptRef.current === null) {
      return;
    }

    try {
      const dataUrl = await htmlToImage.toPng(receiptRef.current, { 
        quality: 0.98,
        pixelRatio: 2, // Increase resolution for better quality
        style: {
          // Temporarily set a specific width during capture for consistency
          width: '672px', 
          margin: '0',
          borderRadius: '0',
        }
      });
      const link = document.createElement('a');
      link.download = `INVEST-EMPOWERMENT-Receipt-${receipt.transactionId}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Oops, something went wrong!', err);
      alert('Failed to download receipt image. Please try again.');
    }
  };

  return (
    <div className="min-h-screen text-gray-800 dark:text-gray-200 transition-colors duration-300 p-4 sm:p-6 lg:p-8 flex flex-col items-center">
      <div className="w-full max-w-2xl">
        <div className="mb-6 flex flex-wrap justify-between items-center gap-4">
            <button onClick={onBack} className="text-emerald-600 dark:text-emerald-500 font-semibold hover:underline">
                &larr; Back to Dashboard
            </button>
            <button 
                onClick={handleDownload}
                className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200 shadow-sm"
            >
                <ArrowDownTrayIcon className="w-5 h-5" />
                <span>Download Receipt</span>
            </button>
        </div>

        <div ref={receiptRef} className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="p-8 text-center bg-blue-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Withdrawal Initiated</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Your transaction is being processed.</p>
            <div className="mt-4 inline-flex items-center gap-2 bg-yellow-100 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-300 font-medium py-1 px-3 rounded-full text-sm">
              <ClockIcon className="w-4 h-4" />
              <span>{receipt.status}</span>
            </div>
          </div>

          <div className="p-8 space-y-6">
            <div className="flex items-center gap-4">
              {userProfile.profilePicture ? (
                <img src={userProfile.profilePicture} alt="Profile" className="w-12 h-12 rounded-full object-cover" />
              ) : (
                <UserCircleIcon className="w-12 h-12 text-gray-400 dark:text-gray-500" />
              )}
              <div>
                <p className="font-bold text-gray-900 dark:text-white">{userProfile.fullName}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{userProfile.email}</p>
              </div>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-center sm:text-left">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Amount Withdrawn</p>
                  <p className="text-xl font-bold text-gray-900 dark:text-white">
                    {receipt.amountGBP.toLocaleString('en-GB', { style: 'currency', currency: 'GBP' })}
                  </p>
                </div>
                <div className="sm:text-right">
                  <p className="text-sm text-gray-500 dark:text-gray-400">You Will Receive (Approx.)</p>
                  <p className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-500">
                     {receipt.amountLocal.toLocaleString('en-US', { style: 'currency', currency: receipt.currency })}
                  </p>
                </div>
              </div>
            </div>

            {/* Bank Details Section */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                <h3 className="font-semibold text-lg mb-3 text-gray-800 dark:text-gray-200">Withdrawal Destination</h3>
                <div className="bg-blue-50 dark:bg-gray-700/50 rounded-lg p-4">
                     <ul className="space-y-2 text-sm">
                        <li className="flex justify-between">
                            <span className="text-gray-500 dark:text-gray-400">Bank Name</span>
                            <span className="font-medium text-gray-700 dark:text-gray-300">{receipt.bankName}</span>
                        </li>
                        <li className="flex justify-between">
                            <span className="text-gray-500 dark:text-gray-400">Account Holder</span>
                            <span className="font-medium text-gray-700 dark:text-gray-300">{receipt.accountHolderName}</span>
                        </li>
                        <li className="flex justify-between">
                            <span className="text-gray-500 dark:text-gray-400">Account Number</span>
                            <span className="font-mono text-gray-700 dark:text-gray-300">{maskAccountNumber(receipt.accountNumber)}</span>
                        </li>
                     </ul>
                </div>
            </div>

            <div className="bg-blue-50 dark:bg-gray-700/50 rounded-lg p-4">
              <h3 className="font-semibold text-lg mb-3 text-gray-800 dark:text-gray-200">Transaction Details</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Transaction ID</span>
                  <span className="font-mono text-gray-700 dark:text-gray-300">{receipt.transactionId}</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Date & Time</span>
                  <span className="text-gray-700 dark:text-gray-300">{formatDate(receipt.date)}</span>
                </li>
                 <li className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Exchange Rate</span>
                  <span className="text-gray-700 dark:text-gray-300">1 GBP ≈ {receipt.exchangeRate.toLocaleString()} {receipt.currency}</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="p-4 text-center bg-blue-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700">
             <p className="text-xs text-gray-500 dark:text-gray-400">If you have any questions, please contact support.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WithdrawalReceipt;