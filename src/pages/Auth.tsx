import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SplashScreen from '@/components/SplashScreen';
import AuthForm from '@/components/auth/AuthForm';

const Auth: React.FC = () => {
  const navigate = useNavigate();
  const [showSplash, setShowSplash] = useState(true);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  useEffect(() => {
    // Check if user is already logged in
    const userData = localStorage.getItem('smartcare_user');
    if (userData) {
      navigate('/dashboard');
    }
  }, [navigate]);

  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  const handleAuthSuccess = () => {
    navigate('/dashboard');
  };

  const toggleAuthMode = () => {
    setAuthMode(prev => prev === 'login' ? 'register' : 'login');
  };

  if (showSplash) {
    return <SplashScreen onComplete={handleSplashComplete} />;
  }

  return (
    <AuthForm 
      mode={authMode}
      onSuccess={handleAuthSuccess}
      onToggleMode={toggleAuthMode}
    />
  );
};

export default Auth;