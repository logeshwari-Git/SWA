import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaSmile,
  FaHistory,
  FaBook,
  FaCalendarAlt,
  FaChartLine,
  FaFire,
} from "react-icons/fa";
import { getMoods } from "../mood-journal-api/moodApi";
import "./Dashboard.css";

const modules = [
  { title: "Mood", icon: <FaSmile />, color: "#ff4da6", path: "/mood-entry" },
  { title: "Mood History", icon: <FaHistory />, color: "#ff66b3", path: "/mood-history" },
  { title: "Journal", icon: <FaBook />, color: "#ff85c1", path: "/journal" },
  { title: "Journal History", icon: <FaHistory />, color: "#ff99cc", path: "/journal-history" },
  { title: "Calendar", icon: <FaCalendarAlt />, color: "#ffb3d9", path: "/calendar" },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const [moods, setMoods] = useState([]);
  const [streakDays, setStreakDays] = useState([]);
  const [streak, setStreak] = useState(0);
  const [affirmation, setAffirmation] = useState("");
  const [fireActive, setFireActive] = useState(false);

  useEffect(() => {
    fetchMoods();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setFireActive((prev) => !prev);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const fetchMoods = async () => {
    try {
      const data = await getMoods();
      setMoods(data);
      calculateStreak(data);
      generateAffirmation(data);
    } catch (err) {
      console.error(err);
    }
  };

  const calculateStreak = (data) => {
    if (!data.length) return;

    const sorted = [...data].sort(
      (a, b) => new Date(b.mood_date) - new Date(a.mood_date)
    );

    let currentStreak = 0;
    let today = new Date();

    for (let i = 0; i < sorted.length; i++) {
      const moodDate = new Date(sorted[i].mood_date);

      const diff =
        Math.floor(
          (today.setHours(0, 0, 0, 0) -
            moodDate.setHours(0, 0, 0, 0)) /
            (1000 * 60 * 60 * 24)
        );

      if (diff === currentStreak) {
        currentStreak++;
      } else {
        break;
      }
    }

    setStreak(currentStreak);

    const last7 = [];
    for (let i = 6; i >= 0; i--) {
      const checkDate = new Date();
      checkDate.setDate(checkDate.getDate() - i);

      const exists = data.some(
        (m) =>
          new Date(m.mood_date).toDateString() ===
          checkDate.toDateString()
      );

      last7.push(exists);
    }
    setStreakDays(last7);
  };

  const generateAffirmation = (data) => {
    if (!data.length) return setAffirmation("Start your journey today 💖");

    const latest = data[data.length - 1].mood_code;

    const affirmations = {
      1: "You survived today. That’s strength 💪",
      2: "Healing takes time 🌸",
      3: "Progress is progress ✨",
      4: "You’re glowing lately 💖",
      5: "You are unstoppable 🔥",
    };

    setAffirmation(affirmations[latest] || "Keep going 💕");
  };

  return (
    <div className="dashboard-container">

      {/* ✅ Back Button added */}
      <button className="back-btn" onClick={() => navigate(-1)}>
        ← Back
      </button>

      <div className="profile-section">
        <div className="avatar"></div>
        <div className="streak">
          <FaFire className={`fire-icon ${fireActive ? "active" : ""}`} />
          <span>{streak} days streak</span>
        </div>
        <p className="affirmation">{affirmation}</p>
      </div>

      <div className="mini-mood-bar">
        {streakDays.map((day, i) => (
          <div
            key={i}
            className={`day ${day ? "active" : ""}`}
            style={{ animationDelay: `${i * 0.15}s` }}
          ></div>
        ))}
      </div>

      <div className="modules-grid">
        {modules.map((mod) => (
          <div
            key={mod.title}
            className="module-card"
            onClick={() => navigate(mod.path)}
          >
            <div className="icon">{mod.icon}</div>
            <div className="title">{mod.title}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;