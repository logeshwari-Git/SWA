import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "./CounselorDashboard.css";

const TIME_SLOTS = [
  "08:00 - 08:50 AM",
  "09:00 - 09:50 AM",
  "10:00 - 10:50 AM",
  "11:00 - 11:50 AM",
  "12:00 - 12:50 PM",
  "14:00 - 14:50 PM"
];

const API_BASE_URL = "http://127.0.0.1:5001";

function getAuthConfig() {
  const token = localStorage.getItem("authToken");
  return token
    ? { headers: { Authorization: `Bearer ${token}` } }
    : {};
}

function getStoredUser() {
  try {
    return JSON.parse(localStorage.getItem("authUser") || "null");
  } catch {
    return null;
  }
}

function CounselorDashboard({ forcedCounselorId = "" }) {
  const params = useParams();
  const counselorId = forcedCounselorId || params.id;
  const authUser = getStoredUser();
  const [appointments, setAppointments] = useState([]);
  const [remarks, setRemarks] = useState({});
  const [selectedTab, setSelectedTab] = useState("Bookings");
  const [selectedDate, setSelectedDate] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [chatAppointmentId, setChatAppointmentId] = useState(null);
  const [messages, setMessages] = useState({});
  const [newMessage, setNewMessage] = useState({});

  const fetchAppointments = async () => {
    if (!counselorId) return;
    try {
      const res = await axios.get(
        `${API_BASE_URL}/api/appointments/counselor/${counselorId}`,
        getAuthConfig()
      );
      setAppointments(res.data || []);
    } catch (err) {
      console.error(err);
      setAppointments([]);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [counselorId]);

  const fetchMessages = async (appointmentId) => {
    if (!appointmentId) return;
    try {
      const res = await axios.get(
        `${API_BASE_URL}/api/appointments/${appointmentId}/messages`,
        getAuthConfig()
      );
      setMessages(prev => ({ ...prev, [appointmentId]: res.data || [] }));
    } catch (err) {
      console.error("Error fetching messages:", err);
    }
  };

  useEffect(() => {
    if (chatAppointmentId) {
      fetchMessages(chatAppointmentId);
      const messageInterval = setInterval(() => {
        fetchMessages(chatAppointmentId);
      }, 3000);
      return () => clearInterval(messageInterval);
    }
  }, [chatAppointmentId]);

  const updateStatus = async (appointmentId, action, message) => {
    try {
      await axios.put(
        `${API_BASE_URL}/api/appointments/${action}/${appointmentId}`,
        {},
        getAuthConfig()
      );
      alert(message);
      fetchAppointments();
    } catch (err) {
      console.error(err);
      alert("Failed to update status");
    }
  };

  const completeSession = async (appointmentId) => {
    if (!remarks[appointmentId] || !remarks[appointmentId].trim()) {
      alert("Please enter remarks before completing the session");
      return;
    }
    try {
      await axios.put(
        `${API_BASE_URL}/api/appointments/complete/${appointmentId}`,
        { remarks: remarks[appointmentId] },
        getAuthConfig()
      );
      alert("Session completed successfully");
      fetchAppointments();
    } catch (err) {
      console.error(err);
      alert("Failed to complete session");
    }
  };

  const cancelBooking = async (appointmentId) => {
    try {
      await axios.delete(
        `${API_BASE_URL}/api/appointments/${appointmentId}`,
        getAuthConfig()
      );
      alert("Booking cancelled successfully");
      fetchAppointments();
    } catch (err) {
      console.error(err);
      alert("Failed to cancel booking");
    }
  };

  const sendMessage = async (appointmentId) => {
    if (!newMessage[appointmentId] || !newMessage[appointmentId].trim()) {
      alert("Please enter a message");
      return;
    }

    try {
      await axios.post(
        `${API_BASE_URL}/api/appointments/${appointmentId}/message`,
        {
          text: newMessage[appointmentId],
          senderName: authUser?.name || "Counselor"
        },
        getAuthConfig()
      );
      setNewMessage(prev => ({ ...prev, [appointmentId]: "" }));
      fetchMessages(appointmentId);
    } catch (err) {
      console.error("Error sending message:", err);
      alert("Failed to send message");
    }
  };

  const parseLocalDate = (dateString) => {
    if (!dateString) return null;
    const parts = dateString.split("-");
    if (parts.length !== 3) return null;
    return new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
  };

  const formatDateString = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const getAppointmentsForDate = (dateString) => {
    return filteredAppointments.filter((a) => a.date === dateString);
  };

  const getAppointmentCountForDate = (dateString) => {
    return getAppointmentsForDate(dateString).length;
  };

  const getMonthDays = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const getPreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const getNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const monthName = currentMonth.toLocaleString("default", { month: "long", year: "numeric" });
  const monthDays = getMonthDays(currentMonth);
  const firstDay = getFirstDayOfMonth(currentMonth);
  const calendarDays = [];

  // Add empty cells for days before month starts
  for (let i = 0; i < firstDay; i++) {
    calendarDays.push(null);
  }

  // Add days of the month
  for (let i = 1; i <= monthDays; i++) {
    calendarDays.push(i);
  }

  const getFilteredAppointments = () => {
    return appointments.filter((appointment) => {
      if (selectedTab === "Bookings") {
        return (
          appointment.status === "Pending" ||
          appointment.status === "Reschedule Requested"
        );
      }
      if (selectedTab === "Accepted") {
        return appointment.status === "Confirmed";
      }
      if (selectedTab === "Completed") {
        return appointment.status === "Completed";
      }
      return false;
    });
  };

  const filteredAppointments = getFilteredAppointments();
  const selectedDateString = selectedDate ? formatDateString(selectedDate) : null;
  const selectedAppointments = selectedDateString
    ? getAppointmentsForDate(selectedDateString)
    : [];

  return (
    <div className="counselor-dashboard">
      <h2>Counselor Calendar Dashboard</h2>

      <div className="dashboard-tabs" style={{ marginBottom: "20px" }}>
        <button
          className={selectedTab === "Bookings" ? "active-tab" : ""}
          onClick={() => setSelectedTab("Bookings")}
        >
          Bookings
        </button>
        <button
          className={selectedTab === "Accepted" ? "active-tab" : ""}
          onClick={() => setSelectedTab("Accepted")}
        >
          Accepted
        </button>
        <button
          className={selectedTab === "Completed" ? "active-tab" : ""}
          onClick={() => setSelectedTab("Completed")}
        >
          Completed
        </button>
      </div>

      <div className="calendar-section">
        <div className="calendar-header">
          <button onClick={getPreviousMonth} className="nav-btn">
            ← Previous
          </button>
          <h3>{monthName}</h3>
          <button onClick={getNextMonth} className="nav-btn">
            Next →
          </button>
        </div>

        <div className="calendar-weekdays">
          <div className="weekday">Sun</div>
          <div className="weekday">Mon</div>
          <div className="weekday">Tue</div>
          <div className="weekday">Wed</div>
          <div className="weekday">Thu</div>
          <div className="weekday">Fri</div>
          <div className="weekday">Sat</div>
        </div>

        <div className="calendar-grid">
          {calendarDays.map((day, index) => {
            if (day === null) {
              return <div key={`empty-${index}`} className="calendar-cell empty"></div>;
            }

            const cellDate = new Date(
              currentMonth.getFullYear(),
              currentMonth.getMonth(),
              day
            );
            const cellDateString = formatDateString(cellDate);
            const appointmentCount = getAppointmentCountForDate(cellDateString);
            const isSelected =
              selectedDate &&
              selectedDate.getDate() === day &&
              selectedDate.getMonth() === currentMonth.getMonth() &&
              selectedDate.getFullYear() === currentMonth.getFullYear();

            return (
              <div
                key={day}
                className={`calendar-cell ${isSelected ? "selected" : ""} ${
                  appointmentCount > 0 ? "has-appointments" : ""
                }`}
                onClick={() => {
                  setSelectedDate(cellDate);
                }}
              >
                <div className="day-number">{day}</div>
                {appointmentCount > 0 && (
                  <div className="appointment-count">
                    {appointmentCount} {appointmentCount === 1 ? "Appointment" : "Appointments"}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {selectedDate && (
        <div className="details-panel">
          <h3>
            Appointments for {selectedDate.toLocaleDateString("default", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric"
            })}
          </h3>

          {selectedAppointments.length === 0 ? (
            <p>No appointments scheduled for this date.</p>
          ) : (
            <div className="appointments-list">
              {selectedAppointments.map((appointment) => (
                <div key={appointment._id} className="appointment-detail-card">
                  <div className="appointment-info">
                    <p>
                      <b>Student:</b> {appointment.studentName}
                    </p>
                    <p>
                      <b>Email:</b> {appointment.email}
                    </p>
                    <p>
                      <b>Phone:</b> {appointment.phone}
                    </p>
                    <p>
                      <b>Date:</b> {appointment.date}
                    </p>
                    <p>
                      <b>Time:</b> {appointment.slot}
                    </p>
                    <p>
                      <b>Status:</b>{" "}
                      <span className={`status-badge status-${appointment.status.toLowerCase().replace(" ", "-")}`}>
                        {appointment.status}
                      </span>
                    </p>
                  </div>

                  {appointment.status === "Pending" && (
                    <div className="action-buttons">
                      <button
                        onClick={() => updateStatus(appointment._id, "accept", "Appointment confirmed")}
                        className="btn-accept"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => updateStatus(appointment._id, "request-reschedule", "Reschedule request sent")}
                        className="btn-reschedule"
                      >
                        Request Reschedule
                      </button>
                    </div>
                  )}

                  {appointment.status === "Reschedule Requested" && (
                    <div className="reschedule-info">
                      <p>
                        <b>Suggested Date:</b>{" "}
                        {appointment.counselorSuggestedDate || "Waiting for student to suggest"}
                      </p>
                      <p>
                        <b>Suggested Time:</b>{" "}
                        {appointment.counselorSuggestedSlot || "Waiting for student to suggest"}
                      </p>
                    </div>
                  )}

                  {appointment.status === "Confirmed" && (
                    <div className="confirmed-actions">
                      <p style={{ color: "green", fontWeight: "bold" }}>✅ Confirmed</p>
                      <button
                        onClick={() => setChatAppointmentId(chatAppointmentId === appointment._id ? null : appointment._id)}
                        className="btn-chat"
                      >
                        💬 {chatAppointmentId === appointment._id ? "Close" : "Open"} Chat
                      </button>
                      <button
                        onClick={() => cancelBooking(appointment._id)}
                        className="btn-cancel"
                      >
                        Cancel Booking
                      </button>

                      {chatAppointmentId === appointment._id && (
                        <div className="chat-box">
                          <div className="messages-display">
                            {!messages[appointment._id] || messages[appointment._id].length === 0 ? (
                              <p className="no-messages">No messages yet.</p>
                            ) : (
                              messages[appointment._id].map((msg, idx) => (
                                <div
                                  key={idx}
                                  className={`message ${msg.sender === "counselor" ? "counselor-msg" : "student-msg"}`}
                                >
                                  <p className="msg-sender">{msg.senderName}</p>
                                  <p className="msg-text">{msg.text}</p>
                                  <p className="msg-time">
                                    {new Date(msg.timestamp).toLocaleTimeString([], {
                                      hour: "2-digit",
                                      minute: "2-digit"
                                    })}
                                  </p>
                                </div>
                              ))
                            )}
                          </div>
                          <div className="message-input-box">
                            <textarea
                              placeholder="Type your message..."
                              value={newMessage[appointment._id] || ""}
                              onChange={(e) =>
                                setNewMessage(prev => ({ ...prev, [appointment._id]: e.target.value }))
                              }
                              rows="2"
                            />
                            <button
                              onClick={() => sendMessage(appointment._id)}
                              className="send-msg-btn"
                            >
                              Send
                            </button>
                          </div>
                        </div>
                      )}

                      <div className="remarks-section">
                        <label>
                          <b>Session Remarks</b>
                        </label>
                        <textarea
                          placeholder="Enter remarks for the student"
                          value={remarks[appointment._id] || ""}
                          onChange={(e) =>
                            setRemarks({ ...remarks, [appointment._id]: e.target.value })
                          }
                        />
                        <button
                          onClick={() => completeSession(appointment._id)}
                          className="btn-complete"
                        >
                          Complete Session
                        </button>
                      </div>
                    </div>
                  )}

                  {appointment.status === "Completed" && (
                    <div className="completed-info">
                      <p style={{ color: "green", fontWeight: "bold" }}>✅ Session Completed</p>
                      <p>
                        <b>Remarks:</b> {appointment.remarks || "No remarks provided"}
                      </p>
                    </div>
                  )}

                  {appointment.status === "Cancelled" && (
                    <p style={{ color: "gray", fontWeight: "bold" }}>🚫 Booking Cancelled</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default CounselorDashboard;