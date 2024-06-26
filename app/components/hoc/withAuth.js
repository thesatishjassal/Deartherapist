import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useAuth from '../../../hooks/useAuth'; // Adjust the import path according to your project structure

const withAuth = (WrappedComponent) => {
  return (props) => {
    const { user, checkAuthStatus } = useAuth();
    const router = useRouter();

    useEffect(() => {
      checkAuthStatus();
      if (!user) {
        router.push('/');
      }
    }, [user]);

    if (!user) {
      return null; // or a loading spinner
    }

    return <WrappedComponent {...props} />;
  };
};

export default withAuth;
