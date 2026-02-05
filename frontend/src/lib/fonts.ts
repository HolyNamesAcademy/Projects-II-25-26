// Local font configuration - fonts are prefetched to avoid network issues
import localFont from 'next/font/local';

export const unna = localFont({
  src: [
    {
      path: '../../public/fonts/unna-400.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/fonts/unna-700.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-unna',
  display: 'swap',
});

export const playfairDisplay = localFont({
  src: '../../public/fonts/playfair-display-500.woff2',
  weight: '500',
  variable: '--font-playfair-display',
  display: 'swap',
});

export const satisfy = localFont({
  src: '../../public/fonts/satisfy-400.woff2',
  weight: '400',
  variable: '--font-satisfy',
  display: 'swap',
});
