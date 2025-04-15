import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'light' | 'dark';
}

const Logo: React.FC<LogoProps> = ({ size = 'md', variant = 'light' }) => {
  // Size mapping
  const sizeMap = {
    sm: 'h-8',
    md: 'h-10',
    lg: 'h-14'
  };
  
  // Color mapping based on variant
  const colorClass = variant === 'light' ? 'text-white' : 'text-primary';
  
  return (
    <div className={`flex items-center ${sizeMap[size]}`}>
      {/* Logo icon - a stylized heart with emoji face */}
      <div className={`relative ${colorClass} mr-2`}>
        <div className="relative">
          {/* Heart shape */}
          <svg 
            viewBox="0 0 40 40" 
            fill="currentColor"
            className={sizeMap[size]}
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M20 10.8C18.4 8.6 15.3 7 12 7C6.5 7 2 11.5 2 17C2 25 9.5 31.5 20 37C30.5 31.5 38 25 38 17C38 11.5 33.5 7 28 7C24.7 7 21.6 8.6 20 10.8Z"
              className="fill-current"
            />
            
            {/* Add a gradient overlay to the heart */}
            <defs>
              <linearGradient id="heartGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#9C27B0" stopOpacity="0.7" />
                <stop offset="100%" stopColor="#FF9800" stopOpacity="0.7" />
              </linearGradient>
            </defs>
            <path
              d="M20 10.8C18.4 8.6 15.3 7 12 7C6.5 7 2 11.5 2 17C2 25 9.5 31.5 20 37C30.5 31.5 38 25 38 17C38 11.5 33.5 7 28 7C24.7 7 21.6 8.6 20 10.8Z"
              fill="url(#heartGradient)"
            />
            
            {/* Add facial features */}
            {/* Eyes */}
            <circle cx="14" cy="18" r="2" fill="white" />
            <circle cx="26" cy="18" r="2" fill="white" />
            
            {/* Smile */}
            <path
              d="M14 25C16 28 24 28 26 25"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              fill="none"
            />
          </svg>
        </div>
      </div>
      
      {/* Text part of the logo */}
      <div className={`font-bold ${colorClass}`}>
        <span className="text-2xl font-extrabold">MeMu</span>
        <span className="text-xl ml-1 opacity-90">AI</span>
      </div>
    </div>
  );
};

export default Logo;