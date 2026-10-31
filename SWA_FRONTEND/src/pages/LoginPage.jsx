import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({
    username: "",
    password: ""
  });
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    try {
      await login(form);
      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="login-shell">
      <div className="login-hero">
        <div className="login-orb login-orb--one" />
        <div className="login-orb login-orb--two" />
        <div className="login-sticker login-sticker--top">✨</div>
        <div className="login-sticker login-sticker--mid">💗</div>
        <div className="login-sticker login-sticker--bottom">🌿</div>
        <div className="login-badge">Student Wellbeing App</div>
        <p className="login-kicker">Campus care, made simple</p>
        <h1>Support your students with a calmer, clearer daily wellbeing space.</h1>
        <p className="login-copy">
          Assessments, journaling, self-care, crisis guidance, and counselor support brought into one focused experience.
        </p>

        <div className="login-summary">
          <div className="login-summary-card">
            <span>Designed For</span>
            <strong>Students, counselors, and admins</strong>
          </div>
          <div className="login-summary-card">
            <span>Made For</span>
            <strong>Daily wellbeing check-ins at scale</strong>
          </div>
        </div>

        <div className="login-points">
          <div className="login-point">
            <span className="login-point-icon">🫶</span>
            <strong>Daily Assessment</strong>
            <span>Quick check-ins with guided next steps.</span>
          </div>
          <div className="login-point">
            <span className="login-point-icon">📝</span>
            <strong>Reflection</strong>
            <span>Journaling and mood history in one flow.</span>
          </div>
          <div className="login-point">
            <span className="login-point-icon">🤝</span>
            <strong>Real Support</strong>
            <span>Self-care tools and counselor connection.</span>
          </div>
        </div>
      </div>

      <div className="login-panel">
        <div className="login-card login-card--premium">
          <div className="login-card-glow" />
          <p className="eyebrow">Secure Login</p>
          <h2>Sign in</h2>
          <p className="login-form-copy">Continue into the wellbeing workspace with your approved account.</p>

          <form onSubmit={handleSubmit} className="stack">
            <label className="login-field">
              <span>User ID / Username</span>
              <input
                placeholder="Enter your username"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
              />
            </label>

            <label className="login-field">
              <span>Password</span>
              <input
                type="password"
                placeholder="Enter your password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </label>

            {error ? <p className="error">{error}</p> : null}

            <button type="submit" className="login-submit">
              Enter App
            </button>
          </form>

          <div className="login-footer-note">
            <span>Private access for student, counselor, and admin users.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
