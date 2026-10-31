import { useState } from "react";
import { apiJson } from "../utils/api";

function AdminAddQuote() {
  const [message, setMessage] = useState("");
  const [riskLevel, setRiskLevel] = useState("LOW");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus("");

    try {
      await apiJson("/api/admin/add-quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, riskLevel })
      });

      setStatus("Quote added successfully");
      setMessage("");
    } catch (err) {
      setStatus(err.message || "Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="content-card">
      <h2>Add Motivation Quote</h2>

      <form onSubmit={handleSubmit}>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Enter motivational quote..."
          required
          rows="5"
        />

        <select
          value={riskLevel}
          onChange={(e) => setRiskLevel(e.target.value)}
        >
          <option value="LOW">Low Risk</option>
          <option value="MODERATE">Moderate Risk</option>
          <option value="HIGH">High Risk</option>
        </select>

        <button type="submit" disabled={loading || !message.trim()}>
          {loading ? "Adding..." : "Add Quote"}
        </button>
      </form>

      {status && <p>{status}</p>}
    </div>
  );
}

export default AdminAddQuote;
