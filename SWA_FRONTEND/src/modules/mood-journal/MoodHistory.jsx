import React, { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Line } from "react-chartjs-2";
import { getMoods } from "../mood-journal-api/moodApi"; // ✅ USE API
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";
import "./MoodHistory.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

const moodEmojiMap = {
  1: "😡",
  2: "😢",
  3: "😐",
  4: "😊",
  5: "😁",
  6: "😍",
};

const MoodHistory = ({ goBack, refreshTrigger }) => {
  const [moods, setMoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const handleGoBack = () => {
    if (goBack) goBack();
    else navigate(-1);
  };

  useEffect(() => {
    const loadMoods = async () => {
      setLoading(true);
      try {
        const data = await getMoods(); // ✅ FETCH FROM BACKEND
        setMoods(data || []);
      } catch (err) {
        console.error("Failed to load moods", err);
        setMoods([]);
      } finally {
        setLoading(false);
      }
    };

    loadMoods();
  }, [refreshTrigger]);

  /* -------- GRAPH DATA -------- */
  const chartData = useMemo(() => {
    if (!moods.length) return null;
    const labels = moods.map((m) =>
      new Date(m.mood_date).toLocaleDateString()
    );
  const values = moods.map((m) => m.mood_code || 3);

    return {
      labels,
      datasets: [
        {
          label: "Mood Intensity",
          data: values,
          borderColor: "#ff6b9d",
          backgroundColor: "rgba(255,107,157,0.2)",
          tension: 0.4,
          fill: true,
        },
      ],
    };
  }, [moods]);

 const chartOptions = {
  responsive: true,
  plugins: {
    legend: { labels: { color: "#fff" } },
    tooltip: {
      callbacks: {
        label: function (context) {
          const moodLabels = {
            1: "😡 Angry",
            2: "😢 Sad",
            3: "😐 Neutral",
            4: "😊 Happy",
            5: "😁 Excited",
            6: "😍 Loved",
          };
          return moodLabels[context.raw] || "Mood";
        },
      },
    },
  },
  scales: {
    x: { ticks: { color: "#fff" } },
    y: {
      min: 1,
      max: 6,
      ticks: {
        stepSize: 1,
        color: "#fff",
        callback: function (value) {
          const moodLabels = {
            1: "😡",
            2: "😢",
            3: "😐",
            4: "😊",
            5: "😁",
            6: "😍",
          };
          return moodLabels[value] || value;
        },
      },
    },
  },
};

  /* -------- GROUP HISTORY -------- */
  const groupedMoods = useMemo(() => {
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    const groups = { Today: [], Yesterday: [], Older: [] };

    moods.forEach((mood) => {
      const moodDate = new Date(mood.mood_date);
      if (moodDate.toDateString() === today.toDateString())
        groups.Today.push(mood);
      else if (moodDate.toDateString() === yesterday.toDateString())
        groups.Yesterday.push(mood);
      else groups.Older.push(mood);
    });

    return groups;
  }, [moods]);

  return (
    <motion.div
      className="mood-history"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="history-header">
        <button className="back-btn" onClick={handleGoBack}>
          ← Back
        </button>
        <h2 className="history-title">💗 Mood History</h2>
      </div>

      {loading && <p className="info-text">Loading moods…</p>}
      {!loading && moods.length === 0 && (
        <p className="info-text">No moods recorded yet 🌱</p>
      )}

      {!loading && chartData && (
        <div style={{ marginBottom: "30px" }}>
          <Line data={chartData} options={chartOptions} />
        </div>
      )}

      {Object.entries(groupedMoods).map(([group, groupMoods]) =>
        groupMoods.length > 0 ? (
          <div key={group} className="group-section">
            <h3 className="group-title">{group}</h3>
            <div className="history-list">
              {groupMoods.map((mood, index) => (
                <motion.div
                  key={mood._id}
                  className="history-card"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.03 }}
                >
                  <div className="emoji">
                    {moodEmojiMap[mood.mood_code]}
                  </div>
                  <div className="details">
                    <p>
                      Intensity: <strong>{mood.intensity}</strong>
                    </p>
                    <p className="date">
                      {new Date(mood.mood_date).toLocaleDateString()}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ) : null
      )}
    </motion.div>
  );
};

export default MoodHistory;