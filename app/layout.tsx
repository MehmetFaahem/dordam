import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SessionWrapper from '../components/SessionWrapper';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'NextJS E-commerce',
  description: 'A comprehensive e-commerce website built with Next.js 14',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div className="flex flex-col min-h-screen">
            <SessionWrapper>
              <Header />
              <main className="flex-grow">{children}</main>
              <Footer />
            </SessionWrapper>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
