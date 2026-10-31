import { useEffect, useState } from "react";
import { apiJson } from "../utils/api";

function AdminQuestionList() {
  const [questions, setQuestions] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({
    questionText: "",
    category: "",
    difficulty: ""
  });

  const categories = ["who5", "ghq12", "phq9", "gad7", "mbi"];

  const loadQuestions = async (category = "") => {
    try {
      const url = category
        ? `/api/admin/questions?category=${category}`
        : "/api/admin/questions";

      const data = await apiJson(url);
      setQuestions(data.questions || []);
    } catch (err) {
      console.error("Load error:", err);
      setQuestions([]);
    }
  };

  useEffect(() => {
    loadQuestions(selectedCategory);
  }, [selectedCategory]);

  const deleteQuestion = async (id) => {
    if (!window.confirm("Delete this question?")) return;

    try {
      await apiJson(`/api/admin/question/${id}`, {
        method: "DELETE"
      });
      loadQuestions(selectedCategory);
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const startEdit = (question) => {
    setEditId(question._id);
    setEditData({
      questionText: question.questionText || "",
      category: question.category || "who5",
      difficulty: question.difficulty || "basic"
    });
  };

  const saveEdit = async () => {
    try {
      await apiJson(`/api/admin/question/${editId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editData)
      });

      setEditId(null);
      loadQuestions(selectedCategory);
    } catch (err) {
      console.error("Edit error:", err);
    }
  };

  return (
    <div className="content-card admin-panel-card">
      <div className="panel-header">
        <div>
          <h2>Manage Questions</h2>
          <p>Review, update, or remove questions from the assessment bank.</p>
        </div>
      </div>

      <div className="filter-bar">
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category.toUpperCase()}
            </option>
          ))}
        </select>
      </div>

      {questions.length === 0 ? (
        <p className="empty-state">No questions found.</p>
      ) : (
        questions.map((question) => (
          <div key={question._id} className="question-card">
            {editId === question._id ? (
              <div className="editor-wrap">
                <textarea
                  rows="3"
                  value={editData.questionText}
                  onChange={(e) =>
                    setEditData({
                      ...editData,
                      questionText: e.target.value
                    })
                  }
                />

                <div className="form-row">
                  <select
                    value={editData.category}
                    onChange={(e) =>
                      setEditData({
                        ...editData,
                        category: e.target.value
                      })
                    }
                  >
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category.toUpperCase()}
                      </option>
                    ))}
                  </select>

                  <select
                    value={editData.difficulty}
                    onChange={(e) =>
                      setEditData({
                        ...editData,
                        difficulty: e.target.value
                      })
                    }
                  >
                    <option value="basic">Basic</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>

                <div className="question-actions">
                  <button onClick={saveEdit}>Save</button>
                  <button className="secondary-btn" onClick={() => setEditId(null)}>Cancel</button>
                </div>
              </div>
            ) : (
              <>
                <div className="question-content">
                  <h4>{question.questionText}</h4>

                  <div className="question-meta">
                    <span className="category-tag">{question.category?.toUpperCase()}</span>
                    <span className="difficulty-tag">{question.difficulty?.toUpperCase()}</span>
                  </div>
                </div>

                <div className="question-actions">
                  <button onClick={() => startEdit(question)}>Edit</button>

                  <button
                    className="secondary-btn"
                    onClick={() => deleteQuestion(question._id)}
                  >
                    Delete
                  </button>
                </div>
              </>
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default AdminQuestionList;
