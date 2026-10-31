import React, { useMemo } from "react";
import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";
import "./MoodHeatmap.css";

const MoodHeatmapPremium = ({ data = [] }) => {
  const today = new Date();
  const startDate = new Date(today.getFullYear(), 0, 1);

  // Find highest mood value
  const highestValue = useMemo(() => {
    if (!data.length) return 0;
    return Math.max(...data.map((d) => d.count));
  }, [data]);

  return (
    <div className="premium-bg">
      {/* ✨ Floating Sparkles */}
      <div className="sparkles">
        {Array.from({ length: 25 }).map((_, i) => (
          <span key={i}></span>
        ))}
      </div>

      <div className="heatmap-container glass-card fade-in">
        <h2 className="title">💗 Mood Tracker</h2>

        <CalendarHeatmap
          startDate={startDate}
          endDate={today}
          values={data}
          classForValue={(value) => {
            if (!value) return "color-empty";
            if (value.count === highestValue)
              return `color-scale-4 highest-mood`;
            return `color-scale-${value.count}`;
          }}
        />
      </div>
    </div>
  );
};

export default MoodHeatmapPremium;
