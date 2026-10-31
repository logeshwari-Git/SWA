import { useEffect, useState } from "react";
import { API_BASE_URL } from "../utils/api";

function AdminManageQuotes() {
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newQuote, setNewQuote] = useState({
    message: "",
    riskLevel: "LOW"
  });
  const [message, setMessage] = useState("");

  // Fetch all quotes
  const fetchQuotes = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/quotes`);
      const data = await res.json();
      setQuotes(data.quotes || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuotes();
  }, []);

  // Add new quote
  const addQuote = async () => {
    if (!newQuote.message.trim()) {
      setMessage("❌ Enter quote message");
      return;
    }

    try {
      setMessage("");
      const res = await fetch(`${API_BASE_URL}/api/admin/add-quote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newQuote)
      });

      if (res.ok) {
        setMessage("✅ Quote added!");
        setNewQuote({ message: "", riskLevel: "LOW" });
        fetchQuotes(); // Refresh list
      } else {
        setMessage("❌ Failed to add quote");
      }
    } catch (err) {
      setMessage("❌ Server error");
    }
  };

  // Toggle quote active/inactive
  const toggleQuote = async (id, isActive) => {
    try {
      await fetch(`${API_BASE_URL}/api/admin/toggle-quote/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !isActive })
      });
      fetchQuotes(); // Refresh list
      setMessage(`✅ Quote ${isActive ? "deactivated" : "activated"}`);
    } catch (err) {
      setMessage("❌ Failed to update");
    }
  };

  if (loading) return <div className="content-card">⏳ Loading quotes...</div>;

  return (
    <div className="content-card" style={{ padding: "20px" }}>
      <h2>💬 Manage Quotes ({quotes.length})</h2>

      {/* ADD NEW QUOTE */}
      <div style={{ 
        background: "#f9f9f9", 
        padding: "20px", 
        borderRadius: "10px", 
        marginBottom: "30px" 
      }}>
        <h3>➕ Add New Quote</h3>
        <textarea
          value={newQuote.message}
          onChange={(e) => setNewQuote({ ...newQuote, message: e.target.value })}
          placeholder="Enter motivational quote..."
          style={{ width: "100%", height: "100px", marginBottom: "10px", padding: "10px" }}
        />
        <select 
          value={newQuote.riskLevel}
          onChange={(e) => setNewQuote({ ...newQuote, riskLevel: e.target.value })}
          style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
        >
          <option value="LOW">Low Risk</option>
          <option value="MODERATE">Moderate Risk</option>
          <option value="HIGH">High Risk</option>
        </select>
        <button onClick={addQuote} style={{ width: "100%", padding: "10px", background: "#ff6b6b", color: "white", border: "none" }}>
          Add Quote
        </button>
      </div>

      {/* ALL QUOTES TABLE */}
      <div style={{ maxHeight: "500px", overflow: "auto" }}>
        <table border="1" style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#ff6b6b", color: "white" }}>
              <th>Quote</th>
              <th>Risk Level</th>
              <th>Status</th>
              <th>Date Added</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {quotes.map((q) => (
              <tr key={q._id} style={{ borderBottom: "1px solid #ddd" }}>
                <td style={{ maxWidth: "400px" }}>"{q.message}"</td>
                <td>
                  <span style={{ 
                    color: q.riskLevel === "HIGH" ? "red" : 
                            q.riskLevel === "MODERATE" ? "orange" : "green",
                    fontWeight: "bold"
                  }}>
                    {q.riskLevel}
                  </span>
                </td>
                <td>
                  <span style={{ 
                    color: q.isActive ? "green" : "red",
                    fontWeight: "bold"
                  }}>
                    {q.isActive ? "✅ Active" : "❌ Inactive"}
                  </span>
                </td>
                <td>{new Date(q.createdAt).toLocaleDateString()}</td>
                <td>
                  <button 
                    onClick={() => toggleQuote(q._id, q.isActive)}
                    style={{
                      padding: "5px 10px",
                      background: q.isActive ? "#f44336" : "#4CAF50",
                      color: "white",
                      border: "none",
                      borderRadius: "3px",
                      cursor: "pointer"
                    }}
                  >
                    {q.isActive ? "Deactivate" : "Activate"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {message && (
        <p style={{ 
          marginTop: "20px", 
          padding: "15px", 
          background: "#fff3cd", 
          borderRadius: "5px", 
          textAlign: "center",
          fontWeight: "bold"
        }}>
          {message}
        </p>
      )}
    </div>
  );
}

export default AdminManageQuotes;
