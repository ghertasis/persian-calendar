export default function Home() {
  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>🌟 تقویم فارسی هیبرید</h1>
      <p>✅ برنامه با موفقیت بارگذاری شد!</p>
      <p>📅 تاریخ امروز: {new Date().toLocaleDateString('fa-IR')}</p>
    </div>
  )
}
