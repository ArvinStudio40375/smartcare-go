import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Eye, EyeOff, Loader2, User, Mail, Phone, MapPin, Lock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AuthFormProps {
  mode: 'login' | 'register';
  onSuccess: () => void;
  onToggleMode: () => void;
}

const AuthForm: React.FC<AuthFormProps> = ({ mode, onSuccess, onToggleMode }) => {
  const [formData, setFormData] = useState({
    nama_lengkap: '',
    email: '',
    password: '',
    alamat: '',
    no_hp: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
    setError('');
  };

  const handleLogin = async () => {
    try {
      // Check user credentials from our custom users table
      const { data: user, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('email', formData.email)
        .eq('password', formData.password)
        .eq('role', 'user')
        .single();

      if (userError || !user) {
        throw new Error('Email atau password tidak valid');
      }

      // Store user data in localStorage for session management
      localStorage.setItem('smartcare_user', JSON.stringify(user));
      
      toast({
        title: "Login Berhasil!",
        description: `Selamat datang kembali, ${user.nama_lengkap}!`,
      });

      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan saat login');
    }
  };

  const handleRegister = async () => {
    try {
      // Validate required fields
      if (!formData.nama_lengkap || !formData.email || !formData.password || !formData.alamat || !formData.no_hp) {
        throw new Error('Semua field harus diisi');
      }

      // Check if email already exists
      const { data: existingUser } = await supabase
        .from('users')
        .select('id')
        .eq('email', formData.email)
        .single();

      if (existingUser) {
        throw new Error('Email sudah terdaftar');
      }

      // Insert new user
      const { error } = await supabase
        .from('users')
        .insert([{
          nama_lengkap: formData.nama_lengkap,
          email: formData.email,
          password: formData.password,
          alamat: formData.alamat,
          no_hp: formData.no_hp,
          role: 'user',
          saldo: 0
        }]);

      if (error) throw error;

      toast({
        title: "Registrasi Berhasil!",
        description: "Akun Anda telah dibuat. Silakan login.",
      });

      // Switch to login mode
      onToggleMode();
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan saat registrasi');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (mode === 'login') {
        await handleLogin();
      } else {
        await handleRegister();
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mobile-container min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md card-surface">
        <CardHeader className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center">
            <User className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold">
            {mode === 'login' ? 'Masuk ke SmartCare' : 'Daftar SmartCare'}
          </CardTitle>
          <CardDescription>
            {mode === 'login' 
              ? 'Masuk untuk mengakses layanan kesehatan' 
              : 'Buat akun untuk memulai layanan kesehatan'
            }
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="nama_lengkap">Nama Lengkap</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="nama_lengkap"
                      name="nama_lengkap"
                      type="text"
                      placeholder="Masukkan nama lengkap"
                      value={formData.nama_lengkap}
                      onChange={handleInputChange}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="no_hp">Nomor HP</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="no_hp"
                      name="no_hp"
                      type="tel"
                      placeholder="08123456789"
                      value={formData.no_hp}
                      onChange={handleInputChange}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="alamat">Alamat</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="alamat"
                      name="alamat"
                      type="text"
                      placeholder="Masukkan alamat lengkap"
                      value={formData.alamat}
                      onChange={handleInputChange}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
              </>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="nama@email.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Masukkan password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="pl-10 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button 
              type="submit" 
              className="w-full btn-primary"
              disabled={loading}
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {mode === 'login' ? 'Masuk' : 'Daftar'}
            </Button>

            <div className="text-center">
              <button
                type="button"
                onClick={onToggleMode}
                className="text-sm text-primary hover:underline"
              >
                {mode === 'login' 
                  ? "Belum punya akun? Daftar di sini" 
                  : "Sudah punya akun? Masuk di sini"
                }
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthForm;