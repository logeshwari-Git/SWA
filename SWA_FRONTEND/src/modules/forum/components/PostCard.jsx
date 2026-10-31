function PostCard({ post }) {
  const time = new Date(post.createdAt).toLocaleString();

  return (
    <div className="post-card">
      <div className="tag">{post.tag}</div>

      <h3>{post.title}</h3>

      <div className="author">
        {post.author} • {time}
      </div>

      <p>{post.description}</p>

      <div className="comment-count">
        💬 {post.commentsCount}
      </div>
    </div>
  );
}

export default PostCard;
