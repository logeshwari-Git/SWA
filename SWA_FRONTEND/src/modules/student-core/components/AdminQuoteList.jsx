import { useEffect, useState } from "react";
import { apiJson } from "../utils/api";

const riskOptions = ["LOW", "MODERATE", "HIGH"];

function AdminQuoteList() {
  const [quotes, setQuotes] = useState([]);
  const [riskFilter, setRiskFilter] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editMessage, setEditMessage] = useState("");
  const [editRiskLevel, setEditRiskLevel] = useState("LOW");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchQuotes = async () => {
    try {
      setLoading(true);
      setStatus("");

      let url = "/api/admin/quotes";
      if (riskFilter) {
        url += `?riskLevel=${riskFilter}`;
      }

      const data = await apiJson(url);
      setQuotes(data.quotes || []);
    } catch (err) {
      console.error("Quote fetch error:", err);
      setStatus(err.message || "Failed to load quotes");
      setQuotes([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuotes();
  }, [riskFilter]);

  const startEdit = (quote) => {
    setEditingId(quote._id);
    setEditMessage(quote.message || "");
    setEditRiskLevel(quote.riskLevel || "LOW");
    setStatus("");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditMessage("");
    setEditRiskLevel("LOW");
    setStatus("");
  };

  const updateQuote = async (id) => {
    const message = editMessage.trim();
    if (!message) {
      setStatus("Quote message is required");
      return;
    }

    try {
      await apiJson(`/api/admin/quote/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message,
          riskLevel: editRiskLevel
        })
      });

      cancelEdit();
      fetchQuotes();
    } catch (err) {
      console.error("Quote update error:", err);
      setStatus(err.message || "Failed to update quote");
    }
  };

  const deleteQuote = async (id) => {
    if (!window.confirm("Delete this quote?")) return;

    try {
      await apiJson(`/api/admin/quote/${id}`, {
        method: "DELETE"
      });
      fetchQuotes();
    } catch (err) {
      console.error("Quote delete error:", err);
      setStatus(err.message || "Failed to delete quote");
    }
  };

  return (
    <div className="content-card admin-panel-card">
      <div className="panel-header">
        <div>
          <h2>Manage Quotes</h2>
          <p>Edit saved motivation quotes and match them to the right risk level.</p>
        </div>
      </div>

      <div className="filter-bar">
        <select
          value={riskFilter}
          onChange={(e) => setRiskFilter(e.target.value)}
        >
          <option value="">All Risk Levels</option>
          {riskOptions.map((risk) => (
            <option key={risk} value={risk}>
              {risk}
            </option>
          ))}
        </select>
      </div>

      {status && <p className="form-status">{status}</p>}
      {loading && <p className="empty-state">Loading quotes...</p>}

      {!loading && quotes.length === 0 ? (
        <p className="empty-state">No quotes found.</p>
      ) : (
        quotes.map((quote) => (
          <div key={quote._id} className="quote-card">
            {editingId === quote._id ? (
              <div className="editor-wrap">
                <textarea
                  value={editMessage}
                  onChange={(e) => setEditMessage(e.target.value)}
                  rows="4"
                />

                <select
                  value={editRiskLevel}
                  onChange={(e) => setEditRiskLevel(e.target.value)}
                >
                  {riskOptions.map((risk) => (
                    <option key={risk} value={risk}>
                      {risk}
                    </option>
                  ))}
                </select>

                <div className="question-actions">
                  <button onClick={() => updateQuote(quote._id)}>Save</button>
                  <button className="secondary-btn" onClick={cancelEdit}>Cancel</button>
                </div>
              </div>
            ) : (
              <>
                <div className="quote-content">
                  <p>{quote.message}</p>
                  <span className="difficulty-tag">{quote.riskLevel}</span>
                </div>

                <div className="question-actions">
                  <button onClick={() => startEdit(quote)}>Edit</button>
                  <button className="secondary-btn" onClick={() => deleteQuote(quote._id)}>Delete</button>
                </div>
              </>
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default AdminQuoteList;
