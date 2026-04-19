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

  // 🔁 CREATE OR GET FOLDER
  const getOrCreateFolder = async (name, parentId) => {
    const { data: existing } = await supabase
      .from('folders')
      .select('*')
      .eq('client_id', id)
      .eq('name', name)
      .eq('parent_id', parentId)

    if (existing && existing.length > 0) {
      return existing[0].id
    }

    const { data } = await supabase
      .from('folders')
      .insert([
        {
          name,
          client_id: id,
          parent_id: parentId
        }
      ])
      .select()

    return data[0].id
  }

  // 📤 UPLOAD FILE
  const uploadFile = async (file, folderId) => {
    const filePath = `${id}/${Date.now()}-${file.name}`

    await supabase.storage
      .from('client-files')
      .upload(filePath, file)

    await supabase.from('files').insert([
      {
        name: file.name,
        file_path: filePath,
        client_id: id,
        folder_id: folderId
      }
    ])
  }

  // 📁 RECURSIVE FOLDER HANDLER
  const traverseFileTree = async (item, parentId) => {
    if (item.isFile) {
      item.file(async (file) => {
        await uploadFile(file, parentId)
      })
    } else if (item.isDirectory) {
      const newFolderId = await getOrCreateFolder(item.name, parentId)

      const dirReader = item.createReader()

      dirReader.readEntries(async (entries) => {
        for (let entry of entries) {
          await traverseFileTree(entry, newFolderId)
        }
      })
    }
  }

  // 🟦 HANDLE DROP (FOLDER SUPPORT)
  const handleDrop = async (e) => {
    e.preventDefault()
    setDragActive(false)
    setUploading(true)
    setMessage('Uploading folder...')

    const items = e.dataTransfer.items

    for (let i = 0; i < items.length; i++) {
      const entry = items[i].webkitGetAsEntry()
      if (entry) {
        await traverseFileTree(entry, currentFolder?.id || null)
      }
    }

    setUploading(false)
    setMessage('Upload complete ✅')
    fetchFolders()
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

        {/* TOP */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {folderPath.length > 0 && (
            <button onClick={goBack} style={backBtn}>←</button>
          )}
          <h2>Upload Files</h2>
        </div>

        {message && <p>{message}</p>}

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

        {/* DROP ZONE */}
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
          Drag & Drop folders or files
        </div>

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

const crumb = {
  cursor: 'pointer'
}

const backBtn = {
  padding: '6px 10px',
  borderRadius: 6,
  border: 'none',
  cursor: 'pointer'
}
