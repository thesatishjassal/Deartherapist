import { Inter } from "next/font/google";
import HeaderBar from "./components/Header";
import "./globals.css";
import Container from "@mui/material/Container";
import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter';
import dynamic from 'next/dynamic';
import useAuth from './useAuth';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { metadata } from './metadata'; // Import metadata if needed

const inter = Inter({ subsets: ["latin"] });

const DynamicHeaderBar = dynamic(() => import('./components/Header'), {
  ssr: false,
});

export default function RootLayout({ children }) {
  const { user, checkAuthStatus } = useAuth();
  const router = useRouter();

  useEffect(() => {
    checkAuthStatus();
    if (!user && window.location.pathname !== '/') {
      router.push('/');
    }
  }, [user]);

  return (
    <html lang="en">
      <body className={inter.className}>
        <DynamicHeaderBar />
        <AppRouterCacheProvider>
          <Container>
            {children}
          </Container>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
