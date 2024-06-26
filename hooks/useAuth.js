import { useState, useEffect } from 'react';
import { jwtDecode } from "jwt-decode";
import { useRouter } from 'next/navigation';

const useAuth = () => {
  const [user, setUser] = useState(null);
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('token'); // Adjust this according to your token storage method
    setUser(null);
    router.push('/');
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser(decoded);
      } catch (error) {
        console.error('Error decoding token:', error);
        handleLogout(); // Optionally log the user out if the token is invalid
      }
    }
  }, []);

  return { user, handleLogout };
};

export default useAuth;
