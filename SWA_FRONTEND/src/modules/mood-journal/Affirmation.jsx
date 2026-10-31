import React, { useState } from "react";

const affirmations = [
  "You are enough just as you are.",
  "Take a deep breath and let go of stress.",
  "Small steps every day lead to big changes.",
  "Your feelings are valid and important.",
  "Happiness is a journey, not a destination.",
  "You are stronger than you think.",
  "Focus on what you can control today.",
  "Be kind to yourself.",
];

const Affirmation = ({ goBack }) => {
  const [current, setCurrent] = useState(0);

  const nextAffirmation = () => {
    setCurrent((prev) => (prev + 1) % affirmations.length);
  };

  return (
    <div style={{ padding: "1rem", textAlign: "center" }}>
      <h2>Affirmation</h2>
      <div className="card accent" style={{ padding: "2rem", margin: "1rem 0", fontSize: "1.2rem" }}>
        {affirmations[current]}
      </div>
      <button onClick={nextAffirmation} style={{ marginRight: "0.5rem" }}>Next</button>
      <button onClick={goBack}>Back</button>
    </div>
  );
};

export default Affirmation;
