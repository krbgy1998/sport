
import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

// Ensure NEXT_PUBLIC_SITE_URL is set in your .env file
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.sportsurge1.com'; // Default fallback updated

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'sportsurge - Live Sports Scores & News',
    template: '%s | sportsurge',
  },
  description: 'sportsurge is your ultimate source for live sports scores, news, and updates. Covering NFL, NBA, Soccer, MLB, NHL, MMA, Boxing, Tennis, Golf, and more. Get real-time information, schedules, and detailed insights.',
  keywords: ['sports scores', 'live scores', 'sports news', 'NFL scores', 'NBA scores', 'soccer results', 'MLB updates', 'NHL games', 'MMA fights', 'boxing results', 'tennis tournaments', 'golf leaderboards', 'sportsurge'],
  openGraph: {
    title: {
      default: 'sportsurge - Live Sports Scores & News',
      template: '%s | sportsurge',
    },
    description: 'Your ultimate source for live sports scores and news. Real-time updates from NFL, NBA, Soccer, MLB, NHL, and many more leagues on sportsurge.',
    url: '/', // Relative to metadataBase
    siteName: 'sportsurge',
    images: [
      {
        url: 'https://placehold.co/1200x630.png', // General site OG image
        width: 1200,
        height: 630,
        alt: 'sportsurge - Live Sports Scores and News',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: {
        default: 'sportsurge - Live Sports Scores & News',
        template: '%s | sportsurge',
    },
    description: 'Your ultimate source for live sports scores and news. Real-time updates from NFL, NBA, Soccer, MLB, NHL, and many more leagues on sportsurge.',
    images: [`${siteUrl}/og-image.png`], // Example: if you have a static OG image in /public
    // site: '@yourtwitterhandle', // Optional: Your Twitter handle for the site
    // creator: '@creatorhandle', // Optional: Twitter handle of the content creator
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} dark`}>
      <head>
        {/* Meta tags defined in the metadata object will be rendered here by Next.js */}
      </head>
      <body className={`${inter.className} font-body antialiased`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
