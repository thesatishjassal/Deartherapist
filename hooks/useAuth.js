"use client"

import { useState, useEffect } from 'react';
import { jwtDecode } from "jwt-decode";
import { useRouter } from 'next/navigation';

const useAuth = () => {
  const [user, setUser] = useState(null);
  const router = useRouter();

  const handleLogin = (token) => {
    localStorage.setItem('token', token);
    const decoded = jwtDecode(token);
    setUser(decoded);
    router.push('/dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    router.push('/');
  };

  const checkAuthStatus = () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser(decoded);
      } catch (error) {
        console.error('Error decoding token:', error);
        handleLogout();
      }
    } else {
      setUser(null);
    }
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  return { user, handleLogin, handleLogout, checkAuthStatus };
};

export default useAuth;