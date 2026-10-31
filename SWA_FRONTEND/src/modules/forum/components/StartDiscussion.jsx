import { useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../student-core/utils/api";

function StartDiscussion({ refresh }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const submitPost = async () => {
    if (!title || !description) return;

    await axios.post(`${API_BASE_URL}/api/posts`, {
      title,
      description,
      tag: "General"
    });

    setTitle("");
    setDescription("");
    refresh();
  };

  return (
    <div className="start-box">
      <input
        placeholder="Start a discussion"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        placeholder="Description..."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <button onClick={submitPost}>Post</button>
    </div>
  );
}

export default StartDiscussion;
