import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminSummary from "../modules/student-core/components/AdminSummary";
import AdminUserManager from "../modules/student-core/components/AdminUserManager";
import AdminAddQuestion from "../modules/student-core/components/AdminAddQuestion";
import AdminQuestionList from "../modules/student-core/components/AdminQuestionList";
import AdminAddQuote from "../modules/student-core/components/AdminAddQuote";
import AdminQuoteList from "../modules/student-core/components/AdminQuoteList";
import AdminForumModeration from "../modules/student-core/components/AdminForumModeration";
import AdminSelfCare from "../modules/selfcare/pages/AdminSelfCare";
import { useAuth } from "../contexts/AuthContext";

export default function AdminPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState("summary");

  if (user?.role !== "admin") {
    return <div className="content-card">This section is available for admin accounts only.</div>;
  }

  return (
    <div className="app-container">
      <div className="content-card" style={{ marginBottom: "20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: "12px", alignItems: "center", flexWrap: "wrap" }}>
          <h2>Admin Dashboard</h2>
          <button
            onClick={() => {
              logout();
              navigate("/login");
            }}
          >
            Logout
          </button>
        </div>
        <div className="tag-row">
          <button className={tab === "summary" ? "chip active" : "chip"} onClick={() => setTab("summary")}>Overview</button>
          <button className={tab === "users" ? "chip active" : "chip"} onClick={() => setTab("users")}>Users</button>
          <button className={tab === "add-question" ? "chip active" : "chip"} onClick={() => setTab("add-question")}>Add Questions</button>
          <button className={tab === "manage-question" ? "chip active" : "chip"} onClick={() => setTab("manage-question")}>Manage Questions</button>
          <button className={tab === "add-quote" ? "chip active" : "chip"} onClick={() => setTab("add-quote")}>Add Quotes</button>
          <button className={tab === "manage-quote" ? "chip active" : "chip"} onClick={() => setTab("manage-quote")}>Manage Quotes</button>
          <button className={tab === "selfcare" ? "chip active" : "chip"} onClick={() => setTab("selfcare")}>Self Care</button>
          <button className={tab === "forum" ? "chip active" : "chip"} onClick={() => setTab("forum")}>Forum Moderation</button>
        </div>
      </div>

      {tab === "summary" && <AdminSummary />}
      {tab === "users" && <AdminUserManager />}
      {tab === "add-question" && <AdminAddQuestion />}
      {tab === "manage-question" && <AdminQuestionList />}
      {tab === "add-quote" && <AdminAddQuote />}
      {tab === "manage-quote" && <AdminQuoteList />}
      {tab === "selfcare" && <AdminSelfCare />}
      {tab === "forum" && <AdminForumModeration />}
    </div>
  );
}
