import { useState } from 'react';

function AdminPanel() {
  const [tab, setTab] = useState('questions');
  const [questionText, setQuestionText] = useState('');
  const [category, setCategory] = useState('stress');
  const [difficulty, setDifficulty] = useState('basic');
  const [questions, setQuestions] = useState([
    {id:1, questionText:'Sample question', category:'stress', difficulty:'basic'},
    {id:2, questionText:'Another question', category:'anxiety', difficulty:'advanced'}
  ]);
  const [quotes, setQuotes] = useState([
    {id:1, message:'Sample quote', riskLevel:'NORISK'}
  ]);

  const addQuestion = () => {
    const newQ = {id: Date.now(), questionText, category, difficulty};
    setQuestions([newQ, ...questions]);
    setQuestionText('');
  };

  const deleteQuestion = (id) => {
    setQuestions(questions.filter(q => q.id !== id));
  };

  return (
    <div className="admin-panel">
      <div className="admin-header">
        <h2>⚙️ Admin Control Center</h2>
      </div>
      

      {/* PERFECT TABS */}
      <div className="admin-tabs">
        <button className={tab === 'questions' ? 'active' : ''} 
                onClick={() => setTab('questions')}>
          📝 Questions
        </button>
        <button className={tab === 'quotes' ? 'active' : ''} 
                onClick={() => setTab('quotes')}>
          💭 Quotes
        </button>
      </div>

      {/* QUESTIONS TAB */}
      {tab === 'questions' && (
        <div className="admin-content">
          {/* ADD QUESTION FORM */}
          <div className="add-form">
            <h3>➕ Add New Question</h3>
            <textarea 
              value={questionText} 
              onChange={(e) => setQuestionText(e.target.value)}
              placeholder="Enter your question here..."
              className="question-input"
            />
            <div className="form-row">
              <select value={category} onChange={(e) => setCategory(e.target.value)} className="select-input">
                <option value="stress">Stress</option>
                <option value="anxiety">Anxiety</option>
                <option value="sadness">Sadness</option>
              </select>
              <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)} className="select-input">
                <option value="basic">Basic</option>
                <option value="advanced">Advanced</option>
              </select>
              <button onClick={addQuestion} className="add-btn">Add Question</button>
            </div>
          </div>

          {/* QUESTIONS LIST */}
          <div className="questions-list">
            <h3>📋 Manage Questions ({questions.length})</h3>
            <div className="questions-grid">
              {questions.map(q => (
                <div key={q.id} className="question-item">
                  <div className="question-text">{q.questionText}</div>
                  <div className="question-meta">
                    <span className={`tag ${q.category}`}>{q.category}</span>
                    <span className={`tag difficulty-${q.difficulty}`}>{q.difficulty}</span>
                    <button onClick={() => deleteQuestion(q.id)} className="delete-btn">🗑️</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* QUOTES TAB - SIMPLIFIED */}
      {tab === 'quotes' && (
        <div className="admin-content">
          <div className="quotes-placeholder">
            <h3>💭 Motivational Quotes</h3>
            <p>Quote management coming soon...</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminPanel;
