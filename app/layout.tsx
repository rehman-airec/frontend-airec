import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ReactQueryProvider } from '@/providers/ReactQueryProvider';
import { AuthProvider } from '@/providers/AuthProvider';
import { AlertProvider } from '@/providers/AlertProvider';
import { ToastProvider } from '@/components/notifications/ToastProvider';
import { SocketProvider } from '@/providers/SocketProvider';
import { TenantProvider } from '@/providers/TenantProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Recruitment Platform',
  description: 'Connect talented candidates with great opportunities',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ReactQueryProvider>
          <AuthProvider>
            <AlertProvider>
              <TenantProvider>
                <SocketProvider>
                  {children}
                  <ToastProvider />
                </SocketProvider>
              </TenantProvider>
            </AlertProvider>
          </AuthProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}