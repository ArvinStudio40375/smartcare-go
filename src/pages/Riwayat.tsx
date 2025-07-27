import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MobileLayout from '@/components/layout/MobileLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  Clock, 
  MapPin, 
  User, 
  CreditCard, 
  Calendar,
  Activity,
  Receipt
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface Order {
  id: string;
  deskripsi: string;
  alamat: string;
  tarif: number;
  status: string;
  waktu_pesan: string;
  waktu_mulai?: string;
  waktu_selesai?: string;
  created_at: string;
  mitra_id?: string;
}

interface User {
  id: string;
  nama_lengkap: string;
}

const Riwayat: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'menunggu' | 'diterima' | 'diproses' | 'selesai'>('all');

  useEffect(() => {
    // Load user data
    const userData = localStorage.getItem('smartcare_user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      loadOrders(parsedUser.id);
    } else {
      navigate('/auth');
    }
  }, [navigate]);

  const loadOrders = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('pesanan')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (tab: string) => {
    navigate(`/${tab}`);
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
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatShortDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short'
    });
  };

  const filteredOrders = filter === 'all' 
    ? orders 
    : orders.filter(order => order.status === filter);

  const filters = [
    { key: 'all', label: 'Semua', count: orders.length },
    { key: 'menunggu', label: 'Menunggu', count: orders.filter(o => o.status === 'menunggu').length },
    { key: 'diterima', label: 'Diterima', count: orders.filter(o => o.status === 'diterima').length },
    { key: 'diproses', label: 'Diproses', count: orders.filter(o => o.status === 'diproses').length },
    { key: 'selesai', label: 'Selesai', count: orders.filter(o => o.status === 'selesai').length },
  ];

  if (!user) {
    return null;
  }

  return (
    <MobileLayout activeTab="riwayat" onTabChange={handleTabChange} title="Riwayat Pesanan">
      {/* Filter Tabs */}
      <div className="flex space-x-2 mb-6 overflow-x-auto pb-2">
        {filters.map((filterItem) => (
          <Button
            key={filterItem.key}
            variant={filter === filterItem.key ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter(filterItem.key as any)}
            className={`whitespace-nowrap ${
              filter === filterItem.key 
                ? 'bg-primary text-primary-foreground' 
                : 'border-border'
            }`}
          >
            {filterItem.label} ({filterItem.count})
          </Button>
        ))}
      </div>

      {/* Orders List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="card-surface animate-pulse">
              <CardContent className="p-4">
                <div className="h-4 bg-muted rounded mb-2"></div>
                <div className="h-3 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredOrders.length > 0 ? (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <Card 
              key={order.id} 
              className="card-surface cursor-pointer hover:shadow-md transition-all duration-200"
              onClick={() => setSelectedOrder(order)}
            >
              <CardContent className="p-4">
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground mb-1">
                      {order.deskripsi.split(' - ')[0] || order.deskripsi}
                    </h3>
                    <p className="text-lg font-bold text-primary">
                      {formatCurrency(order.tarif)}
                    </p>
                  </div>
                  {getStatusBadge(order.status)}
                </div>

                {/* Details */}
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-3 w-3" />
                    <span>{formatShortDate(order.waktu_pesan)}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-3 w-3" />
                    <span className="truncate">{order.alamat}</span>
                  </div>
                </div>

                {/* Click indicator */}
                <div className="mt-3 pt-3 border-t border-border">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Dibuat {formatShortDate(order.created_at)}</span>
                    <span className="text-primary">Tap untuk detail →</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="card-surface">
          <CardContent className="p-8 text-center">
            <Activity className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              {filter === 'all' ? 'Belum Ada Pesanan' : `Belum Ada Pesanan ${filter}`}
            </h3>
            <p className="text-muted-foreground mb-4">
              {filter === 'all' 
                ? 'Mulai pesan layanan kesehatan untuk melihat riwayat di sini'
                : `Tidak ada pesanan dengan status ${filter.toLowerCase()}`
              }
            </p>
            {filter === 'all' && (
              <Button 
                onClick={() => navigate('/pesanan')}
                className="btn-primary"
              >
                Buat Pesanan Pertama
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Invoice/Detail Modal */}
      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Receipt className="h-5 w-5" />
              <span>Detail Pesanan</span>
            </DialogTitle>
          </DialogHeader>

          {selectedOrder && (
            <div className="space-y-4">
              {/* Status */}
              <div className="text-center">
                {getStatusBadge(selectedOrder.status)}
              </div>

              {/* Service Info */}
              <div className="bg-muted/30 rounded-lg p-4">
                <h3 className="font-semibold text-lg mb-2">
                  {selectedOrder.deskripsi.split(' - ')[0] || selectedOrder.deskripsi}
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tarif:</span>
                    <span className="font-semibold">{formatCurrency(selectedOrder.tarif)}</span>
                  </div>
                </div>
              </div>

              {/* Details */}
              <div className="space-y-3">
                <div>
                  <div className="flex items-center space-x-2 text-muted-foreground mb-1">
                    <Activity className="h-4 w-4" />
                    <span className="text-sm">Deskripsi Lengkap</span>
                  </div>
                  <p className="text-sm">{selectedOrder.deskripsi}</p>
                </div>

                <div>
                  <div className="flex items-center space-x-2 text-muted-foreground mb-1">
                    <MapPin className="h-4 w-4" />
                    <span className="text-sm">Alamat Layanan</span>
                  </div>
                  <p className="text-sm">{selectedOrder.alamat}</p>
                </div>

                <div>
                  <div className="flex items-center space-x-2 text-muted-foreground mb-1">
                    <Clock className="h-4 w-4" />
                    <span className="text-sm">Tanggal Pesanan</span>
                  </div>
                  <p className="text-sm">{formatDate(selectedOrder.created_at)}</p>
                </div>

                {selectedOrder.waktu_mulai && (
                  <div>
                    <div className="flex items-center space-x-2 text-muted-foreground mb-1">
                      <Calendar className="h-4 w-4" />
                      <span className="text-sm">Waktu Mulai</span>
                    </div>
                    <p className="text-sm">{formatDate(selectedOrder.waktu_mulai)}</p>
                  </div>
                )}

                {selectedOrder.waktu_selesai && (
                  <div>
                    <div className="flex items-center space-x-2 text-muted-foreground mb-1">
                      <Calendar className="h-4 w-4" />
                      <span className="text-sm">Waktu Selesai</span>
                    </div>
                    <p className="text-sm">{formatDate(selectedOrder.waktu_selesai)}</p>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-4">
                {selectedOrder.status === 'menunggu' && (
                  <Button variant="outline" className="w-full" size="sm">
                    Hubungi Customer Service
                  </Button>
                )}
                
                {selectedOrder.status === 'selesai' && (
                  <Button 
                    className="w-full btn-primary" 
                    size="sm"
                    onClick={() => {
                      navigate('/pesanan', { 
                        state: { 
                          selectedService: selectedOrder.deskripsi.split(' - ')[0] 
                        } 
                      });
                      setSelectedOrder(null);
                    }}
                  >
                    Pesan Lagi
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </MobileLayout>
  );
};

export default Riwayat;