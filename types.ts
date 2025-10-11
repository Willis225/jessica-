import React from 'react';

// FIX: Removed circular self-import of UserProfile to resolve the 'Import declaration conflicts with local declaration' error.

export enum TransactionType {
  ADD = 'ADD',
  REMOVE = 'REMOVE',
  WITHDRAW = 'WITHDRAW',
}

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  date: string;
  description?: string;
}

export interface PriceAlert {
  id: string;
  type: 'above' | 'below';
  targetPrice: number;
  status: 'active' | 'triggered';
  createdAt: string;
}

export interface Asset {
  id: string;
  name: string;
  ticker: string;
  balance: number;
  price: number;
  logoUrl?: string;
  transactions: Transaction[];
  priceAlerts: PriceAlert[];
}

export interface UserProfile {
  fullName: string;
  email: string;
  bio: string;
  profilePicture: string | null;
}

export type Theme = 'light' | 'dark';

export interface Receipt {
  transactionId: string;
  date: string;
  status: 'Pending' | 'Completed' | 'Failed';
  userProfile: UserProfile;
  amountGBP: number;
  amountLocal: number;
  currency: string;
  exchangeRate: number;
  bankName: string;
  accountHolderName: string;
  accountNumber: string;
}

export interface Notification {
  id: string;
  type: 'investors' | 'investment' | 'withdrawal' | 'price_alert' | 'new_member';
  icon: React.ElementType;
  title: string;
  message: string;
  timestamp: string;
}