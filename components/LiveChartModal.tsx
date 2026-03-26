import React, { useState, useEffect } from 'react';
import { Asset } from '../types';
import { XMarkIcon } from './Icons';
import AssetLogo from './AssetLogo';

interface LiveChartModalProps {
  asset: Asset;
  onClose: () => void;
}

// Generates an initial set of random data points for the chart
const generateRandomData = () => {
  const data = [];
  let lastY = 50;
  for (let i = 0; i < 20; i++) {
    const y = lastY + (Math.random() * 10 - 5);
    data.push(Math.max(10, Math.min(90, y))); // Clamp values between 10 and 90
    lastY = y;
  }
  return data;
};

// Converts an array of data points into an SVG path string
const dataToPath = (data: number[]) => {
  const width = 300;
  const height = 100;
  const step = width / (data.length - 1);
  return data.map((d, i) => `${i === 0 ? 'M' : 'L'} ${i * step} ${height - (d / 100) * height}`).join(' ');
};

const LiveChartModal: React.FC<LiveChartModalProps> = ({ asset, onClose }) => {
    const [chartData, setChartData] = useState(generateRandomData());

    // Effect to simulate live data updates every second
    useEffect(() => {
        const interval = setInterval(() => {
            setChartData(prevData => {
                const newData = [...prevData.slice(1)]; // Remove the oldest data point
                let lastY = newData[newData.length - 1] || 50;
                const y = lastY + (Math.random() * 10 - 5); // Add a new random data point
                newData.push(Math.max(10, Math.min(90, y))); // Clamp value
                return newData;
            });
        }, 1000);
        return () => clearInterval(interval); // Clean up on unmount
    }, []);

    const path = dataToPath(chartData);

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
            <div className="bg-white dark:bg-[#0f172a] rounded-[2.5rem] shadow-2xl w-full max-w-2xl border border-gray-200 dark:border-blue-900/20 overflow-hidden relative">
                <div className="spotlight-bg opacity-30" />
                
                <div className="flex justify-between items-center p-8 border-b border-gray-100 dark:border-blue-900/10 relative z-10">
                    <div className="flex items-center gap-4">
                        <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-2xl">
                            <AssetLogo asset={asset} size="md" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                                {asset.name}
                            </h2>
                            <p className="text-xs font-bold text-gray-500 dark:text-blue-400/60 uppercase tracking-widest">Real-time Market Data</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-xl text-gray-400 hover:text-gray-700 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-blue-900/30 transition-all">
                        <XMarkIcon className="w-7 h-7" />
                    </button>
                </div>

                <div className="p-8 relative z-10">
                    <div className="w-full h-72 bg-gray-50 dark:bg-black/40 rounded-[2rem] p-8 flex items-center justify-center border border-gray-100 dark:border-blue-900/20 relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <svg viewBox="0 0 300 100" className="w-full h-full relative z-10" preserveAspectRatio="none">
                            <defs>
                                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.2" />
                                    <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                                </linearGradient>
                            </defs>
                            <path
                                d={`${path} L 300 100 L 0 100 Z`}
                                fill="url(#chartGradient)"
                                className="transition-all duration-500"
                            />
                            <path
                                d={path}
                                fill="none"
                                stroke="#3b82f6"
                                strokeWidth="3"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="transition-all duration-500 drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]"
                            />
                        </svg>
                    </div>
                    
                    <div className="mt-8 grid grid-cols-2 gap-4">
                        <div className="p-6 bg-gray-50 dark:bg-black/20 rounded-3xl border border-gray-100 dark:border-blue-900/10">
                            <p className="text-xs font-bold text-gray-400 dark:text-blue-400/40 uppercase tracking-widest mb-1">Current Price</p>
                            <p className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">
                                {asset.price.toLocaleString('en-GB', { style: 'currency', currency: 'GBP' })}
                            </p>
                        </div>
                        <div className="p-6 bg-gray-50 dark:bg-black/20 rounded-3xl border border-gray-100 dark:border-blue-900/10">
                            <p className="text-xs font-bold text-gray-400 dark:text-blue-400/40 uppercase tracking-widest mb-1">24h Change</p>
                            <p className="text-2xl font-black text-blue-600 dark:text-blue-400 tracking-tight">
                                +1.25%
                            </p>
                        </div>
                    </div>
                </div>

                <div className="p-8 border-t border-gray-100 dark:border-blue-900/10 relative z-10">
                    <button onClick={onClose} className="w-full bg-gray-100 dark:bg-blue-900/20 hover:bg-gray-200 dark:hover:bg-blue-900/40 text-gray-900 dark:text-white font-bold py-4 rounded-2xl transition-all active:scale-95">
                        Done
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LiveChartModal;