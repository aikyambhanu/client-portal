'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '../../../../lib/supabase'
import Header from '../../../../components/Header'

export default function UserFilesPage() {
  const { id } = useParams()
  const [files, setFiles] = useState([])

  useEffect(() => {
    fetchFiles()
  }, [id])

  const fetchFiles = async () => {
    const { data } = await supabase
      .from('files')
      .select('*')
      .eq('client_id', id)

    setFiles(data || [])
  }

  const handleUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    const filePath = `${id}/${Date.now()}-${file.name}`

    const { error } = await supabase.storage
      .from('client-files')
      .upload(filePath, file)

    if (error) {
      alert('Upload failed')
      return
    }

    await supabase.from('files').insert([
      {
        name: file.name,
        file_path: filePath,
        client_id: id
      }
    ])

    alert('File uploaded')
    fetchFiles()
  }

  const getFileUrl = (path) => {
    return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/client-files/${path}`
  }

  return (
    <div>
      <Header />

      <div style={{ padding: 40 }}>
        <h1>User File Manager</h1>

        {/* Upload */}
        <input type="file" onChange={handleUpload} />

        <hr /><br />

        {/* Files List */}
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
