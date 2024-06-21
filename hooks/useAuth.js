import { useState, useEffect } from 'react';
import { jwtDecode } from "jwt-decode";
import { useRouter } from 'next/navigation';

const useAuth = () => {
  const [user, setUser] = useState(null);
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null); // Clear user state
    router.push('/'); // Redirect to login page
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser(decoded);
      } catch (error) {
        console.error('Error decoding token:', error);
        handleLogout(); // Handle token decoding errors by logging out
      }
    } else {
      setUser(null); // Ensure user state is cleared if no token found
    }
  }, []); // Empty dependency array ensures useEffect runs only once on mount

  return { user, handleLogout };
};

export default useAuth;