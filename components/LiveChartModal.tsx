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
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl border border-gray-200 dark:border-gray-700">
                <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-4">
                        <AssetLogo asset={asset} size="md" />
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                            {asset.name} Live Chart
                        </h2>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
                        <XMarkIcon className="w-7 h-7" />
                    </button>
                </div>

                <div className="p-6">
                    <div className="w-full h-64 bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4 flex items-center justify-center">
                        <svg viewBox="0 0 300 100" className="w-full h-full" preserveAspectRatio="none">
                            <path
                                d={path}
                                fill="none"
                                stroke="#10B981"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                style={{ transition: 'd 0.5s linear' }}
                            />
                        </svg>
                    </div>
                    <div className="mt-4 text-center">
                        <p className="text-sm text-gray-500 dark:text-gray-400">Current Price</p>
                        <p className="text-3xl font-bold text-gray-900 dark:text-white">{asset.price.toLocaleString('en-GB', { style: 'currency', currency: 'GBP' })}</p>
                        <p className="text-sm text-emerald-600 dark:text-emerald-500 font-semibold">+1.25% (24h)</p>
                    </div>
                </div>

                <div className="bg-blue-50 dark:bg-gray-800/50 p-4 rounded-b-2xl flex justify-end">
                    <button onClick={onClose} className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-bold py-2 px-6 rounded-lg transition-colors">
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LiveChartModal;