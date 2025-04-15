import React from 'react';
import { Link, useLocation } from 'wouter';

interface NavigationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const NavigationDrawer: React.FC<NavigationDrawerProps> = ({
  isOpen,
  onClose
}) => {
  const [location] = useLocation();
  
  return (
    <div 
      className={`fixed top-0 left-0 h-full w-64 glassmorphism transform transition-transform duration-300 z-20 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
    >
      <div className="p-4 border-b border-white/10 flex justify-between items-center">
        <h2 className="text-lg font-semibold">Menu</h2>
        <button 
          className="p-2 rounded-full hover:bg-white/10 transition-colors"
          onClick={onClose}
        >
          <i className="fas fa-times"></i>
        </button>
      </div>
      <nav className="p-2">
        <ul>
          <li>
            <Link href="/">
              <a 
                className={`flex items-center p-3 rounded-lg ${location === '/' ? 'bg-white/20' : 'hover:bg-white/10'} transition-colors`}
                onClick={onClose}
              >
                <i className="fas fa-home w-6"></i>
                <span>Home</span>
              </a>
            </Link>
          </li>
          <li>
            <Link href="/tutor">
              <a 
                className={`flex items-center p-3 rounded-lg ${location === '/tutor' ? 'bg-white/20' : 'hover:bg-white/10'} transition-colors`}
                onClick={onClose}
              >
                <i className="fas fa-brain w-6"></i>
                <span>AI Tutor</span>
              </a>
            </Link>
          </li>
          <li>
            <Link href="/safety">
              <a 
                className={`flex items-center p-3 rounded-lg ${location === '/safety' ? 'bg-white/20' : 'hover:bg-white/10'} transition-colors`}
                onClick={onClose}
              >
                <i className="fas fa-shield-alt w-6"></i>
                <span>Safety Features</span>
              </a>
            </Link>
          </li>
          <li>
            <Link href="/history">
              <a 
                className={`flex items-center p-3 rounded-lg ${location === '/history' ? 'bg-white/20' : 'hover:bg-white/10'} transition-colors`}
                onClick={onClose}
              >
                <i className="fas fa-history w-6"></i>
                <span>Chat History</span>
              </a>
            </Link>
          </li>
          <li>
            <Link href="/about">
              <a 
                className={`flex items-center p-3 rounded-lg ${location === '/about' ? 'bg-white/20' : 'hover:bg-white/10'} transition-colors`}
                onClick={onClose}
              >
                <i className="fas fa-info-circle w-6"></i>
                <span>About</span>
              </a>
            </Link>
          </li>
        </ul>
      </nav>
      <div className="absolute bottom-4 left-0 right-0 p-4">
        <button className="w-full p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors">
          <i className="fas fa-sign-out-alt mr-2"></i> Log Out
        </button>
      </div>
    </div>
  );
};

export default NavigationDrawer;
