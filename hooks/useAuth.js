import { useState, useEffect } from 'react';
import { jwtDecode } from "jwt-decode";
import { useRouter } from 'next/navigation';

const useAuth = () => {
  const [user, setUser] = useState(null);
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    router.push('/'); // Redirect to login page
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000; // Current time in seconds
        if (decoded.exp < currentTime) {
          throw new Error('Token expired');
        }
        setUser(decoded);
      } catch (error) {
        console.error('Error decoding token or token expired:', error);
        handleLogout();
      }
    } else {
      setUser(null);
      router.push('/'); // Redirect to login if no token found
    }
  }, []);

  return { user, handleLogout };
};

export default useAuth;