import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'sportsurge',
  description: 'Your ultimate source for sports scores and news.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} dark`}>
      <head>
        {/* Google Font links removed, next/font handles this now */}
      </head>
      <body className={`${inter.className} font-body antialiased`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
