import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Counselor from "../modules/student-core/components/Counselor";
import AppointmentCounselorDashboard from "../modules/appointments/CounselorDashboard";
import { useAuth } from "../contexts/AuthContext";

export default function CounselorPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState("high-risk");

  return (
    <div className="app-container">
      <div className="content-card" style={{ marginBottom: "20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: "12px", alignItems: "center", flexWrap: "wrap" }}>
          <h2>Counselor Dashboard</h2>
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
          <button
            className={tab === "high-risk" ? "chip active" : "chip"}
            onClick={() => setTab("high-risk")}
          >
            High Risk Students
          </button>
          <button
            className={tab === "bookings" ? "chip active" : "chip"}
            onClick={() => setTab("bookings")}
          >
            Appointments
          </button>
        </div>
      </div>

      {tab === "high-risk" ? (
        <Counselor />
      ) : (
        <AppointmentCounselorDashboard forcedCounselorId={user?.id} />
      )}
    </div>
  );
}
