import { useEffect, useState } from "react";
import { API_BASE_URL } from "../utils/api";

const CounselorDashboard = () => {
  const [data, setData] = useState([]);
  const [totalStudents, setTotalStudents] = useState(0);
  const [highRiskCount, setHighRiskCount] = useState(0);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [range, setRange] = useState("");
  const [loading, setLoading] = useState(false);

  // ================= FETCH =================
  const fetchDashboard = async () => {
    try {
      setLoading(true);

      const url = range
        ? `${API_BASE_URL}/api/counselor/dashboard?range=${range}`
        : `${API_BASE_URL}/api/counselor/dashboard`;

      const res = await fetch(url);
      const result = await res.json();

      setData(result.data || []);
      setTotalStudents(result.totalStudents || 0);
      setHighRiskCount(result.highRisk || 0);

    } catch (err) {
      console.error("Dashboard error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, [range]);

  // ================= DELETE =================
  const deleteStudent = async (studentId, day, date) => {
    if (!window.confirm(`Delete ${studentId} Day ${day}?`)) return;

    try {
      await fetch(
        `${API_BASE_URL}/api/counselor/delete/${studentId}/${day}/${date}`,
        { method: "DELETE" }
      );

      fetchDashboard();
      setSelectedStudent(null);

    } catch (err) {
      console.error("Delete error:", err);
      alert("Delete failed");
    }
  };

  if (loading) return <div className="content-card">⏳ Loading...</div>;

  return (
    <div className="content-card" style={{ padding: "20px" }}>
      <h2>🧑‍⚕️ Counselor Dashboard</h2>

      {/* FILTER */}
      <div style={{ marginBottom: "20px" }}>
        <select value={range} onChange={(e) => setRange(e.target.value)}>
          <option value="">All Time</option>
          <option value="week">Last 7 Days</option>
          <option value="month">Last 30 Days</option>
          <option value="year">Last Year</option>
        </select>

        <span style={{ marginLeft: "20px" }}>
          Total Students: <strong>{totalStudents}</strong>
        </span>

        <span style={{ color: "red", marginLeft: "20px" }}>
          High Risk: <strong>{highRiskCount}</strong>
        </span>
      </div>

      {/* ================= LIST ================= */}
      {!selectedStudent ? (
        <table border="1" style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#eee" }}>
              <th>#</th>
              <th>Student</th>
              <th>Day</th>
              <th>Initial</th>
              <th>Final</th>
              <th>Date</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {data.map((r) => (
              <tr key={`${r.studentId}-${r.day}-${r.date}`}>
                <td>{r.serialNo}</td>
                <td>{r.studentId}</td>
                <td>{r.day}</td>

                <td>{r.initialRisk}</td>

                <td style={{
                  color:
                    r.finalRisk === "HIGH"
                      ? "red"
                      : r.finalRisk === "MODERATE"
                      ? "orange"
                      : "green",
                  fontWeight: "bold"
                }}>
                  {r.finalRisk}
                </td>

                <td>{r.date}</td>

                <td>
                  <button onClick={() => setSelectedStudent(r)}>
                    View
                  </button>

                  <button
                    style={{ background: "red", color: "white", marginLeft: "10px" }}
                    onClick={() => deleteStudent(r.studentId, r.day, r.date)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        // ================= DETAILS =================
        <div>
          <button onClick={() => setSelectedStudent(null)}>
            ← Back
          </button>

          <h3>
            {selectedStudent.studentId} - Day {selectedStudent.day}
          </h3>

          <p><b>Date:</b> {selectedStudent.date}</p>
          <p><b>Initial Risk:</b> {selectedStudent.initialRisk}</p>
          <p><b>Final Risk:</b> {selectedStudent.finalRisk}</p>

          {/* SCORES */}
          <h4>📊 Scores</h4>
          <p>GHQ: {selectedStudent.scores?.ghq}</p>
          <p>WHO: {selectedStudent.scores?.who}%</p>
          <p>PHQ: {selectedStudent.scores?.phq}</p>
          <p>GAD: {selectedStudent.scores?.gad}</p>

          <h4>🔥 MBI</h4>
          <p>Exhaustion: {selectedStudent.scores?.mbi?.exhaustion?.toFixed(1)}</p>
          <p>Cynicism: {selectedStudent.scores?.mbi?.cynicism?.toFixed(1)}</p>
          <p>Efficacy: {selectedStudent.scores?.mbi?.efficacy?.toFixed(1)}</p>

          {/* ANSWERS */}
          <h4>Assessment 1 Answers</h4>
          {selectedStudent.assessment1Answers?.length > 0 ? (
            selectedStudent.assessment1Answers.map((a, i) => (
              <div key={i}>
                <strong>{a.category}</strong> → {a.rating}
              </div>
            ))
          ) : <p>No A1 answers</p>}

          <h4>Assessment 2 Answers</h4>
          {selectedStudent.assessment2Answers?.length > 0 ? (
            selectedStudent.assessment2Answers.map((a, i) => (
              <div key={i}>
                <strong>{a.category}</strong> → {a.rating}
              </div>
            ))
          ) : <p>No A2 answers</p>}

          <button
            style={{ marginTop: "20px", background: "red", color: "white" }}
            onClick={() =>
              deleteStudent(
                selectedStudent.studentId,
                selectedStudent.day,
                selectedStudent.date
              )
            }
          >
            Delete This Record
          </button>
        </div>
      )}
    </div>
  );
};

export default CounselorDashboard;