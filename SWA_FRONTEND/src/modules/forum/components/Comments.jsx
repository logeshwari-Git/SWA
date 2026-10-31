import axios from "axios";
import { useState } from "react";
import { containsBadWord } from "../utils/filter";
import { API_BASE_URL } from "../../student-core/utils/api";
import "./Comments.css";

export default function Comments({ post }) {
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  const [localComments, setLocalComments] = useState(post.comments || []);

  // 📝 Handle typing
  const handleChange = (e) => {
    const value = e.target.value;
    setText(value);

    if (containsBadWord(value)) {
      setError("⚠️ Inappropriate language is not allowed.");
    } else {
      setError("");
    }
  };

  // ➕ Add comment
  const addComment = async () => {
    const cleanText = text.trim();

    if (!cleanText) {
      setError("⚠️ Comment cannot be empty");
      return;
    }

    if (error) return;

    // ✅ get userId from logged in user
    const authUser = JSON.parse(localStorage.getItem("authUser"));
    const userId = authUser?._id || authUser?.id || localStorage.getItem("userId");

    if (!userId) {
      setError("⚠️ User not logged in");
      return;
    }

    try {
      const res = await axios.post(
        `${API_BASE_URL}/api/posts/comment/${post._id}`,
        {
          text: cleanText,
          userId: userId
        }
      );

      setLocalComments(res.data.comments);
      setText("");
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "⚠️ Something went wrong");
    }
  };

  // ❤️ Like comment (frontend only)
  const likeComment = (index) => {
    const updated = [...localComments];
    updated[index].likes = (updated[index].likes || 0) + 1;
    setLocalComments(updated);
  };

  // 🕒 Format date
  const formatDate = (date) => {
    return new Date(date).toLocaleString();
  };

  return (
    <div className="comments-box">
      {/* 💬 Comments List */}
      {localComments.map((c, i) => (
        <div key={i} className="comment-item">
          <div className="comment-header">
            <span className="user">{c.anonymousId || "Anonymous"}</span>
            <span className="time">
              {c.createdAt ? formatDate(c.createdAt) : ""}
            </span>
          </div>

          <p className="comment-text">{c.text}</p>

          <div className="comment-actions">
            <button onClick={() => likeComment(i)}>
              ❤️ {c.likes || 0}
            </button>
          </div>
        </div>
      ))}

      {/* ✍️ Input */}
      <div className="comment-input">
        <input
          placeholder="Write a comment..."
          value={text}
          onChange={handleChange}
        />

        <button onClick={addComment} disabled={!!error}>
          Send
        </button>
      </div>

      {/* ⚠️ Error */}
      {error && <p className="error-text">{error}</p>}
    </div>
  );
}