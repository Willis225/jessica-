import React from 'react';

const TradingChartPreview: React.FC = () => {
  // A simple, static SVG path representing a positive trend
  const chartPath = "M0 45 L15 30 L30 35 L45 20 L60 25 L75 10 L90 15 L100 5";

  return (
    <div className="w-28 h-10 mx-auto">
      <svg viewBox="0 0 100 50" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style={{ stopColor: 'rgba(16, 185, 129, 0.4)' }} />
            <stop offset="100%" style={{ stopColor: 'rgba(16, 185, 129, 0)' }} />
          </linearGradient>
        </defs>
        <path
          d={`${chartPath} L100 50 L0 50 Z`}
          fill="url(#chartGradient)"
        />
        <path
          d={chartPath}
          fill="none"
          stroke="#10B981"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};

export default TradingChartPreview;
