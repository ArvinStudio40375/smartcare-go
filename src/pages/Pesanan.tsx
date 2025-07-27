import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import MobileLayout from '@/components/layout/MobileLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, MapPin, CreditCard, Banknote, CheckCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface User {
  id: string;
  nama_lengkap: string;
  alamat: string;
  saldo: number;
}

const Pesanan: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  
  const [user, setUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    nama_layanan: '',
    alamat_layanan: '',
    catatan: '',
    total_harga: '',
    metode_pembayaran: 'Cash',
    tanggal: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Load user data
    const userData = localStorage.getItem('smartcare_user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      
      // Pre-fill alamat with user's address
      setFormData(prev => ({
        ...prev,
        alamat_layanan: parsedUser.alamat
      }));
    } else {
      navigate('/auth');
    }

    // Pre-fill service if selected from dashboard
    const selectedService = location.state?.selectedService;
    if (selectedService) {
      setFormData(prev => ({
        ...prev,
        nama_layanan: selectedService
      }));
    }

    // Set default tanggal to today
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const formattedDate = tomorrow.toISOString().slice(0, 16);
    setFormData(prev => ({
      ...prev,
      tanggal: formattedDate
    }));
  }, [navigate, location]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
    setError('');
  };

  const handlePaymentMethodChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      metode_pembayaran: value
    }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Validation
      if (!formData.nama_layanan || !formData.alamat_layanan || !formData.total_harga || !formData.tanggal) {
        throw new Error('Semua field yang diperlukan harus diisi');
      }

      const totalHarga = parseInt(formData.total_harga);
      if (isNaN(totalHarga) || totalHarga <= 0) {
        throw new Error('Total harga harus berupa angka yang valid');
      }

      // Check balance if using saldo
      if (formData.metode_pembayaran === 'Saldo' && user && user.saldo < totalHarga) {
        throw new Error('Saldo tidak mencukupi. Silakan top up terlebih dahulu.');
      }

      // Insert pesanan
      const { error } = await supabase
        .from('pesanan_smartcare')
        .insert([{
          user_id: user?.id,
          nama_layanan: formData.nama_layanan,
          alamat_layanan: formData.alamat_layanan,
          catatan: formData.catatan || null,
          total_harga: totalHarga,
          metode_pembayaran: formData.metode_pembayaran,
          tanggal: formData.tanggal,
          status: 'Menunggu'
        }]);

      if (error) throw error;

      toast({
        title: "Pesanan Berhasil Dibuat!",
        description: "Pesanan Anda sedang menunggu konfirmasi dari mitra.",
      });

      // Redirect to dashboard
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan saat membuat pesanan');
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

  if (!user) {
    return null;
  }

  return (
    <MobileLayout showBottomNav={false}>
      {/* Header */}
      <div className="flex items-center space-x-3 mb-6">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => navigate('/dashboard')}
          className="p-2"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-bold">Buat Pesanan</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Service Details */}
        <Card className="card-surface">
          <CardHeader>
            <CardTitle className="text-lg">Detail Layanan</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nama_layanan">Nama Layanan *</Label>
              <Input
                id="nama_layanan"
                name="nama_layanan"
                type="text"
                placeholder="Contoh: Pemeriksaan Umum, Suntik Vitamin"
                value={formData.nama_layanan}
                onChange={handleInputChange}
                className="input-primary"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tanggal">Tanggal & Waktu Layanan *</Label>
              <Input
                id="tanggal"
                name="tanggal"
                type="datetime-local"
                value={formData.tanggal}
                onChange={handleInputChange}
                className="input-primary"
                required
                min={new Date().toISOString().slice(0, 16)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="alamat_layanan">Alamat Layanan *</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Textarea
                  id="alamat_layanan"
                  name="alamat_layanan"
                  placeholder="Masukkan alamat lengkap tempat layanan"
                  value={formData.alamat_layanan}
                  onChange={handleInputChange}
                  className="pl-10 min-h-[80px]"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="catatan">Catatan Tambahan</Label>
              <Textarea
                id="catatan"
                name="catatan"
                placeholder="Jelaskan keluhan atau kebutuhan khusus..."
                value={formData.catatan}
                onChange={handleInputChange}
                className="min-h-[100px]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="total_harga">Total Harga (Rp) *</Label>
              <Input
                id="total_harga"
                name="total_harga"
                type="number"
                placeholder="150000"
                value={formData.total_harga}
                onChange={handleInputChange}
                className="input-primary"
                min="1"
                required
              />
            </div>
          </CardContent>
        </Card>

        {/* Payment Method */}
        <Card className="card-surface">
          <CardHeader>
            <CardTitle className="text-lg">Metode Pembayaran</CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup 
              value={formData.metode_pembayaran} 
              onValueChange={handlePaymentMethodChange}
              className="space-y-3"
            >
              <div className="flex items-center space-x-3 p-3 border border-border rounded-lg">
                <RadioGroupItem value="Cash" id="cash" />
                <div className="flex items-center space-x-3 flex-1">
                  <Banknote className="h-5 w-5 text-green-600" />
                  <div>
                    <Label htmlFor="cash" className="font-medium">Cash</Label>
                    <p className="text-sm text-muted-foreground">Bayar tunai kepada mitra</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 border border-border rounded-lg">
                <RadioGroupItem value="Saldo" id="saldo" />
                <div className="flex items-center space-x-3 flex-1">
                  <CreditCard className="h-5 w-5 text-primary" />
                  <div className="flex-1">
                    <Label htmlFor="saldo" className="font-medium">Saldo SmartCare</Label>
                    <p className="text-sm text-muted-foreground">
                      Tersedia: {formatCurrency(user.saldo)}
                    </p>
                  </div>
                </div>
              </div>
            </RadioGroup>

            {/* Balance Warning */}
            {formData.metode_pembayaran === 'Saldo' && formData.total_harga && 
             parseInt(formData.total_harga) > user.saldo && (
              <Alert className="mt-4 border-warning bg-warning/5">
                <AlertDescription className="text-warning">
                  Saldo tidak mencukupi. Anda memerlukan {formatCurrency(parseInt(formData.total_harga) - user.saldo)} lagi.
                  <Button 
                    variant="link" 
                    className="p-0 h-auto text-warning underline ml-1"
                    onClick={() => navigate('/topup')}
                  >
                    Top up sekarang
                  </Button>
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Summary */}
        {formData.total_harga && (
          <Card className="card-surface bg-muted/30">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <span className="font-medium">Total Pembayaran:</span>
                <span className="text-lg font-bold text-primary">
                  {formatCurrency(parseInt(formData.total_harga) || 0)}
                </span>
              </div>
            </CardContent>
          </Card>
        )}

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Submit Button */}
        <div className="space-y-3">
          <Button 
            type="submit" 
            className="w-full btn-primary"
            disabled={loading || (formData.metode_pembayaran === 'Saldo' && formData.total_harga && parseInt(formData.total_harga) > user.saldo)}
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Membuat Pesanan...
              </>
            ) : (
              <>
                <CheckCircle className="mr-2 h-4 w-4" />
                Buat Pesanan
              </>
            )}
          </Button>

          <Button 
            type="button" 
            variant="outline" 
            className="w-full"
            onClick={() => navigate('/dashboard')}
          >
            Batal
          </Button>
        </div>
      </form>
    </MobileLayout>
  );
};

export default Pesanan;