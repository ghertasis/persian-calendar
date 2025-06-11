import PersianCalendar from '@/components/PersianCalendar'

export default function Home() {
  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>� تقویم فارسی هیبرید</h1>
      <p>✅ برنامه با موفقیت بارگذاری شد!</p>
      <div style={{ marginTop: '30px' }}>
        <PersianCalendar />
      </div>
    </div>
  )
}
