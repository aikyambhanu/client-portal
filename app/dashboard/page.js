'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { useRouter } from 'next/navigation'

export default function Dashboard() {
  const [folders, setFolders] = useState([])
  const [files, setFiles] = useState([])

  const [folderPath, setFolderPath] = useState([])
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('name')

  const router = useRouter()

  const user =
    typeof window !== 'undefined'
      ? JSON.parse(localStorage.getItem('user'))
      : null

  const clientId = user?.id

  const currentFolder = folderPath.length
    ? folderPath[folderPath.length - 1]
    : null

  useEffect(() => {
    if (clientId) {
      fetchFolders()
      fetchFiles()
    }
  }, [clientId, currentFolder])

  // 📁 Fetch folders
  const fetchFolders = async () => {
    let query = supabase
      .from('folders')
      .select('*')
      .eq('client_id', clientId)

    if (currentFolder === null) {
      query = query.is('parent_id', null)
    } else {
      query = query.eq('parent_id', currentFolder.id)
    }

    const { data } = await query
    setFolders(data || [])
  }

  // 📄 Fetch files (FIXED ROOT ISSUE)
  const fetchFiles = async () => {
    let query = supabase
      .from('files')
      .select('*')
      .eq('client_id', clientId)

    if (currentFolder === null) {
      query = query.is('folder_id', null)
    } else {
      query = query.eq('folder_id', currentFolder.id)
    }

    const { data } = await query
    setFiles(data || [])
  }

  // 🔍 FILTER + SORT
  const filteredFiles = files
    .filter(f => f.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sort === 'name') return a.name.localeCompare(b.name)
      if (sort === 'date') return new Date(b.created_at) - new Date(a.created_at)
      return 0
    })

  // 📄 File icons
  const getIcon = (name) => {
    if (name.endsWith('.pdf')) return '📕'
    if (name.match(/\.(jpg|jpeg|png|webp)$/)) return '🖼️'
    if (name.match(/\.(xls|xlsx)$/)) return '📊'
    if (name.match(/\.(doc|docx)$/)) return '📄'
    return '📁'
  }

  const getFileUrl = (path) => {
    return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/client-files/${path}`
  }

  const openFolder = (folder) => {
    setFolderPath([...folderPath, folder])
  }

  const logout = () => {
    localStorage.removeItem('user')
    router.push('/login')
  }

  return (
    <div style={{
      height: '100vh',
      display: 'flex',
      background: 'linear-gradient(135deg, #1e3c72, #2a5298)',
      color: '#fff'
    }}>

      {/* SIDEBAR */}
      <div style={{
        width: 240,
        padding: 20,
        background: 'rgba(255,255,255,0.1)',
        backdropFilter: 'blur(10px)'
      }}>
        <h3>📁 My Drive</h3>

        <div onClick={() => setFolderPath([])} style={navItem}>
          Root
        </div>

        {folderPath.length > 0 && (
          <div onClick={() => setFolderPath(folderPath.slice(0, -1))} style={navItem}>
            ⬅ Back
          </div>
        )}
      </div>

      {/* MAIN */}
      <div style={{ flex: 1, padding: 20 }}>

        {/* TOP BAR */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: 20
        }}>
          <h2>My Documents</h2>
          <button onClick={logout} style={logoutBtn}>Logout</button>
        </div>

        {/* SEARCH + SORT */}
        <div style={{
          display: 'flex',
          gap: 10,
          marginBottom: 20
        }}>
          <input
            placeholder="Search files..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={searchBox}
          />

          <select value={sort} onChange={(e) => setSort(e.target.value)} style={searchBox}>
            <option value="name">Sort by Name</option>
            <option value="date">Sort by Date</option>
          </select>
        </div>

        {/* BREADCRUMB */}
        <div style={{ marginBottom: 20 }}>
          <span onClick={() => setFolderPath([])} style={{ cursor: 'pointer' }}>
            Root
          </span>

          {folderPath.map((f, i) => (
            <span key={f.id}>
              {' > '}
              <span
                onClick={() => setFolderPath(folderPath.slice(0, i + 1))}
                style={{ cursor: 'pointer' }}
              >
                {f.name}
              </span>
            </span>
          ))}
        </div>

        {/* FOLDERS */}
        <h3>Folders</h3>
        <div style={grid}>
          {folders.map(f => (
            <div key={f.id} style={card} onClick={() => openFolder(f)}>
              📁 {f.name}
            </div>
          ))}
        </div>

        {/* FILES */}
        <h3 style={{ marginTop: 30 }}>Files</h3>
        <div style={grid}>
          {filteredFiles.map(f => (
            <a
              key={f.id}
              href={getFileUrl(f.file_path)}
              target="_blank"
              style={card}
            >
              {getIcon(f.name)} {f.name}
            </a>
          ))}
        </div>

      </div>
    </div>
  )
}

/* STYLES */

const grid = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(160px,1fr))',
  gap: 15
}

const card = {
  padding: 20,
  borderRadius: 12,
  background: 'rgba(255,255,255,0.15)',
  backdropFilter: 'blur(10px)',
  cursor: 'pointer',
  textDecoration: 'none',
  color: '#fff',
  transition: '0.3s'
}

const navItem = {
  padding: 10,
  borderRadius: 8,
  marginTop: 10,
  cursor: 'pointer',
  background: 'rgba(255,255,255,0.1)'
}

const logoutBtn = {
  padding: '8px 14px',
  borderRadius: 6,
  border: 'none',
  cursor: 'pointer',
  background: '#ff4d4f',
  color: '#fff'
}

const searchBox = {
  padding: 10,
  borderRadius: 8,
  border: 'none',
  outline: 'none'
}
