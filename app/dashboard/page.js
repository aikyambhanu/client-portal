'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { useRouter } from 'next/navigation'

export default function Dashboard() {
  const [folders, setFolders] = useState([])
  const [files, setFiles] = useState([])
  const [folderPath, setFolderPath] = useState([])

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

  // 📄 Fetch files
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

  // 🔗 File URL
  const getFileUrl = (path) => {
    return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/client-files/${path}`
  }

  // 📂 Navigation
  const openFolder = (folder) => {
    setFolderPath([...folderPath, folder])
  }

  const goBack = () => {
    const newPath = [...folderPath]
    newPath.pop()
    setFolderPath(newPath)
  }

  // 🚪 Logout
  const logout = () => {
    localStorage.removeItem('user')
    router.push('/login')
  }

  return (
    <div style={{
      height: '100vh',
      display: 'flex',
      background: 'linear-gradient(135deg, #1e3c72, #2a5298)',
      color: '#fff',
      fontFamily: 'Inter, sans-serif'
    }}>

      {/* SIDEBAR */}
      <div style={{
        width: 240,
        padding: 20,
        background: 'rgba(255,255,255,0.1)',
        backdropFilter: 'blur(10px)',
        borderRight: '1px solid rgba(255,255,255,0.2)'
      }}>
        <h3 style={{ marginBottom: 20 }}>📁 My Drive</h3>

        <div
          style={navItem}
          onClick={() => setFolderPath([])}
        >
          Root
        </div>

        {folderPath.length > 0 && (
          <div style={navItem} onClick={goBack}>
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

          <button onClick={logout} style={logoutBtn}>
            Logout
          </button>
        </div>

        {/* BREADCRUMB */}
        <div style={{ marginBottom: 20 }}>
          <span style={{ cursor: 'pointer' }} onClick={() => setFolderPath([])}>
            Root
          </span>

          {folderPath.map((f, i) => (
            <span key={f.id}>
              {' > '}
              <span
                style={{ cursor: 'pointer' }}
                onClick={() => setFolderPath(folderPath.slice(0, i + 1))}
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
            <div
              key={f.id}
              style={card}
              onClick={() => openFolder(f)}
            >
              📁 {f.name}
            </div>
          ))}
        </div>

        {/* FILES */}
        <h3 style={{ marginTop: 30 }}>Files</h3>
        <div style={grid}>
          {files.map(f => (
            <a
              key={f.id}
              href={getFileUrl(f.file_path)}
              target="_blank"
              style={card}
            >
              📄 {f.name}
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
  cursor: 'pointer',
  marginBottom: 10,
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
