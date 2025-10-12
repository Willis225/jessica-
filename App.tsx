import React, { useState, useEffect, useMemo } from 'react';
import { Asset, TransactionType, UserProfile, Notification, Receipt, PriceAlert } from './types';
import LandingPage from './components/LandingPage';
import LoginScreen from './components/LoginScreen';
import ManageBalanceModal from './components/ManageBalanceModal';
import TransactionHistoryModal from './components/TransactionHistoryModal';
import { initialAssets as newInitialAssets, initialProfile as newInitialProfile } from './mockData';
import LiveChartModal from './components/LiveChartModal';
import PriceAlertModal from './components/PriceAlertModal';
import { BanknotesIcon, BellAlertIcon, ChartBarIcon, UserPlusIcon } from './components/Icons';
import NotificationPopup from './components/NotificationPopup';
import WithdrawModal from './components/WithdrawModal';
import WithdrawalReceipt from './components/WithdrawalReceipt';
import ProfileModal from './components/ProfileModal';
import MobileDashboard from './components/MobileDashboard';

type ModalState = {
  type: 'manageBalance' | 'history' | 'chart' | 'alert' | null;
  asset: Asset | null;
};

// --- User Data Management ---
const USERS_DB_KEY = 'invest_empowerment_users';
const ACTIVE_USER_KEY = 'invest_empowerment_active_user';

const MOCK_INVESTORS = [
    { name: 'Mary T.', location: 'Port Moresby, Papua New Guinea' },
    { name: 'Ratu S.', location: 'Suva, Fiji' },
    { name: 'David K.', location: 'Lae, Papua New Guinea' },
    { name: 'Grace V.', location: 'Honiara, Solomon Islands' },
    { name: 'John P.', location: 'Mount Hagen, Papua New Guinea' },
    { name: 'Sarah L.', location: 'Goroka, Papua New Guinea' },
    { name: 'Tui F.', location: 'Apia, Samoa' },
    { name: 'Lina M.', location: 'Nukuʻalofa, Tonga' },
    { name: 'Ben G.', location: 'Port Vila, Vanuatu' },
    { name: 'Anna P.', location: 'Madang, Papua New Guinea' },
    { name: 'Samuel J.', location: 'Lautoka, Fiji' },
    { name: 'Jessica W.', location: 'Auki, Solomon Islands' },
];

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [getStarted, setGetStarted] = useState(false);
  const [loginError, setLoginError] = useState('');
  
  // State for the currently logged-in user
  const [activeUserEmail, setActiveUserEmail] = useState<string | null>(null);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [investmentStartTime, setInvestmentStartTime] = useState<number | null>(null);

  const [modal, setModal] = useState<ModalState>({ type: null, asset: null });
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [currentView, setCurrentView] = useState<'dashboard' | 'receipt'>('dashboard');
  const [activeReceipt, setActiveReceipt] = useState<Receipt | null>(null);

  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  });

  useEffect(() => {
    // Auto-login check on initial load
    const loggedInUserEmail = localStorage.getItem(ACTIVE_USER_KEY);
    if (loggedInUserEmail) {
      const users = JSON.parse(localStorage.getItem(USERS_DB_KEY) || '{}');
      const userData = users[loggedInUserEmail];
      if (userData) {
        setActiveUserEmail(loggedInUserEmail);
        setAssets(userData.assets);
        setUserProfile(userData.profile);
        setInvestmentStartTime(userData.investmentStartTime);
        setIsLoggedIn(true);
      }
    }
  }, []);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  const saveUserData = (email: string, data: any) => {
    const users = JSON.parse(localStorage.getItem(USERS_DB_KEY) || '{}');
    users[email] = data;
    localStorage.setItem(USERS_DB_KEY, JSON.stringify(users));
  };

  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString() + Math.random(),
      timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    };
    setNotifications(prev => [newNotification, ...prev]);
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  useEffect(() => {
    if (!isLoggedIn) return;
    const activityInterval = setInterval(() => {
      if (notifications.length >= 5) return;
      const randomInvestor = MOCK_INVESTORS[Math.floor(Math.random() * MOCK_INVESTORS.length)];
      const randomAction = Math.random();
      let notificationData: Omit<Notification, 'id' | 'timestamp'>;
      if (randomAction < 0.5) {
        const amount = Math.floor(Math.random() * (5000 - 100 + 1) + 100);
        notificationData = { type: 'investment', icon: ChartBarIcon, title: 'New Investment', message: `${randomInvestor.name} from ${randomInvestor.location} has invested $${amount.toLocaleString()}.` };
      } else if (randomAction < 0.8) {
        const amount = Math.floor(Math.random() * (2000 - 200 + 1) + 200);
        notificationData = { type: 'withdrawal', icon: BanknotesIcon, title: 'Profit Withdrawal', message: `${randomInvestor.name} from ${randomInvestor.location} withdrew $${amount.toLocaleString()}.` };
      } else {
        notificationData = { type: 'new_member', icon: UserPlusIcon, title: 'Welcome!', message: `${randomInvestor.name} from ${randomInvestor.location} has just joined!` };
      }
      addNotification(notificationData);
    }, 4000);
    return () => clearInterval(activityInterval);
  }, [isLoggedIn, notifications]);

  const handleLogin = (email: string, password: string): boolean => {
    setLoginError('');
    const users = JSON.parse(localStorage.getItem(USERS_DB_KEY) || '{}');
    const userData = users[email.toLowerCase()];

    if (userData && userData.password === password) {
      setActiveUserEmail(email.toLowerCase());
      setAssets(userData.assets);
      setUserProfile(userData.profile);
      setInvestmentStartTime(userData.investmentStartTime);
      setIsLoggedIn(true);
      localStorage.setItem(ACTIVE_USER_KEY, email.toLowerCase());
      addNotification({ type: 'new_member', icon: UserPlusIcon, title: 'Login Successful', message: 'Welcome back to your investment dashboard.' });
      return true;
    }
    setLoginError('Invalid email or password.');
    return false;
  };

  const handleSignup = (email: string, password: string): boolean => {
    setLoginError('');
    const users = JSON.parse(localStorage.getItem(USERS_DB_KEY) || '{}');
    const lowerCaseEmail = email.toLowerCase();

    if (users[lowerCaseEmail]) {
      setLoginError('An account with this email already exists.');
      return false;
    }

    const startTime = Date.now();
    const newUserProfile = { ...newInitialProfile, email: lowerCaseEmail, fullName: 'New Investor' };
    const newUserData = {
      password,
      profile: newUserProfile,
      assets: newInitialAssets,
      investmentStartTime: startTime,
    };

    saveUserData(lowerCaseEmail, newUserData);

    setActiveUserEmail(lowerCaseEmail);
    setAssets(newInitialAssets);
    setUserProfile(newUserProfile);
    setInvestmentStartTime(startTime);
    setIsLoggedIn(true);
    localStorage.setItem(ACTIVE_USER_KEY, lowerCaseEmail);
    addNotification({ type: 'new_member', icon: UserPlusIcon, title: 'Account Created!', message: 'Welcome to INVEST EMPOWERMENT!' });
    return true;
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setGetStarted(false);
    setActiveUserEmail(null);
    setAssets([]);
    setUserProfile(null);
    localStorage.removeItem(ACTIVE_USER_KEY);
  };
  
  const handleUpdateBalance = (assetId: string, amount: number, type: TransactionType, description?: string) => {
    const updatedAssets = assets.map(asset => {
      if (asset.id === assetId) {
        const newBalance = type === TransactionType.ADD ? asset.balance + amount : asset.balance - amount;
        const newTransaction = { id: `tx-${Date.now()}`, type, amount, date: new Date().toISOString(), description };
        addNotification({ type: 'investment', icon: ChartBarIcon, title: `Balance Updated for ${asset.ticker}`, message: `Successfully ${type === TransactionType.ADD ? 'added' : 'removed'} ${amount} ${asset.ticker}.` });
        return { ...asset, balance: newBalance, transactions: [...asset.transactions, newTransaction] };
      }
      return asset;
    });
    setAssets(updatedAssets);
    if (activeUserEmail) {
      const users = JSON.parse(localStorage.getItem(USERS_DB_KEY) || '{}');
      const currentUserData = users[activeUserEmail];
      saveUserData(activeUserEmail, { ...currentUserData, assets: updatedAssets });
    }
  };
  
  const handleWithdraw = (details: { amount: number; convertedAmount: number; currency: string; rate: number; bankName: string; accountHolderName: string; accountNumber: string; }) => {
    if (!userProfile) return;
    const newReceipt: Receipt = {
      transactionId: `WD-${Date.now()}`, date: new Date().toISOString(), status: 'Pending', userProfile,
      amountGBP: details.amount, amountLocal: details.convertedAmount, currency: details.currency,
      exchangeRate: details.rate, bankName: details.bankName, accountHolderName: details.accountHolderName,
      accountNumber: details.accountNumber,
    };
    
    let remainingWithdrawal = details.amount;
    const updatedAssets = assets.map(asset => {
      const assetValue = asset.balance * asset.price;
      if (remainingWithdrawal > 0 && assetValue > 0) {
        const withdrawalFromAsset = Math.min(remainingWithdrawal, assetValue);
        const balanceToRemove = withdrawalFromAsset / asset.price;
        remainingWithdrawal -= withdrawalFromAsset;
        return { ...asset, balance: asset.balance - balanceToRemove };
      }
      return asset;
    }).filter(asset => asset.balance > 0.00001);
    
    setAssets(updatedAssets);
    if (activeUserEmail) {
      const users = JSON.parse(localStorage.getItem(USERS_DB_KEY) || '{}');
      const currentUserData = users[activeUserEmail];
      saveUserData(activeUserEmail, { ...currentUserData, assets: updatedAssets });
    }

    addNotification({ type: 'withdrawal', icon: BanknotesIcon, title: 'Withdrawal Initiated', message: `Your withdrawal of ${details.amount.toLocaleString('en-GB', {style: 'currency', currency: 'GBP'})} is being processed.` });
    setActiveReceipt(newReceipt);
    setCurrentView('receipt');
    setIsWithdrawModalOpen(false);
  };
  
  const handleAddAlert = (assetId: string, alert: Omit<PriceAlert, 'id' | 'status' | 'createdAt'>) => {
    const updatedAssets = assets.map(asset => {
      if (asset.id === assetId) {
        const newAlert: PriceAlert = { ...alert, id: `alert-${Date.now()}`, status: 'active' as const, createdAt: new Date().toISOString() };
        addNotification({ type: 'price_alert', icon: BellAlertIcon, title: 'Price Alert Set', message: `Alert for ${asset.ticker} when price is ${alert.type} ${alert.targetPrice.toLocaleString('en-GB', {style: 'currency', currency: 'GBP'})}.` });
        return { ...asset, priceAlerts: [...asset.priceAlerts, newAlert] };
      }
      return asset;
    });
    setAssets(updatedAssets);
     if (activeUserEmail) {
      const users = JSON.parse(localStorage.getItem(USERS_DB_KEY) || '{}');
      const currentUserData = users[activeUserEmail];
      saveUserData(activeUserEmail, { ...currentUserData, assets: updatedAssets });
    }
  };

  const handleDeleteAlert = (assetId: string, alertId: string) => {
    const updatedAssets = assets.map(asset => {
      if (asset.id === assetId) {
        return { ...asset, priceAlerts: asset.priceAlerts.filter(a => a.id !== alertId) };
      }
      return asset;
    });
    setAssets(updatedAssets);
    if (activeUserEmail) {
      const users = JSON.parse(localStorage.getItem(USERS_DB_KEY) || '{}');
      const currentUserData = users[activeUserEmail];
      saveUserData(activeUserEmail, { ...currentUserData, assets: updatedAssets });
    }
  };

  const handleSaveProfile = (updatedProfile: UserProfile) => {
    setUserProfile(updatedProfile);
    if (activeUserEmail) {
      const users = JSON.parse(localStorage.getItem(USERS_DB_KEY) || '{}');
      const currentUserData = users[activeUserEmail];
      saveUserData(activeUserEmail, { ...currentUserData, profile: updatedProfile });
    }
    addNotification({ type: 'new_member', icon: UserPlusIcon, title: 'Profile Updated', message: 'Your profile information has been saved successfully.' });
  };

  const stockAssets = useMemo(() => assets.filter(asset => asset.ticker !== 'BTC' && asset.ticker !== 'GBP'), [assets]);

  if (!isLoggedIn || !userProfile) {
    return getStarted 
      ? <LoginScreen onLogin={handleLogin} onSignup={handleSignup} error={loginError} />
      : <LandingPage onGetStarted={() => setGetStarted(true)} />;
  }
  
  if (currentView === 'receipt' && activeReceipt) {
    return <WithdrawalReceipt receipt={activeReceipt} onBack={() => setCurrentView('dashboard')} />
  }

  return (
    <div className="min-h-screen bg-blue-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 transition-colors duration-300">
      <main className="w-full mx-auto p-4 sm:p-6 lg:p-8">
        <MobileDashboard
            assets={stockAssets}
            userProfile={userProfile}
            notifications={notifications}
            onWithdrawClick={() => setIsWithdrawModalOpen(true)}
            onProfileClick={() => setIsProfileModalOpen(true)}
            onLogout={handleLogout}
            theme={theme}
            onToggleTheme={toggleTheme}
            investmentStartTime={investmentStartTime}
        />
      </main>

      <div className="fixed bottom-4 left-4 w-full max-w-sm space-y-3 z-50">
        {notifications.slice(0, 3).map(notification => (
          <NotificationPopup key={notification.id} notification={notification} onRemove={removeNotification} />
        ))}
      </div>

      {modal.type === 'manageBalance' && modal.asset && (
        <ManageBalanceModal asset={modal.asset} onClose={() => setModal({ type: null, asset: null })} onUpdateBalance={handleUpdateBalance} />
      )}
      {modal.type === 'history' && modal.asset && (
        <TransactionHistoryModal asset={modal.asset} onClose={() => setModal({ type: null, asset: null })} />
      )}
      {modal.type === 'chart' && modal.asset && (
        <LiveChartModal asset={modal.asset} onClose={() => setModal({type: null, asset: null})} />
      )}
      {modal.type === 'alert' && modal.asset && (
        <PriceAlertModal asset={modal.asset} onClose={() => setModal({type: null, asset: null})} onAddAlert={handleAddAlert} onDeleteAlert={handleDeleteAlert} />
      )}
      {isWithdrawModalOpen && (
        <WithdrawModal totalValue={assets.reduce((acc, asset) => acc + asset.balance * asset.price, 0)} onClose={() => setIsWithdrawModalOpen(false)} onWithdraw={handleWithdraw} />
      )}
      {isProfileModalOpen && (
        <ProfileModal profile={userProfile} onClose={() => setIsProfileModalOpen(false)} onSave={handleSaveProfile} />
      )}
    </div>
  );
};

export default App;
