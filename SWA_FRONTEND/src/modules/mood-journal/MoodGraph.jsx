import React, { useEffect, useMemo, useState } from "react";
import { getMoods } from "../mood-journal-api/moodApi";
import { Line } from "react-chartjs-2";
import { useNavigate } from "react-router-dom";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

const moodEmojis = {
  1: "😢",
  2: "😕",
  3: "😐",
  4: "🙂",
  5: "😄",
};

const MoodGraph = () => {
  const navigate = useNavigate(); // ✅ navigation added

  const [moods, setMoods] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [viewType, setViewType] = useState("monthly");
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    async function fetchMoods() {
      const data = await getMoods();
      setMoods(Array.isArray(data) ? data : []);
    }
    fetchMoods();
  }, []);

  const filteredMoods = useMemo(() => {
    if (!Array.isArray(moods)) return [];
    if (!selectedMonth) return moods;

    return moods.filter((m) => {
      const date = new Date(m.mood_date);
      const month = `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, "0")}`;
      return month === selectedMonth;
    });
  }, [moods, selectedMonth]);

  const processedData = useMemo(() => {
    if (!Array.isArray(filteredMoods)) return [];

    if (viewType === "weekly") {
      const weeks = {};
      filteredMoods.forEach((m) => {
        const date = new Date(m.mood_date);
        const week = Math.ceil(date.getDate() / 7);
        const key = `Week ${week}`;

        if (!weeks[key]) weeks[key] = [];
        weeks[key].push(m.intensity || 3);
      });

      return Object.keys(weeks).map((w) => ({
        label: w,
        value:
          weeks[w].reduce((a, b) => a + b, 0) / weeks[w].length,
      }));
    }

    return filteredMoods.map((m) => ({
      label: new Date(m.mood_date).toLocaleDateString(),
      value: m.intensity || 3,
    }));
  }, [filteredMoods, viewType]);

  const maxMood = Math.max(
    ...processedData.map((d) => d.value || 0),
    0
  );

  const chartData = {
    labels: processedData.map((d) => d.label),
    datasets: [
      {
        label: "Mood",
        data: processedData.map((d) => d.value),
        borderColor: "#ff6b9d",
        backgroundColor: "rgba(255,107,157,0.2)",
        tension: 0.4,
        fill: true,
        pointRadius: processedData.map((d) =>
          d.value === maxMood ? 8 : 4
        ),
        pointBackgroundColor: processedData.map((d) =>
          d.value === maxMood ? "#ff0000" : "#ff6b9d"
        ),
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    animation: {
      duration: 1000,
      easing: "easeOutQuart",
    },
    plugins: {
      legend: {
        labels: {
          color: darkMode ? "#fff" : "#000",
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: darkMode ? "#fff" : "#000",
        },
        grid: {
          color: darkMode ? "#444" : "#ccc",
        },
      },
      y: {
        min: 1,
        max: 5,
        ticks: {
          stepSize: 1,
          color: darkMode ? "#fff" : "#000",
          callback: function (value) {
            return moodEmojis[value] || value;
          },
        },
        grid: {
          color: darkMode ? "#444" : "#ccc",
        },
      },
    },
  };

  const months = [
    ...new Set(
      moods.map((m) => {
        const date = new Date(m.mood_date);
        return `${date.getFullYear()}-${String(
          date.getMonth() + 1
        ).padStart(2, "0")}`;
      })
    ),
  ];

  return (
    <div
      style={{
        padding: "2rem",
        borderRadius: "20px",
        backdropFilter: "blur(15px)",
        background: darkMode
          ? "rgba(20,20,20,0.7)"
          : "rgba(255,255,255,0.6)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
        color: darkMode ? "#fff" : "#000",
      }}
    >
      <h2>Mood Graph</h2>

      <div style={{ marginBottom: "1rem" }}>
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
        >
          <option value="">All Months</option>
          {months.map((month) => (
            <option key={month} value={month}>
              📅 {month}
            </option>
          ))}
        </select>

        <button onClick={() => setViewType("weekly")}>
          📊 Weekly
        </button>
        <button onClick={() => setViewType("monthly")}>
          📈 Daily
        </button>

        <button onClick={() => setDarkMode(!darkMode)}>
          🌙 Toggle Theme
        </button>
      </div>

      {processedData.length === 0 ? (
        <p>No mood data yet.</p>
      ) : (
        <Line data={chartData} options={chartOptions} />
      )}

      {/* ✅ FIXED BACK BUTTON */}
      <button
        onClick={() => navigate(-1)}
        style={{
          marginTop: "1rem",
          padding: "10px 20px",
          borderRadius: "10px",
          border: "none",
          cursor: "pointer",
        }}
      >
        ⬅ Back
      </button>
    </div>
  );
};

export default MoodGraph;
