import React, { useState, useEffect } from 'react';
import { Asset, UserProfile, Notification } from '../types';
import {
    LogoutIcon, ChevronDownIcon, UserCircleIcon, BanknotesIcon, CogIcon,
    PlusIcon, ChatBubbleLeftRightIcon, ArrowUpIcon, DropletIcon, ArrowDownRightIcon, UserPlusIcon, BellAlertIcon,
    SunIcon, MoonIcon
} from './Icons';
import AssetLogo from './AssetLogo';

interface MobileDashboardProps {
    assets: Asset[];
    userProfile: UserProfile;
    notifications: Notification[];
    onWithdrawClick: () => void;
    onProfileClick: () => void;
    onLogout: () => void;
    theme: 'light' | 'dark';
    onToggleTheme: () => void;
    investmentStartTime: number | null;
}

const TARGET_BALANCE = 20000;
const DURATION_MS = 3 * 24 * 60 * 60 * 1000; // 3 days
const INITIAL_INVESTMENT = 500; // Assumed initial investment for profit calculation

const MobileDashboard: React.FC<MobileDashboardProps> = ({
    assets,
    userProfile,
    notifications,
    onWithdrawClick,
    onProfileClick,
    onLogout,
    theme,
    onToggleTheme,
    investmentStartTime,
}) => {
    const [animatedBalance, setAnimatedBalance] = useState(0);

    useEffect(() => {
        if (investmentStartTime === null) return;

        let animationFrameId: number;
        
        const animate = () => {
            const elapsedTime = Date.now() - investmentStartTime;
            const progress = Math.min(elapsedTime / DURATION_MS, 1);
            const currentBalance = progress * TARGET_BALANCE;
            setAnimatedBalance(currentBalance);

            if (progress < 1) {
                animationFrameId = requestAnimationFrame(animate);
            }
        };

        animate();

        return () => {
            cancelAnimationFrame(animationFrameId);
        };
    }, [investmentStartTime]);
    
    const profit = animatedBalance > INITIAL_INVESTMENT ? animatedBalance - INITIAL_INVESTMENT : 0;
    const profitPercentage = INITIAL_INVESTMENT > 0 ? (profit / INITIAL_INVESTMENT) * 100 : 0;
    
    const handleInvestClick = () => {
        window.open('https://wa.link/zzgy5z', '_blank');
    };

    const NotificationIcon = ({ type }: { type: Notification['type'] }) => {
        const iconMap = {
            investment: <ArrowUpIcon className="w-5 h-5 text-white" />,
            withdrawal: <BanknotesIcon className="w-5 h-5 text-white" />,
            new_member: <UserPlusIcon className="w-5 h-5 text-white" />,
            price_alert: <BellAlertIcon className="w-5 h-5 text-white" />,
            // Custom mock icons
            water_bill: <DropletIcon className="w-5 h-5 text-white" />,
            spending: <ArrowDownRightIcon className="w-5 h-5 text-white" />,
            sent_money: <UserCircleIcon className="w-5 h-5 text-white" />,
        };
        const colorMap = {
            investment: 'bg-green-500',
            withdrawal: 'bg-blue-500',
            new_member: 'bg-purple-500',
            price_alert: 'bg-yellow-500',
            water_bill: 'bg-yellow-400',
            spending: 'bg-red-500',
            sent_money: 'bg-pink-500',
        };
        
        const extendedType = type as Notification['type'] | 'water_bill' | 'spending' | 'sent_money';
        const IconComponent = iconMap[extendedType] || <UserCircleIcon className="w-5 h-5 text-white" />;
        const bgColor = colorMap[extendedType] || 'bg-gray-500';

        return <div className={`w-10 h-10 rounded-full flex items-center justify-center ${bgColor}`}>{IconComponent}</div>;
    };
    
    return (
        <div className="max-w-md mx-auto p-4 sm:p-6 space-y-8 bg-gradient-to-b from-blue-100 via-white to-pink-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 rounded-3xl shadow-lg">
            {/* Header */}
            <header className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <button onClick={onLogout} className="p-2 rounded-full bg-white/50 dark:bg-gray-700/50 hover:bg-white dark:hover:bg-gray-700 transition-colors">
                        <LogoutIcon className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                    </button>
                    <button onClick={onToggleTheme} className="p-2 rounded-full bg-white/50 dark:bg-gray-700/50 hover:bg-white dark:hover:bg-gray-700 transition-colors">
                        {theme === 'light' ? 
                            <MoonIcon className="w-6 h-6 text-gray-700 dark:text-gray-300" /> : 
                            <SunIcon className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                        }
                    </button>
                </div>

                <button onClick={onProfileClick} className="flex items-center gap-2 bg-white dark:bg-gray-800 p-2 pr-4 rounded-full shadow-sm">
                    {userProfile.profilePicture ? (
                        <img src={userProfile.profilePicture} alt="Profile" className="w-10 h-10 rounded-full object-cover" />
                    ) : (
                        <UserCircleIcon className="w-10 h-10 text-gray-400" />
                    )}
                    <div>
                        <p className="font-bold text-sm text-gray-900 dark:text-white">{userProfile.fullName}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{userProfile.email}</p>
                    </div>
                    <ChevronDownIcon className="w-5 h-5 text-gray-500" />
                </button>
            </header>

            {/* Balance Section */}
            <section className="text-center space-y-2">
                <p className="text-sm text-gray-600 dark:text-gray-400">Total balance</p>
                <p className="text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                    {animatedBalance.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                </p>
                <div className="flex justify-center items-center gap-2 text-green-600 dark:text-green-400 font-semibold">
                    <ArrowUpIcon className="w-4 h-4" />
                    <span>
                        {profit.toLocaleString('en-US', { style: 'currency', currency: 'USD' })} ({profitPercentage.toFixed(2)}%)
                    </span>
                </div>
            </section>
            
            {/* Action Buttons */}
            <section className="grid grid-cols-2 gap-4">
                <button onClick={handleInvestClick} className="flex items-center justify-center gap-2 w-full bg-gray-900 hover:bg-gray-700 text-white font-bold py-4 px-4 rounded-2xl transition-colors shadow-lg">
                    <ChatBubbleLeftRightIcon className="w-6 h-6" />
                    <span>Invest Now</span>
                </button>
                 <button onClick={onWithdrawClick} className="flex items-center justify-center gap-2 w-full bg-gray-900 hover:bg-gray-700 text-white font-bold py-4 px-4 rounded-2xl transition-colors shadow-lg">
                    <BanknotesIcon className="w-6 h-6" />
                    <span>Withdraw</span>
                </button>
            </section>
            
            {/* Assets Section */}
            <section>
                <div className="flex justify-between items-center mb-3">
                    <h3 className="font-bold text-gray-900 dark:text-white text-lg">Assets to Invest In</h3>
                    <button className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
                        <PlusIcon className="w-6 h-6 text-gray-500" />
                    </button>
                </div>
                <div className="flex space-x-4 overflow-x-auto pb-2">
                    {assets.map(asset => (
                         <div key={asset.id} className="flex-shrink-0 flex flex-col items-center gap-2 p-3 bg-white/60 dark:bg-gray-800/60 rounded-xl w-28">
                            <AssetLogo asset={asset} size="lg"/>
                            <p className="font-semibold text-sm text-gray-800 dark:text-gray-200 truncate">{asset.name}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{asset.price.toLocaleString('en-GB', {style: 'currency', currency: 'GBP'})}</p>
                            <button className="w-full bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold py-1.5 rounded-md transition">
                                Invest
                            </button>
                         </div>
                    ))}
                </div>
            </section>
            
            {/* Notifications Section */}
            <section>
                <div className="flex justify-between items-center mb-3">
                    <h3 className="font-bold text-gray-900 dark:text-white text-lg">Notifications</h3>
                    <button className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
                        <CogIcon className="w-6 h-6 text-gray-500" />
                    </button>
                </div>
                <div className="space-y-3">
                    {notifications.length > 0 ? notifications.map(n => (
                        <div key={n.id} className="flex items-center gap-4 p-3 bg-white/60 dark:bg-gray-800/60 rounded-xl">
                            <NotificationIcon type={n.type} />
                            <div className="flex-1">
                                <p className="font-semibold text-sm text-gray-900 dark:text-white">{n.title}</p>
                                <p className="text-xs text-gray-600 dark:text-gray-400">{n.message}</p>
                            </div>
                            <p className="text-xs text-gray-400 dark:text-gray-500 self-start">{n.timestamp}</p>
                        </div>
                    )) : <p className="text-sm text-center text-gray-500 dark:text-gray-400 py-4">No new notifications.</p>}
                </div>
            </section>
        </div>
    );
};

export default MobileDashboard;
