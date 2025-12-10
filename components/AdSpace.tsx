import React from 'react';

interface AdSpaceProps {
  type: 'horizontal' | 'vertical';
  className?: string;
}

const AdSpace: React.FC<AdSpaceProps> = ({ type, className = '' }) => {
  const isHorizontal = type === 'horizontal';

  return (
    <div 
      className={`bg-gray-200 dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-700 flex items-center justify-center text-gray-400 text-xs font-bold uppercase tracking-widest relative overflow-hidden group ${
        isHorizontal ? 'w-full h-[90px] my-4' : 'w-[160px] h-[600px] hidden xl:flex'
      } ${className}`}
    >
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
      <span>Google Ad ({isHorizontal ? 'Horizontal' : 'Vertical'})</span>
    </div>
  );
};

export default AdSpace;