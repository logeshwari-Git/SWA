import axios from "axios";
import { useState } from "react";
import { containsBadWord } from "../utils/filter";
import { API_BASE_URL } from "../../student-core/utils/api";
import "./PostForm.css";

export default function PostForm() {
  const [title, setTitle] = useState("");
  const [error, setError] = useState("");
  const [serverError, setServerError] = useState("");

  const handleChange = (e) => {
    const value = e.target.value;
    setTitle(value);

    if (containsBadWord(value)) {
      setError("⚠️ Inappropriate language is not allowed.");
    } else {
      setError("");
    }

    setServerError("");
  };

  const submitPost = async () => {
    const cleanTitle = title.trim();

    if (!cleanTitle) {
      setError("⚠️ Post cannot be empty");
      return;
    }

    if (error) return;

    // ✅ Get userId from localStorage (since your project stores it there)
    const authUser = JSON.parse(localStorage.getItem("authUser"));
const userId = authUser?._id || authUser?.id;

    if (!userId) {
      setServerError("⚠️ User not logged in");
      return;
    }

    try {
      await axios.post(`${API_BASE_URL}/api/posts`, {
        title: cleanTitle,
        userId: userId
      });

      setTitle("");
      setError("");
      setServerError("");

      window.location.reload();
    } catch (err) {
      setServerError(err.response?.data?.message || "⚠️ Something went wrong");
    }
  };

  return (
    <div className="post-form">
      <input
        placeholder="Start a discussion..."
        value={title}
        onChange={handleChange}
      />

      <button onClick={submitPost} disabled={!!error}>
        Post
      </button>

      {error && <p className="error-text">{error}</p>}
      {serverError && <p className="error-text">{serverError}</p>}
    </div>
  );
}