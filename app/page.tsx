'use client'

import { useState, useEffect } from 'react'

export default function Home() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setTimeout(() => {
      setLoading(false)
    }, 2000)
  }, [])

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <h1>تقویم فارسی هیبرید</h1>
        <p>در حال بارگذاری...</p>
      </div>
    )
  }

  return (
    <div style={{ textAlign: 'center', padding: '50px' }}>
      <h1>✅ تقویم فارسی هیبرید</h1>
      <p>برنامه با موفقیت بارگذاری شد!</p>
    </div>
  )
}
