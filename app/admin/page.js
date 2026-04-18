'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import Header from '../../components/Header'
import { useRouter } from 'next/navigation'

export default function AdminPage() {
  const [users, setUsers] = useState([])
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
      alert('Please fill mandatory fields')
      return
    }

    const { error } = await supabase.from('users').insert([
      {
        ...form,
        role: 'client'
      }
    ])

    if (error) {
      alert(error.message)
    } else {
      alert('User created successfully')

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
  }

  const toggleUser = async (user) => {
    await supabase
      .from('users')
      .update({ is_active: !user.is_active })
      .eq('id', user.id)

    fetchUsers()
  }

  return (
    <div>
      <Header />

      <div style={{ padding: 40 }}>
        <h1>Admin Dashboard</h1>

        {/* CREATE USER FORM */}
        <h3>Create User</h3>

        <input
          name="username"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
        /><br /><br />

        <input
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
        /><br /><br />

        <input
          name="client_name"
          placeholder="Client Name"
          value={form.client_name}
          onChange={handleChange}
        /><br /><br />

        <input
          name="phone"
          placeholder="Phone"
          value={form.phone}
          onChange={handleChange}
        /><br /><br />

        <input
          name="email"
          placeholder="Email (optional)"
          value={form.email}
          onChange={handleChange}
        /><br /><br />

        <input
          name="company_name"
          placeholder="Company (optional)"
          value={form.company_name}
          onChange={handleChange}
        /><br /><br />

        <button onClick={createUser}>Create User</button>

        <hr /><br />

        {/* USERS TABLE */}
        <h3>Users List</h3>

        <table border="1" cellPadding="10">
          <thead>
            <tr>
              <th>Username</th>
              <th>Client Name</th>
              <th>Phone</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {users.map((u) => (
              <tr
  key={u.id}
  style={{ cursor: 'pointer' }}
  onClick={() => router.push(`/admin/user/${u.id}`)}
>
                <td>{u.username}</td>
                <td>{u.client_name}</td>
                <td>{u.phone}</td>
                <td>{u.is_active ? 'Active' : 'Disabled'}</td>
                <td>
                  <button onClick={() => toggleUser(u)}>
                    Toggle
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
