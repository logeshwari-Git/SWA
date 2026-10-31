import React from "react";

const IconDashboard = ({ setActiveSection }) => {
  const buttons = [
    { label: "Mood Tracker", section: "moodTracker" },
    { label: "Mood History", section: "moodHistory" },
    { label: "New Journal", section: "journalEntry" },
    { label: "Journal History", section: "journalHistory" },
    { label: "Mood Graph", section: "moodGraph" },
    { label: "Calendar View", section: "calendarView" },
    { label: "Affirmation", section: "affirmation" },
  ];

  return (
    <div className="icon-dashboard" style={{ display: "flex", flexWrap: "wrap", gap: "1rem", padding: "1rem" }}>
      {buttons.map((btn) => (
        <button key={btn.section} onClick={() => setActiveSection(btn.section)}>
          {btn.label}
        </button>
      ))}
    </div>
  );
};

export default IconDashboard;
