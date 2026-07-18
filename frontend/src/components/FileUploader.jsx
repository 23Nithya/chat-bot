import { useState } from "react"
import axios from "axios"

export default function FileUploader({ onUpload }) {
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleUpload = async () => {
    if (!file) return
    setLoading(true)

    const formData = new FormData()
    formData.append("file", file)

    try {
      const res = await axios.post(
        "http://localhost:8000/api/upload",
        formData
      )
      onUpload(`✅ ${res.data.filename} uploaded — ${res.data.chunks_stored} chunks stored`)
    } catch (err) {
      onUpload("❌ Upload failed. Try again.")
    } finally {
      setLoading(false)
      setFile(null)
    }
  }

  return (
    <div className="uploader">
      <input
        type="file"
        accept=".pdf,.txt"
        onChange={(e) => setFile(e.target.files[0])}
      />
      <button onClick={handleUpload} disabled={!file || loading}>
        {loading ? "Uploading..." : "Upload"}
      </button>
    </div>
  )
}