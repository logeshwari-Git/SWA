import { useEffect, useState } from "react";

function SplashScreen({ onFinish }) {
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFadeOut(true);
      setTimeout(() => {
        onFinish();
      }, 800);
    }, 3200);

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div className={`splash-container ${fadeOut ? "fade-out" : ""}`}>
      <div className="splash-card">
        <div className="splash-orb-group">
          <span className="splash-orb splash-orb-one">🌸</span>
          <span className="splash-orb splash-orb-two">✨</span>
          <span className="splash-orb splash-orb-three">💗</span>
        </div>
        <h1>Student Wellbeing App</h1>
        <p className="quote">🌿 Breathe, reset, and begin with care.</p>
      </div>
    </div>
  );
}

export default SplashScreen;
