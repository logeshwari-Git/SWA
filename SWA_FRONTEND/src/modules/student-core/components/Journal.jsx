function Journal({ onBack }) {
  return (
    <div className="content-card">
      <button className="back-btn" onClick={onBack}>← Back</button>
      <textarea placeholder="Today I feel..." />
      <button className="primary">Save Entry</button>
    </div>
  );
}

export default Journal;
