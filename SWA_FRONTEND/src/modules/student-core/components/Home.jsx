function Home({ onBack }) {
  return (
    <div className="home-wrapper">
      <button className="back-btn" onClick={onBack}>Back</button>

      <div className="hero-section">
        <h1 className="hero-title">Welcome to your wellbeing era</h1>
        <p className="hero-subtitle">
          A calm little corner to reset, reflect, and feel more like yourself again.
        </p>
      </div>

      <div className="home-grid">
        <div className="home-card">
          <img src="https://cdn-icons-png.flaticon.com/512/4320/4320337.png" alt="Reset" />
          <h3>Reset</h3>
          <p>Slow the noise, breathe deeper, and let your day soften a bit.</p>
        </div>

        <div className="home-card">
          <img src="https://cdn-icons-png.flaticon.com/512/4320/4320371.png" alt="Reflect" />
          <h3>Reflect</h3>
          <p>Notice what you feel without pressure to have everything figured out.</p>
        </div>

        <div className="home-card">
          <img src="https://cdn-icons-png.flaticon.com/512/4320/4320394.png" alt="Glow up" />
          <h3>Glow Up</h3>
          <p>Small habits build confidence, balance, and a stronger version of you.</p>
        </div>
      </div>

      <div className="motivation-box">
        <h2>Today's Mood Boost</h2>
        <p>"You do not need to rush your healing. Progress still counts when it feels gentle."</p>
      </div>

      <div className="selfcare-tips">
        <div className="tip">Hydrate and romanticize your water bottle.</div>
        <div className="tip">Take five deep breaths before the next task.</div>
        <div className="tip">Step outside for a tiny sunlight break.</div>
        <div className="tip">Write one honest line about how today feels.</div>
      </div>
    </div>
  );
}

export default Home;
