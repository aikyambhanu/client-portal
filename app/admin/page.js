'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { useRouter } from 'next/navigation'

export default function AdminPage() {
  const [users, setUsers] = useState([])
  const [search, setSearch] = useState('')

  const router = useRouter()

  const [form, setForm] = useState({
    username: '',
    password: '',
    client_name: '',
    phone: '',
    email: '',
    company_name: ''
  })

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    const { data } = await supabase.from('users').select('*')
    setUsers(data || [])
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const createUser = async () => {
    if (!form.username || !form.password || !form.client_name || !form.phone) {
      alert('Fill mandatory fields')
      return
    }

    await supabase.from('users').insert([
      {
        ...form,
        role: 'client',
        is_active: true
      }
    ])

    setForm({
      username: '',
      password: '',
      client_name: '',
      phone: '',
      email: '',
      company_name: ''
    })

    fetchUsers()
  }

  const toggleUser = async (user) => {
    await supabase
      .from('users')
      .update({ is_active: !user.is_active })
      .eq('id', user.id)

    fetchUsers()
  }

  // 🔍 FILTER
  const filteredUsers = users.filter(u => {
    const text = search.toLowerCase()

    return (
      u.client_name?.toLowerCase().includes(text) ||
      u.company_name?.toLowerCase().includes(text) ||
      u.phone?.toString().includes(text)
    )
  })

  return (
    <div style={container}>

      {/* HEADER */}
      <div style={header}>
        <h2>Admin Dashboard</h2>
      </div>

      {/* CREATE USER */}
      <div style={card}>
        <h3>Create Client</h3>

        <div style={grid}>
          <input name="username" placeholder="Username" value={form.username} onChange={handleChange} />
          <input name="password" placeholder="Password" value={form.password} onChange={handleChange} />
          <input name="client_name" placeholder="Client Name" value={form.client_name} onChange={handleChange} />
          <input name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} />
          <input name="email" placeholder="Email" value={form.email} onChange={handleChange} />
          <input name="company_name" placeholder="Company" value={form.company_name} onChange={handleChange} />
        </div>

        <button style={primaryBtn} onClick={createUser}>
          Create User
        </button>
      </div>

      {/* USERS LIST */}
      <div style={card}>
        <h3>Clients</h3>

        {/* SEARCH */}
        <input
          placeholder="Search by client / company / phone"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={searchBox}
        />

        {/* USERS */}
        {filteredUsers.length === 0 && (
          <p style={{ textAlign: 'center', marginTop: 20, opacity: 0.7 }}>
  No matching clients found
</p>
        )}

        {filteredUsers.map((u) => (
          <div key={u.id} style={userRow}>

            <div>
              <b>{u.client_name}</b><br />
              <span style={subText}>{u.username}</span><br />
              <span style={subText}>{u.email || 'No Email'}</span>
              <span style={subText}>{u.company_name || '—'}</span>
            </div>

            <div>{u.phone}</div>

            {/* STATUS SWITCH */}
          <div
  onClick={(e) => {
  e.stopPropagation()
  toggleUser(u)
}}
  style={{
    width: 40,
    height: 20,
    borderRadius: 20,
    background: u.is_active ? '#4CAF50' : '#ccc',
    cursor: 'pointer',
    position: 'relative'
  }}
>
  <div style={{
    width: 16,
    height: 16,
    borderRadius: '50%',
    background: '#fff',
    position: 'absolute',
    top: 2,
    left: u.is_active ? 22 : 2,
    transition: '0.3s'
  }} />
</div>

            {/* ACTION */}
            <button
              style={secondaryBtn}
              onClick={(e) => {
  e.stopPropagation()
  router.push(`/admin/user/${u.id}`)
}}
            >
              Upload Files
            </button>

          </div>
        ))}
      </div>

    </div>
  )
}

/* STYLES */

const container = {
  minHeight: '100vh',
  padding: 30,
  background: 'linear-gradient(135deg, #1e3c72, #2a5298)',
  color: '#fff'
}

const header = {
  marginBottom: 20
}

const card = {
  background: 'rgba(255,255,255,0.1)',
  padding: 20,
  borderRadius: 12,
  backdropFilter: 'blur(10px)',
  marginBottom: 20
}

const grid = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(200px,1fr))',
  gap: 10,
  marginBottom: 15
}

const userRow = {
  display: 'grid',
  gridTemplateColumns: '2fr 1fr 1fr 1fr',
  alignItems: 'center',
  padding: 15,
  marginTop: 10,
  borderRadius: 10,
  background: 'rgba(255,255,255,0.08)',
  transition: '0.3s',
  cursor: 'pointer'
}
onMouseOver={(e) => {
  e.currentTarget.style.background = 'rgba(255,255,255,0.15)'
}}
onMouseOut={(e) => {
  e.currentTarget.style.background = 'rgba(255,255,255,0.08)'
}}

const primaryBtn = {
  padding: '10px 20px',
  background: '#00c6ff',
  border: 'none',
  borderRadius: 8,
  color: '#fff',
  cursor: 'pointer'
}

const secondaryBtn = {
  padding: '8px 14px',
  borderRadius: 8,
  border: 'none',
  background: '#0072ff',
  color: '#fff',
  cursor: 'pointer'
}

const subText = {
  fontSize: 12,
  opacity: 0.7
}

const searchBox = {
  padding: 10,
  borderRadius: 8,
  border: 'none',
  margin: '10px 0 15px 0',
  width: '100%',
  outline: 'none'
}

const switchStyle = {
  position: 'relative',
  display: 'inline-block',
  width: 40,
  height: 20
}

const slider = {
  position: 'absolute',
  cursor: 'pointer',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: '#ccc',
  borderRadius: 20,
  transition: '.4s'
}
