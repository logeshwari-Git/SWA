import React, { useEffect, useState, useRef } from "react";
import { getJournals, deleteJournal } from "../mood-journal-api/journalApi";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import "./JournalHistory.css";

const JournalHistory = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const todayRef = useRef(null);

  const [journals, setJournals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJournals();
  }, []);

  useEffect(() => {
    if (location.state?.highlightToday && todayRef.current) {
      todayRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [location.state, journals]);

  const fetchJournals = async () => {
    try {
      const data = await getJournals(); // ✅ token auth, no userId
      setJournals(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this journal?")) return;
    await deleteJournal(id);
    fetchJournals();
  };

  const handleEdit = (journal) => {
    navigate("/journal-edit", { state: { journal } });
  };

  const todayDate = new Date().toISOString().split("T")[0];

  return (
    <motion.div
      className="journal-container"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h2 className="journal-title">💗 Journal History</h2>

      {/* ✅ Back button now goes to previous page (Mood Tracker if that's where user came from) */}
      <button className="back-btn" onClick={() => navigate(-1)}>
        ← Back
      </button>

      {loading && <p className="info-text">Loading journals…</p>}
      {!loading && journals.length === 0 && <p className="info-text">No journal entries yet.</p>}

      {journals.map((j) => {
        const journalDate = new Date(j.journal_date).toISOString().split("T")[0];
        const isToday = journalDate === todayDate;

        return (
          <motion.div
            key={j._id}
            ref={isToday ? todayRef : null}
            className={`journal-card ${isToday ? "today" : ""}`}
          >
            {isToday && <span className="today-badge">Today</span>}
            <p>{j.journal_text}</p>
            <small className="date">{new Date(j.journal_date).toLocaleDateString()}</small>

            <div className="btn-group">
              <button className="edit-btn" onClick={() => handleEdit(j)}>Edit</button>
              <button className="delete-btn" onClick={() => handleDelete(j._id)}>Delete</button>
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
};

export default JournalHistory;