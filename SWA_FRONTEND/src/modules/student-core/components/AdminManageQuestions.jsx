import { useEffect, useState } from "react";
import { API_BASE_URL } from "../utils/api";

function AdminManageQuestions() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newQuestion, setNewQuestion] = useState({
    questionText: "",
    category: "who5",
    difficulty: "basic"
  });
  const [message, setMessage] = useState("");

  // Fetch all questions
  const fetchQuestions = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/questions`);
      const data = await res.json();
      setQuestions(data.questions || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  // Add new question
  const addQuestion = async () => {
    if (!newQuestion.questionText.trim()) {
      setMessage("❌ Enter question text");
      return;
    }

    try {
      setMessage("");
      const res = await fetch(`${API_BASE_URL}/api/admin/add-question`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newQuestion)
      });

      if (res.ok) {
        setMessage("✅ Question added!");
        setNewQuestion({ questionText: "", category: "who5", difficulty: "basic" });
        fetchQuestions(); // Refresh list
      } else {
        setMessage("❌ Failed to add question");
      }
    } catch (err) {
      setMessage("❌ Server error");
    }
  };

  // Toggle question active/inactive
  const toggleQuestion = async (id, isActive) => {
    try {
      await fetch(`${API_BASE_URL}/api/admin/toggle-question/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !isActive })
      });
      fetchQuestions(); // Refresh list
      setMessage(`✅ Question ${isActive ? "deactivated" : "activated"}`);
    } catch (err) {
      setMessage("❌ Failed to update");
    }
  };

  if (loading) return <div className="content-card">⏳ Loading questions...</div>;

  return (
    <div className="content-card" style={{ padding: "20px" }}>
      <h2>📝 Manage Questions ({questions.length})</h2>

      {/* ADD NEW QUESTION */}
      <div style={{ 
        background: "#f9f9f9", 
        padding: "20px", 
        borderRadius: "10px", 
        marginBottom: "30px" 
      }}>
        <h3>➕ Add New Question</h3>
        <textarea
          value={newQuestion.questionText}
          onChange={(e) => setNewQuestion({ ...newQuestion, questionText: e.target.value })}
          placeholder="Enter question..."
          style={{ width: "100%", height: "80px", marginBottom: "10px", padding: "10px" }}
        />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px", marginBottom: "10px" }}>
          <select 
            value={newQuestion.category}
            onChange={(e) => setNewQuestion({ ...newQuestion, category: e.target.value })}
          >
            <option value="who5">WHO5</option>
            <option value="ghq12">GHQ12</option>
            <option value="phq9">PHQ9</option>
            <option value="gad7">GAD7</option>
            <option value="mbi">MBI</option>
          </select>
          <select 
            value={newQuestion.difficulty}
            onChange={(e) => setNewQuestion({ ...newQuestion, difficulty: e.target.value })}
          >
            <option value="basic">Basic</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>
        <button onClick={addQuestion} style={{ width: "100%", padding: "10px", background: "#4CAF50", color: "white", border: "none" }}>
          Add Question
        </button>
      </div>

      {/* ALL QUESTIONS TABLE */}
      <div style={{ maxHeight: "500px", overflow: "auto" }}>
        <table border="1" style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#2196F3", color: "white" }}>
              <th>Question</th>
              <th>Category</th>
              <th>Difficulty</th>
              <th>Status</th>
              <th>Date Added</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {questions.map((q) => (
              <tr key={q._id} style={{ borderBottom: "1px solid #ddd" }}>
                <td style={{ maxWidth: "300px" }}>{q.questionText}</td>
                <td><strong>{q.category.toUpperCase()}</strong></td>
                <td>{q.difficulty}</td>
                <td>
                  <span style={{ 
                    color: q.isActive ? "green" : "red",
                    fontWeight: "bold"
                  }}>
                    {q.isActive ? "✅ Active" : "❌ Inactive"}
                  </span>
                </td>
                <td>{new Date(q.createdAt).toLocaleDateString()}</td>
                <td>
                  <button 
                    onClick={() => toggleQuestion(q._id, q.isActive)}
                    style={{
                      padding: "5px 10px",
                      background: q.isActive ? "#f44336" : "#4CAF50",
                      color: "white",
                      border: "none",
                      borderRadius: "3px",
                      cursor: "pointer"
                    }}
                  >
                    {q.isActive ? "Deactivate" : "Activate"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {message && (
        <p style={{ 
          marginTop: "20px", 
          padding: "15px", 
          background: "#e8f5e8", 
          borderRadius: "5px", 
          textAlign: "center",
          fontWeight: "bold"
        }}>
          {message}
        </p>
      )}
    </div>
  );
}

export default AdminManageQuestions;
