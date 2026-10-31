import { useAuth } from "../contexts/AuthContext";
import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import PageBackButton from "../components/PageBackButton";
import BookAppointment from "../modules/appointments/BookAppointment";
import { apiJson } from "../utils/api";

export default function AppointmentPage() {
  const { user } = useAuth();
  const [latestAppointmentId, setLatestAppointmentId] = useState("");

  useEffect(() => {
    let active = true;

    async function loadMine() {
      if (user?.role !== "student") return;

      try {
        const appointments = await apiJson("/api/appointments/mine");
        if (active) {
          setLatestAppointmentId(appointments?.[0]?._id || "");
        }
      } catch (error) {
        if (active) {
          setLatestAppointmentId("");
        }
      }
    }

    loadMine();
    return () => {
      active = false;
    };
  }, [user]);

  if (user?.role === "counselor") {
    return <Navigate to={`/counselor-dashboard/${user.id}`} replace />;
  }

  return (
    <div className="app-container">
      <PageBackButton />
      {latestAppointmentId ? (
        <div className="content-card" style={{ marginBottom: "18px" }}>
          <h3 style={{ marginBottom: "8px" }}>My Booking Status</h3>
          <p className="muted" style={{ marginBottom: "12px" }}>
            Open this to see whether the counselor has accepted, rejected, or asked to reschedule.
          </p>
          <Link to={`/status/${latestAppointmentId}`}>
            <button>View Booking Status</button>
          </Link>
        </div>
      ) : null}
      <BookAppointment />
    </div>
  );
}
