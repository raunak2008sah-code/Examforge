import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'ExamForge',
    template: '%s | ExamForge',
  },
  description: 'ExamForge — JEE Main CBT platform for exam administration and assessment',
  // Prevent search engine indexing until v0 is ready for public access
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      {/*
       * No inline styles here — CLAUDE.md §2.1 forbids hardcoded values.
       * All visual tokens (background, font, spacing) come from globals.css
       * and will be replaced with design-system CSS variables in Phase 4.
       */}
      <body>{children}</body>
    </html>
  );
}
