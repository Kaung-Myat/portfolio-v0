import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { Navigation } from '@/components/navigation';
import { Footer } from '@/components/footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL('https://kaungmratthu.com'),
  title: {
    default: 'Kaung Mrat Thu - Full-Stack Developer & Software Engineer',
    template: '%s | Kaung Mrat Thu',
  },
  description:
    'Portfolio and blog of Kaung Mrat Thu, a full-stack developer and software engineer specializing in modern web technologies, JavaScript, TypeScript, React, Next.js, and Node.js.',
  keywords: [
    'Kaung Mrat Thu',
    'Full-Stack Developer',
    'Software Engineer',
    'Web Developer',
    'React Developer',
    'Next.js',
    'TypeScript',
    'JavaScript',
    'Portfolio',
    'Blog',
  ],
  authors: [{ name: 'Kaung Mrat Thu' }],
  creator: 'Kaung Mrat Thu',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://kaungmratthu.com',
    title: 'Kaung Mrat Thu - Full-Stack Developer & Software Engineer',
    description:
      'Portfolio and blog of Kaung Mrat Thu, a full-stack developer and software engineer.',
    siteName: 'Kaung Mrat Thu',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kaung Mrat Thu - Full-Stack Developer & Software Engineer',
    description:
      'Portfolio and blog of Kaung Mrat Thu, a full-stack developer and software engineer.',
    creator: '@yourtwitterhandle',
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
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div className="flex min-h-screen flex-col">
            <Navigation />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
