import React from "react";

const helplines = [
  { name: "Mann Talks", phone: "+91-8686139139" },
  { name: "Arpita Foundation", phone: "+91-80-23655557" },
  { name: "Speak2Us", phone: "9375493754" },
  { name: "Mind Aid", phone: "+91-80-25374567" },
  { name: "Hope Foundation", phone: "+91-80-26547899" },
  { name: "Peace Minds", phone: "+91-80-27659843" },
  { name: "Mental Health Helpline", phone: "+91-80-27659844" },
  { name: "Serenity Trust", phone: "+91-80-27659845" },
  { name: "Smile Foundation", phone: "+91-80-27659846" },
  { name: "Youth Mindcare", phone: "+91-80-27659847" },
];

const containerStyle = {
  display: "flex",
  flexWrap: "wrap",
  justifyContent: "center",
  background: "#fde7ef",
  padding: "20px",
  minHeight: "100vh",
  flexDirection: "column", // stack heading above cards
  alignItems: "center",    // center heading and cards horizontally
};

const headingStyle = {
  textAlign: "center",
  color: "#ff4f87",
  marginBottom: "30px",
  fontSize: "2rem",
};

const cardsWrapperStyle = {
  display: "flex",
  flexWrap: "wrap",
  justifyContent: "center",
  gap: "15px",
};

const cardStyle = {
  background: "#fff0f5",
  padding: "20px",
  borderRadius: "12px",
  margin: "10px",
  width: "250px",
  boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
  transition: "transform 0.2s, box-shadow 0.2s",
  cursor: "pointer",
};

const nameStyle = { fontWeight: "bold", marginBottom: "10px", color: "#ff4f87" };
const phoneStyle = { fontWeight: "bold", color: "#333" };

export default function CrisisSupport() {
  return (
    <div style={containerStyle}>
      {/* Heading */}
      <h2 style={headingStyle}>Crisis Support</h2>

      {/* Cards wrapper */}
      <div style={cardsWrapperStyle}>
        {helplines.map((h, i) => (
          <div
            key={i}
            style={cardStyle}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.05)";
              e.currentTarget.style.boxShadow = "0 8px 16px rgba(0,0,0,0.2)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.boxShadow = "0 4px 8px rgba(0,0,0,0.1)";
            }}
          >
            <div style={nameStyle}>{h.name}</div>
            <div style={phoneStyle}>Helpline: {h.phone}</div>
          </div>
        ))}
      </div>
    </div>
  );
}