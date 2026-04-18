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
    const { data } = await supabase
      .from('files')
      .select('*')
      .eq('client_id', id)
      .eq('folder_id', currentFolder?.id || null)

    setFiles(data || [])
  }

  // 📁 Create folder
  const createFolder = async (name, parentId) => {
    const { data } = await supabase.from('folders').insert([
      {
        name,
        client_id: id,
        parent_id: parentId
      }
    ]).select().single()

    return data
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

  // 🔁 READ DIRECTORY RECURSIVELY
  const readEntry = async (entry, parentId) => {
    if (entry.isFile) {
      entry.file(async (file) => {
        await uploadFile(file, parentId)
      })
    }

    if (entry.isDirectory) {
      const newFolder = await createFolder(entry.name, parentId)

      const reader = entry.createReader()

      reader.readEntries(async (entries) => {
        for (let ent of entries) {
          await readEntry(ent, newFolder.id)
        }
      })
    }
  }

  // 🟦 HANDLE DROP (FILES + FOLDERS)
  const handleDrop = async (e) => {
    e.preventDefault()
    setDragActive(false)

    const items = e.dataTransfer.items

    for (let i = 0; i < items.length; i++) {
      const entry = items[i].webkitGetAsEntry()

      if (entry) {
        await readEntry(entry, currentFolder?.id || null)
      }
    }

    setTimeout(() => {
      fetchFolders()
      fetchFiles()
    }, 1500)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setDragActive(true)
  }

  const handleDragLeave = () => {
    setDragActive(false)
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
        <h2>User File Manager</h2>

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
        <button onClick={() => createFolder(folderName, currentFolder?.id || null)}>
          Create Folder
        </button>

        <hr />

        {/* Drag Area */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          style={{
            border: '2px dashed #aaa',
            padding: 40,
            textAlign: 'center',
            background: dragActive ? '#eef6ff' : '#fff'
          }}
        >
          Drag & Drop Files OR Folders Here
        </div>

        <hr />

        {/* Folders */}
        <h4>Folders</h4>
        {folders.map(f => (
          <div key={f.id} onClick={() => openFolder(f)}>
            📁 {f.name}
          </div>
        ))}

        <hr />

        {/* Files */}
        <h4>Files</h4>
        {files.map(f => (
          <div key={f.id}>
            <a href={getFileUrl(f.file_path)} target="_blank">
              📄 {f.name}
            </a>
          </div>
        ))}
      </div>
    </div>
  )
}
