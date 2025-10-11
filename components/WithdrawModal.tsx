import React, { useState, FormEvent, useEffect } from 'react';
import { XMarkIcon, BanknotesIcon, ArrowRightIcon } from './Icons';

interface WithdrawModalProps {
  totalValue: number;
  onClose: () => void;
  onWithdraw: (details: { 
    amount: number; 
    convertedAmount: number; 
    currency: string; 
    rate: number;
    bankName: string;
    accountHolderName: string;
    accountNumber: string;
  }) => void;
}

const exchangeRates: Record<string, number> = {
  AUD: 1.91,   // Australian Dollar
  EUR: 1.18,   // Euro
  FJD: 2.85,   // Fijian Dollar
  NZD: 2.05,   // New Zealand Dollar
  PGK: 4.85,   // Papua New Guinean Kina
  SBD: 10.55,  // Solomon Islands Dollar
  TOP: 2.95,   // Tongan Pa'anga
  USD: 1.25,   // United States Dollar
  VUV: 155,    // Vanuatu Vatu
  WST: 3.45,   // Samoan Tālā
};

const WithdrawModal: React.FC<WithdrawModalProps> = ({ totalValue, onClose, onWithdraw }) => {
  const [amount, setAmount] = useState<number | string>('');
  const [error, setError] = useState('');
  const [view, setView] = useState<'amount' | 'convert'>('amount');
  const [targetCurrency, setTargetCurrency] = useState('PGK'); // Default to PGK
  const [convertedAmount, setConvertedAmount] = useState<number | null>(null);
  const [secretCode, setSecretCode] = useState('');

  // Bank details state
  const [bankName, setBankName] = useState('');
  const [accountHolderName, setAccountHolderName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  
  const numericAmount = parseFloat(amount as string);

  useEffect(() => {
    if (numericAmount > 0) {
      setConvertedAmount(numericAmount * exchangeRates[targetCurrency]);
    } else {
      setConvertedAmount(null);
    }
  }, [numericAmount, targetCurrency]);


  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError('');
    const value = e.target.value;
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setAmount(value);
    }
  };

  const handleProceedToConvert = (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (isNaN(numericAmount) || numericAmount <= 0) {
      setError('Please enter a valid, positive amount.');
      return;
    }

    if (numericAmount > totalValue) {
      setError(`Cannot withdraw more than the total investment value of ${totalValue.toLocaleString('en-GB', { style: 'currency', currency: 'GBP' })}.`);
      return;
    }
    setView('convert');
  };
  
  const handleConfirmWithdrawal = () => {
    setError('');
    if (!bankName || !accountHolderName || !accountNumber) {
        setError('Please fill in all bank details.');
        return;
    }
    if (secretCode.toLowerCase() !== 'code123') {
      setError('Invalid secret code. Please try again.');
      return;
    }

    if (convertedAmount === null) return;

    onWithdraw({
      amount: numericAmount,
      convertedAmount: convertedAmount,
      currency: targetCurrency,
      rate: exchangeRates[targetCurrency],
      bankName,
      accountHolderName,
      accountNumber,
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md border border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {view === 'amount' ? 'Withdraw Funds' : 'Confirm Withdrawal'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
            <XMarkIcon className="w-7 h-7" />
          </button>
        </div>

        {view === 'amount' ? (
           <form onSubmit={handleProceedToConvert}>
            <div className="p-6">
              <div className="bg-gray-100 dark:bg-gray-700/50 rounded-lg p-4 mb-6 text-center">
                <p className="text-sm text-gray-500 dark:text-gray-400">Total Investment Value</p>
                <p className="font-bold text-2xl text-gray-900 dark:text-white mt-1">
                  {totalValue.toLocaleString('en-GB', { style: 'currency', currency: 'GBP' })}
                </p>
              </div>

              <div className="mb-4">
                <label htmlFor="withdraw-amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Withdrawal Amount (GBP)
                </label>
                <input
                  id="withdraw-amount"
                  type="text"
                  value={amount}
                  onChange={handleAmountChange}
                  placeholder="e.g., 500.00"
                  required
                  autoFocus
                  className="w-full bg-white dark:bg-gray-900/50 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                />
              </div>
              
              {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
            </div>

            <div className="bg-blue-50 dark:bg-gray-800/50 p-4 rounded-b-2xl flex justify-end gap-4">
               <button type="button" onClick={onClose} className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-bold py-2 px-6 rounded-lg transition-colors">
                Cancel
              </button>
              <button
                  type="submit"
                  className="flex items-center justify-center gap-2 w-auto bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-6 rounded-lg transition-colors duration-200 shadow-sm disabled:bg-emerald-800 disabled:cursor-not-allowed"
                  disabled={!amount || numericAmount <= 0}
              >
                  <span>Next</span>
                  <ArrowRightIcon className="w-5 h-5" />
              </button>
            </div>
          </form>
        ) : (
          <div>
            <div className="p-6 max-h-[70vh] overflow-y-auto">
              <div className="text-center mb-6">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Amount to Withdraw</p>
                  <p className="font-bold text-3xl text-gray-900 dark:text-white mt-1">
                    {numericAmount.toLocaleString('en-GB', { style: 'currency', currency: 'GBP' })}
                  </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label htmlFor="target-currency" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Convert To
                  </label>
                  <select 
                    id="target-currency"
                    value={targetCurrency}
                    onChange={(e) => setTargetCurrency(e.target.value)}
                    className="w-full bg-white dark:bg-gray-900/50 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                  >
                    <option value="PGK">PGK - Papua New Guinean Kina</option>
                    <option value="FJD">FJD - Fijian Dollar</option>
                    <option value="SBD">SBD - Solomon Islands Dollar</option>
                    <option value="WST">WST - Samoan Tālā</option>
                    <option value="TOP">TOP - Tongan Paʻanga</option>
                    <option value="VUV">VUV - Vanuatu Vatu</option>
                    <option value="NZD">NZD - New Zealand Dollar</option>
                    <option value="AUD">AUD - Australian Dollar</option>
                    <option value="USD">USD - United States Dollar</option>
                    <option value="EUR">EUR - Euro</option>
                  </select>
                </div>

                <div className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-4">
                    <h3 className="text-md font-semibold text-gray-800 dark:text-gray-200">Bank Details</h3>
                     <div>
                        <label htmlFor="bank-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Bank Name</label>
                        <input id="bank-name" type="text" value={bankName} onChange={(e) => setBankName(e.target.value)} placeholder="e.g., Pacific Bank" required className="w-full bg-white dark:bg-gray-900/50 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"/>
                    </div>
                    <div>
                        <label htmlFor="account-holder-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Account Holder's Name</label>
                        <input id="account-holder-name" type="text" value={accountHolderName} onChange={(e) => setAccountHolderName(e.target.value)} placeholder="e.g., Jessica Allen" required className="w-full bg-white dark:bg-gray-900/50 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"/>
                    </div>
                     <div>
                        <label htmlFor="account-number" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Account Number</label>
                        <input id="account-number" type="text" value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} placeholder="Enter your bank account number" required className="w-full bg-white dark:bg-gray-900/50 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"/>
                    </div>
                </div>

                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                    <label htmlFor="secret-code" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Secret Withdrawal Code
                    </label>
                    <input 
                        id="secret-code"
                        type="password"
                        value={secretCode}
                        onChange={(e) => {
                            setSecretCode(e.target.value)
                            setError('')
                        }}
                        placeholder="Enter authorization code"
                        required
                        className="w-full bg-white dark:bg-gray-900/50 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                    />
                </div>
              </div>
              
              {error && <p className="text-red-500 text-sm mt-4 text-center">{error}</p>}
              
              <div className="bg-gray-100 dark:bg-gray-700/50 rounded-lg p-4 text-center mt-6">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  You will receive (approx.)
                </p>
                <p className="font-bold text-2xl text-emerald-600 dark:text-emerald-500 mt-1">
                  {convertedAmount?.toLocaleString('en-US', { style: 'currency', currency: targetCurrency }) ?? '...'}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  Rate: 1 GBP ≈ {exchangeRates[targetCurrency]} {targetCurrency}
                </p>
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-gray-800/50 p-4 rounded-b-2xl flex justify-end gap-4">
              <button type="button" onClick={() => { setView('amount'); setError(''); setSecretCode(''); }} className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-bold py-2 px-6 rounded-lg transition-colors">
                Back
              </button>
              <button
                  onClick={handleConfirmWithdrawal}
                  className="flex items-center justify-center gap-2 w-auto bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-6 rounded-lg transition-colors duration-200 shadow-sm"
              >
                  <BanknotesIcon className="w-5 h-5" />
                  <span>Confirm & Withdraw</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WithdrawModal;