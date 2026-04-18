'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '../../../../lib/supabase'
import Header from '../../../../components/Header'

export default function UserFilesPage() {
  const { id } = useParams()

  const [files, setFiles] = useState([])
  const [folders, setFolders] = useState([])
  const [folderName, setFolderName] = useState('')
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

  // 📄 Fetch files (FIXED ROOT ISSUE)
  const fetchFiles = async () => {
    let query = supabase
      .from('files')
      .select('*')
      .eq('client_id', id)

    if (currentFolder === null) {
      query = query.is('folder_id', null)
    } else {
      query = query.eq('folder_id', currentFolder.id)
    }

    const { data } = await query
    setFiles(data || [])
  }

  // 📁 Create folder
  const createFolder = async () => {
    if (!folderName) return setMessage('Enter folder name')

    await supabase.from('folders').insert([
      {
        name: folderName,
        client_id: id,
        parent_id: currentFolder?.id || null
      }
    ])

    setFolderName('')
    setMessage('Folder created ✅')
    fetchFolders()
  }

  // 📤 Upload with progress simulation
  const uploadFile = async (file, folderId) => {
    setUploading(true)
    setProgress(0)

    const filePath = `${id}/${Date.now()}-${file.name}`

    // fake progress animation
    let fakeProgress = 0
    const interval = setInterval(() => {
      fakeProgress += 10
      setProgress(Math.min(fakeProgress, 90))
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

  // 📤 Upload handler
  const handleUpload = async (e) => {
    const files = e.target.files
    for (let i = 0; i < files.length; i++) {
      await uploadFile(files[i], currentFolder?.id || null)
    }
    fetchFiles()
  }

  // 🟦 Drag drop
  const handleDrop = async (e) => {
    e.preventDefault()
    setDragActive(false)

    const files = e.dataTransfer.files

    for (let i = 0; i < files.length; i++) {
      await uploadFile(files[i], currentFolder?.id || null)
    }

    fetchFiles()
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setDragActive(true)
  }

  const handleDragLeave = () => setDragActive(false)

  // 🗑 Delete file
  const deleteFile = async (file) => {
    if (!confirm('Delete this file?')) return

    await supabase.storage
      .from('client-files')
      .remove([file.file_path])

    await supabase.from('files').delete().eq('id', file.id)

    setMessage('File deleted 🗑️')
    fetchFiles()
  }

  // 🔗 URL
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

  const goToLevel = (index) => {
    setFolderPath(folderPath.slice(0, index + 1))
  }

  return (
    <div>
      <Header />

      <div style={{ padding: 30, maxWidth: 1000, margin: 'auto' }}>
        <h2>User File Manager</h2>

        {/* MESSAGE */}
        {message && (
          <div style={{ marginBottom: 10, color: 'green' }}>
            {message}
          </div>
        )}

        {/* Breadcrumb */}
        <div>
          <button onClick={() => setFolderPath([])}>Root</button>
          {folderPath.map((f, i) => (
            <span key={f.id}>
              {' > '}
              <button onClick={() => goToLevel(i)}>{f.name}</button>
            </span>
          ))}
        </div>

        {folderPath.length > 0 && (
          <button onClick={goBack}>⬅ Back</button>
        )}

        <hr />

        {/* Create Folder */}
        <input
          placeholder="Folder name"
          value={folderName}
          onChange={(e) => setFolderName(e.target.value)}
        />
        <button onClick={createFolder}>Create Folder</button>

        <hr />

        {/* Upload Area */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          style={{
            border: '2px dashed #aaa',
            padding: 30,
            textAlign: 'center',
            background: dragActive ? '#eef6ff' : '#fff'
          }}
        >
          Drag & Drop files or
          <br />
          <input type="file" multiple onChange={handleUpload} />
        </div>

        {/* Progress */}
        {uploading && (
          <div style={{ marginTop: 10 }}>
            Uploading... {progress}%
            <div style={{
              height: 6,
              background: '#ddd',
              marginTop: 5
            }}>
              <div style={{
                width: `${progress}%`,
                height: '100%',
                background: 'green'
              }} />
            </div>
          </div>
        )}

        <hr />

        {/* Folders */}
        <h4>Folders</h4>
        {folders.map(f => (
          <div key={f.id} onClick={() => openFolder(f)} style={{ cursor: 'pointer' }}>
            📁 {f.name}
          </div>
        ))}

        <hr />

        {/* Files */}
        <h4>Files</h4>
        {files.map(f => (
          <div key={f.id} style={{ display: 'flex', gap: 10 }}>
            <a href={getFileUrl(f.file_path)} target="_blank">
              📄 {f.name}
            </a>
            <button onClick={() => deleteFile(f)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  )
}
