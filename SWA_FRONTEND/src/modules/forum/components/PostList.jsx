import axios from "axios";
import { useEffect, useState } from "react";
import Comments from "./Comments";
import { API_BASE_URL } from "../../student-core/utils/api";
import "./PostList.css";

export default function PostList() {
  const [posts, setPosts] = useState([]);
  const [openComments, setOpenComments] = useState(null);

  // ✅ FIXED profileId (for like system)
  let profileId = localStorage.getItem("profileId");

  if (!profileId) {
    profileId = "user_" + Math.random().toString(36).substring(2, 8);
    localStorage.setItem("profileId", profileId);
  }

  // 📥 Fetch posts
  useEffect(() => {
    axios.get(`${API_BASE_URL}/api/posts`)
      .then((res) => {
        setPosts(res.data);
      })
      .catch((err) => console.error(err));
  }, []);

  // ❤️ Like post
  const likePost = async (id) => {
    try {
      await axios.put(`${API_BASE_URL}/api/posts/like/${id}`, {
        profileId,
      });

      // update UI without reload
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === id ? { ...post, likes: post.likes + 1 } : post
        )
      );

    } catch {
      alert("You already liked this post");
    }
  };

  // 🕒 Format date
  const formatDate = (date) => {
    return new Date(date).toLocaleString();
  };

  return (
    <>
      {posts.map((post) => (
        <div key={post._id} className="post-card">

          {/* 👤 USER + TIME */}
          <div className="post-meta">
            <span className="username">
              🕶 {post.anonymousId || "Anonymous"}
            </span>

            <span className="date">
              • {formatDate(post.createdAt)}
            </span>
          </div>

          {/* 📝 POST CONTENT */}
          <h3>{post.title}</h3>

          {/* ❤️ LIKE + 💬 COMMENT */}
          <div className="post-actions">
            <button onClick={() => likePost(post._id)}>
              ❤️ {post.likes}
            </button>

            <button onClick={() => setOpenComments(post._id)}>
              💬 {post.comments.length}
            </button>
          </div>

          {/* 💬 COMMENTS */}
          {openComments === post._id && (
            <Comments post={post} />
          )}

        </div>
      ))}
    </>
  );
}