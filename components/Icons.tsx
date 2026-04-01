import React from 'react';
import { motion } from 'motion/react';

type IconProps = React.SVGProps<SVGSVGElement>;

const iconVariants = {
  initial: { scale: 1, rotate: 0 },
  hover: { scale: 1.1, rotate: 5, transition: { type: 'spring', stiffness: 300, damping: 10 } },
  tap: { scale: 0.9, rotate: -5 },
};

const MotionSVG = motion.create('svg');

export const XMarkIcon: React.FC<IconProps> = (props) => (
  <MotionSVG 
    variants={iconVariants}
    initial="initial"
    whileHover="hover"
    whileTap="tap"
    xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </MotionSVG>
);

export const PlusIcon: React.FC<IconProps> = (props) => (
  <MotionSVG 
    variants={iconVariants}
    initial="initial"
    whileHover="hover"
    whileTap="tap"
    xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
  </MotionSVG>
);

export const MinusIcon: React.FC<IconProps> = (props) => (
    <MotionSVG 
        variants={iconVariants}
        initial="initial"
        whileHover="hover"
        whileTap="tap"
        xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15" />
    </MotionSVG>
);

export const BanknotesIcon: React.FC<IconProps> = (props) => (
  <MotionSVG 
    variants={iconVariants}
    initial="initial"
    whileHover="hover"
    whileTap="tap"
    xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125-1.125h-15c-.621 0-1.125-.504-1.125-1.125v-9.75c0-.621.504-1.125 1.125-1.125h1.5" />
  </MotionSVG>
);

export const ChatBubbleLeftRightIcon: React.FC<IconProps> = (props) => (
    <MotionSVG 
        variants={iconVariants}
        initial="initial"
        whileHover="hover"
        whileTap="tap"
        xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193l-3.72 3.72a.75.75 0 01-1.06 0l-3.72-3.72C9.347 18.603 8.5 17.639 8.5 16.5v-4.286c0-.97.616-1.813 1.5-2.097a6.75 6.75 0 015.5 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5v2.25H3.75V6.75z" />
    </MotionSVG>
);

export const ListBulletIcon: React.FC<IconProps> = (props) => (
  <MotionSVG 
    variants={iconVariants}
    initial="initial"
    whileHover="hover"
    whileTap="tap"
    xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
  </MotionSVG>
);

export const ChartPieIcon: React.FC<IconProps> = (props) => (
  <MotionSVG 
    variants={iconVariants}
    initial="initial"
    whileHover="hover"
    whileTap="tap"
    xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6a7.5 7.5 0 107.5 7.5h-7.5V6z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5H21A7.5 7.5 0 0013.5 3v7.5z" />
  </MotionSVG>
);

export const BellAlertIcon: React.FC<IconProps> = (props) => (
  <MotionSVG 
    variants={{
      initial: { scale: 1, rotate: 0 },
      hover: { scale: 1.1, rotate: [0, -10, 10, -10, 10, 0], transition: { duration: 0.5 } },
      tap: { scale: 0.9 },
    }}
    initial="initial"
    whileHover="hover"
    whileTap="tap"
    xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
  </MotionSVG>
);

export const BitcoinIcon: React.FC<IconProps> = (props) => (
  <MotionSVG 
    variants={{
      initial: { scale: 1, rotate: 0 },
      hover: { scale: 1.1, rotate: 360, transition: { duration: 0.8, ease: "easeInOut" } },
      tap: { scale: 0.9 },
    }}
    initial="initial"
    whileHover="hover"
    whileTap="tap"
    xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-6h6m-6 4h6m-6-8h6" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 100-18 9 9 0 000 18z" />
  </MotionSVG>
);

export const StockIcon: React.FC<IconProps> = (props) => (
    <MotionSVG 
        variants={iconVariants}
        initial="initial"
        whileHover="hover"
        whileTap="tap"
        xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
    </MotionSVG>
);

export const ArrowTrendingUpIcon: React.FC<IconProps> = (props) => (
    <MotionSVG 
        variants={{
          initial: { y: 0, x: 0 },
          hover: { y: -2, x: 2, transition: { repeat: Infinity, repeatType: "reverse", duration: 0.5 } },
        }}
        initial="initial"
        whileHover="hover"
        xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
    </MotionSVG>
);

export const CameraIcon: React.FC<IconProps> = (props) => (
  <MotionSVG 
    variants={iconVariants}
    initial="initial"
    whileHover="hover"
    whileTap="tap"
    xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.776 48.776 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
  </MotionSVG>
);

export const UserCircleIcon: React.FC<IconProps> = (props) => (
  <MotionSVG 
    variants={iconVariants}
    initial="initial"
    whileHover="hover"
    whileTap="tap"
    xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
  </MotionSVG>
);

export const ArrowRightIcon: React.FC<IconProps> = (props) => (
  <MotionSVG 
    variants={{
      initial: { x: 0 },
      hover: { x: 5, transition: { repeat: Infinity, repeatType: "reverse", duration: 0.4 } },
    }}
    initial="initial"
    whileHover="hover"
    xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75" />
  </MotionSVG>
);

export const Bars3Icon: React.FC<IconProps> = (props) => (
  <MotionSVG 
    variants={iconVariants}
    initial="initial"
    whileHover="hover"
    whileTap="tap"
    xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
  </MotionSVG>
);

export const ChartBarIcon: React.FC<IconProps> = (props) => (
    <MotionSVG 
        variants={{
          initial: { scaleY: 1 },
          hover: { scaleY: [1, 1.2, 1], transition: { repeat: Infinity, duration: 1 } },
        }}
        initial="initial"
        whileHover="hover"
        xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
    </MotionSVG>
);

export const EyeIcon: React.FC<IconProps> = (props) => (
    <MotionSVG 
        variants={iconVariants}
        initial="initial"
        whileHover="hover"
        whileTap="tap"
        xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.432 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </MotionSVG>
);

export const EyeSlashIcon: React.FC<IconProps> = (props) => (
    <MotionSVG 
        variants={iconVariants}
        initial="initial"
        whileHover="hover"
        whileTap="tap"
        xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.822 7.822L21 21m-2.278-2.278l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
    </MotionSVG>
);

export const LifebuoyIcon: React.FC<IconProps> = (props) => (
    <MotionSVG 
        variants={iconVariants}
        initial="initial"
        whileHover="hover"
        whileTap="tap"
        xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
    </MotionSVG>
);

export const ShieldCheckIcon: React.FC<IconProps> = (props) => (
    <MotionSVG 
        variants={iconVariants}
        initial="initial"
        whileHover="hover"
        whileTap="tap"
        xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.286z" />
    </MotionSVG>
);

export const UserPlusIcon: React.FC<IconProps> = (props) => (
    <MotionSVG 
        variants={iconVariants}
        initial="initial"
        whileHover="hover"
        whileTap="tap"
        xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
    </MotionSVG>
);

export const WalletIcon: React.FC<IconProps> = (props) => (
    <MotionSVG 
        variants={iconVariants}
        initial="initial"
        whileHover="hover"
        whileTap="tap"
        xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18 3a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 9m18 3V9" />
    </MotionSVG>
);

export const ClockIcon: React.FC<IconProps> = (props) => (
  <MotionSVG 
    variants={{
      initial: { rotate: 0 },
      hover: { rotate: 360, transition: { duration: 2, repeat: Infinity, ease: "linear" } },
    }}
    initial="initial"
    whileHover="hover"
    xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
  </MotionSVG>
);

export const ArrowDownTrayIcon: React.FC<IconProps> = (props) => (
  <MotionSVG 
    variants={{
      initial: { y: 0 },
      hover: { y: 3, transition: { repeat: Infinity, repeatType: "reverse", duration: 0.5 } },
    }}
    initial="initial"
    whileHover="hover"
    xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
  </MotionSVG>
);

export const LogoutIcon: React.FC<IconProps> = (props) => (
    <MotionSVG 
        variants={iconVariants}
        initial="initial"
        whileHover="hover"
        whileTap="tap"
        xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
    </MotionSVG>
);

export const ChevronDownIcon: React.FC<IconProps> = (props) => (
    <MotionSVG 
        variants={iconVariants}
        initial="initial"
        whileHover="hover"
        whileTap="tap"
        xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
    </MotionSVG>
);

export const ArrowUpIcon: React.FC<IconProps> = (props) => (
    <MotionSVG 
        variants={iconVariants}
        initial="initial"
        whileHover="hover"
        whileTap="tap"
        xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5L12 3m0 0l7.5 7.5M12 3v18" />
    </MotionSVG>
);

export const CogIcon: React.FC<IconProps> = (props) => (
    <MotionSVG 
        variants={{
          initial: { rotate: 0 },
          hover: { rotate: 90, transition: { duration: 0.5 } },
        }}
        initial="initial"
        whileHover="hover"
        xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12a7.5 7.5 0 0015 0m-15 0a7.5 7.5 0 1115 0m-15 0H3m18 0h-1.5m-15 0a7.5 7.5 0 1115 0m-15 0H3m18 0h-1.5m-15 0a7.5 7.5 0 1115 0m-15 0H3m18 0h-1.5" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8.25v1.5m0 4.5v1.5m0 4.5v1.5m3.75-12.75l-1.06 1.06m-6.38 6.38l-1.06 1.06m1.06-7.44l-1.06-1.06m7.44 1.06l1.06-1.06m-6.38 6.38l-1.06 1.06m1.06-7.44l-1.06-1.06M12 12a2.25 2.25 0 110-4.5 2.25 2.25 0 010 4.5z" />
    </MotionSVG>
);

export const DropletIcon: React.FC<IconProps> = (props) => (
    <MotionSVG 
        variants={iconVariants}
        initial="initial"
        whileHover="hover"
        whileTap="tap"
        xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.002 9.002 0 008.13-5.322c.214-.52.37-1.06.37-1.628 0-3.328-2.688-6.023-6-6.023s-6 2.695-6 6.023c0 .568.156 1.108.37 1.628A9.002 9.002 0 0012 21z" />
    </MotionSVG>
);

export const ArrowDownRightIcon: React.FC<IconProps> = (props) => (
    <MotionSVG 
        variants={iconVariants}
        initial="initial"
        whileHover="hover"
        whileTap="tap"
        xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
    </MotionSVG>
);

export const SunIcon: React.FC<IconProps> = (props) => (
  <MotionSVG 
    variants={{
      initial: { rotate: 0 },
      hover: { rotate: 180, transition: { duration: 0.5 } },
    }}
    initial="initial"
    whileHover="hover"
    xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
  </MotionSVG>
);

export const DocumentTextIcon: React.FC<IconProps> = (props) => (
  <MotionSVG 
    variants={iconVariants}
    initial="initial"
    whileHover="hover"
    whileTap="tap"
    xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
  </MotionSVG>
);

export const MoonIcon: React.FC<IconProps> = (props) => (
  <MotionSVG 
    variants={{
      initial: { rotate: 0 },
      hover: { rotate: -20, transition: { duration: 0.5 } },
    }}
    initial="initial"
    whileHover="hover"
    xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
  </MotionSVG>
);
