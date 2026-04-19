'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '../../../../lib/supabase'

export default function UserFilesPage() {
  const { id } = useParams()

  const [files, setFiles] = useState([])
  const [folders, setFolders] = useState([])
  const [folderPath, setFolderPath] = useState([])
  const [dragActive, setDragActive] = useState(false)

  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [message, setMessage] = useState('')

  const currentFolder = folderPath.length
    ? folderPath[folderPath.length - 1]
    : null

  useEffect(() => {
    if (id) {
      fetchFolders()
      fetchFiles()
    }
  }, [id, currentFolder])

  // 📁 Fetch folders
  const fetchFolders = async () => {
    let query = supabase.from('folders').select('*').eq('client_id', id)

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
    let query = supabase.from('files').select('*').eq('client_id', id)

    if (currentFolder === null) {
      query = query.is('folder_id', null)
    } else {
      query = query.eq('folder_id', currentFolder.id)
    }

    const { data } = await query
    setFiles(data || [])
  }

  // 📤 Upload
  const uploadFile = async (file, folderId) => {
    setUploading(true)
    setProgress(0)

    const filePath = `${id}/${Date.now()}-${file.name}`

    let fake = 0
    const interval = setInterval(() => {
      fake += 10
      setProgress(Math.min(fake, 90))
    }, 200)

    const { error } = await supabase.storage
      .from('client-files')
      .upload(filePath, file)

    clearInterval(interval)

    if (error) {
      setUploading(false)
      setMessage(error.message)
      return
    }

    await supabase.from('files').insert([
      {
        name: file.name,
        file_path: filePath,
        client_id: id,
        folder_id: folderId
      }
    ])

    setProgress(100)
    setUploading(false)
    setMessage('Upload successful ✅')
  }

  const handleUpload = async (e) => {
    const files = e.target.files
    for (let i = 0; i < files.length; i++) {
      await uploadFile(files[i], currentFolder?.id || null)
    }
    fetchFiles()
  }

  const handleDrop = async (e) => {
    e.preventDefault()
    setDragActive(false)

    const files = e.dataTransfer.files
    for (let i = 0; i < files.length; i++) {
      await uploadFile(files[i], currentFolder?.id || null)
    }

    fetchFiles()
  }

  const deleteFile = async (file) => {
    await supabase.storage
      .from('client-files')
      .remove([file.file_path])

    await supabase.from('files').delete().eq('id', file.id)

    setMessage('File deleted 🗑️')
    fetchFiles()
  }

  const getFileUrl = (path) => {
    return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/client-files/${path}`
  }

  const openFolder = (folder) => {
    setFolderPath([...folderPath, folder])
  }

  const goBack = () => {
    setFolderPath(folderPath.slice(0, -1))
  }

  const truncate = (text) =>
    text.length > 18 ? text.slice(0, 18) + '...' : text

  return (
    <div style={container}>

      {/* SIDEBAR */}
      <div style={sidebar}>
        <h3>📁 Upload Panel</h3>

        <div style={navItem} onClick={() => setFolderPath([])}>
          Root
        </div>
      </div>

      {/* MAIN */}
      <div style={{ flex: 1, padding: 25 }}>

        {/* TOP BAR */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {folderPath.length > 0 && (
            <button onClick={goBack} style={backBtn}>←</button>
          )}
          <h2>Upload Files</h2>
        </div>

        {/* MESSAGE */}
        {message && <p style={{ color: '#0f0' }}>{message}</p>}

        {/* BREADCRUMB */}
        <div style={{ marginBottom: 20 }}>
          <span style={crumb} onClick={() => setFolderPath([])}>Root</span>

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

        {/* UPLOAD AREA */}
        <div
          onDragOver={(e) => {
            e.preventDefault()
            setDragActive(true)
          }}
          onDragLeave={() => setDragActive(false)}
          onDrop={handleDrop}
          style={{
            border: '2px dashed #aaa',
            padding: 40,
            textAlign: 'center',
            borderRadius: 12,
            background: dragActive
              ? 'rgba(255,255,255,0.2)'
              : 'rgba(255,255,255,0.1)'
          }}
        >
          <div style={{ marginBottom: 10 }}>
            Drag & Drop files
          </div>

          <input
            type="file"
            multiple
            onChange={handleUpload}
            style={{
              display: 'block',
              margin: '10px auto 0'
            }}
          />
        </div>

        {/* PROGRESS */}
        {uploading && (
          <div style={{ marginTop: 10 }}>
            Uploading... {progress}%
            <div style={{ height: 6, background: '#444' }}>
              <div style={{
                width: `${progress}%`,
                height: '100%',
                background: '#00ffcc'
              }} />
            </div>
          </div>
        )}

        {/* FOLDERS */}
        <h3 style={{ marginTop: 25 }}>Folders</h3>
        <div style={grid}>
          {folders.map(f => (
            <div key={f.id} style={card} onClick={() => openFolder(f)}>
              📁 {truncate(f.name)}
            </div>
          ))}
        </div>

        {/* FILES */}
        <h3 style={{ marginTop: 25 }}>Files</h3>
        <div style={grid}>
          {files.map(f => (
            <div key={f.id} style={card}>
              <a href={getFileUrl(f.file_path)} target="_blank">
                📄 {truncate(f.name)}
              </a>
              <br />
              <button onClick={() => deleteFile(f)} style={deleteBtn}>
                Delete
              </button>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}

/* STYLES */

const container = {
  display: 'flex',
  minHeight: '100vh',
  background: 'linear-gradient(135deg, #1e3c72, #2a5298)',
  color: '#fff'
}

const sidebar = {
  width: 220,
  padding: 20,
  background: 'rgba(255,255,255,0.08)',
  backdropFilter: 'blur(10px)'
}

const navItem = {
  marginTop: 10,
  cursor: 'pointer'
}

const grid = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(150px,1fr))',
  gap: 15
}

const card = {
  padding: 15,
  borderRadius: 10,
  background: 'rgba(255,255,255,0.15)',
  cursor: 'pointer',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis'
}

const deleteBtn = {
  marginTop: 5,
  background: '#ff4d4f',
  border: 'none',
  padding: '5px 10px',
  color: '#fff',
  cursor: 'pointer',
  borderRadius: 6
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
