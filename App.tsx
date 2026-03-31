import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'motion/react';
import { Asset, TransactionType, UserProfile, Notification, Receipt, PriceAlert } from './types';
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
import { LogoutIcon } from './components/Icons';
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

  const TARGET_BALANCE = 20000;
  const DURATION_MS = 48 * 60 * 60 * 1000; // 48 hours
  const [animatedBalance, setAnimatedBalance] = useState(0);
  const [isInvestmentCompleted, setIsInvestmentCompleted] = useState(false);
  const [totalWithdrawn, setTotalWithdrawn] = useState(0);

  useEffect(() => {
    if (investmentStartTime === null) return;

    let animationFrameId: number;
    
    const animate = () => {
        const elapsedTime = Date.now() - investmentStartTime;
        const progress = Math.min(elapsedTime / DURATION_MS, 1);
        const currentBalance = (progress * TARGET_BALANCE) - totalWithdrawn;
        setAnimatedBalance(Math.max(0, currentBalance));

        if (progress >= 1) {
            setIsInvestmentCompleted(true);
        } else {
            animationFrameId = requestAnimationFrame(animate);
        }
    };

    animate();

    return () => {
        cancelAnimationFrame(animationFrameId);
    };
  }, [investmentStartTime, totalWithdrawn]);

  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  });

  useEffect(() => {
    // Seed default user if none exists
    const users = JSON.parse(localStorage.getItem(USERS_DB_KEY) || '{}');
    if (Object.keys(users).length === 0) {
      const defaultEmail = newInitialProfile.email.toLowerCase();
      users[defaultEmail] = {
        password: 'password123',
        profile: newInitialProfile,
        assets: newInitialAssets,
        investmentStartTime: Date.now(),
      };
      localStorage.setItem(USERS_DB_KEY, JSON.stringify(users));
    }

    // Auto-login check on initial load
    const loggedInUserEmail = localStorage.getItem(ACTIVE_USER_KEY);
    if (loggedInUserEmail) {
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
    const trimmedEmail = email.trim().toLowerCase();
    const users = JSON.parse(localStorage.getItem(USERS_DB_KEY) || '{}');
    const userData = users[trimmedEmail];

    if (userData && userData.password === password) {
      setActiveUserEmail(trimmedEmail);
      setAssets(userData.assets);
      setUserProfile(userData.profile);
      setInvestmentStartTime(userData.investmentStartTime);
      setIsLoggedIn(true);
      localStorage.setItem(ACTIVE_USER_KEY, trimmedEmail);
      addNotification({ type: 'new_member', icon: UserPlusIcon, title: 'Welcome back', message: 'You are now signed in to your dashboard.' });
      return true;
    }
    setLoginError('Invalid email or password.');
    return false;
  };

  const handleSignup = (name: string, email: string, password: string): boolean => {
    setLoginError('');
    const users = JSON.parse(localStorage.getItem(USERS_DB_KEY) || '{}');
    const trimmedEmail = email.trim().toLowerCase();

    if (users[trimmedEmail]) {
      setLoginError('An account with this email already exists.');
      return false;
    }

    const startTime = Date.now();
    const newUserProfile = { ...newInitialProfile, email: trimmedEmail, fullName: name.trim() || 'New Investor' };
    const newUserData = {
      password,
      profile: newUserProfile,
      assets: newInitialAssets,
      investmentStartTime: startTime,
    };

    saveUserData(trimmedEmail, newUserData);

    setActiveUserEmail(trimmedEmail);
    setAssets(newInitialAssets);
    setUserProfile(newUserProfile);
    setInvestmentStartTime(startTime);
    setIsLoggedIn(true);
    localStorage.setItem(ACTIVE_USER_KEY, trimmedEmail);
    addNotification({ type: 'new_member', icon: UserPlusIcon, title: 'Account Created!', message: 'Welcome to INVEST EMPOWERMENT!' });
    return true;
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
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
      transactionId: `WD-${Date.now()}`, 
      date: new Date().toISOString(), 
      status: 'Payment Successful', 
      userProfile,
      amountUSD: details.amount, 
      amountLocal: details.convertedAmount, 
      currency: details.currency,
      exchangeRate: details.rate, 
      bankName: details.bankName, 
      accountHolderName: details.accountHolderName,
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

    addNotification({ type: 'withdrawal', icon: BanknotesIcon, title: 'Withdrawal Successful', message: `Your withdrawal of ${details.amount.toLocaleString('en-US', {style: 'currency', currency: 'USD'})} has been processed.` });
    setTotalWithdrawn(prev => prev + details.amount);
    setActiveReceipt(newReceipt);
    setCurrentView('receipt');
    setIsWithdrawModalOpen(false);
  };
  
  const handleAddAlert = (assetId: string, alert: Omit<PriceAlert, 'id' | 'status' | 'createdAt'>) => {
    const updatedAssets = assets.map(asset => {
      if (asset.id === assetId) {
        const newAlert: PriceAlert = { ...alert, id: `alert-${Date.now()}`, status: 'active' as const, createdAt: new Date().toISOString() };
        addNotification({ type: 'price_alert', icon: BellAlertIcon, title: 'Price Alert Set', message: `Alert for ${asset.ticker} when price is ${alert.type} ${alert.targetPrice.toLocaleString('en-US', {style: 'currency', currency: 'USD'})}.` });
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

  const stockAssets = useMemo(() => assets.filter(asset => asset.ticker !== 'BTC' && asset.ticker !== 'USD'), [assets]);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
      document.documentElement.style.setProperty('--x', `${e.clientX}px`);
      document.documentElement.style.setProperty('--y', `${e.clientY}px`);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        setMousePos({ x: touch.clientX, y: touch.clientY });
        document.documentElement.style.setProperty('--x', `${touch.clientX}px`);
        document.documentElement.style.setProperty('--y', `${touch.clientY}px`);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.1 });

    const elements = document.querySelectorAll('.reveal-text');
    elements.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, [isLoggedIn, currentView]);

  if (!isLoggedIn || !userProfile) {
    return <LoginScreen onLogin={handleLogin} onSignup={handleSignup} error={loginError} />;
  }
  
  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#050505] text-gray-800 dark:text-gray-200 transition-colors duration-500 relative overflow-hidden">
      <div className="atmosphere" />
      <div className="spotlight-bg" />
      
      <div className="w-full fixed top-0 left-0 right-0 px-4 py-4 flex justify-end z-50 pointer-events-none">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleLogout}
          className="pointer-events-auto flex items-center gap-2 px-4 py-2 bg-white/10 dark:bg-blue-900/20 backdrop-blur-md border border-gray-200/50 dark:border-blue-900/30 text-gray-700 dark:text-blue-400 rounded-full transition-all font-black text-xs uppercase tracking-widest hover:bg-red-500/10 hover:text-red-500 dark:hover:bg-red-500/20 dark:hover:text-red-400 shadow-lg"
        >
          <LogoutIcon className="w-4 h-4" />
          <span>Logout</span>
        </motion.button>
      </div>

      <main className="w-full mx-auto p-4 sm:p-6 lg:p-8 pt-20 relative z-10">
        {currentView === 'receipt' && activeReceipt ? (
          <WithdrawalReceipt receipt={activeReceipt} onBack={() => setCurrentView('dashboard')} />
        ) : (
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
              animatedBalance={animatedBalance}
              isCompleted={isInvestmentCompleted}
          />
        )}
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
        <WithdrawModal totalValue={animatedBalance} onClose={() => setIsWithdrawModalOpen(false)} onWithdraw={handleWithdraw} />
      )}
      {isProfileModalOpen && (
        <ProfileModal profile={userProfile} onClose={() => setIsProfileModalOpen(false)} onSave={handleSaveProfile} />
      )}
    </div>
  );
};

export default App;