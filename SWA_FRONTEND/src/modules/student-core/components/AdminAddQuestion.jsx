import { useState } from "react";
import { apiJson } from "../utils/api";

function AdminAddQuestion() {
  const [questionText, setQuestionText] = useState("");
  const [category, setCategory] = useState("who5");
  const [difficulty, setDifficulty] = useState("basic");
  const [message, setMessage] = useState("");

  const addQuestion = async () => {
    try {
      await apiJson("/api/admin/add-question", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          questionText,
          category,
          difficulty
        })
      });

      setMessage("Added");
      setQuestionText("");
    } catch (error) {
      setMessage(error.message || "Server Error");
    }
  };

  return (
    <div className="content-card">
      <h2>Add Question</h2>

      <textarea
        value={questionText}
        onChange={(e) => setQuestionText(e.target.value)}
        placeholder="Enter question"
      />

      <select value={category} onChange={(e) => setCategory(e.target.value)}>
        <option value="who5">WHO5</option>
        <option value="ghq12">GHQ12</option>
        <option value="phq9">PHQ9</option>
        <option value="gad7">GAD7</option>
        <option value="mbi">MBI</option>
      </select>

      <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
        <option value="basic">Basic</option>
        <option value="advanced">Advanced</option>
      </select>

      <button onClick={addQuestion}>Add</button>

      <p>{message}</p>
    </div>
  );
}

export default AdminAddQuestion;
