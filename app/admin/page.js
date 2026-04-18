'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import Header from '../../components/Header'

export default function AdminPage() {
  const [users, setUsers] = useState([])

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    const { data } = await supabase.from('users').select('*')
    setUsers(data || [])
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
            {users.map(u => (
              <tr key={u.id}>
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
