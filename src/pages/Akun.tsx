import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MobileLayout from '@/components/layout/MobileLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Edit3, 
  Save, 
  X, 
  LogOut,
  Shield,
  HelpCircle,
  Info
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface UserData {
  id: string;
  nama_lengkap: string;
  email: string;
  alamat: string;
  no_hp: string;
  saldo: number;
  created_at: string;
}

const Akun: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [user, setUser] = useState<UserData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    nama_lengkap: '',
    email: '',
    alamat: '',
    no_hp: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Load user data
    const userData = localStorage.getItem('smartcare_user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      setFormData({
        nama_lengkap: parsedUser.nama_lengkap,
        email: parsedUser.email,
        alamat: parsedUser.alamat,
        no_hp: parsedUser.no_hp
      });
    } else {
      navigate('/auth');
    }
  }, [navigate]);

  const handleTabChange = (tab: string) => {
    navigate(`/${tab}`);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
    setError('');
  };

  const handleEdit = () => {
    setIsEditing(true);
    setError('');
  };

  const handleCancel = () => {
    if (user) {
      setFormData({
        nama_lengkap: user.nama_lengkap,
        email: user.email,
        alamat: user.alamat,
        no_hp: user.no_hp
      });
    }
    setIsEditing(false);
    setError('');
  };

  const handleSave = async () => {
    setLoading(true);
    setError('');

    try {
      // Validate required fields
      if (!formData.nama_lengkap || !formData.email || !formData.alamat || !formData.no_hp) {
        throw new Error('Semua field harus diisi');
      }

      // Update user data in database
      const { error } = await supabase
        .from('users')
        .update({
          nama_lengkap: formData.nama_lengkap,
          email: formData.email,
          alamat: formData.alamat,
          no_hp: formData.no_hp
        })
        .eq('id', user?.id);

      if (error) throw error;

      // Update user data in localStorage
      if (user) {
        const updatedUser = { ...user, ...formData };
        setUser(updatedUser);
        localStorage.setItem('smartcare_user', JSON.stringify(updatedUser));
      }

      setIsEditing(false);
      toast({
        title: "Profil Berhasil Diperbarui!",
        description: "Data profil Anda telah disimpan.",
      });
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan saat memperbarui profil');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    // Clear user data
    localStorage.removeItem('smartcare_user');
    toast({
      title: "Logout Berhasil",
      description: "Anda telah keluar dari aplikasi.",
    });
    navigate('/auth');
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatJoinDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  if (!user) {
    return null;
  }

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <MobileLayout activeTab="akun" onTabChange={handleTabChange} title="Akun Saya">
      {/* Profile Header */}
      <Card className="card-surface mb-6">
        <CardContent className="p-6">
          <div className="flex items-center space-x-4 mb-4">
            <Avatar className="h-16 w-16">
              <AvatarFallback className="bg-primary text-primary-foreground text-lg font-semibold">
                {getInitials(user.nama_lengkap)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h2 className="text-xl font-bold">{user.nama_lengkap}</h2>
              <p className="text-muted-foreground">{user.email}</p>
              <div className="mt-2">
                <span className="text-sm text-muted-foreground">Saldo: </span>
                <span className="text-lg font-semibold text-primary">
                  {formatCurrency(user.saldo)}
                </span>
              </div>
            </div>
          </div>
          
          <div className="text-center pt-4 border-t border-border">
            <p className="text-sm text-muted-foreground">
              Bergabung sejak {formatJoinDate(user.created_at)}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Profile Information */}
      <Card className="card-surface mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <User className="h-5 w-5" />
              <span>Informasi Profil</span>
            </CardTitle>
            {!isEditing ? (
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleEdit}
                className="btn-ghost"
              >
                <Edit3 className="h-4 w-4 mr-1" />
                Edit
              </Button>
            ) : (
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleCancel}
                  disabled={loading}
                >
                  <X className="h-4 w-4" />
                </Button>
                <Button 
                  size="sm"
                  onClick={handleSave}
                  disabled={loading}
                  className="btn-primary"
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="nama_lengkap">Nama Lengkap</Label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="nama_lengkap"
                name="nama_lengkap"
                type="text"
                value={formData.nama_lengkap}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="pl-10"
              />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="pl-10"
              />
            </div>
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <Label htmlFor="no_hp">Nomor HP</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="no_hp"
                name="no_hp"
                type="tel"
                value={formData.no_hp}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="pl-10"
              />
            </div>
          </div>

          {/* Address */}
          <div className="space-y-2">
            <Label htmlFor="alamat">Alamat</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="alamat"
                name="alamat"
                type="text"
                value={formData.alamat}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="pl-10"
              />
            </div>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Account Actions */}
      <Card className="card-surface mb-6">
        <CardHeader>
          <CardTitle>Pengaturan Akun</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button 
            variant="outline" 
            className="w-full justify-start"
            onClick={() => {
              toast({
                title: "Fitur Segera Hadir",
                description: "Fitur keamanan sedang dalam pengembangan.",
              });
            }}
          >
            <Shield className="mr-3 h-4 w-4" />
            Keamanan & Privacy
          </Button>

          <Button 
            variant="outline" 
            className="w-full justify-start"
            onClick={() => {
              toast({
                title: "Hubungi Customer Service",
                description: "Silakan hubungi CS kami di WhatsApp untuk bantuan.",
              });
            }}
          >
            <HelpCircle className="mr-3 h-4 w-4" />
            Bantuan & Support
          </Button>

          <Button 
            variant="outline" 
            className="w-full justify-start"
            onClick={() => {
              toast({
                title: "SmartCare v1.0.0",
                description: "Aplikasi layanan kesehatan terpercaya.",
              });
            }}
          >
            <Info className="mr-3 h-4 w-4" />
            Tentang Aplikasi
          </Button>
        </CardContent>
      </Card>

      {/* Logout Button */}
      <Card className="card-surface border-destructive/20">
        <CardContent className="p-4">
          <Button 
            variant="destructive" 
            className="w-full"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Keluar dari Akun
          </Button>
        </CardContent>
      </Card>
    </MobileLayout>
  );
};

export default Akun;