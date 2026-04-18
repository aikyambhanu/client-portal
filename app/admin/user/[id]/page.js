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

  const [folderPath, setFolderPath] = useState([]) // 🔥 breadcrumb

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

  // 📤 Upload file
  const handleUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

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

    alert('File uploaded')
    fetchFiles()
  }

  // 🔗 File URL
  const getFileUrl = (path) => {
    return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/client-files/${path}`
  }

  // 📂 Open folder
  const openFolder = (folder) => {
    setFolderPath([...folderPath, folder])
  }

  // ⬅️ Go back
  const goBack = () => {
    const newPath = [...folderPath]
    newPath.pop()
    setFolderPath(newPath)
  }

  // 🧭 Breadcrumb click
  const goToLevel = (index) => {
    setFolderPath(folderPath.slice(0, index + 1))
  }

  return (
    <div>
      <Header />

      <div style={{ padding: 40 }}>
        <h1>User File Manager</h1>

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

        {/* 📁 Create Folder */}
        <h3>Create Folder</h3>

        <input
          placeholder="Folder name"
          value={folderName}
          onChange={(e) => setFolderName(e.target.value)}
        />

        <button onClick={createFolder}>Create</button>

        <hr /><br />

        {/* 📂 Folder List */}
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

        {/* 📤 Upload */}
        <h3>Upload File</h3>
        <input type="file" onChange={handleUpload} />

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
