import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'تقویم فارسی هیبرید',
  description: 'تقویم فارسی با قابلیت همگام‌سازی با Google Calendar',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fa" dir="rtl">
      <body>{children}</body>
    </html>
  )
}
