
import { Asset, UserProfile, TransactionType } from './types';

// This is the user profile for the demo account.
export const initialProfile: UserProfile = {
  fullName: 'PASTOR JESSICA ALLEN',
  email: 'jessica.allen@example.com',
  bio: 'A pastor dedicated to helping the community achieve financial stability through faith-based, transparent investment opportunities.',
  profilePicture: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
};

// This is the initial set of assets for the portfolio.
export const initialAssets: Asset[] = [
    {
        id: 'btc',
        name: 'Bitcoin',
        ticker: 'BTC',
        balance: 2.5,
        price: 55210.50,
        logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Bitcoin.svg/1200px-Bitcoin.svg.png',
        transactions: [
            { id: 'tx1', type: TransactionType.ADD, amount: 1.0, date: '2024-05-01T10:00:00Z', description: 'Initial investment' },
            { id: 'tx2', type: TransactionType.ADD, amount: 1.5, date: '2024-05-10T14:30:00Z', description: 'Monthly savings' },
        ],
        priceAlerts: [],
    },
    {
        id: 'aapl',
        name: 'Apple Inc.',
        ticker: 'AAPL',
        balance: 50,
        price: 172.25,
        logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg',
        transactions: [],
        priceAlerts: [],
    },
    {
        id: 'msft',
        name: 'Microsoft Corp.',
        ticker: 'MSFT',
        balance: 30,
        price: 415.13,
        logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Microsoft_logo.svg/2048px-Microsoft_logo.svg.png',
        transactions: [],
        priceAlerts: [],
    },
    {
        id: 'amzn',
        name: 'Amazon.com, Inc.',
        ticker: 'AMZN',
        balance: 15,
        price: 183.54,
        logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Amazon_logo.svg/2560px-Amazon_logo.svg.png',
        transactions: [],
        priceAlerts: [],
    },
    {
        id: 'googl',
        name: 'Alphabet Inc.',
        ticker: 'GOOGL',
        balance: 10,
        price: 171.96,
        logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Google_2015_logo.svg/1920px-Google_2015_logo.svg.png',
        transactions: [],
        priceAlerts: [],
    },
    {
        id: 'meta',
        name: 'Meta Platforms, Inc.',
        ticker: 'META',
        balance: 25,
        price: 471.92,
        logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/Meta-Logo.png/1200px-Meta-Logo.png',
        transactions: [],
        priceAlerts: [],
    },
    {
        id: 'tsla',
        name: 'Tesla, Inc.',
        ticker: 'TSLA',
        balance: 20,
        price: 174.95,
        logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Tesla_logo.png/1200px-Tesla_logo.png',
        transactions: [],
        priceAlerts: [],
    },
    {
        id: 'cash',
        name: 'Cash Balance',
        ticker: 'GBP',
        balance: 10000.00,
        price: 1.00,
        logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/Pound_symbol.svg/1200px-Pound_symbol.svg.png',
        transactions: [],
        priceAlerts: [],
    }
];
