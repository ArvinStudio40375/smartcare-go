import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
    const userData = localStorage.getItem('smartcare_user');
    if (userData) {
      navigate('/dashboard');
    } else {
      navigate('/auth');
    }
  }, [navigate]);

  // Loading state while redirecting
  return (
    <div className="mobile-container min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center animate-pulse">
          <div className="w-8 h-8 bg-white rounded-full"></div>
        </div>
        <p className="text-muted-foreground">Memuat SmartCare...</p>
      </div>
    </div>
  );
};

export default Index;
