import { useEffect, useState } from "react";
import { apiJson } from "../../../utils/api";

const bannedWords = [
  "badword1",
  "badword2",
  "idiot",
  "stupid",
  "hate",
  "sex",
  "nude",
  "abuse",
  "kill",
  "dumb",
  "racist",
  "toxic"
];

function containsBadWord(text) {
  const lowerText = String(text || "").toLowerCase();
  return bannedWords.some((word) => lowerText.includes(word));
}

export default function AdminForumModeration() {
  const [posts, setPosts] = useState([]);
  const [status, setStatus] = useState("");

  const loadPosts = async () => {
    try {
      const data = await apiJson("/api/posts/admin/posts");
      setPosts(data || []);
      setStatus("");
    } catch (err) {
      setStatus(err.message || "Failed to load forum posts");
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  const deletePost = async (id) => {
    if (!window.confirm("Delete this post?")) return;

    try {
      await apiJson(`/api/posts/admin/delete/${id}`, { method: "DELETE" });
      setStatus("Post deleted successfully");
      loadPosts();
    } catch (err) {
      setStatus(err.message || "Failed to delete post");
    }
  };

  const deleteComment = async (postId, index) => {
    if (!window.confirm("Delete this comment?")) return;

    try {
      await apiJson(`/api/posts/admin/delete-comment/${postId}/${index}`, {
        method: "DELETE"
      });
      setStatus("Comment deleted successfully");
      loadPosts();
    } catch (err) {
      setStatus(err.message || "Failed to delete comment");
    }
  };

  return (
    <div className="content-card admin-panel-card">
      <div className="panel-header">
        <div>
          <h2>Forum Moderation</h2>
          <p>Review anonymous posts, remove bad content, and delete abusive comments.</p>
        </div>
      </div>

      {status ? <p className="form-status">{status}</p> : null}

      {posts.length === 0 ? (
        <p className="empty-state">No forum posts found.</p>
      ) : (
        posts.map((post) => (
          <div key={post._id} className="quote-card">
            <div className="quote-content">
              <p><strong>Post:</strong> {post.title}</p>

              <p><strong>Anonymous ID:</strong> {post.anonymousId || "Anonymous"}</p>

              {/* ✅ show real user name from populated userId */}
              <p>
                <strong>Real User:</strong>{" "}
                {post.userId?.name || post.realUserName || "Unknown"}
              </p>

              <p>
                <strong>Status:</strong>{" "}
                {containsBadWord(post.title) ? "Contains bad words" : "Clean"}
              </p>
            </div>

            <div className="question-actions" style={{ marginBottom: "12px" }}>
              <button onClick={() => deletePost(post._id)}>Delete Post</button>
            </div>

            <div>
              <h4 style={{ marginBottom: "8px" }}>Comments</h4>

              {post.comments?.length ? (
                post.comments.map((comment, index) => (
                  <div
                    key={`${post._id}-${index}`}
                    style={{
                      padding: "10px",
                      borderRadius: "12px",
                      background: "#fff8fb",
                      border: "1px solid #ffd7e5",
                      marginBottom: "8px"
                    }}
                  >
                    <p style={{ marginBottom: "6px" }}>{comment.text}</p>

                    <p style={{ marginBottom: "6px" }}>
                      <strong>Anonymous ID:</strong>{" "}
                      {comment.anonymousId || "Anonymous"}
                    </p>

                    <p style={{ marginBottom: "6px" }}>
                      <strong>Real User:</strong>{" "}
                      {comment.realUserName || "Unknown"}
                    </p>

                    <p style={{ marginBottom: "8px" }}>
                      <strong>Status:</strong>{" "}
                      {containsBadWord(comment.text) ? "Contains bad words" : "Clean"}
                    </p>

                    <button onClick={() => deleteComment(post._id, index)}>
                      Delete Comment
                    </button>
                  </div>
                ))
              ) : (
                <p className="muted">No comments.</p>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
}