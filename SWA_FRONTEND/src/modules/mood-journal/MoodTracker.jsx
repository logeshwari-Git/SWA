import React, { useState, useEffect } from "react";
import { saveMood, getMoods } from "../mood-journal-api/moodApi";
import { motion } from "framer-motion";
import Confetti from "react-confetti";
import { useNavigate } from "react-router-dom";
import "./MoodTracker.css";

// ---------------- VISITOR ID ----------------
const getVisitorKey = () => {
  let visitorId = sessionStorage.getItem("visitorId");
  if (!visitorId) {
    visitorId = Math.random().toString(36).substr(2, 9);
    sessionStorage.setItem("visitorId", visitorId);
  }
  return visitorId;
};

const moodMap = [
  { code: 1, emoji: "😡" },
  { code: 2, emoji: "😢" },
  { code: 3, emoji: "😐" },
  { code: 4, emoji: "😊" },
  { code: 5, emoji: "😁" },
  { code: 6, emoji: "😍" },
];

const stickerMap = [
  { code: 1, icon: "🌸" },
  { code: 2, icon: "🌼" },
  { code: 3, icon: "🌺" },
  { code: 4, icon: "🌷" },
  { code: 5, icon: "🍀" },
];

const moodBackgrounds = {
  1: "linear-gradient(135deg, #fee2e2, #fecaca)",
  2: "linear-gradient(135deg, #e0f2fe, #bae6fd)",
  3: "linear-gradient(135deg, #f1f5f9, #e2e8f0)",
  4: "linear-gradient(135deg, #fef9c3, #fde68a)",
  5: "linear-gradient(135deg, #dcfce7, #bbf7d0)",
  6: "linear-gradient(135deg, #fce7f3, #fbcfe8)",
};

const moodDescriptions = {
  1: "Take a breath. It will pass.",
  2: "It’s okay to feel low sometimes.",
  3: "A calm and steady day.",
  4: "Glad you're feeling good!",
  5: "Energy looks high today!",
  6: "Feeling loved and connected 💕",
};

const MoodTracker = ({ onBack }) => {
  const [selectedMood, setSelectedMood] = useState(null);
  const [intensity, setIntensity] = useState(3);
  const [selectedSticker, setSelectedSticker] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);

  const [todayCount, setTodayCount] = useState(0);
  const [moodLimitReached, setMoodLimitReached] = useState(false);
  const [timeLeft, setTimeLeft] = useState(null);

  const navigate = useNavigate();
  const visitorKey = (() => {
    try {
      const u = JSON.parse(localStorage.getItem("authUser"));
      if (u?.id || u?._id || u?.username) return u.id || u._id || u.username;
    } catch (e) {}
    return "guest";
  })();

  const handleGoBack = () => {
    if (onBack) onBack();
    else navigate(-1);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const syncBackendMoods = async () => {
      try {
        const userMoods = await getMoods();
        if (Array.isArray(userMoods)) {
          const logs = userMoods.map((m) => ({ time: m.mood_date || m.createdAt }));
          localStorage.setItem(`moodLogs_${visitorKey}`, JSON.stringify(logs));
        }
      } catch (e) {}
      checkMoodLimit();
    };
    syncBackendMoods();
    }, 1000);
    const syncBackendMoods = async () => {
      try {
        const userMoods = await getMoods();
        if (Array.isArray(userMoods)) {
          const logs = userMoods.map((m) => ({ time: m.mood_date || m.createdAt }));
          localStorage.setItem(`moodLogs_${visitorKey}`, JSON.stringify(logs));
        }
      } catch (e) {}
      checkMoodLimit();
    };
    syncBackendMoods();
    return () => clearInterval(interval);
  }, []);

  const checkMoodLimit = () => {
    const stored = JSON.parse(localStorage.getItem(`moodLogs_${visitorKey}`)) || [];
    const now = new Date();

    const todayLogs = stored.filter((log) => {
      const logDate = new Date(log.time);
      return logDate.toDateString() === now.toDateString();
    });

    setTodayCount(todayLogs.length);

    if (todayLogs.length >= 3) {
      setMoodLimitReached(true);
      setTimeLeft(null);
      return;
    }

    if (todayLogs.length > 0) {
      const lastLog = new Date(todayLogs[todayLogs.length - 1].time);
      const nextAllowed = new Date(lastLog.getTime() + 4 * 60 * 60 * 1000);

      if (now < nextAllowed) {
        setMoodLimitReached(true);
        const diff = nextAllowed - now;
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff / (1000 * 60)) % 60);
        const seconds = Math.floor((diff / 1000) % 60);

        setTimeLeft(
          `${hours.toString().padStart(2, "0")}:${minutes
            .toString()
            .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
        );
        return;
      }
    }

    setMoodLimitReached(false);
    setTimeLeft(null);
  };

  const handleSave = async () => {
    if (!selectedMood) return alert("Please select a mood!");
    if (moodLimitReached) return;

    const moodData = {
      mood_code: selectedMood.code,
      intensity,
      sticker_code: selectedSticker ? selectedSticker.code : 1,
      mood_date: new Date(),
    };

    try {
      await saveMood(moodData);

      const stored = JSON.parse(localStorage.getItem(`moodLogs_${visitorKey}`)) || [];
      stored.push({ time: new Date() });
      localStorage.setItem(`moodLogs_${visitorKey}`, JSON.stringify(stored));

      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);

      setSelectedMood(null);
      setSelectedSticker(null);
      setIntensity(3);

      const syncBackendMoods = async () => {
      try {
        const userMoods = await getMoods();
        if (Array.isArray(userMoods)) {
          const logs = userMoods.map((m) => ({ time: m.mood_date || m.createdAt }));
          localStorage.setItem(`moodLogs_${visitorKey}`, JSON.stringify(logs));
        }
      } catch (e) {}
      checkMoodLimit();
    };
    syncBackendMoods();
      alert("Mood saved successfully 💖");
      handleGoBack();
    } catch (err) {
      console.error("Error saving mood:", err.response?.data || err.message);
      alert("Error saving mood. Check backend.");
    }
  };

  return (
    <motion.div
      className="mood-tracker"
      style={{
        background: selectedMood
          ? moodBackgrounds[selectedMood.code]
          : undefined,
        transition: "background 0.5s ease",
      }}
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 25 }}
    >
      {showConfetti && <Confetti numberOfPieces={150} recycle={false} />}

      <button className="back-btn" onClick={handleGoBack}>
        ← Back
      </button>

      <h2>💗 How are you feeling today?</h2>

      <div className="progress-section">
        <p>
          Today’s Logs: <strong>{todayCount}/3</strong>
        </p>
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${(todayCount / 3) * 100}%` }}
          />
        </div>
      </div>

      {timeLeft && <p className="countdown">⏳ Next mood available in: {timeLeft}</p>}

      <div className="emoji-grid">
        {moodMap.map((m) => (
          <motion.button
            key={m.code}
            className={`emoji-btn ${selectedMood?.code === m.code ? "selected" : ""}`}
            onClick={() => setSelectedMood(m)}
            whileTap={{ scale: 0.9 }}
            whileHover={{ scale: 1.2 }}
          >
            {m.emoji}
          </motion.button>
        ))}
      </div>

      {selectedMood && (
        <motion.p
          className="mood-description"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {moodDescriptions[selectedMood.code]}
        </motion.p>
      )}

      <div className="intensity-slider">
        <label>Intensity: {intensity}</label>
        <input
          type="range"
          min="1"
          max="5"
          value={intensity}
          onChange={(e) => setIntensity(parseInt(e.target.value))}
        />
      </div>

      <div className="sticker-grid">
        {stickerMap.map((s) => (
          <motion.button
            key={s.code}
            className={`sticker-btn ${selectedSticker?.code === s.code ? "selected" : ""}`}
            onClick={() => setSelectedSticker(s)}
            whileTap={{ scale: 0.9 }}
            whileHover={{ scale: 1.2 }}
          >
            {s.icon}
          </motion.button>
        ))}
      </div>

      <motion.button
        className="save-btn"
        onClick={handleSave}
        disabled={moodLimitReached}
        whileTap={{ scale: moodLimitReached ? 1 : 0.95 }}
        whileHover={{ scale: moodLimitReached ? 1 : 1.05 }}
      >
        {moodLimitReached ? "Available Later ⏳" : "Save Mood 💖"}
      </motion.button>
    </motion.div>
  );
};

export default MoodTracker;