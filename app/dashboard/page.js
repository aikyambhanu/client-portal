'use client'

import { useEffect, useState } from 'react'
import Header from '../../components/Header'
import { supabase } from '../../lib/supabase'

export default function Dashboard() {
  const [files, setFiles] = useState([])
  const [folders, setFolders] = useState([])
  const [folderPath, setFolderPath] = useState([])

  const user = typeof window !== 'undefined'
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
    const { data } = await supabase
      .from('files')
      .select('*')
      .eq('client_id', clientId)
      .eq('folder_id', currentFolder?.id || null)

    setFiles(data || [])
  }

  // 🔗 File URL
  const getFileUrl = (path) => {
    return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/client-files/${path}`
  }

  // 📂 Open folder
  const openFolder = (folder) => {
    setFolderPath([...folderPath, folder])
  }

  // ⬅️ Back
  const goBack = () => {
    const newPath = [...folderPath]
    newPath.pop()
    setFolderPath(newPath)
  }

  // 🧭 Breadcrumb
  const goToLevel = (index) => {
    setFolderPath(folderPath.slice(0, index + 1))
  }

  return (
    <div>
      <Header />

      <div style={{ padding: 40 }}>
        <h1>My Documents</h1>

        {/* 🧭 Breadcrumb */}
        <div style={{ marginBottom: 20 }}>
          <button onClick={() => setFolderPath([])}>Root</button>

          {folderPath.map((f, i) => (
            <span key={f.id}>
              {' > '}
              <button onClick={() => goToLevel(i)}>
                {f.name}
              </button>
            </span>
          ))}
        </div>

        {/* ⬅️ Back */}
        {folderPath.length > 0 && (
          <button onClick={goBack}>⬅️ Back</button>
        )}

        <hr /><br />

        {/* 📂 Folders */}
        <h3>Folders</h3>

        <ul>
          {folders.map(f => (
            <li key={f.id}>
              <button onClick={() => openFolder(f)}>
                📁 {f.name}
              </button>
            </li>
          ))}
        </ul>

        <hr /><br />

        {/* 📄 Files */}
        <h3>Files</h3>

        <ul>
          {files.map(f => (
            <li key={f.id}>
              <a href={getFileUrl(f.file_path)} target="_blank">
                {f.name}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
