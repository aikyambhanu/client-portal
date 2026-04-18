'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabase'

export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const router = useRouter()

  const handleLogin = async () => {
    setError('')
    setLoading(true)

    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('username', username)
      .single()

    if (error || !data) {
      setError('Invalid username')
      setLoading(false)
      return
    }

    if (!data.is_active) {
      setError('Account is disabled')
      setLoading(false)
      return
    }

    if (data.password !== password) {
      setError('Incorrect password')
      setLoading(false)
      return
    }

    localStorage.setItem('user', JSON.stringify(data))

    if (data.role === 'admin') {
      router.push('/admin')
    } else {
      router.push('/dashboard')
    }
  }

  return (
    <div style={{
      height: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      background: 'linear-gradient(135deg, #1e3c72, #2a5298)',
      fontFamily: 'Inter, sans-serif'
    }}>

      {/* CARD */}
      <div style={{
        width: 380,
        padding: 35,
        borderRadius: 16,
        background: 'rgba(255,255,255,0.15)',
        backdropFilter: 'blur(15px)',
        border: '1px solid rgba(255,255,255,0.2)',
        boxShadow: '0 15px 40px rgba(0,0,0,0.2)',
        color: '#fff'
      }}>

        {/* TITLE */}
        <h2 style={{ textAlign: 'center', marginBottom: 5 }}>
          Welcome 👋
        </h2>

        <p style={{
          textAlign: 'center',
          fontSize: 14,
          marginBottom: 25,
          opacity: 0.8
        }}>
          Secure client portal access
        </p>

        {/* USERNAME */}
        <div style={floatingContainer}>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={floatingInput}
            required
          />
          <label style={{
            ...floatingLabel,
            top: username ? -8 : 12,
            fontSize: username ? 12 : 14
          }}>
            Username
          </label>
        </div>

        {/* PASSWORD */}
        <div style={floatingContainer}>
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={floatingInput}
            required
          />

          <label style={{
            ...floatingLabel,
            top: password ? -8 : 12,
            fontSize: password ? 12 : 14
          }}>
            Password
          </label>

          {/* 👁️ Toggle */}
          <span
            onClick={() => setShowPassword(!showPassword)}
            style={{
              position: 'absolute',
              right: 12,
              top: 12,
              cursor: 'pointer',
              fontSize: 14
            }}
          >
            {showPassword ? '🙈' : '👁️'}
          </span>
        </div>

        {/* ERROR MESSAGE */}
        {error && (
          <div style={{
            color: '#ffb3b3',
            fontSize: 13,
            marginBottom: 10
          }}>
            {error}
          </div>
        )}

        {/* BUTTON */}
        <button
          onClick={handleLogin}
          style={{
            width: '100%',
            padding: 12,
            marginTop: 10,
            background: '#00c6ff',
            backgroundImage: 'linear-gradient(to right, #00c6ff, #0072ff)',
            color: '#fff',
            border: 'none',
            borderRadius: 8,
            cursor: 'pointer',
            fontWeight: 600,
            transition: '0.3s'
          }}
          onMouseOver={e => e.target.style.transform = 'scale(1.03)'}
          onMouseOut={e => e.target.style.transform = 'scale(1)'}
        >
          {loading ? 'Signing in...' : 'Login'}
        </button>

        {/* QUOTES */}
        <div style={{
          marginTop: 20,
          fontSize: 13,
          opacity: 0.85,
          lineHeight: 1.6
        }}>
          <p>• "Compliance today prevents penalties tomorrow."</p>
          <p>• "Smart finance decisions build strong businesses."</p>
        </div>

      </div>
    </div>
  )
}

/* STYLES */

const floatingContainer = {
  position: 'relative',
  marginBottom: 18
}

const floatingInput = {
  width: '100%',
  padding: '12px',
  borderRadius: 8,
  border: '1px solid rgba(255,255,255,0.3)',
  background: 'transparent',
  color: '#fff',
  outline: 'none'
}

const floatingLabel = {
  position: 'absolute',
  left: 12,
  background: 'transparent',
  padding: '0 4px',
  color: '#ddd',
  transition: '0.2s'
}
