// app/page.tsx
'use client'

export default function Home() {
  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>تست ساده</h1>
      <p>اگه این متن رو می‌بینی، Next.js کار می‌کنه</p>
      <p>تاریخ: {new Date().toLocaleDateString('fa-IR')}</p>
    </div>
  )
}
