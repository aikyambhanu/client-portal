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

  // 📤 Upload file
  const uploadFile = async (file, folderId) => {
    const filePath = `${id}/${Date.now()}-${file.name}`

    await supabase.storage.from('client-files').upload(filePath, file)

    await supabase.from('files').insert([
      {
        name: file.name,
        file_path: filePath,
        client_id: id,
        folder_id: folderId
      }
    ])
  }

  // 📁 Create/Get folder
  const getOrCreateFolder = async (name, parentId) => {
    const { data: existing } = await supabase
      .from('folders')
      .select('*')
      .eq('client_id', id)
      .eq('name', name)
      .eq('parent_id', parentId)

    if (existing?.length) return existing[0].id

    const { data } = await supabase
      .from('folders')
      .insert([{ name, client_id: id, parent_id: parentId }])
      .select()

    return data[0].id
  }

  // 🔁 Traverse folders
  const traverseFileTree = async (item, parentId) => {
    if (item.isFile) {
      item.file(async (file) => {
        await uploadFile(file, parentId)
      })
    } else if (item.isDirectory) {
      const newFolderId = await getOrCreateFolder(item.name, parentId)

      const reader = item.createReader()
      reader.readEntries(async (entries) => {
        for (let entry of entries) {
          await traverseFileTree(entry, newFolderId)
        }
      })
    }
  }

  // 🟦 Drop handler
  const handleDrop = async (e) => {
    e.preventDefault()
    setDragActive(false)

    const items = e.dataTransfer.items

    for (let i = 0; i < items.length; i++) {
      const entry = items[i].webkitGetAsEntry()
      if (entry) await traverseFileTree(entry, currentFolder?.id || null)
    }

    setMessage('Upload complete ✅')
    fetchFolders()
    fetchFiles()
  }

  // 🗑 DELETE FILE
  const deleteFile = async (file) => {
    if (!confirm('Delete this file?')) return

    await supabase.storage.from('client-files').remove([file.file_path])
    await supabase.from('files').delete().eq('id', file.id)

    setMessage('File deleted 🗑️')
    fetchFiles()
  }

  // 🗑 DELETE FOLDER (RECURSIVE)
 const deleteFolder = async (folderId, isRoot = false) => {
  if (isRoot) {
    if (!confirm('Delete this folder and all its contents?')) return
  }

  // delete files
  const { data: files } = await supabase
    .from('files')
    .select('*')
    .eq('folder_id', folderId)

  if (files?.length) {
    await supabase.storage
      .from('client-files')
      .remove(files.map(f => f.file_path))

    await supabase.from('files').delete().eq('folder_id', folderId)
  }

  // delete subfolders WITHOUT confirmation
  const { data: subfolders } = await supabase
    .from('folders')
    .select('*')
    .eq('parent_id', folderId)

  if (subfolders?.length) {
    for (let sf of subfolders) {
      await deleteFolder(sf.id, false)
    }
  }

  await supabase.from('folders').delete().eq('id', folderId)

  if (isRoot) {
    setMessage('Folder deleted 🗑️')
    fetchFolders()
    fetchFiles()
  }
}

  const openFolder = (f) => setFolderPath([...folderPath, f])
  const goBack = () => setFolderPath(folderPath.slice(0, -1))

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
  const truncate = (t) => (t.length > 18 ? t.slice(0, 18) + '...' : t)

  return (
    <div style={container}>
      {/* SIDEBAR */}
      <div style={sidebar}>
        <h3>📁 Upload Panel</h3>
        <div style={navItem} onClick={() => setFolderPath([])}>Root</div>
      </div>

      {/* MAIN */}
      <div style={{ flex: 1, padding: 25 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {folderPath.length > 0 && <button onClick={goBack}>←</button>}
          <h2>Upload Files</h2>
        </div>

        {message && <p>{message}</p>}

        {/* DROP ZONE */}
        <div
          onDragOver={(e) => {
            e.preventDefault()
            setDragActive(true)
          }}
          onDrop={handleDrop}
          style={{
            border: '2px dashed #aaa',
            padding: 40,
            borderRadius: 12
          }}
        >
          Drag & Drop folders or files
        </div>

        {/* FOLDERS */}
        <h3>Folders</h3>
        <div style={grid}>
          {folders.map(f => (
           <div key={f.id} style={cardRow}>
  <div onClick={() => openFolder(f)} style={cardText}>
    📁 {truncate(f.name)}
  </div>

  <span
    onClick={(e) => {
      e.stopPropagation()
      deleteFolder(f.id, true)
    }}
    style={deleteIcon}
  >
    🗑️
  </span>
</div>
          ))}
        </div>

        {/* FILES */}
        <h3>Files</h3>
        <div style={grid}>
          {files.map(f => (
          <div key={f.id} style={cardRow}>
 <span
  onClick={async () => {
    const url = await getSecureUrl(f.file_path)
    if (url) window.open(url, '_blank')
  }}
  style={{ cursor: 'pointer' }}    
>

  <span
    onClick={(e) => {
      e.stopPropagation()
      deleteFile(f)
    }}
    style={deleteIcon}
  >
    🗑️
  </span>
</div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* styles */
const container = {
  display: 'flex',
  minHeight: '100vh',
  background: 'linear-gradient(135deg, #1e3c72, #2a5298)',
  color: '#fff'
}

const sidebar = { width: 220, padding: 20 }
const navItem = { cursor: 'pointer', marginTop: 10 }

const grid = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(150px,1fr))',
  gap: 15
}

const cardRow = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: 12,
  borderRadius: 10,
  background: 'rgba(255,255,255,0.15)'
}
const cardText = {
  maxWidth: '120px',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  textDecoration: 'none',
  color: '#fff'
}
const deleteIcon = {
  cursor: 'pointer',
  fontSize: 16,
  opacity: 0.7,
  transition: '0.2s'
}

const deleteBtn = {
  marginTop: 5,
  background: 'red',
  color: '#fff',
  border: 'none',
  padding: 5,
  cursor: 'pointer'
}
