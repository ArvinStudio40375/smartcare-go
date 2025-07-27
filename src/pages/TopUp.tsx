import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MobileLayout from '@/components/layout/MobileLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { 
  Wallet, 
  Upload, 
  CreditCard, 
  CheckCircle, 
  Clock,
  AlertCircle,
  Plus
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface User {
  id: string;
  nama_lengkap: string;
  no_hp: string;
  saldo: number;
}

interface TopUpHistory {
  id: string;
  nominal: number;
  status: string;
  created_at: string;
  wa: string;
}

const TopUp: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [user, setUser] = useState<User | null>(null);
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [topUpHistory, setTopUpHistory] = useState<TopUpHistory[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(true);

  const quickAmounts = [50000, 100000, 200000, 500000];

  useEffect(() => {
    // Load user data
    const userData = localStorage.getItem('smartcare_user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      loadTopUpHistory(parsedUser.id);
    } else {
      navigate('/auth');
    }
  }, [navigate]);

  const loadTopUpHistory = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('topup')
        .select('*')
        .eq('mitra_id', userId) // Using mitra_id column for user_id
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;
      setTopUpHistory(data || []);
    } catch (error) {
      console.error('Error loading top up history:', error);
    } finally {
      setLoadingHistory(false);
    }
  };

  const handleTabChange = (tab: string) => {
    navigate(`/${tab}`);
  };

  const handleQuickAmount = (value: number) => {
    setAmount(value.toString());
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const topUpAmount = parseInt(amount);
      
      if (isNaN(topUpAmount) || topUpAmount < 10000) {
        throw new Error('Minimum top up adalah Rp 10.000');
      }

      if (topUpAmount > 10000000) {
        throw new Error('Maximum top up adalah Rp 10.000.000');
      }

      // Insert top up request
      const { error } = await supabase
        .from('topup')
        .insert([{
          mitra_id: user?.id, // Using mitra_id column for user_id
          nominal: topUpAmount,
          wa: user?.no_hp || '',
          status: 'menunggu'
        }]);

      if (error) throw error;

      toast({
        title: "Permintaan Top Up Berhasil!",
        description: "Tim kami akan memproses permintaan Anda dalam 1x24 jam.",
      });

      // Reset form and reload history
      setAmount('');
      if (user) {
        loadTopUpHistory(user.id);
      }
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan saat memproses top up');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'menunggu':
        return <Badge className="status-pending">Menunggu</Badge>;
      case 'dikonfirmasi':
        return <Badge className="status-completed">Berhasil</Badge>;
      case 'ditolak':
        return <Badge variant="destructive">Ditolak</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (!user) {
    return null;
  }

  return (
    <MobileLayout activeTab="topup" onTabChange={handleTabChange} title="Top Up Saldo">
      {/* Current Balance */}
      <Card className="card-gradient text-white mb-6">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Wallet className="h-6 w-6" />
              <span className="text-white/80">Saldo Saat Ini</span>
            </div>
            <CreditCard className="h-6 w-6 text-white/60" />
          </div>
          <div className="text-3xl font-bold mb-2">
            {formatCurrency(user.saldo)}
          </div>
          <p className="text-white/80 text-sm">
            a.n. {user.nama_lengkap}
          </p>
        </CardContent>
      </Card>

      {/* Top Up Form */}
      <Card className="card-surface mb-6">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Plus className="h-5 w-5" />
            <span>Top Up Saldo</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Quick Amount Buttons */}
            <div>
              <Label className="text-sm font-medium mb-3 block">Pilih Nominal Cepat</Label>
              <div className="grid grid-cols-2 gap-2">
                {quickAmounts.map((quickAmount) => (
                  <Button
                    key={quickAmount}
                    type="button"
                    variant={amount === quickAmount.toString() ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleQuickAmount(quickAmount)}
                    className="text-sm"
                  >
                    {formatCurrency(quickAmount)}
                  </Button>
                ))}
              </div>
            </div>

            {/* Custom Amount Input */}
            <div className="space-y-2">
              <Label htmlFor="amount">Atau Masukkan Nominal</Label>
              <Input
                id="amount"
                type="number"
                placeholder="Minimum Rp 10.000"
                value={amount}
                onChange={(e) => {
                  setAmount(e.target.value);
                  setError('');
                }}
                className="input-primary"
                min="10000"
                max="10000000"
              />
              <p className="text-xs text-muted-foreground">
                Minimum: Rp 10.000 | Maximum: Rp 10.000.000
              </p>
            </div>

            {/* Payment Instructions */}
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-sm">
                <strong>Cara Top Up:</strong><br />
                1. Klik "Ajukan Top Up" di bawah<br />
                2. Transfer ke rekening yang akan diberikan tim kami<br />
                3. Kirim bukti transfer via WhatsApp<br />
                4. Saldo akan ditambahkan dalam 1x24 jam
              </AlertDescription>
            </Alert>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button 
              type="submit" 
              className="w-full btn-primary"
              disabled={loading || !amount || parseInt(amount) < 10000}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Memproses...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Ajukan Top Up {amount ? formatCurrency(parseInt(amount)) : ''}
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Top Up History */}
      <Card className="card-surface">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock className="h-5 w-5" />
            <span>Riwayat Top Up</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loadingHistory ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex justify-between items-center p-3 border border-border rounded-lg animate-pulse">
                  <div>
                    <div className="h-4 bg-muted rounded w-20 mb-1"></div>
                    <div className="h-3 bg-muted rounded w-16"></div>
                  </div>
                  <div className="h-6 bg-muted rounded w-16"></div>
                </div>
              ))}
            </div>
          ) : topUpHistory.length > 0 ? (
            <div className="space-y-3">
              {topUpHistory.map((topup) => (
                <div 
                  key={topup.id} 
                  className="flex justify-between items-center p-3 border border-border rounded-lg"
                >
                  <div>
                    <p className="font-medium">{formatCurrency(topup.nominal)}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(topup.created_at)}
                    </p>
                  </div>
                  {getStatusBadge(topup.status)}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <CheckCircle className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">Belum ada riwayat top up</p>
              <p className="text-sm text-muted-foreground mt-1">
                Top up pertama Anda akan muncul di sini
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </MobileLayout>
  );
};

export default TopUp;