// app/layout.tsx
import type { Metadata } from 'next';
import './_styles/globals.css';

export const metadata: Metadata = { title: 'Wedding Invite' };

// 예시: blush 테마
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" data-theme="classic">
      <body>{children}</body>
    </html>
  );
}
