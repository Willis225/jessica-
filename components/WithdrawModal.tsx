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

// Exchange rates based on 1 USD as base
const exchangeRates: Record<string, number> = {
  AUD: 1.53,   // Australian Dollar
  EUR: 0.94,   // Euro
  FJD: 2.28,   // Fijian Dollar
  NZD: 1.64,   // New Zealand Dollar
  PGK: 3.88,   // Papua New Guinean Kina
  SBD: 8.44,   // Solomon Islands Dollar
  TOP: 2.36,   // Tongan Pa'anga
  USD: 1.00,   // United States Dollar
  VUV: 124,    // Vanuatu Vatu
  WST: 2.76,   // Samoan Tālā
  GBP: 0.80,   // British Pound
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
    setBankName('');
  }, [targetCurrency]);

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
      setError(`Cannot withdraw more than the total investment value of ${totalValue.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}.`);
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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div className="bg-white dark:bg-[#0f172a] rounded-[2rem] shadow-2xl w-full max-w-md border border-gray-200 dark:border-blue-900/20 overflow-hidden relative">
        <div className="spotlight-bg opacity-30" />
        
        <div className="flex justify-between items-center p-6 border-b border-gray-100 dark:border-blue-900/10 relative z-10">
          <h2 className="text-xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            {view === 'amount' ? 'Withdraw Funds' : 'Review Withdrawal'}
          </h2>
          <button onClick={onClose} className="p-2 rounded-xl text-gray-400 hover:text-gray-700 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-blue-900/30 transition-all">
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {view === 'amount' ? (
           <form onSubmit={handleProceedToConvert} className="relative z-10">
            <div className="p-8 space-y-8">
              <div className="bg-gray-50 dark:bg-blue-900/10 rounded-2xl p-6 text-center border border-gray-100 dark:border-blue-900/10">
                <p className="text-xs font-bold text-gray-500 dark:text-blue-400/60 uppercase tracking-widest">Total Portfolio Value</p>
                <p className="font-extrabold text-3xl text-gray-900 dark:text-white mt-2 tracking-tight">
                  {totalValue.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                </p>
              </div>

              <div className="space-y-4">
                <label htmlFor="withdraw-amount" className="block text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">
                  Withdrawal Amount (USD)
                </label>
                <div className="relative">
                  <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 font-bold">$</span>
                  <input
                    id="withdraw-amount"
                    type="text"
                    value={amount}
                    onChange={handleAmountChange}
                    placeholder="0.00"
                    required
                    autoFocus
                    className="w-full bg-gray-50 dark:bg-black/50 border border-gray-200 dark:border-blue-900/30 rounded-2xl pl-10 pr-5 py-4 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all font-bold text-lg"
                  />
                </div>
              </div>
              
              {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-xs py-3 px-4 rounded-xl font-bold text-center">
                  {error}
                </div>
              )}
            </div>

            <div className="p-6 pt-0">
              <button
                  type="submit"
                  className="flex items-center justify-center gap-3 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-2xl transition-all shadow-xl shadow-blue-500/20 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={!amount || numericAmount <= 0}
              >
                  <span>Continue to Details</span>
                  <ArrowRightIcon className="w-5 h-5" />
              </button>
              <button type="button" onClick={onClose} className="w-full py-4 text-sm font-bold text-gray-500 dark:text-blue-400/60 hover:text-gray-900 dark:hover:text-white transition-colors">
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="relative z-10">
            <div className="p-6 max-h-[65vh] overflow-y-auto space-y-6 scrollbar-hide">
              <div className="text-center p-4 bg-gray-50 dark:bg-blue-900/10 rounded-2xl border border-gray-100 dark:border-blue-900/10">
                  <p className="text-xs font-bold text-gray-500 dark:text-blue-400/60 uppercase tracking-widest">Withdrawal Amount</p>
                  <p className="font-extrabold text-3xl text-gray-900 dark:text-white mt-1 tracking-tight">
                    {numericAmount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                  </p>
              </div>

              <div className="space-y-5">
                <div>
                  <label htmlFor="target-currency" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 ml-1">
                    Payout Currency
                  </label>
                  <select 
                    id="target-currency"
                    value={targetCurrency}
                    onChange={(e) => setTargetCurrency(e.target.value)}
                    className="w-full bg-gray-50 dark:bg-black/50 border border-gray-200 dark:border-blue-900/30 rounded-2xl px-5 py-4 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all font-medium"
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
                    <option value="GBP">GBP - British Pound</option>
                  </select>
                </div>

                <div className="space-y-4">
                    <h3 className="text-sm font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest ml-1">Bank Information</h3>
                     <div>
                        {targetCurrency === 'PGK' ? (
                          <select 
                            id="bank-name" 
                            value={bankName} 
                            onChange={(e) => setBankName(e.target.value)} 
                            required 
                            className="w-full bg-gray-50 dark:bg-black/50 border border-gray-200 dark:border-blue-900/30 rounded-2xl px-5 py-4 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all font-medium"
                          >
                            <option value="">Select Bank</option>
                            <option value="Bank of South Pacific-BSP">Bank of South Pacific-BSP</option>
                            <option value="Kina bank">Kina bank</option>
                          </select>
                        ) : (
                          <input 
                            id="bank-name" 
                            type="text" 
                            value={bankName} 
                            onChange={(e) => setBankName(e.target.value)} 
                            placeholder="Bank Name" 
                            required 
                            className="w-full bg-gray-50 dark:bg-black/50 border border-gray-200 dark:border-blue-900/30 rounded-2xl px-5 py-4 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                          />
                        )}
                    </div>
                    <div>
                        <input id="account-holder-name" type="text" value={accountHolderName} onChange={(e) => setAccountHolderName(e.target.value)} placeholder="Account Holder Name" required className="w-full bg-gray-50 dark:bg-black/50 border border-gray-200 dark:border-blue-900/30 rounded-2xl px-5 py-4 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"/>
                    </div>
                     <div>
                        <input id="account-number" type="text" value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} placeholder="Account Number" required className="w-full bg-gray-50 dark:bg-black/50 border border-gray-200 dark:border-blue-900/30 rounded-2xl px-5 py-4 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"/>
                    </div>
                </div>

                <div className="pt-2">
                    <label htmlFor="secret-code" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 ml-1">
                        Security Code
                    </label>
                    <input 
                        id="secret-code"
                        type="password"
                        value={secretCode}
                        onChange={(e) => {
                            setSecretCode(e.target.value)
                            setError('')
                        }}
                        placeholder="••••••••"
                        required
                        className="w-full bg-gray-50 dark:bg-black/50 border border-gray-200 dark:border-blue-900/30 rounded-2xl px-5 py-4 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-center tracking-[0.5em]"
                    />
                </div>
              </div>
              
              {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-xs py-3 px-4 rounded-xl font-bold text-center">
                  {error}
                </div>
              )}
              
              <div className="bg-blue-600/5 dark:bg-blue-400/5 rounded-2xl p-6 text-center border border-blue-600/10 dark:border-blue-400/10">
                <p className="text-xs font-bold text-gray-500 dark:text-blue-400/60 uppercase tracking-widest">Estimated Payout</p>
                <p className="font-extrabold text-3xl text-blue-600 dark:text-blue-400 mt-2 tracking-tight">
                  {convertedAmount?.toLocaleString('en-US', { style: 'currency', currency: targetCurrency }) ?? '...'}
                </p>
                <p className="text-[10px] font-bold text-gray-400 dark:text-blue-400/40 mt-3 uppercase tracking-tighter">
                  Rate: 1 USD ≈ {exchangeRates[targetCurrency]} {targetCurrency}
                </p>
              </div>
            </div>

            <div className="p-6 flex flex-col gap-3">
              <button
                  onClick={handleConfirmWithdrawal}
                  className="flex items-center justify-center gap-3 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-2xl transition-all shadow-xl shadow-blue-500/20 active:scale-95"
              >
                  <BanknotesIcon className="w-6 h-6" />
                  <span>Request Withdrawal</span>
              </button>
              <button type="button" onClick={() => { setView('amount'); setError(''); setSecretCode(''); }} className="w-full py-3 text-sm font-bold text-gray-500 dark:text-blue-400/60 hover:text-gray-900 dark:hover:text-white transition-colors">
                Back to Amount
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WithdrawModal;