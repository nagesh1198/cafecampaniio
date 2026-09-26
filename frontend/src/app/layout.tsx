import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Café Companion — Your Café, Smarter',
  description:
    'AI-powered café companion platform for customers and teams. Discover, order, connect, and enjoy with Google Gemini intelligence.',
  keywords: ['cafe', 'coffee', 'gemini ai', 'order tracking', 'rewards', 'open space'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          rel="icon"
          href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>☕</text></svg>"
        />
        <meta name="theme-color" content="#FBF8F3" />
      </head>
      <body>{children}</body>
    </html>
  );
}
