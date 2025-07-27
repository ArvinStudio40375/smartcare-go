import React from 'react';
import { Home, Clock, CreditCard, User } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MobileLayoutProps {
  children: React.ReactNode;
  activeTab?: 'dashboard' | 'riwayat' | 'topup' | 'akun';
  onTabChange?: (tab: string) => void;
  showBottomNav?: boolean;
  title?: string;
}

const MobileLayout: React.FC<MobileLayoutProps> = ({ 
  children, 
  activeTab = 'dashboard', 
  onTabChange, 
  showBottomNav = true,
  title 
}) => {
  const tabs = [
    { id: 'dashboard', icon: Home, label: 'Beranda' },
    { id: 'riwayat', icon: Clock, label: 'Riwayat' },
    { id: 'topup', icon: CreditCard, label: 'Top Up' },
    { id: 'akun', icon: User, label: 'Akun' },
  ];

  return (
    <div className="mobile-container">
      {/* Header */}
      {title && (
        <div className="mobile-header">
          <h1 className="text-lg font-semibold text-center">{title}</h1>
        </div>
      )}

      {/* Content */}
      <div className={`mobile-content ${showBottomNav ? 'pb-20' : ''}`}>
        {children}
      </div>

      {/* Bottom Navigation */}
      {showBottomNav && (
        <div className="mobile-bottom-nav">
          <div className="flex items-center justify-around py-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              
              return (
                <Button
                  key={tab.id}
                  variant="ghost"
                  size="sm"
                  onClick={() => onTabChange?.(tab.id)}
                  className={`flex flex-col items-center space-y-1 p-2 min-w-0 ${
                    isActive 
                      ? 'text-primary' 
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Icon className={`h-5 w-5 ${isActive ? 'text-primary' : ''}`} />
                  <span className="text-xs font-medium">{tab.label}</span>
                </Button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileLayout;