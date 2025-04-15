import React, { useState } from 'react';
import { useLocation, Link } from 'wouter';

interface HeaderProps {
  onMenuClick: () => void;
  onProfileClick: () => void;
  onSettingsClick: () => void;
}

const Header: React.FC<HeaderProps> = ({
  onMenuClick,
  onProfileClick,
  onSettingsClick
}) => {
  const [location] = useLocation();
  
  // Get title based on current route
  const getTitle = () => {
    switch (location) {
      case '/about':
        return 'About MeMu AI';
      case '/safety':
        return 'Safety Features';
      default:
        return 'MeMu AI';
    }
  };
  
  return (
    <header className="glassmorphism flex items-center justify-between p-4 z-10">
      <div className="flex items-center">
        <button 
          id="menu-btn" 
          className="p-2 rounded-full hover:bg-white/10 transition-colors"
          aria-label="Menu"
          onClick={onMenuClick}
        >
          <i className="fas fa-bars"></i>
        </button>
        <h1 className="ml-3 text-xl font-bold">{getTitle()}</h1>
      </div>
      <div className="flex items-center">
        <button 
          id="profile-btn" 
          className="p-2 rounded-full hover:bg-white/10 transition-colors"
          aria-label="Profile"
          onClick={onProfileClick}
        >
          <i className="fas fa-user"></i>
        </button>
        <button 
          id="settings-btn" 
          className="ml-2 p-2 rounded-full hover:bg-white/10 transition-colors"
          aria-label="Settings"
          onClick={onSettingsClick}
        >
          <i className="fas fa-cog"></i>
        </button>
      </div>
    </header>
  );
};

export default Header;
