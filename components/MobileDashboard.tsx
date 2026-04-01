import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
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
    onWithdrawalHistoryClick: () => void;
    onProfileClick: () => void;
    onLogout: () => void;
    theme: 'light' | 'dark';
    onToggleTheme: () => void;
    investmentStartTime: number | null;
    animatedBalance: number;
    isCompleted: boolean;
}

const TARGET_BALANCE = 20000;
const DURATION_MS = 48 * 60 * 60 * 1000; // 48 hours
const INITIAL_INVESTMENT = 500; // Assumed initial investment for profit calculation

const MobileDashboard: React.FC<MobileDashboardProps> = ({
    assets,
    userProfile,
    notifications,
    onWithdrawClick,
    onWithdrawalHistoryClick,
    onProfileClick,
    onLogout,
    theme,
    onToggleTheme,
    investmentStartTime,
    animatedBalance,
    isCompleted,
}) => {
    
    const profit = animatedBalance > INITIAL_INVESTMENT ? animatedBalance - INITIAL_INVESTMENT : 0;
    const profitPercentage = INITIAL_INVESTMENT > 0 ? (profit / INITIAL_INVESTMENT) * 100 : 0;
    
    const handleInvestClick = () => {
        // window.open('https://wa.link/zzgy5z', '_blank');
        console.log('Reinvest button disabled');
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
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md mx-auto p-4 sm:p-6 space-y-8 bg-white/80 dark:bg-black/40 backdrop-blur-3xl rounded-[2.5rem] shadow-2xl border border-gray-200/50 dark:border-blue-900/20 relative overflow-hidden"
        >
            <div className="spotlight-bg opacity-50" />
            
            {/* Header */}
            <header className="flex justify-between items-center relative z-10">
                <div className="flex items-center gap-2">
                    <motion.button 
                        whileHover={{ scale: 1.1, rotate: 10 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={onToggleTheme} 
                        className="p-3 rounded-2xl bg-gray-100 dark:bg-blue-900/20 text-gray-700 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/40 transition-all"
                    >
                        {theme === 'light' ? 
                            <MoonIcon className="w-6 h-6" /> : 
                            <SunIcon className="w-6 h-6" />
                        }
                    </motion.button>
                    <motion.button 
                        whileHover={{ scale: 1.1, rotate: -10 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={onWithdrawalHistoryClick} 
                        className="p-3 rounded-2xl bg-gray-100 dark:bg-blue-900/20 text-gray-700 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/40 transition-all"
                        title="Withdrawal History"
                    >
                        <BanknotesIcon className="w-6 h-6" />
                    </motion.button>
                </div>

                <motion.button 
                    whileHover={{ scale: 1.02, x: 5 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onProfileClick} 
                    className="flex items-center gap-3 bg-gray-100 dark:bg-blue-900/20 p-1.5 pr-5 rounded-2xl shadow-sm border border-transparent hover:border-blue-500/30 transition-all"
                >
                    {userProfile.profilePicture ? (
                        <img src={userProfile.profilePicture} alt="Profile" className="w-10 h-10 rounded-xl object-cover shadow-lg" />
                    ) : (
                        <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold">
                            {userProfile.fullName.charAt(0)}
                        </div>
                    )}
                    <div className="text-left">
                        <p className="font-bold text-sm text-gray-900 dark:text-white leading-tight">{userProfile.fullName.split(' ')[0]}</p>
                        <p className="text-[10px] font-medium text-gray-500 dark:text-blue-400/60 uppercase tracking-wider">Pro Member</p>
                    </div>
                    <ChevronDownIcon className="w-4 h-4 text-gray-400" />
                </motion.button>
            </header>

            {/* Balance Section */}
            <section className="text-center space-y-4 py-4 relative z-10">
                <div className="space-y-1">
                    <p className={`text-xs font-bold uppercase tracking-[0.2em] reveal-text transition-colors duration-500 ${isCompleted ? 'text-green-500 dark:text-green-400' : 'text-gray-500 dark:text-blue-400/60'}`}>
                        {isCompleted ? "INVEST HOURS COMPLETED" : "Total Portfolio Value"}
                    </p>
                    <motion.p 
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="text-5xl font-extrabold text-gray-900 dark:text-white tracking-tighter shimmer-text"
                    >
                        {animatedBalance.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                    </motion.p>
                </div>

                <div className="max-w-[200px] mx-auto space-y-2">
                    <div className="h-1.5 w-full bg-gray-100 dark:bg-blue-900/20 rounded-full overflow-hidden">
                        <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${(animatedBalance / TARGET_BALANCE) * 100}%` }}
                            className={`h-full transition-colors duration-500 ${isCompleted ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]' : 'bg-blue-600 shadow-[0_0_10px_rgba(37,99,235,0.5)]'}`}
                        />
                    </div>
                    {!isCompleted && investmentStartTime && (
                        <p className="text-[10px] font-bold text-gray-400 dark:text-blue-400/40 uppercase tracking-widest">
                            Progress: {((Math.min(DURATION_MS, Date.now() - investmentStartTime) / DURATION_MS) * 100).toFixed(1)}%
                        </p>
                    )}
                </div>

                <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="inline-flex items-center gap-2 px-4 py-1.5 bg-green-500/10 dark:bg-green-500/20 text-green-600 dark:text-green-400 rounded-full text-sm font-bold"
                >
                    <ArrowUpIcon className="w-4 h-4" />
                    <span>
                        +{profit.toLocaleString('en-US', { style: 'currency', currency: 'USD' })} ({profitPercentage.toFixed(2)}%)
                    </span>
                </motion.div>
            </section>
            
            {/* Action Buttons */}
            <section className="grid grid-cols-2 gap-4 relative z-10">
                <motion.button 
                    whileHover={{ scale: 1 }}
                    whileTap={{ scale: 1 }}
                    onClick={handleInvestClick} 
                    className="flex flex-col items-center justify-center gap-3 w-full bg-gray-400 dark:bg-gray-800 text-white font-bold py-6 px-4 rounded-3xl transition-all shadow-none cursor-not-allowed opacity-60 group"
                    disabled
                >
                    <div className="p-3 bg-white/20 rounded-2xl group-hover:scale-110 transition-transform">
                        <ChatBubbleLeftRightIcon className="w-6 h-6" />
                    </div>
                    <span className="text-sm">Reinvest Now</span>
                </motion.button>
                 <motion.button 
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onWithdrawClick} 
                    className="flex flex-col items-center justify-center gap-3 w-full bg-gray-900 dark:bg-white text-white dark:text-black font-bold py-6 px-4 rounded-3xl transition-all shadow-xl shadow-black/10 dark:shadow-white/5 group"
                >
                    <div className="p-3 bg-white/10 dark:bg-black/10 rounded-2xl group-hover:scale-110 transition-transform">
                        <BanknotesIcon className="w-6 h-6" />
                    </div>
                    <span className="text-sm">Withdraw</span>
                </motion.button>
            </section>
            
            {/* Assets Section */}
            <section className="relative z-10">
                <div className="flex justify-between items-center mb-4 px-1">
                    <h3 className="font-extrabold text-gray-900 dark:text-white text-lg tracking-tight">Market Assets</h3>
                    <motion.button 
                        whileHover={{ rotate: 90, scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-2 rounded-xl bg-gray-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                    >
                        <PlusIcon className="w-5 h-5" />
                    </motion.button>
                </div>
                <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide">
                    {assets.map((asset, index) => (
                         <motion.div 
                            key={asset.id} 
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ y: -8, backgroundColor: theme === 'dark' ? 'rgba(30, 58, 138, 0.3)' : 'rgba(243, 244, 246, 1)' }}
                            className="flex-shrink-0 flex flex-col items-center gap-3 p-4 bg-gray-50 dark:bg-blue-900/10 rounded-3xl w-32 border border-transparent hover:border-blue-500/30 transition-all shadow-sm"
                        >
                            <div className="p-2 bg-white dark:bg-blue-900/30 rounded-2xl shadow-sm">
                                <AssetLogo asset={asset} size="lg"/>
                            </div>
                            <div className="text-center">
                                <p className="font-bold text-sm text-gray-900 dark:text-white truncate w-24">{asset.name}</p>
                                <p className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">{asset.price.toLocaleString('en-US', {style: 'currency', currency: 'USD'})}</p>
                            </div>
                            <motion.button 
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-black py-2 rounded-xl transition shadow-lg shadow-blue-500/20 uppercase tracking-widest"
                            >
                                Reinvest Now
                            </motion.button>
                         </motion.div>
                    ))}
                </div>
            </section>
            
            {/* Notifications Section */}
            <section className="relative z-10">
                <div className="flex justify-between items-center mb-4 px-1">
                    <h3 className="font-extrabold text-gray-900 dark:text-white text-lg tracking-tight">Recent Activity</h3>
                    <motion.button 
                        whileHover={{ rotate: 180, scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-2 rounded-xl bg-gray-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                    >
                        <CogIcon className="w-5 h-5" />
                    </motion.button>
                </div>
                <div className="space-y-3">
                    <AnimatePresence>
                        {notifications.length > 0 ? notifications.map((n, index) => (
                            <motion.div 
                                key={n.id} 
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ delay: index * 0.05 }}
                                className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-blue-900/10 rounded-3xl border border-transparent hover:border-blue-500/20 transition-all group"
                            >
                                <div className="group-hover:scale-110 transition-transform">
                                    <NotificationIcon type={n.type} />
                                </div>
                                <div className="flex-1">
                                    <p className="font-bold text-sm text-gray-900 dark:text-white leading-tight">{n.title}</p>
                                    <p className="text-xs text-gray-500 dark:text-blue-400/60 font-medium mt-0.5">{n.message}</p>
                                </div>
                                <p className="text-[10px] font-bold text-gray-400 dark:text-blue-400/40 self-start mt-1 uppercase tracking-tighter">{n.timestamp}</p>
                            </motion.div>
                        )) : <p className="text-sm text-center text-gray-500 dark:text-gray-400 py-8 font-medium">No recent activity.</p>}
                    </AnimatePresence>
                </div>
            </section>
        </motion.div>
    );
};

export default MobileDashboard;