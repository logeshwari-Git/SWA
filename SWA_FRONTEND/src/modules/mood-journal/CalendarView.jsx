import React, { useState, useEffect } from "react";
import { getMoods } from "../mood-journal-api/moodApi";
import { useNavigate } from "react-router-dom"; // ✅ added

import "./CalendarView.css";

const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const months = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

// Mood Emoji Mapping
const moodEmoji = {
  1: "😡",
  2: "😢",
  3: "😐",
  4: "😊",
  5: "😁",
  6: "😍"
};

const CalendarView = () => {

  const navigate = useNavigate(); // ✅ added

  const [moodData, setMoodData] = useState({});
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [direction, setDirection] = useState("slide-left");

  useEffect(() => {
    fetchMoodData();
  }, [currentMonth]);

  const fetchMoodData = async () => {
    try {
      const moods = await getMoods();

      console.log("Moods from API:", moods);

      const data = {};

      moods.forEach((entry) => {
        const formattedDate = new Date(entry.mood_date)
          .toISOString()
          .split("T")[0];

        data[formattedDate] = {
          mood: entry.mood_code,
        };
      });

      setMoodData(data);
    } catch (err) {
      console.error("Error fetching moods:", err);
    }
  };

  const changeMonth = (dir) => {
    setDirection(dir === "next" ? "slide-left" : "slide-right");

    setTimeout(() => {
      setCurrentMonth(
        new Date(
          currentMonth.getFullYear(),
          currentMonth.getMonth() + (dir === "next" ? 1 : -1),
          1
        )
      );
    }, 200);
  };

  const firstDay = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth(),
    1
  ).getDay();

  const daysInMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() + 1,
    0
  ).getDate();

  const handleDayClick = (dateStr) => {
    setSelectedDate(dateStr);
    const entry = moodData[dateStr];
    console.log("Selected:", entry || { mood: 0, journal: "" }, dateStr);
  };

  const today = new Date();

  return (
    <div className="calendar-container">

      {/* ✅ Back Button added */}
      <button className="back-btn" onClick={() => navigate(-1)}>
        ← Back
      </button>

      <div className="calendar-header">
        <button onClick={() => changeMonth("prev")}>◀</button>
        <h2>
          {months[currentMonth.getMonth()]}{" "}
          {currentMonth.getFullYear()}
        </h2>
        <button onClick={() => changeMonth("next")}>▶</button>
      </div>

      <div className="weekdays">
        {weekdays.map((d) => (
          <div key={d} className="weekday">{d}</div>
        ))}
      </div>

      <div className={`days-grid ${direction}`}>
        {Array.from({ length: firstDay }).map((_, idx) => (
          <div key={`empty-${idx}`} className="day empty"></div>
        ))}

        {Array.from({ length: daysInMonth }).map((_, idx) => {
          const day = idx + 1;
          const dateObj = new Date(
            currentMonth.getFullYear(),
            currentMonth.getMonth(),
            day
          );

          const dateStr = `${currentMonth.getFullYear()}-${String(
            currentMonth.getMonth() + 1
          ).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

          const entry = moodData[dateStr];
          const mood = entry?.mood || 0;

          const isToday =
            today.toDateString() === dateObj.toDateString();

          const isSelected = selectedDate === dateStr;

          return (
            <div
              key={day}
              className={`day ${isToday ? "today" : ""} ${
                isSelected ? "selected" : ""
              }`}
              onClick={() => handleDayClick(dateStr)}
            >
              <div className="date-number">{day}</div>
              <div className="emoji">{moodEmoji[mood]}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CalendarView;