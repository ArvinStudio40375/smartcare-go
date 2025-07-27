import React from 'react';
import { Bell, Wallet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface DashboardHeaderProps {
  userName: string;
  balance: number;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ userName, balance }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="card-gradient p-6 text-white mb-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-white/80 text-sm">Selamat datang,</p>
          <h2 className="text-xl font-bold">{userName}</h2>
        </div>
        <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
          <Bell className="h-5 w-5" />
        </Button>
      </div>

      {/* Balance Card */}
      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Wallet className="h-5 w-5 text-white/80" />
            <span className="text-white/80 text-sm">Saldo Anda</span>
          </div>
          <Badge variant="secondary" className="bg-white/20 text-white border-0">
            Aktif
          </Badge>
        </div>
        <div className="mt-2">
          <p className="text-2xl font-bold">{formatCurrency(balance)}</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;