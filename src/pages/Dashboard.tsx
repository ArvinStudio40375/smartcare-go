import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MobileLayout from '@/components/layout/MobileLayout';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import ServiceCard from '@/components/dashboard/ServiceCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Stethoscope, 
  Syringe, 
  Heart, 
  Activity,
  Clock,
  MapPin
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface User {
  id: string;
  nama_lengkap: string;
  email: string;
  alamat: string;
  no_hp: string;
  saldo: number;
}

interface Order {
  id: string;
  deskripsi: string;
  status: string;
  waktu_pesan: string;
  alamat: string;
  tarif: number;
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load user data from localStorage
    const userData = localStorage.getItem('smartcare_user');
    if (userData) {
      setUser(JSON.parse(userData));
      loadRecentOrders(JSON.parse(userData).id);
    } else {
      navigate('/auth');
    }
  }, [navigate]);

  const loadRecentOrders = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('pesanan')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(3);

      if (error) throw error;
      setRecentOrders(data || []);
    } catch (error) {
      console.error('Error loading recent orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (tab: string) => {
    navigate(`/${tab}`);
  };

  const handleServiceSelect = (service: string) => {
    navigate('/pesanan', { state: { selectedService: service } });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'menunggu':
        return <Badge className="status-pending">Menunggu</Badge>;
      case 'diterima':
        return <Badge className="status-progress">Diterima</Badge>;
      case 'diproses':
        return <Badge className="status-progress">Diproses</Badge>;
      case 'selesai':
        return <Badge className="status-completed">Selesai</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!user) {
    return null;
  }

  return (
    <MobileLayout activeTab="dashboard" onTabChange={handleTabChange}>
      {/* Dashboard Header */}
      <DashboardHeader userName={user.nama_lengkap} balance={user.saldo} />

      {/* Quick Services */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-4">Layanan Kesehatan</h3>
        <div className="space-y-3">
          <ServiceCard
            icon={Stethoscope}
            title="Pemeriksaan Umum"
            description="Pemeriksaan kesehatan komprehensif di rumah"
            onClick={() => handleServiceSelect('Pemeriksaan Umum')}
            gradient={true}
          />
          
          <ServiceCard
            icon={Syringe}
            title="Layanan Suntik"
            description="Layanan suntik vitamin dan imunisasi"
            onClick={() => handleServiceSelect('Layanan Suntik')}
          />
          
          <ServiceCard
            icon={Heart}
            title="Perawatan Jantung"
            description="Pemeriksaan dan monitoring kesehatan jantung"
            onClick={() => handleServiceSelect('Perawatan Jantung')}
          />
          
          <ServiceCard
            icon={Activity}
            title="Fisioterapi"
            description="Terapi fisik dan rehabilitasi di rumah"
            onClick={() => handleServiceSelect('Fisioterapi')}
          />
        </div>
      </div>

      {/* Recent Orders */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Pesanan Terbaru</h3>
          {recentOrders.length > 0 && (
            <button 
              onClick={() => navigate('/riwayat')}
              className="text-primary text-sm font-medium"
            >
              Lihat Semua
            </button>
          )}
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="card-surface p-4 animate-pulse">
                <div className="h-4 bg-muted rounded mb-2"></div>
                <div className="h-3 bg-muted rounded w-3/4"></div>
              </div>
            ))}
          </div>
        ) : recentOrders.length > 0 ? (
          <div className="space-y-3">
            {recentOrders.map((order) => (
              <Card key={order.id} className="card-surface">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium">{order.deskripsi.split(' - ')[0] || order.deskripsi}</h4>
                    {getStatusBadge(order.status)}
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground space-x-4">
                    <div className="flex items-center space-x-1">
                      <Clock className="h-3 w-3" />
                      <span>{formatDate(order.waktu_pesan)}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-3 w-3" />
                      <span className="truncate">{order.alamat}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="card-surface">
            <CardContent className="p-6 text-center">
              <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">Belum ada pesanan</p>
              <p className="text-sm text-muted-foreground mt-1">
                Mulai pesan layanan kesehatan untuk kebutuhan Anda
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Emergency Contact */}
      <Card className="bg-destructive/5 border-destructive/20">
        <CardHeader className="pb-3">
          <CardTitle className="text-destructive text-sm">Layanan Darurat</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <p className="text-sm text-muted-foreground mb-3">
            Untuk situasi darurat medis, hubungi:
          </p>
          <div className="flex space-x-2">
            <a 
              href="tel:119" 
              className="flex-1 bg-destructive text-destructive-foreground text-center py-2 px-4 rounded-lg text-sm font-medium"
            >
              Ambulans 119
            </a>
            <a 
              href="tel:112" 
              className="flex-1 bg-destructive text-destructive-foreground text-center py-2 px-4 rounded-lg text-sm font-medium"
            >
              Darurat 112
            </a>
          </div>
        </CardContent>
      </Card>
    </MobileLayout>
  );
};

export default Dashboard;