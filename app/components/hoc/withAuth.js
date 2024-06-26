import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useAuth from '../../../hooks/useAuth'; // Adjust the import path as per your project structure

const withAuth = (WrappedComponent) => {
  const AuthComponent = (props) => {
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

  // Add displayName for better debugging
  AuthComponent.displayName = `withAuth(${WrappedComponent.displayName || WrappedComponent.name})`;

  return AuthComponent;
};

export default withAuth;
