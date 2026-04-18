'use client'

import { useRouter } from 'next/navigation'

export default function Header() {
  const router = useRouter()

  const user = typeof window !== 'undefined'
    ? JSON.parse(localStorage.getItem('user'))
    : null

  const handleLogout = () => {
    localStorage.removeItem('user')
    router.push('/login')
  }

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      padding: 20,
      borderBottom: '1px solid #ddd'
    }}>
      <h2>Client Portal</h2>

      <div>
        {user ? (
          <>
            <span style={{ marginRight: 10 }}>{user.username}</span>
            <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <button onClick={() => router.push('/login')}>
            Login
          </button>
        )}
      </div>
    </div>
  )
}