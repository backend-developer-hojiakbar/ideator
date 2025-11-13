import React from 'react';

interface AtmScreenProps {
  children: React.ReactNode;
}

export const AtmScreen: React.FC<AtmScreenProps> = ({ children }) => {
  return (
    <div className="w-full max-w-lg md:max-w-xl lg:max-w-2xl p-2 transform-gpu transition-all duration-500 glass-panel">
      <div className="w-full h-full bg-white/70 dark:bg-gray-900/70 rounded-lg p-6 md:p-8 relative overflow-hidden">
        {/* Screen glare effect */}
        <div className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-br from-white/20 to-transparent to-50% pointer-events-none rounded-lg"></div>
        {children}
      </div>
    </div>
  );
};