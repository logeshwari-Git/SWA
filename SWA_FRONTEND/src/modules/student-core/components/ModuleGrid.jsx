import { useNavigate } from "react-router-dom";

const studentModules = [
  { key: "assessment", path: "/assessment", emoji: "🧠", title: "Assessment", caption: "Daily screening with guided next steps.", tag: "Daily" },
  { key: "selfcare", path: "/selfcare", emoji: "🌿", title: "Self Care", caption: "Activities, saved tools, and calm resets.", tag: "Care" },
  { key: "moodJournal", path: "/mood", emoji: "🧠", title: "Mood Tracking & Journal", caption: "Track moods, write journals, and view patterns.", tag: "Reflect" },
  { key: "forum", path: "/forum", emoji: "💬", title: "Forum", caption: "Connect safely with a moderated student space.", tag: "Connect" },
  { key: "crisis", path: "/crisis", emoji: "🆘", title: "Crisis Help", caption: "Reach urgent support resources quickly.", tag: "Urgent" },
  { key: "counselor", path: "/appointments", emoji: "🤝", title: "Counselor", caption: "Book, track, and follow up on sessions.", tag: "Support" }
];

export default function ModuleGrid({ showAdmin = true }) {
  const navigate = useNavigate(); // 🔥 IMPORTANT

  return (
    <div className="home-dashboard">
      <section className="dashboard-hero">
        <div className="dashboard-hero__content">
          <div className="dashboard-hero__badge">Student Dashboard</div>
          <h1 className="main-title">Everything for daily student wellbeing, in one place.</h1>
          <p className="dashboard-hero__copy">
            Start with an assessment, continue with self-care and reflection, and reach support whenever it is needed.
          </p>

          <div className="dashboard-hero__actions">
            <button type="button" onClick={() => navigate("/assessment")}>
              Start Today&apos;s Check-In
            </button>
            <button
              type="button"
              className="dashboard-secondary-btn"
              onClick={() => navigate("/selfcare")}
            >
              Explore Self Care
            </button>
          </div>
        </div>

        <div className="dashboard-hero__panel">
          <div className="dashboard-stat">
            <span className="dashboard-stat__label">Core Flow</span>
            <strong>Check in, reflect, get help</strong>
          </div>
          <div className="dashboard-stat">
            <span className="dashboard-stat__label">Student Tools</span>
            <strong>6 focused wellbeing modules</strong>
          </div>
          <div className="dashboard-stat">
            <span className="dashboard-stat__label">Access</span>
            <strong>Assessment, care, crisis, counselor</strong>
          </div>
        </div>
      </section>

      <div className="dashboard-grid">
        {studentModules.map((module, index) => (
          <div
            key={module.key}
            className="dashboard-card dashboard-card--student dashboard-card--action"
            onClick={() => navigate(module.path)}   // ✅ FIXED
            style={{ cursor: "pointer" }}
          >
            <div className="dashboard-card__top">
              <span className="dash-icon">{module.emoji}</span>
              <span className="dashboard-card__tag">{module.tag}</span>
            </div>
            <div className="dashboard-card__body">
              <span className="dashboard-card__index">0{index + 1}</span>
              <h3>{module.title}</h3>
              <p>{module.caption}</p>
            </div>
          </div>
        ))}

        {showAdmin && (
          <button
            type="button"
            className="dashboard-card dashboard-card--student dashboard-card--action"
            onClick={() => navigate("/admin")}   // ✅ FIXED
          >
            <div className="dashboard-card__top">
              <span className="dash-icon">🛠️</span>
              <span className="dashboard-card__tag">Manage</span>
            </div>
            <div className="dashboard-card__body">
              <span className="dashboard-card__index">07</span>
              <h3>Admin</h3>
              <p>Manage users, quotes, questions, and app content.</p>
            </div>
          </button>
        )}
      </div>
    </div>
  );
}