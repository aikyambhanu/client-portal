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

  const fetchFolders = async () => {
    let query = supabase.from('folders').select('*').eq('client_id', clientId)

    if (currentFolder === null) {
      query = query.is('parent_id', null)
    } else {
      query = query.eq('parent_id', currentFolder.id)
    }

    const { data } = await query
    setFolders(data || [])
  }

  const fetchFiles = async () => {
    let query = supabase.from('files').select('*').eq('client_id', clientId)

    if (currentFolder === null) {
      query = query.is('folder_id', null)
    } else {
      query = query.eq('folder_id', currentFolder.id)
    }

    const { data } = await query
    setFiles(data || [])
  }

  // 🔍 Filter + Sort
  const filteredFiles = files
    .filter(f => f.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sort === 'name') return a.name.localeCompare(b.name)
      if (sort === 'date') return new Date(b.created_at) - new Date(a.created_at)
      return 0
    })

  const getIcon = (name) => {
    if (name.endsWith('.pdf')) return '📕'
    if (name.match(/\.(jpg|jpeg|png)$/)) return '🖼️'
    return '📄'
  }

const getSecureUrl = async (path) => {
  const { data, error } = await supabase
    .storage
    .from('client-files')
    .createSignedUrl(path, 60) // 60 seconds

  if (error) {
    console.error(error)
    return null
  }

  return data.signedUrl
}

  const openFolder = (folder) => {
    setFolderPath([...folderPath, folder])
  }

  const goBack = () => {
    setFolderPath(folderPath.slice(0, -1))
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
        width: 220,
        padding: 20,
        background: 'rgba(255,255,255,0.08)',
        backdropFilter: 'blur(10px)'
      }}>
        <h3>📁 My Drive</h3>

        <div onClick={() => setFolderPath([])} style={navItem}>
          Root
        </div>
      </div>

      {/* MAIN */}
      <div style={{ flex: 1, padding: 25 }}>

        {/* TOP BAR */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 20
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 15 }}>
            {folderPath.length > 0 && (
              <button onClick={goBack} style={backBtn}>←</button>
            )}

            <h2>Documents</h2>
          </div>

          <button onClick={logout} style={logoutBtn}>
            Logout
          </button>
        </div>

        {/* BREADCRUMB */}
        <div style={{ marginBottom: 20, opacity: 0.8 }}>
          <span onClick={() => setFolderPath([])} style={crumb}>
            Root
          </span>

          {folderPath.map((f, i) => (
            <span key={f.id}>
              {' › '}
              <span
                style={crumb}
                onClick={() => setFolderPath(folderPath.slice(0, i + 1))}
              >
                {f.name}
              </span>
            </span>
          ))}
        </div>

        {/* SEARCH + SORT */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
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

        {/* FOLDERS */}
        <h3>Folders</h3>
        <div style={grid}>
          {folders.map(f => (
            <div key={f.id} style={card} onClick={() => openFolder(f)}>
              📁 {truncate(f.name)}
            </div>
          ))}
        </div>

        {/* FILES */}
        <h3 style={{ marginTop: 30 }}>Files</h3>
        <div style={grid}>
          {filteredFiles.map(f => (
          <div style={card}>
  <span
    onClick={async () => {
      const url = await getSecureUrl(f.file_path)
      if (url) window.open(url, '_blank')
    }}
    style={{ cursor: 'pointer' }}
  >
    {getIcon(f.name)} {truncate(f.name)}
  </span>
</div>
          ))}
        </div>

      </div>
    </div>
  )
}

/* HELPERS */
const truncate = (text) =>
  text.length > 18 ? text.slice(0, 18) + '...' : text

/* STYLES */

const grid = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(160px,1fr))',
  gap: 15
}

const card = {
  padding: 15,
  borderRadius: 12,
  background: 'rgba(255,255,255,0.15)',
  backdropFilter: 'blur(10px)',
  cursor: 'pointer',
  textDecoration: 'none',
  color: '#fff',
  transition: '0.3s',
  whiteSpace: 'nowrap',
  overflow: 'hidden'
}

const navItem = {
  padding: 10,
  borderRadius: 8,
  marginTop: 10,
  cursor: 'pointer',
  background: 'rgba(255,255,255,0.1)'
}

const searchBox = {
  padding: 10,
  borderRadius: 8,
  border: 'none',
  outline: 'none'
}

const crumb = {
  cursor: 'pointer'
}

const backBtn = {
  padding: '6px 10px',
  borderRadius: 6,
  border: 'none',
  cursor: 'pointer'
}

const logoutBtn = {
  padding: '8px 16px',
  borderRadius: 20,
  border: 'none',
  cursor: 'pointer',
  background: 'linear-gradient(to right, #ff4d4f, #ff7875)',
  color: '#fff'
}
