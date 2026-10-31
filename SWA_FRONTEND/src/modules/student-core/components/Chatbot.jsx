function Chatbot({ onBack }) {
  return (
    <div className="content-card">
      <button className="back-btn" onClick={onBack}>← Back</button>
      <h2>AI Chatbot</h2>
      <p>Chatbot support will be available soon.</p>
    </div>
  );
}

export default Chatbot;
