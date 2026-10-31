function Forum({ onBack }) {
  return (
    <div className="content-card">
      <button className="back-btn" onClick={onBack}>← Back</button>
      <p><strong>Student:</strong> Exams are making me anxious.</p>
      <input placeholder="Type your message..." />
      <button className="primary">Send</button>
    </div>
  );
}

export default Forum;
