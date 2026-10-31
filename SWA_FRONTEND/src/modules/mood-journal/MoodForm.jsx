import { useState } from "react";
import { saveMood } from "../api";
import { moodMap } from "../mood-journal-utils/moodMap";
import { motion } from "framer-motion";

export default function MoodForm() {
  const [mood, setMood] = useState("");

  const handleSave = async () => {
    if (!mood) return alert("Select a mood");

    try {
      await saveMood({
        userId: "student1",
        mood: Number(mood),
        intensity: 3,
      });
      alert("Mood Saved!");
      setMood("");
    } catch (err) {
      console.error(err);
      alert("Failed to save mood");
    }
  };

  return (
    <motion.div
      className="card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={{
        padding: "20px",
        borderRadius: "15px",
        boxShadow: "0 6px 18px rgba(0,0,0,0.12)",
        background: "#fff",
        textAlign: "center",
        marginBottom: "20px",
      }}
    >
      <h2>Mood Tracker</h2>
      <div style={{ display: "flex", justifyContent: "space-around", margin: "20px 0" }}>
        {Object.entries(moodMap).map(([value, { emoji, label }]) => (
          <motion.button
            key={value}
            whileHover={{ scale: 1.3 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setMood(value)}
            style={{
              fontSize: "28px",
              padding: "10px",
              border: mood === value ? "2px solid #4CAF50" : "1px solid #ccc",
              borderRadius: "12px",
              cursor: "pointer",
              background: mood === value ? "#e6f4ea" : "#f9f9f9",
            }}
            title={label}
          >
            {emoji}
          </motion.button>
        ))}
      </div>
      <button
        onClick={handleSave}
        style={{
          width: "100%",
          padding: "12px",
          fontSize: "16px",
          fontWeight: "bold",
          backgroundColor: "#4CAF50",
          color: "#fff",
          border: "none",
          borderRadius: "12px",
          cursor: "pointer",
        }}
      >
        Save Mood
      </button>
    </motion.div>
  );
}
