import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Add additional global styles for the app
const styleSheet = document.createElement("style");
styleSheet.textContent = `
  body {
    overflow-x: hidden;
    font-family: 'Inter', sans-serif;
    min-height: 100vh;
    /* Prevent pull-to-refresh on mobile */
    overscroll-behavior-y: none;
    /* Prevent iOS text auto-zoom */
    text-size-adjust: 100%;
    -webkit-text-size-adjust: 100%;
  }
  
  .glassmorphism {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.1);
  }
  
  .typing-indicator span {
    animation: blink 1.4s infinite both;
  }
  
  .typing-indicator span:nth-child(2) {
    animation-delay: 0.2s;
  }
  
  .typing-indicator span:nth-child(3) {
    animation-delay: 0.4s;
  }
  
  @keyframes blink {
    0% { opacity: 0.1; }
    20% { opacity: 1; }
    100% { opacity: 0.1; }
  }
  
  .emoji-slider::-webkit-slider-thumb {
    appearance: none;
    height: 30px;
    width: 30px;
    border-radius: 50%;
    background: var(--primary);
    cursor: pointer;
  }
  
  @keyframes blob {
    0% {
      transform: scale(1);
    }
    33% {
      transform: scale(1.1);
    }
    66% {
      transform: scale(0.9);
    }
    100% {
      transform: scale(1);
    }
  }
  
  .animate-blob {
    animation: blob 7s infinite;
  }
  
  .font-avatar {
    font-family: 'Quicksand', sans-serif;
  }

  /* Mobile-specific styles */
  @media (max-width: 640px) {
    /* Fix iOS 100vh issue */
    .mobile-full-height {
      height: 100vh;
      height: -webkit-fill-available;
    }
    
    /* Make buttons more tappable on mobile */
    button, a {
      min-height: 44px;
      min-width: 44px;
    }
    
    /* Increase modal z-index to ensure they appear above all elements */
    .fixed.inset-0.z-30 {
      z-index: 9999;
    }
  }
`;

document.head.appendChild(styleSheet);

// Fix mobile viewport height issues (iOS Safari 100vh problem)
function setMobileViewportHeight() {
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
}

// Initialize and add event listeners for mobile optimization
function initMobileOptimizations() {
  // Set initial viewport height
  setMobileViewportHeight();
  
  // Update on resize and orientation change
  window.addEventListener('resize', setMobileViewportHeight);
  window.addEventListener('orientationchange', setMobileViewportHeight);
  
  // Prevent pull-to-refresh gesture on mobile
  document.body.addEventListener('touchmove', function(e) {
    if (e.target === document.body) {
      e.preventDefault();
    }
  }, { passive: false });
  
  // Add PWA support (for future use as a progressive web app)
  window.addEventListener('beforeinstallprompt', (e) => {
    // For future PWA install prompt
    console.log('App can be installed as PWA');
  });
}

// Initialize mobile optimizations
initMobileOptimizations();

createRoot(document.getElementById("root")!).render(<App />);
