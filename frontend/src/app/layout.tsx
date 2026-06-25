import type { Metadata } from 'next';
import { Inter, Outfit } from 'next/font/google';
import localFont from 'next/font/local';
import './globals.css';
import { AuthProvider } from '@/lib/auth-context';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
});

const satoshi = localFont({
  src: [
    {
      path: '../../public/fonts/Satoshi-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/fonts/Satoshi-Medium.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../../public/fonts/Satoshi-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../../public/fonts/Satoshi-Black.woff2',
      weight: '900',
      style: 'normal',
    },
  ],
  variable: '--font-satoshi',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'PT ITM | Corporate AI Portal',
  description:
    'PT Indo Tambangraya Megah — Corporate AI Wellness & Knowledge Portal. Your intelligent assistant for safety, wellness, and corporate information.',
  keywords: [
    'PT ITM',
    'Indo Tambangraya Megah',
    'coal mining',
    'AI assistant',
    'corporate portal',
    'Kalimantan',
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={`${inter.variable} ${outfit.variable} ${satoshi.variable}`}>
      <body className="font-sans bg-charcoal text-white antialiased">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
