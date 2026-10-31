import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiJson } from "../utils/api";

function Assessment({ studentId, onBack }) {
  const [assessment, setAssessment] = useState(null);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();

  const ui = {
    sparkles: "\u2728",
    pointRight: "\u{1F449}",
    crescentMoon: "\u{1F319}",
    leftArrow: "\u2190"
  };

  const fallbackQuoteByRisk = {
    LOW: "You are doing well. Keep taking care of yourself.",
    MODERATE: "Take things gently and use the support and self-care tools available to you.",
    HIGH: "You are not alone. Reaching out for support is a strength."
  };

  const emojis = ["\u{1F604}", "\u{1F642}", "\u{1F610}", "\u{1F61E}", "\u{1F622}"];

  useEffect(() => {
    loadNextAssessment();
  }, []);

  const loadNextAssessment = async () => {
    try {
      setLoading(true);
      setAnswers({});

      const data = await apiJson(`/api/student/next-assessment/${studentId}`);

      if (data.completedToday) {
        setAssessment(null);
        return;
      }

      setAssessment(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const submitAssessment = async () => {
    try {
      const answerArray = assessment.questions.map((q) => ({
        questionId: q._id,
        questionText: q.questionText,
        category: q.category,
        rating: answers[q._id] ?? 0
      }));

      const data = await apiJson("/api/student/submit-assessment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId,
          dayNumber: assessment.dayNumber,
          assessmentNumber: assessment.assessmentNumber,
          answers: answerArray
        })
      });
      setResult(data);
      setShowResult(true);

      if (assessment.assessmentNumber === 2 && data.riskLevel === "HIGH") {
        setShowPopup(true);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const renderBackButton = () => {
    if (!onBack) return null;

    return (
      <button
        className="back-btn"
        onClick={onBack}
        style={{ marginBottom: "20px" }}
      >
        {ui.leftArrow} Back
      </button>
    );
  };

  if (loading) {
    return (
      <div className="assessment-state-screen" style={{ textAlign: "center", padding: "20px" }}>
        {renderBackButton()}
        <h2>Loading...</h2>
      </div>
    );
  }

  if (showResult && result) {
    return (
      <div className="assessment-result-wrap assessment-state-screen" style={{ textAlign: "center", padding: "30px" }}>
        {renderBackButton()}

        <div className="result-card">
          <div className="result-badge">{ui.sparkles} Daily support quote</div>
          <h2 className="result-quote-text">
            {result.quote || fallbackQuoteByRisk[result.riskLevel] || "Your result is ready"}
          </h2>
        </div>

        {result.goToAdvanced && (
          <button
            style={{
              marginTop: "20px",
              padding: "12px 20px",
              background: "#ff4d88",
              color: "white",
              border: "none",
              borderRadius: "10px",
              cursor: "pointer"
            }}
            onClick={() => {
              setShowResult(false);
              loadNextAssessment();
            }}
          >
            {ui.pointRight} Take Next Assessment
          </button>
        )}

        {!result.goToAdvanced && (
          <button
            style={{
              marginTop: "20px",
              padding: "12px 20px",
              background: "green",
              color: "white",
              border: "none",
              borderRadius: "10px",
              cursor: "pointer"
            }}
            onClick={() => {
              setShowResult(false);
              if (onBack) {
                onBack();
                return;
              }
              loadNextAssessment();
            }}
          >
            {ui.crescentMoon} Done for Today
          </button>
        )}

        {showPopup && (
          <div className="popup-card" style={{ marginTop: "30px", padding: "20px", background: "#fff" }}>
            <h3>Need Support?</h3>
            <p>Book counselor appointment?</p>

            <button
              style={{ marginRight: "10px" }}
              onClick={() => {
                setShowPopup(false);
                navigate("/appointments", {
                  state: {
                    fromAssessment: true,
                    riskLevel: result?.riskLevel || "HIGH",
                    studentId
                  }
                });
              }}
            >
              Yes
            </button>

            <button onClick={() => setShowPopup(false)}>No</button>
          </div>
        )}
      </div>
    );
  }

  if (!assessment || !assessment.questions) {
    return (
      <div className="assessment-state-screen assessment-done-screen" style={{ textAlign: "center" }}>
        {renderBackButton()}
        <h2>Done for today</h2>
        <p>Assessment 1 will be available tomorrow</p>
      </div>
    );
  }

  const totalQuestions = assessment.questions.length;
  const answered = Object.keys(answers).length;

  return (
    <div className="assessment-container">
      {renderBackButton()}

      <h2 className="title">
        Day {assessment.dayNumber} - Assessment {assessment.assessmentNumber}
      </h2>

      {assessment.questions.map((q) => (
        <div key={q._id} className="question-card">
          <p className="question-text">{q.questionText}</p>

          <div className="emoji-row">
            {emojis.map((emoji, idx) => (
              <span
                key={idx}
                className={`emoji-btn ${answers[q._id] === idx ? "active" : ""}`}
                onClick={() => setAnswers({ ...answers, [q._id]: idx })}
              >
                {emoji}
              </span>
            ))}
          </div>
        </div>
      ))}

      <button
        className="btn-primary"
        onClick={submitAssessment}
        disabled={answered < totalQuestions}
        style={{
          background: answered === totalQuestions ? undefined : "gray",
          cursor: answered === totalQuestions ? "pointer" : "not-allowed"
        }}
      >
        Submit ({answered}/{totalQuestions})
      </button>
    </div>
  );
}

export default Assessment;
