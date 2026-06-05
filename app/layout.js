import { Inter } from 'next/font/google'
import './globals.css'
import { APP_NAME, APP_DESCRIPTION } from '@/lib/constants'
import LayoutShell from '@/components/layout/LayoutShell'
import { GoogleAnalytics } from '@next/third-parties/google'
import Script from 'next/script'

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '-primary-font-inter',
  display: 'swap',
})

export const metadata = {
  metadataBase: new URL('https://www.corehubtools.com'),
  title: {
    default: `${APP_NAME} | Free Online Developer & Writing Tools`,
    template: `%s | ${APP_NAME}`,
  },
  description: APP_DESCRIPTION,
  keywords: [
    'developer tools', 'online tools', 'free tools', 'web utilities', 
    'json formatter', 'qr generator', 'jwt decoder', 'regex tester', 
    'base64 converter', 'code minifier', 'uuid generator'
  ],
  icons: {
    icon: '/fav.png',
    shortcut: '/fav.png',
    apple: '/fav.png',
  },
  openGraph: {
    title: `${APP_NAME} | Free Online Developer & Writing Tools`,
    description: APP_DESCRIPTION,
    url: 'https://www.corehubtools.com',
    siteName: APP_NAME,
    images: [
      {
        url: '/fav.png',
        width: 800,
        height: 800,
        alt: `${APP_NAME} Logo`,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: `${APP_NAME} | Free Online Developer & Writing Tools`,
    description: APP_DESCRIPTION,
    images: ['/fav.png'],
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
  verification: {
    google: 'RtRi1gUAbZysCjdf0z9ahkdn4nb0su9dMOMMRTV66hI',
  },
  other: {
    'google-adsense-account': process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || '',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="light">
      <head>
        <link rel="preconnect" href="https://ep1.adtrafficquality.google" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://googleads.g.doubleclick.net" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://fundingchoicesmessages.google.com" crossOrigin="anonymous" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap" />
        
        {/* Google AdSense Global Script (Native script for static HTML crawler visibility) */}
        <script 
           async 
           src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || 'ca-pub-3898517911471443'}`}
           crossOrigin="anonymous"
        />
      </head>
      <body className={inter.className}>
        <LayoutShell>
          {children}
        </LayoutShell>
        
        {/* Google Analytics GA4 */}
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID || 'G-SPQYLMJQ79'} />
      </body>
    </html>
  )
}
