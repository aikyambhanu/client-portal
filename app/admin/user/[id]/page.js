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
    let query = supabase
      .from('folders')
      .select('*')
      .eq('client_id', id)

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
      .eq('client_id', id)
      .eq('folder_id', currentFolder?.id || null)

    setFiles(data || [])
  }

  // 📁 Create folder
  const createFolder = async () => {
    if (!folderName) return alert('Enter folder name')

    await supabase.from('folders').insert([
      {
        name: folderName,
        client_id: id,
        parent_id: currentFolder?.id || null
      }
    ])

    setFolderName('')
    fetchFolders()
  }

  // 🔁 Reusable upload
  const uploadFile = async (file) => {
    const filePath = `${id}/${Date.now()}-${file.name}`

    const { error } = await supabase.storage
      .from('client-files')
      .upload(filePath, file)

    if (error) {
      console.error(error)
      alert(error.message)
      return
    }

    await supabase.from('files').insert([
      {
        name: file.name,
        file_path: filePath,
        client_id: id,
        folder_id: currentFolder?.id || null
      }
    ])
  }

  // 📤 Input upload
  const handleUpload = async (e) => {
    const files = e.target.files
    for (let i = 0; i < files.length; i++) {
      await uploadFile(files[i])
    }
    fetchFiles()
  }

  // 🟦 Drag handlers
  const handleDragOver = (e) => {
    e.preventDefault()
    setDragActive(true)
  }

  const handleDragLeave = () => {
    setDragActive(false)
  }

  const handleDrop = async (e) => {
    e.preventDefault()
    setDragActive(false)

    const files = e.dataTransfer.files

    for (let i = 0; i < files.length; i++) {
      await uploadFile(files[i])
    }

    fetchFiles()
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

  const goToLevel = (index) => {
    setFolderPath(folderPath.slice(0, index + 1))
  }

  return (
    <div>
      <Header />

      <div style={{ padding: 30, maxWidth: 1000, margin: 'auto' }}>
        <h2 style={{ marginBottom: 20 }}>User File Manager</h2>

        {/* Breadcrumb */}
        <div style={{ marginBottom: 15 }}>
          <button onClick={() => setFolderPath([])}>Root</button>

          {folderPath.map((f, i) => (
            <span key={f.id}>
              {' > '}
              <button onClick={() => goToLevel(i)}>{f.name}</button>
            </span>
          ))}
        </div>

        {/* Back */}
        {folderPath.length > 0 && (
          <button onClick={goBack} style={{ marginBottom: 20 }}>
            ⬅ Back
          </button>
        )}

        {/* Create Folder */}
        <div style={{
          border: '1px solid #ddd',
          padding: 15,
          marginBottom: 20,
          borderRadius: 8
        }}>
          <h4>Create Folder</h4>
          <input
            placeholder="Folder name"
            value={folderName}
            onChange={(e) => setFolderName(e.target.value)}
            style={{ marginRight: 10 }}
          />
          <button onClick={createFolder}>Create</button>
        </div>

        {/* Drag & Drop Upload */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          style={{
            border: '2px dashed #aaa',
            padding: 30,
            textAlign: 'center',
            marginBottom: 20,
            borderRadius: 10,
            background: dragActive ? '#eef6ff' : '#fafafa'
          }}
        >
          <p>Drag & Drop files here</p>
          <p>or</p>
          <input type="file" multiple onChange={handleUpload} />
        </div>

        {/* Folders */}
        <div style={{ marginBottom: 20 }}>
          <h4>Folders</h4>

          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {folders.map(f => (
              <div
                key={f.id}
                onClick={() => openFolder(f)}
                style={{
                  padding: 10,
                  border: '1px solid #ddd',
                  borderRadius: 8,
                  cursor: 'pointer'
                }}
              >
                📁 {f.name}
              </div>
            ))}
          </div>
        </div>

        {/* Files */}
        <div>
          <h4>Files</h4>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {files.map(f => (
              <a
                key={f.id}
                href={getFileUrl(f.file_path)}
                target="_blank"
                style={{
                  padding: 10,
                  border: '1px solid #ddd',
                  borderRadius: 6,
                  textDecoration: 'none'
                }}
              >
                📄 {f.name}
              </a>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}
