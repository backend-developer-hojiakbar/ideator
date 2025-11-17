import React from 'react';

interface AtmScreenProps {
  children: React.ReactNode;
}

export const AtmScreen: React.FC<AtmScreenProps> = ({ children }) => {
  return (
    <div className="w-full max-w-lg md:max-w-xl lg:max-w-2xl p-2 transform-gpu transition-all duration-500 glass-panel">
      <div className="w-full h-full rounded-lg p-6 md:p-8 relative overflow-hidden glass-panel">
        {children}
      </div>
    </div>
  );
};