function Sidebar({ page, setPage }) {
  const items = [
    { id: "home", icon: "🏠", label: "Home" },
    { id: "assessment", icon: "📝", label: "Assessment" },
    { id: "selfcare", icon: "🌿", label: "Selfcare" },
    { id: "journal", icon: "📔", label: "Journal" },
    { id: "forum", icon: "💬", label: "Forum" },
    { id: "chatbot", icon: "🤖", label: "Chatbot" },
    { id: "crisis", icon: "🚨", label: "Crisis" },
    { id: "admin", icon: "⚙️", label: "Admin" },
    { id: "counselor", icon: "🧑‍⚕️", label: "Counselor" }
  ];

  return (
    <div className="bottom-nav">
      {items.map((item) => (
        <div
          key={item.id}
          className={`nav-item ${page === item.id ? "active" : ""}`}
          onClick={() => setPage(item.id)}
        >
          <span className="nav-icon">{item.icon}</span>
          <span className="nav-label">{item.label}</span>
        </div>
      ))}
    </div>
  );
}

export default Sidebar;
