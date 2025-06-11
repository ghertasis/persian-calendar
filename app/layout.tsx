import './globals.css'

export const metadata = {
  title: 'تقویم فارسی هیبرید',
  description: 'تقویم فارسی با قابلیت اتصال به Google Calendar',
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
