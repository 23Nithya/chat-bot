import { useState, useRef, useEffect } from "react"
import axios from "axios"
import MessageBubble from "./MessageBubble"
import "../App.css"

export default function ChatWindow() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const clearChat = () => setMessages([])

  const sendMessage = async () => {
    if (!input.trim()) return
    const userMsg = { role: "user", content: input }
    setMessages(prev => [...prev, userMsg])
    setInput("")
    setLoading(true)
    try {
      const res = await axios.post("http://localhost:8000/api/chat", {
        question: input,
        session_id: "default"
      })
      setMessages(prev => [...prev, {
        role: "assistant",
        content: res.data.answer,
        sources: res.data.sources
      }])
    } catch {
      setMessages(prev => [...prev, {
        role: "assistant",
        content: "Something went wrong. Try again."
      }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="chat-container">
      <div className="chat-toolbar">
        <span>{messages.length} messages</span>
        <button className="btn btn-danger" onClick={clearChat}>
          Clear chat
        </button>
      </div>

      <div className="messages">
        {messages.length === 0 && (
          <div className="empty-state">
            <p>Upload study materials and ask your first question</p>
          </div>
        )}
        {messages.map((msg, i) => <MessageBubble key={i} message={msg} />)}
        {loading && (
          <div className="msg assistant">
            <div className="thinking">
              <span className="dot" /><span className="dot" /><span className="dot" />
              Searching your notes...
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="input-row">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Ask a question from your notes..."
        />
        <button className="btn btn-accent" onClick={sendMessage} disabled={loading}>
          Send
        </button>
      </div>
    </div>
  )
}