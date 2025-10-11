
import React, { useState, useEffect, useRef } from 'react';
import { Asset, Transaction, TransactionType, UserProfile, Theme, Receipt, Notification, PriceAlert } from './types';
import LandingPage from './components/LandingPage';
import LoginScreen from './components/LoginScreen';
import PortfolioHeader from './components/PortfolioHeader';
import AssetRow from './components/AssetRow';
import ManageBalanceModal from './components/ManageBalanceModal';
import ProfileModal from './components/ProfileModal';
import WithdrawModal from './components/WithdrawModal';
import WithdrawalReceipt from './components/WithdrawalReceipt';
import TransactionHistoryModal from './components/TransactionHistoryModal';
import LiveChartModal from './components/LiveChartModal';
import NotificationPopup from './components/NotificationPopup';
import PriceAlertModal from './components/PriceAlertModal';
import { UserCircleIcon, UserGroupIcon, ArrowUpCircleIcon, ArrowDownCircleIcon, BellAlertIcon, SunIcon, MoonIcon, UserPlusIcon } from './components/Icons';

// --- Local Storage User Management ---
interface UserData {
  password: string; // Will be stored as Base64
  profile: UserProfile;
  assets: Asset[];
}
const USERS_STORAGE_KEY = 'invest_empowerment_users';
const THEME_STORAGE_KEY = 'invest_empowerment_theme';

const getUsers = (): Record<string, UserData> => {
  try {
    const usersJson = localStorage.getItem(USERS_STORAGE_KEY);
    return usersJson ? JSON.parse(usersJson) : {};
  } catch (error) {
    console.error("Failed to parse users from localStorage", error);
    return {};
  }
};

const saveUsers = (users: Record<string, UserData>) => {
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
};
// --- End Local Storage ---


// Mock Data for the initial, default user
const initialAssets: Asset[] = [
  {
    id: '1',
    name: 'Bitcoin',
    ticker: 'BTC',
    balance: 0.5,
    price: 55000,
    logoUrl: 'https://cryptologos.cc/logos/bitcoin-btc-logo.svg?v=029',
    transactions: [
      { id: 't1', type: TransactionType.ADD, amount: 0.5, date: '2023-10-01T10:00:00Z', description: 'Initial investment' },
    ],
    priceAlerts: [],
  },
  {
    id: '2',
    name: 'Ethereum',
    ticker: 'ETH',
    balance: 10,
    price: 3500,
    logoUrl: 'https://cryptologos.cc/logos/ethereum-eth-logo.svg?v=029',
    transactions: [
       { id: 't2', type: TransactionType.ADD, amount: 15, date: '2023-09-15T14:30:00Z', description: 'Bought the dip' },
       { id: 't3', type: TransactionType.REMOVE, amount: 5, date: '2023-10-05T09:00:00Z', description: 'Took some profits' },
    ],
    priceAlerts: [],
  },
  {
    id: '3',
    name: 'Unilever PLC',
    ticker: 'ULVR',
    balance: 100,
    price: 44.50,
    logoUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/9/9c/Unilever_logo.svg/1200px-Unilever_logo.svg.png',
    transactions: [
        { id: 't8', type: TransactionType.ADD, amount: 100, date: '2023-05-12T10:00:00Z', description: 'Long-term hold' },
    ],
    priceAlerts: [],
  },
  {
    id: '4',
    name: 'Shell PLC',
    ticker: 'SHEL',
    balance: 250,
    price: 28.75,
    logoUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/e/e8/Shell_logo.svg/1200px-Shell_logo.svg.png',
    transactions: [
        { id: 't9', type: TransactionType.ADD, amount: 250, date: '2023-04-21T11:30:00Z', description: 'Dividend stock purchase' },
    ],
    priceAlerts: [],
  },
  {
    id: '5',
    name: 'Apple Inc.',
    ticker: 'AAPL',
    balance: 50,
    price: 170.00,
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Apple_logo_black.svg/1667px-Apple_logo_black.svg.png',
    transactions: [
      { id: 't4', type: TransactionType.ADD, amount: 50, date: '2023-08-20T12:00:00Z', description: 'Portfolio diversification' },
    ],
    priceAlerts: [],
  },
  {
    id: '6',
    name: 'Vanguard S&P 500 ETF',
    ticker: 'VOO',
    balance: 20,
    price: 450.00,
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Vanguard_logo.svg/2560px-Vanguard_logo.svg.png',
    transactions: [
      { id: 't5', type: TransactionType.ADD, amount: 20, date: '2023-07-10T11:00:00Z', description: 'Core index fund' },
    ],
    priceAlerts: [],
  },
  {
    id: '7',
    name: 'Solana',
    ticker: 'SOL',
    balance: 100,
    price: 150.00,
    logoUrl: 'https://cryptologos.cc/logos/solana-sol-logo.svg?v=029',
    transactions: [
      { id: 't6', type: TransactionType.ADD, amount: 100, date: '2023-11-01T18:00:00Z', description: 'Web3 speculation' },
    ],
    priceAlerts: [],
  },
  {
    id: '8',
    name: 'HSBC Holdings PLC',
    ticker: 'HSBA',
    balance: 300,
    price: 6.50,
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/HSBC_logo_%282018%29.svg/2560px-HSBC_logo_%282018%29.svg.png',
    transactions: [
        { id: 't7', type: TransactionType.ADD, amount: 300, date: '2023-06-01T09:30:00Z', description: 'Financial sector exposure' },
    ],
    priceAlerts: [],
  },
  {
    id: '9',
    name: 'Cash Balance',
    ticker: 'GBP',
    balance: 0,
    price: 1.00,
    logoUrl: 'https://cdn-icons-png.flaticon.com/512/3481/3481269.png',
    transactions: [],
    priceAlerts: [],
  },
];

const initialProfile: UserProfile = {
  fullName: 'Jessica Allen',
  email: 'jessica.allen@example.com',
  bio: 'Diversified portfolio with a focus on long-term growth in tech and renewables.',
  profilePicture: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
};

const defaultEmptyProfile: UserProfile = {
  fullName: '',
  email: '',
  bio: '',
  profilePicture: null,
};

interface WithdrawalDetails {
  amount: number;
  convertedAmount: number;
  currency: string;
  rate: number;
  bankName: string;
  accountHolderName: string;
  accountNumber: string;
}

// Data for random notifications
const randomUsers = [
  { name: 'David K.', location: 'Lae, PNG' },
  { name: 'Sarah L.', location: 'Goroka, PNG' },
  { name: 'Tui F.', location: 'Apia, Samoa' },
  { name: 'Ratu S.', location: 'Suva, Fiji' },
  { name: 'Grace V.', location: 'Honiara, Solomon Islands' },
  { name: 'John P.', location: 'Mount Hagen, PNG' },
  { name: 'Mary T.', location: 'Port Moresby, PNG' },
];

const App: React.FC = () => {
  const [theme, setTheme] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY) as Theme | null;
    if (savedTheme && ['light', 'dark'].includes(savedTheme)) {
        return savedTheme;
    }
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    return prefersDark ? 'dark' : 'light';
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [showLanding, setShowLanding] = useState<boolean>(true);
  const [authError, setAuthError] = useState('');
  const [currentUser, setCurrentUser] = useState<string | null>(null);

  const [assets, setAssets] = useState<Asset[]>([]);
  const [profile, setProfile] = useState<UserProfile>(defaultEmptyProfile);

  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [historyAsset, setHistoryAsset] = useState<Asset | null>(null);
  const [chartAsset, setChartAsset] = useState<Asset | null>(null);
  const [alertAsset, setAlertAsset] = useState<Asset | null>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  
  const [view, setView] = useState<'dashboard' | 'receipt'>('dashboard');
  const [latestReceipt, setLatestReceipt] = useState<Receipt | null>(null);

  const [notifications, setNotifications] = useState<Notification[]>([]);

  const totalValue = assets.reduce((acc, asset) => acc + asset.balance * asset.price, 0);
  const assetsRef = useRef(assets);

    useEffect(() => {
        assetsRef.current = assets;
    }, [assets]);
  
  // Effect to set up the initial demo user if none exist
  useEffect(() => {
    const users = getUsers();
    if (Object.keys(users).length === 0) {
      const defaultUserEmail = 'jessica.allen@example.com';
      users[defaultUserEmail] = {
        password: btoa('password'), // Obfuscate password
        profile: initialProfile,
        assets: initialAssets,
      };
      saveUsers(users);
    }
  }, []);

  // Effect for managing notifications
  useEffect(() => {
    if (!isAuthenticated) return;

    const notificationTypes: Notification['type'][] = ['investors', 'investment', 'withdrawal', 'new_member'];
    let notificationIndex = 0;

    const createNotification = () => {
      const type = notificationTypes[notificationIndex];
      let newNotification;
      const randomUser = randomUsers[Math.floor(Math.random() * randomUsers.length)];

      if (type === 'investors') {
        newNotification = {
          type: 'investors',
          icon: UserGroupIcon,
          title: '768 Recent Investors',
          message: 'Join a growing & trusted community.',
        };
      } else if (type === 'new_member') {
        newNotification = {
            type: 'new_member',
            icon: UserPlusIcon,
            title: 'New Member Joined!',
            message: `${randomUser.name} from ${randomUser.location} just joined.`,
        };
      } else {
        const randomAmount = (Math.random() * (1000 - 50) + 50).toFixed(2);
        
        if (type === 'investment') {
          newNotification = {
            type: 'investment',
            icon: ArrowUpCircleIcon,
            title: `New Investment from ${randomUser.location}`,
            message: `${randomUser.name} just invested ${randomAmount} GBP.`,
          };
        } else { // withdrawal
          newNotification = {
            type: 'withdrawal',
            icon: ArrowDownCircleIcon,
            title: `Successful Withdrawal`,
            message: `${randomUser.name} withdrew their profits.`,
          };
        }
      }
      
      addNotification(newNotification);
      notificationIndex = (notificationIndex + 1) % notificationTypes.length;
    };

    const intervalId = setInterval(createNotification, 8000); // Create a new notification every 8 seconds

    return () => clearInterval(intervalId);
  }, [isAuthenticated]);
  
    // Effect for price simulation and alert checking
    useEffect(() => {
        if (!isAuthenticated) return;

        const intervalId = setInterval(() => {
            const users = getUsers();
            const currentUserEmail = currentUser;
            if (!currentUserEmail) return;

            const updatedAssets = assetsRef.current.map(asset => {
                if (asset.ticker === 'GBP') return asset;

                const changePercent = (Math.random() - 0.5) * 0.01;
                const newPrice = asset.price * (1 + changePercent);
                const updatedAsset = { ...asset, price: newPrice, priceAlerts: asset.priceAlerts.map(a => ({...a})) };

                updatedAsset.priceAlerts.forEach(alert => {
                    if (alert.status === 'active') {
                        const conditionMet = 
                            (alert.type === 'above' && newPrice >= alert.targetPrice) ||
                            (alert.type === 'below' && newPrice <= alert.targetPrice);

                        if (conditionMet) {
                            alert.status = 'triggered';
                            addNotification({
                                type: 'price_alert',
                                icon: BellAlertIcon,
                                title: `${asset.name} Price Alert`,
                                message: `Target of ${alert.targetPrice.toLocaleString('en-GB', { style: 'currency', currency: 'GBP' })} reached.`,
                            });
                        }
                    }
                });
                return updatedAsset;
            });
            
            if (JSON.stringify(updatedAssets) !== JSON.stringify(assetsRef.current)) {
                setAssets(updatedAssets);
                if (users[currentUserEmail]) {
                    users[currentUserEmail].assets = updatedAssets;
                    saveUsers(users);
                }
            }

        }, 5000);

        return () => clearInterval(intervalId);
    }, [isAuthenticated, currentUser]);

  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp'>) => {
    const newNotification: Notification = {
      ...notification,
      id: new Date().getTime().toString() + Math.random(),
      timestamp: 'Just now',
    };
    setNotifications(prev => [newNotification, ...prev].slice(0, 5)); // Keep max 5 notifications
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };


  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);
  
  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  const handleLogin = (email: string, password: string): boolean => {
    setAuthError('');
    const users = getUsers();
    const userData = users[email];

    if (userData) {
      try {
        // Decode the password from storage and compare
        if (atob(userData.password) === password) {
          setIsAuthenticated(true);
          setCurrentUser(email);
          setProfile(userData.profile);
          setAssets(userData.assets);
          return true;
        }
      } catch (e) {
        // This handles cases where the stored password is not valid Base64,
        // which could happen with old data. We'll treat it as a login failure.
        console.error('Failed to decode password for user:', email, e);
      }
    }
    setAuthError('Invalid email or password.');
    return false;
  };
  
  const handleSignup = (email: string, password: string): boolean => {
    setAuthError('');
    const users = getUsers();

    if (users[email]) {
        setAuthError('An account with this email already exists.');
        return false;
    }

    if (!email || !/^\S+@\S+\.\S+$/.test(email) || password.length < 6) {
        setAuthError('Please use a valid email and a password of at least 6 characters.');
        return false;
    }

    const newUserProfile: UserProfile = {
        fullName: email.split('@')[0],
        email: email,
        bio: 'New investor ready for empowerment!',
        profilePicture: null,
    };
    
    const newUsersAssets = initialAssets.map(asset => ({
        ...asset,
        balance: 0,
        transactions: [],
        priceAlerts: [],
    }));

    users[email] = {
        password: btoa(password), // Obfuscate password before saving
        profile: newUserProfile,
        assets: newUsersAssets,
    };
    saveUsers(users);
    
    setIsAuthenticated(true);
    setCurrentUser(email);
    setProfile(newUserProfile);
    setAssets(newUsersAssets);
    
    return true;
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    setShowLanding(true);
    setAssets([]);
    setProfile(defaultEmptyProfile);
  };
  
  const handleUpdateBalance = (assetId: string, amount: number, type: TransactionType, description?: string) => {
    const newAssets = assets.map(asset => {
      if (asset.id === assetId) {
        const newBalance = type === TransactionType.ADD ? asset.balance + amount : asset.balance - amount;
        const newTransaction: Transaction = {
          id: new Date().toISOString(),
          type,
          amount,
          date: new Date().toISOString(),
          description,
        };
        return { ...asset, balance: newBalance, transactions: [...asset.transactions, newTransaction] };
      }
      return asset;
    });
    setAssets(newAssets);

    if (currentUser) {
      const users = getUsers();
      users[currentUser].assets = newAssets;
      saveUsers(users);
    }
  };

  const handleSaveProfile = (updatedProfile: UserProfile) => {
    setProfile(updatedProfile);
    if (currentUser) {
      const users = getUsers();
      users[currentUser].profile = updatedProfile;
      saveUsers(users);
    }
  };
  
  const handleWithdraw = (details: WithdrawalDetails) => {
    handleUpdateBalance('9', details.amount, TransactionType.WITHDRAW);
    
    const newReceipt: Receipt = {
      transactionId: `TXN-${Date.now()}`,
      date: new Date().toISOString(),
      status: 'Pending',
      userProfile: profile,
      amountGBP: details.amount,
      amountLocal: details.convertedAmount,
      currency: details.currency,
      exchangeRate: details.rate,
      bankName: details.bankName,
      accountHolderName: details.accountHolderName,
      accountNumber: details.accountNumber,
    };
    setLatestReceipt(newReceipt);
    setIsWithdrawModalOpen(false);
    setView('receipt');
  };
  
  const handleAddPriceAlert = (assetId: string, alertData: Omit<PriceAlert, 'id' | 'status' | 'createdAt'>) => {
    const newAlert: PriceAlert = {
        ...alertData,
        id: new Date().getTime().toString(),
        status: 'active',
        createdAt: new Date().toISOString(),
    };
    const newAssets = assets.map(asset => {
        if (asset.id === assetId) {
            const updatedAsset = { ...asset, priceAlerts: [...asset.priceAlerts, newAlert] };
            if (alertAsset && alertAsset.id === assetId) setAlertAsset(updatedAsset);
            return updatedAsset;
        }
        return asset;
    });
    setAssets(newAssets);
    if (currentUser) {
        const users = getUsers();
        users[currentUser].assets = newAssets;
        saveUsers(users);
    }
  };

  const handleDeletePriceAlert = (assetId: string, alertId: string) => {
      const newAssets = assets.map(asset => {
          if (asset.id === assetId) {
              const updatedAlerts = asset.priceAlerts.filter(a => a.id !== alertId);
              const updatedAsset = { ...asset, priceAlerts: updatedAlerts };
              if (alertAsset && alertAsset.id === assetId) setAlertAsset(updatedAsset);
              return updatedAsset;
          }
          return asset;
      });
      setAssets(newAssets);
      if (currentUser) {
          const users = getUsers();
          users[currentUser].assets = newAssets;
          saveUsers(users);
      }
  };


  if (showLanding && !isAuthenticated) {
    return <LandingPage onGetStarted={() => setShowLanding(false)} />;
  }
  
  if (!isAuthenticated) {
    return <LoginScreen onLogin={handleLogin} onSignup={handleSignup} error={authError} />;
  }

  if (view === 'receipt' && latestReceipt) {
    return <WithdrawalReceipt receipt={latestReceipt} onBack={() => setView('dashboard')} />;
  }

  return (
    <div className="min-h-screen text-gray-800 dark:text-gray-200 transition-colors duration-300">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-40 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-3">
              <svg className="w-8 h-8 text-emerald-600 dark:text-emerald-500" viewBox="0 0 24 24" fill="currentColor"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"></path></svg>
              <span className="text-xl font-bold text-gray-900 dark:text-white">Investment Dashboard</span>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                aria-label="Toggle theme"
              >
                {theme === 'light' ? (
                  <MoonIcon className="w-6 h-6" />
                ) : (
                  <SunIcon className="w-6 h-6" />
                )}
              </button>
              <button onClick={() => setIsProfileModalOpen(true)} className="flex items-center gap-2">
                {profile.profilePicture ? (
                  <img src={profile.profilePicture} alt="Profile" className="w-10 h-10 rounded-full object-cover" />
                ) : (
                  <UserCircleIcon className="w-10 h-10 text-gray-400 dark:text-gray-500" />
                )}
              </button>
              <button onClick={handleLogout} className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400">
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <PortfolioHeader totalValue={totalValue} onWithdrawClick={() => setIsWithdrawModalOpen(true)} />
        
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-blue-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="p-4">Asset</th>
                <th scope="col" className="p-4 text-right">Price</th>
                <th scope="col" className="p-4 text-right">Balance</th>
                <th scope="col" className="p-4 hidden lg:table-cell">24h Chart</th>
                <th scope="col" className="p-4 text-right hidden md:table-cell">Allocation</th>
                <th scope="col" className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {assets.length > 0 ? (
                assets.map(asset => (
                  <AssetRow 
                    key={asset.id} 
                    asset={asset} 
                    totalPortfolioValue={totalValue}
                    onManageBalance={() => setSelectedAsset(asset)}
                    onViewHistory={() => setHistoryAsset(asset)}
                    onViewChart={() => setChartAsset(asset)}
                    onSetAlert={() => setAlertAsset(asset)}
                  />
                ))
              ) : (
                <tr>
                    <td colSpan={6} className="text-center py-16 px-4">
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Your Investment Dashboard is Empty</h3>
                        <p className="text-gray-500 dark:text-gray-400 mt-2">Click "Invest Now" to get started with a personal consultation.</p>
                    </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>

      {selectedAsset && (
        <ManageBalanceModal 
          asset={selectedAsset} 
          onClose={() => setSelectedAsset(null)}
          onUpdateBalance={handleUpdateBalance}
        />
      )}

      {historyAsset && (
        <TransactionHistoryModal 
            asset={historyAsset}
            onClose={() => setHistoryAsset(null)}
        />
      )}

      {chartAsset && (
        <LiveChartModal
          asset={chartAsset}
          onClose={() => setChartAsset(null)}
        />
      )}
      
      {alertAsset && (
        <PriceAlertModal
            asset={alertAsset}
            onClose={() => setAlertAsset(null)}
            onAddAlert={handleAddPriceAlert}
            onDeleteAlert={handleDeletePriceAlert}
        />
      )}

      {isProfileModalOpen && (
        <ProfileModal 
          profile={profile}
          onClose={() => setIsProfileModalOpen(false)}
          onSave={handleSaveProfile}
        />
      )}

      {isWithdrawModalOpen && (
        <WithdrawModal 
          totalValue={totalValue}
          onClose={() => setIsWithdrawModalOpen(false)}
          onWithdraw={handleWithdraw}
        />
      )}
      
      {/* Notifications Container */}
      <div className="fixed bottom-4 left-4 z-[100] space-y-3 w-full max-w-sm">
        {notifications.map(n => (
          <NotificationPopup
            key={n.id}
            notification={n}
            onRemove={() => removeNotification(n.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default App;
