import { useState, useEffect } from 'react';
import { jwtDecode } from "jwt-decode";
import { useRouter } from 'next/navigation';

const useAuth = () => {
  const [user, setUser] = useState(null);
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('token'); // Remove the token from localStorage
    setUser(null); // Clear the user state
    router.push('/'); // Redirect to the login page
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
    } else {
      router.push('/'); // Redirect to login if no token is found
    }
  }, [router]);

  return { user, handleLogout };
};

export default useAuth;