import { useEffect, useState } from "react";
import { apiJson } from "../utils/api";

function Counselor({ onBack }) {
  const [data, setData] = useState([]);
  const [stats, setStats] = useState({ totalStudents: 0, highRisk: 0 });
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const result = await apiJson("/api/counselor/dashboard");
      setData(result.data || []);
      setStats({
        totalStudents: result.totalStudents || 0,
        highRisk: result.highRisk || 0
      });
    } catch (err) {
      console.error("Counselor fetch error:", err);
      setData([]);
      setStats({ totalStudents: 0, highRisk: 0 });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const deleteStudent = async (studentId, day, date) => {
    if (!window.confirm(`Delete ${studentId} Day ${day} (${date})?`)) return;

    try {
      await apiJson(`/api/counselor/delete/${studentId}/${day}/${date}`, {
        method: "DELETE"
      });

      if (selectedStudent?.studentId === studentId && selectedStudent?.day === day && selectedStudent?.date === date) {
        setSelectedStudent(null);
      }

      fetchDashboard();
    } catch (err) {
      console.error("Delete failed:", err);
      alert(err.message || "Delete failed");
    }
  };

  if (loading && data.length === 0) {
    return <div className="content-card">Loading dashboard...</div>;
  }

  return (
    <div className="content-card">
      <h2 style={{ marginBottom: "20px" }}>Counselor Dashboard</h2>

      {onBack && (
        <button className="back-btn" onClick={onBack}>
          Back
        </button>
      )}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: "16px",
          flexWrap: "wrap",
          marginBottom: "20px",
          padding: "15px",
          background: "#f8f9fa",
          borderRadius: "10px"
        }}
      >
        <div>
          <strong>Total Students Who Took Test:</strong> {stats.totalStudents}
        </div>
        <div>
          <strong>Total High-Risk Records:</strong> {stats.highRisk}
        </div>
      </div>

      {!selectedStudent ? (
        data.length === 0 ? (
          <p>No high-risk students found.</p>
        ) : (
          <table border="1" width="100%" cellPadding="10">
            <thead>
              <tr>
                <th>#</th>
                <th>Student ID</th>
                <th>Day</th>
                <th>Initial Risk</th>
                <th>Final Risk</th>
                <th>Assessment Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row) => (
                <tr key={`${row.internalStudentId}-${row.day}-${row.date}`}>
                  <td>{row.serialNo}</td>
                  <td>{row.studentId}</td>
                  <td>{row.day}</td>
                  <td style={{ color: row.initialRisk === "HIGH" ? "red" : "inherit" }}>
                    {row.initialRisk || "-"}
                  </td>
                  <td style={{ color: row.finalRisk === "HIGH" ? "red" : "inherit" }}>
                    {row.finalRisk || "-"}
                  </td>
                  <td>{row.date}</td>
                  <td>
                    <button
                      onClick={() => setSelectedStudent(row)}
                      style={{ marginRight: "8px" }}
                    >
                      View
                    </button>
                    <button
                      onClick={() => deleteStudent(row.internalStudentId, row.day, row.date)}
                      style={{
                        background: "red",
                        color: "white",
                        border: "none",
                        padding: "6px 10px",
                        borderRadius: "5px",
                        cursor: "pointer"
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )
      ) : (
        <div style={{ textAlign: "left", marginTop: "20px" }}>
          <button
            onClick={() => setSelectedStudent(null)}
            style={{ marginBottom: "10px" }}
          >
            Back to list
          </button>

          <h3>
            Student: {selectedStudent.studentName || selectedStudent.studentId} ({selectedStudent.studentId}) | Day {selectedStudent.day}
          </h3>
          <p>
            <strong>Date:</strong> {selectedStudent.date}
          </p>
          <p>
            <strong>Initial Risk:</strong> {selectedStudent.initialRisk || "-"}
          </p>
          <p>
            <strong>Final Risk:</strong> {selectedStudent.finalRisk || "-"}
          </p>

          <h4>Assessment 1 Answers</h4>
          {selectedStudent.assessment1Answers?.length > 0 ? (
            selectedStudent.assessment1Answers.map((answer, index) => (
              <div key={`${answer.questionId || "q"}-${index}`} style={{ marginBottom: "10px" }}>
                <strong>{answer.category}</strong> | {answer.questionText || "Question text unavailable"} | Rating: {answer.rating}
              </div>
            ))
          ) : (
            <p>No assessment 1 answers.</p>
          )}

          <h4>Assessment 2 Answers</h4>
          {selectedStudent.assessment2Answers?.length > 0 ? (
            selectedStudent.assessment2Answers.map((answer, index) => (
              <div key={`${answer.questionId || "q"}-${index}`} style={{ marginBottom: "10px" }}>
                <strong>{answer.category}</strong> | {answer.questionText || "Question text unavailable"} | Rating: {answer.rating}
              </div>
            ))
          ) : (
            <p>No assessment 2 answers.</p>
          )}

          <button
            onClick={() => deleteStudent(selectedStudent.internalStudentId, selectedStudent.day, selectedStudent.date)}
            style={{
              marginTop: "20px",
              background: "red",
              color: "white",
              border: "none",
              padding: "8px 12px",
              borderRadius: "6px",
              cursor: "pointer"
            }}
          >
            Delete This Record
          </button>
        </div>
      )}
    </div>
  );
}

export default Counselor;
