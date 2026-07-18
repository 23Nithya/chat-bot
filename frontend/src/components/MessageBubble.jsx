export default function MessageBubble({ message }) {
  return (
    <div className={`msg ${message.role}`}>
      <div className="msg-bubble">{message.content}</div>
      {message.sources?.length > 0 && (
        <div className="sources">
          {message.sources.map((s, i) => (
            <span key={i} className="source-badge">📄 {s}</span>
          ))}
        </div>
      )}
    </div>
  )
}