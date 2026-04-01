import React, { useRef } from 'react';
import { Receipt } from '../types';
import { ShieldCheckIcon, UserCircleIcon, ArrowDownTrayIcon, DocumentTextIcon } from './Icons';
import { jsPDF } from 'jspdf';

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
  
  const handleDownloadImage = async () => {
    if (receiptRef.current === null) {
      return;
    }

    try {
      const dataUrl = await htmlToImage.toPng(receiptRef.current, { 
        quality: 0.98,
        pixelRatio: 2, // Increase resolution for better quality
        style: {
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

  const handleDownloadPDF = async () => {
    if (receiptRef.current === null) {
      return;
    }

    try {
      // First generate the image
      const dataUrl = await htmlToImage.toPng(receiptRef.current, { 
        quality: 1,
        pixelRatio: 3, // Higher resolution for PDF
        style: {
          width: '672px', 
          margin: '0',
          borderRadius: '0',
        }
      });

      // Create a temporary image to get dimensions
      const img = new Image();
      img.src = dataUrl;
      await new Promise((resolve) => {
        img.onload = resolve;
      });

      const pdfWidth = 672;
      const pdfHeight = (img.height * pdfWidth) / img.width;

      // Create PDF with dynamic height
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [pdfWidth, pdfHeight]
      });

      pdf.addImage(dataUrl, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`INVEST-EMPOWERMENT-Receipt-${receipt.transactionId}.pdf`);
    } catch (err) {
      console.error('PDF generation failed!', err);
      alert('Failed to generate PDF. Please try again.');
    }
  };

  return (
    <div className="w-full flex flex-col items-center relative">
      <div className="w-full max-w-2xl relative z-10">
        <div className="mb-8 flex flex-wrap justify-between items-center gap-4">
            <button onClick={onBack} className="text-blue-600 dark:text-blue-400 font-bold hover:text-blue-700 dark:hover:text-blue-300 transition-colors flex items-center gap-2">
                <span className="text-xl">&larr;</span> Back to Dashboard
            </button>
            <div className="flex gap-3">
                <button 
                    onClick={handleDownloadImage}
                    className="flex items-center justify-center gap-2 bg-white dark:bg-blue-900/20 border border-gray-200 dark:border-blue-900/30 text-gray-700 dark:text-blue-400 font-bold py-3 px-6 rounded-2xl transition-all duration-200 shadow-lg active:scale-95"
                >
                    <ArrowDownTrayIcon className="w-5 h-5" />
                    <span>PNG</span>
                </button>
                <button 
                    onClick={handleDownloadPDF}
                    className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-2xl transition-all duration-200 shadow-xl shadow-blue-500/20 active:scale-95"
                >
                    <DocumentTextIcon className="w-5 h-5" />
                    <span>Download PDF</span>
                </button>
            </div>
        </div>

        <div ref={receiptRef} className="bg-white dark:bg-[#0f172a] rounded-[2.5rem] shadow-2xl border border-gray-100 dark:border-blue-900/20 overflow-hidden relative">
          <div className="spotlight-bg opacity-20" />
          
          <div className="p-10 text-center bg-gray-50/50 dark:bg-blue-900/10 border-b border-gray-100 dark:border-blue-900/10 relative z-10">
            <div className="w-20 h-20 bg-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-blue-500/40 transform -rotate-6">
              <ShieldCheckIcon className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Withdrawal Successful</h1>
            <p className="text-gray-500 dark:text-blue-400/60 mt-2 font-bold">Your transaction has been completed successfully.</p>
            <div className="mt-6 inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-black py-2 px-4 rounded-2xl text-xs uppercase tracking-widest">
              <span>{receipt.status}</span>
            </div>
          </div>

          <div className="p-10 space-y-10 relative z-10">
            <div className="flex items-center gap-5 bg-gray-50 dark:bg-black/20 p-4 rounded-3xl border border-gray-100 dark:border-blue-900/10">
              {userProfile.profilePicture ? (
                <img src={userProfile.profilePicture} alt="Profile" className="w-14 h-14 rounded-2xl object-cover shadow-lg" />
              ) : (
                <div className="w-14 h-14 bg-blue-600/10 rounded-2xl flex items-center justify-center">
                  <UserCircleIcon className="w-10 h-10 text-blue-600/40" />
                </div>
              )}
              <div>
                <p className="font-black text-lg text-gray-900 dark:text-white leading-tight">{userProfile.fullName}</p>
                <p className="text-sm font-bold text-gray-500 dark:text-blue-400/40">{userProfile.email}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div className="space-y-1">
                <p className="text-xs font-bold text-gray-400 dark:text-blue-400/40 uppercase tracking-widest">Amount Withdrawn</p>
                <p className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">
                  {receipt.amountUSD.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                </p>
              </div>
              <div className="sm:text-right space-y-1">
                <p className="text-xs font-bold text-gray-400 dark:text-blue-400/40 uppercase tracking-widest">You Will Receive (Approx.)</p>
                <p className="text-3xl font-black text-blue-600 dark:text-blue-400 tracking-tighter">
                   {receipt.amountLocal.toLocaleString('en-US', { style: 'currency', currency: receipt.currency })}
                </p>
              </div>
            </div>

            {/* Bank Details Section */}
            <div className="space-y-4">
                <h3 className="text-xs font-black text-gray-400 dark:text-blue-400/40 uppercase tracking-widest ml-1">Withdrawal Destination</h3>
                <div className="bg-gray-50 dark:bg-black/20 rounded-[2rem] p-6 border border-gray-100 dark:border-blue-900/10">
                     <ul className="space-y-4">
                        <li className="flex justify-between items-center">
                            <span className="text-sm font-bold text-gray-500 dark:text-blue-400/40">Bank Name</span>
                            <span className="font-black text-gray-900 dark:text-white">{receipt.bankName}</span>
                        </li>
                        <li className="flex justify-between items-center">
                            <span className="text-sm font-bold text-gray-500 dark:text-blue-400/40">Account Holder</span>
                            <span className="font-black text-gray-900 dark:text-white">{receipt.accountHolderName}</span>
                        </li>
                        <li className="flex justify-between items-center">
                            <span className="text-sm font-bold text-gray-500 dark:text-blue-400/40">Account Number</span>
                            <span className="font-mono font-black text-gray-900 dark:text-white tracking-wider">{receipt.accountNumber}</span>
                        </li>
                     </ul>
                </div>
            </div>

            <div className="bg-blue-600/5 dark:bg-blue-900/10 rounded-[2rem] p-6 border border-blue-600/10 dark:border-blue-900/20">
              <h3 className="text-xs font-black text-blue-600 dark:text-blue-400/60 uppercase tracking-widest mb-4 ml-1">Transaction Details</h3>
              <ul className="space-y-4">
                <li className="flex justify-between items-center">
                  <span className="text-sm font-bold text-blue-600/60 dark:text-blue-400/40">Transaction ID</span>
                  <span className="font-mono font-black text-blue-700 dark:text-blue-300 text-xs">{receipt.transactionId}</span>
                </li>
                <li className="flex justify-between items-center">
                  <span className="text-sm font-bold text-blue-600/60 dark:text-blue-400/40">Date & Time</span>
                  <span className="font-black text-blue-700 dark:text-blue-300">{formatDate(receipt.date)}</span>
                </li>
                 <li className="flex justify-between items-center">
                  <span className="text-sm font-bold text-blue-600/60 dark:text-blue-400/40">Exchange Rate</span>
                  <span className="font-black text-blue-700 dark:text-blue-300">1 USD ≈ {receipt.exchangeRate.toLocaleString()} {receipt.currency}</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="p-8 text-center bg-gray-50/50 dark:bg-blue-900/10 border-t border-gray-100 dark:border-blue-900/10 relative z-10">
             <p className="text-xs font-bold text-gray-500 dark:text-blue-400/60 mb-6 leading-relaxed max-w-md mx-auto italic">
               Please note that your funds will be transferred to your designated bank. Your bank will review and approve the transaction before your profit is credited to your account.
             </p>
             <p className="text-xs font-bold text-gray-400 dark:text-blue-400/40 uppercase tracking-widest">Invest Empowerment Official Receipt</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WithdrawalReceipt;