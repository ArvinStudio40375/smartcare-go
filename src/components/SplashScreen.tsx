import React, { useEffect, useState } from 'react';
import { Heart, Stethoscope } from 'lucide-react';

interface SplashScreenProps {
  onComplete: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onComplete, 300);
    }, 2500);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className={`mobile-container fixed inset-0 z-50 flex flex-col items-center justify-center transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
         style={{ background: 'var(--gradient-primary)' }}>
      
      {/* Logo Animation */}
      <div className="bounce-in mb-8">
        <div className="relative">
          <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
            <Stethoscope className="w-10 h-10 text-white" />
          </div>
          <div className="absolute -top-2 -right-2">
            <Heart className="w-6 h-6 text-white animate-pulse" fill="currentColor" />
          </div>
        </div>
      </div>

      {/* App Name */}
      <div className="text-center fade-in">
        <h1 className="text-3xl font-bold text-white mb-2">SmartCare</h1>
        <p className="text-white/80 text-sm font-medium">Layanan Kesehatan Terpercaya</p>
      </div>

      {/* Loading Animation */}
      <div className="mt-12">
        <div className="flex space-x-1">
          {[0, 1, 2].map((i) => (
            <div 
              key={i}
              className="w-2 h-2 bg-white/60 rounded-full animate-pulse"
              style={{ animationDelay: `${i * 0.2}s` }}
            />
          ))}
        </div>
      </div>

      {/* Version */}
      <div className="absolute bottom-8 text-white/60 text-xs">
        Version 1.0.0
      </div>
    </div>
  );
};

export default SplashScreen;