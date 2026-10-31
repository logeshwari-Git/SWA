import { useEffect, useState } from "react";
import { apiJson } from "../utils/api";

function StatCard({ label, value }) {
  return (
    <div className="content-card" style={{ minWidth: "180px", flex: "1 1 180px" }}>
      <p className="eyebrow">{label}</p>
      <h2 style={{ margin: 0 }}>{value}</h2>
    </div>
  );
}

export default function AdminSummary() {
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    apiJson("/api/admin/summary")
      .then((data) => {
        setSummary(data);
        setError("");
      })
      .catch((err) => {
        setError(err.message || "Failed to load summary");
      });
  }, []);

  if (error) {
    return <div className="content-card">{error}</div>;
  }

  if (!summary) {
    return <div className="content-card">Loading admin summary...</div>;
  }

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
      <StatCard label="Students" value={summary.students || 0} />
      <StatCard label="Counselors" value={summary.counselors || 0} />
      <StatCard label="Admins" value={summary.admins || 0} />
      <StatCard label="Appointments" value={summary.appointments || 0} />
      <StatCard label="Forum Posts" value={summary.posts || 0} />
      <StatCard label="High Risk Records" value={summary.highRisk || 0} />
    </div>
  );
}
