import React, { useState, useEffect } from "react";
import { updateJournal } from "../mood-journal-api/journalApi";
import { decrypt } from "../mood-journal-utils/encryption";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const JournalEdit = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const journal = location.state?.journal;

  const [text, setText] = useState("");

  useEffect(() => {
    if (journal?.journal_encrypted) {
      setText(decrypt(journal.journal_encrypted));
    }
  }, [journal]);

  const handleSave = async () => {
    if (!text.trim()) return alert("Write something before saving");

    try {
      await updateJournal(journal._id, { journal_text: text });
      alert("Journal updated!");
      navigate("/journal-history");
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert("Failed to save journal");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.4 }}
      style={containerStyle}
    >
      <h2 style={titleStyle}>💖 Edit Journal</h2>

      <motion.textarea
        whileFocus={{ scale: 1.02 }}
        rows={6}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Edit your journal..."
        style={textareaStyle}
      />

      <div style={{ marginTop: "1.8rem", display: "flex", gap: "1rem" }}>
        <motion.button
          whileHover={{ scale: 1.07 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleSave}
          style={saveButton}
        >
          Save
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.07 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/journal-history")}
          style={backButton}
        >
          Back
        </motion.button>
      </div>
    </motion.div>
  );
};

const containerStyle = {
  padding: "2rem",
  maxWidth: "650px",
  margin: "3rem auto",
  borderRadius: "25px",
  backdropFilter: "blur(18px)",
  background: "rgba(255, 192, 203, 0.15)",
  boxShadow: "0 20px 60px rgba(255, 105, 180, 0.25)",
  border: "1px solid rgba(255, 255, 255, 0.3)",
};

const titleStyle = {
  marginBottom: "1.5rem",
  fontSize: "1.8rem",
  fontWeight: "600",
  background: "linear-gradient(90deg, #ff4da6, #ff99cc)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  textAlign: "center",
};

const textareaStyle = {
  width: "650 px",
  padding: "1.2 rem",
  borderRadius: "20px",
  border: "1px solid rgba(255, 105, 180, 0.3)",
  fontSize: "1rem",
  resize: "vertical",
  outline: "none",
  background: "rgba(255, 255, 255, 0.7)",
  boxShadow: "0 10px 30px rgba(255, 105, 180, 0.2)",
  transition: "all 0.3s ease",
};

const saveButton = {
  padding: "0.7rem 1.6rem",
  borderRadius: "20px",
  border: "none",
  background: "linear-gradient(135deg, #ff4da6, #ff66cc)",
  color: "#fff",
  fontWeight: "600",
  cursor: "pointer",
  boxShadow: "0 10px 25px rgba(255, 20, 147, 0.3)",
};

const backButton = {
  padding: "0.7rem 1.6rem",
  borderRadius: "20px",
  border: "none",
  background: "linear-gradient(135deg, #ff99cc, #ffb3d9)",
  color: "#fff",
  fontWeight: "600",
  cursor: "pointer",
  boxShadow: "0 10px 25px rgba(255, 105, 180, 0.2)",
};

export default JournalEdit;
