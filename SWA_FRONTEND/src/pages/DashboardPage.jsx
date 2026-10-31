import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import ModuleGrid from "../modules/student-core/components/ModuleGrid";
import SplashScreen from "../modules/student-core/components/SplashScreen";

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showSplash, setShowSplash] = useState(false);

  useEffect(() => {
    if (user?.role === "student" && sessionStorage.getItem("showStudentSplash") === "true") {
      setShowSplash(true);
    }
  }, [user]);

  if (user?.role === "admin") {
    return <Navigate to="/admin" replace />;
  }

  if (user?.role === "counselor") {
    return <Navigate to="/counselor" replace />;
  }

  const routeMap = {
    home: "/",
    assessment: "/assessment",
    selfcare: "/selfcare",
    journal: "/journal",
    forum: "/forum",
    chatbot: "/",
    crisis: "/crisis",
    counselor: "/appointments",
    admin: "/admin"
  };

  if (showSplash) {
    return (
      <SplashScreen
        onFinish={() => {
          sessionStorage.removeItem("showStudentSplash");
          setShowSplash(false);
        }}
      />
    );
  }

  return (
    <div className="app-container">
      <div className="student-home-shell">
        <div className="student-home-topbar">
          <div className="student-home-topbar__copy">
            <span className="student-home-topbar__eyebrow">Student Wellbeing Platform</span>
            <h2>{user?.name ? `Welcome back, ${user.name}` : "Welcome back"}</h2>
            <p>Your daily space for check-ins, reflection, self-care, crisis support, and counselor access.</p>
          </div>

          <button
            className="student-home-topbar__logout"
            onClick={() => {
              logout();
              navigate("/login");
            }}
          >
            Logout
          </button>
        </div>
      </div>

      <ModuleGrid
        showAdmin={user?.role === "admin"}
        onNavigate={(key) => {
          navigate(routeMap[key] || "/");
        }}
      />
    </div>
  );
}
