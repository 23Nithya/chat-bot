import { useState } from "react"
import axios from "axios"

export default function UploadModal({ onClose, onSuccess }) {
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleUpload = async () => {
    if (!file) return
    setLoading(true)
    const formData = new FormData()
    formData.append("file", file)
    try {
      const res = await axios.post("http://localhost:8000/api/upload", formData)
      onSuccess(`${res.data.filename} uploaded — ${res.data.chunks_stored} chunks indexed`)
    } catch {
      onSuccess("Upload failed. Try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="overlay" onClick={(e) => e.target.className === "overlay" && onClose()}>
      <div className="modal">
        <h2>Upload study material</h2>
        <p>Supports PDF and TXT files. Content will be indexed for Q&A.</p>

        <label className="drop-zone">
          <input type="file" accept=".pdf,.txt"
            onChange={(e) => setFile(e.target.files[0])} />
          {file ? (
            <div className="file-pill">
              <span className="fname">{file.name}</span>
              <span className="fsize">{(file.size/1024/1024).toFixed(1)} MB</span>
            </div>
          ) : (
            <span>Drop file here or click to browse</span>
          )}
        </label>

        <div className="modal-actions">
          <button className="btn" onClick={onClose}>Cancel</button>
          <button className="btn btn-accent" onClick={handleUpload}
            disabled={!file || loading}>
            {loading ? "Uploading..." : "Upload"}
          </button>
        </div>
      </div>
    </div>
  )
}