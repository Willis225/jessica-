import React from 'react';

const TradingChartPreview: React.FC = () => {
  // A simple, static SVG path representing a positive trend
  const chartPath = "M0 45 L15 30 L30 35 L45 20 L60 25 L75 10 L90 15 L100 5";

  return (
    <div className="w-28 h-10 mx-auto group">
      <svg viewBox="0 0 100 50" preserveAspectRatio="none" aria-hidden="true" className="overflow-visible">
        <defs>
          <linearGradient id="chartPreviewGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path
          d={`${chartPath} L100 50 L0 50 Z`}
          fill="url(#chartPreviewGradient)"
          className="transition-all duration-500 group-hover:opacity-100 opacity-50"
        />
        <path
          d={chartPath}
          fill="none"
          stroke="#3b82f6"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="transition-all duration-500 group-hover:stroke-blue-400 drop-shadow-[0_0_4px_rgba(59,130,246,0.3)]"
        />
      </svg>
    </div>
  );
};

export default TradingChartPreview;
