import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import "./BookingStatus.css";

const API_BASE_URL = "http://127.0.0.1:5001";

const getAuthConfig = () => {
  const token = localStorage.getItem("authToken");
  return token
    ? {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    : {};
};

const getStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem("authUser") || "null");
  } catch {
    return null;
  }
};

const TIME_SLOTS = [
  "08:00 - 08:50 AM",
  "09:00 - 09:50 AM",
  "10:00 - 10:50 AM",
  "11:00 - 11:50 AM",
  "12:00 - 12:50 PM",
  "14:00 - 14:50 PM",
];

function BookingStatus() {
  const { id } = useParams();
  const navigate = useNavigate();
  const authUser = getStoredUser();

  const [appointment, setAppointment] = useState(null);
  const [newDate, setNewDate] = useState("");
  const [newSlot, setNewSlot] = useState("");
  const [bookedSlots, setBookedSlots] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [showChat, setShowChat] = useState(false);

  const fetchAppointment = useCallback(async () => {
    if (!id) return;

    try {
      const res = await axios.get(`${API_BASE_URL}/api/appointments/${id}`, getAuthConfig());
      setAppointment(res.data);
    } catch (err) {
      console.error("Error fetching appointment:", err);
    }
  }, [id]);

  const fetchMessages = useCallback(async () => {
    if (!id) return;

    try {
      const res = await axios.get(
        `${API_BASE_URL}/api/appointments/${id}/messages`,
        getAuthConfig()
      );
      setMessages(res.data || []);
    } catch (err) {
      console.error("Error fetching messages:", err);
    }
  }, [id]);

  useEffect(() => {
    const loadAppointment = async () => {
      await fetchAppointment();
    };

    loadAppointment();

    const interval = setInterval(() => {
      fetchAppointment();
    }, 5000);

    return () => clearInterval(interval);
  }, [fetchAppointment]);

  useEffect(() => {
    const loadMessages = async () => {
      await fetchMessages();
    };

    loadMessages();

    const messageInterval = setInterval(() => {
      fetchMessages();
    }, 3000);

    return () => clearInterval(messageInterval);
  }, [fetchMessages]);

  useEffect(() => {
    const fetchBookedSlots = async () => {
      if (!appointment?.counselorId?._id || !newDate) {
        return;
      }

      try {
        const res = await axios.get(
          `${API_BASE_URL}/api/appointments/booked-slots`,
          {
            ...getAuthConfig(),
            params: {
              counselorId: appointment.counselorId._id,
              date: newDate
            }
          }
        );
        setBookedSlots(res.data || []);
      } catch (err) {
        console.error("Error fetching booked slots:", err);
        setBookedSlots([]);
      }
    };

    fetchBookedSlots();
  }, [appointment, newDate]);

  const cancelBooking = async () => {
    try {
      await axios.delete(`${API_BASE_URL}/api/appointments/${id}`, getAuthConfig());
      fetchAppointment();
    } catch (err) {
      console.error("Error cancelling booking:", err);
    }
  };

  const submitReschedule = async () => {
    if (!newDate || !newSlot) {
      alert("Please select date and time");
      return;
    }

    if (bookedSlots.includes(newSlot)) {
      alert("This slot is already booked. Please choose another slot.");
      return;
    }

    try {
      await axios.put(
        `${API_BASE_URL}/api/appointments/reschedule/${id}`,
        {
          date: newDate,
          slot: newSlot
        },
        getAuthConfig()
      );

      alert("Appointment rescheduled successfully");
      setNewDate("");
      setNewSlot("");
      setBookedSlots([]);
      fetchAppointment();
    } catch (err) {
      console.error("Error rescheduling appointment:", err);
      alert("Reschedule failed");
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) {
      alert("Please enter a message");
      return;
    }

    try {
      await axios.post(
        `${API_BASE_URL}/api/appointments/${id}/message`,
        {
          text: newMessage,
          senderName: authUser?.name || "Student"
        },
        getAuthConfig()
      );
      setNewMessage("");
      fetchMessages();
    } catch (err) {
      console.error("Error sending message:", err);
      alert("Failed to send message");
    }
  };

  if (!appointment) {
    return <p>Loading booking details...</p>;
  }

  return (
    <div className="status-card">
      <button
        type="button"
        className="page-back-btn"
        style={{ marginBottom: "16px" }}
        onClick={() => navigate(-1)}
      >
        Back
      </button>

      <h2>Booking Status</h2>

      <p>
        <b>Status:</b>{" "}
        {appointment.status === "Pending" &&
          "⏳ Pending (Waiting for counselor response)"}
        {appointment.status === "Confirmed" && "✅ Accepted"}
        {appointment.status === "Rejected" && "❌ Rejected"}
        {appointment.status === "Reschedule Requested" &&
          "🔄 Counselor asked you to reschedule"}
        {appointment.status === "Completed" && "🎉 Session Completed"}
        {appointment.status === "Cancelled" && "🚫 Booking Cancelled"}
      </p>

      <p>
        <b>Counselor:</b> {appointment.counselorId?.name || "Not available"}
      </p>
      <p>
        <b>Date:</b> {appointment.date}
      </p>
      <p>
        <b>Time:</b> {appointment.slot}
      </p>

      <div className="important-notice-card">
        <h3>📌 Important Notice</h3>
        <p>
          • Please join your counseling session on time. Appointments may be cancelled if a student is more than 15 minutes late without prior notice.
        </p>
        <p>
          • If you are delayed or unable to attend due to an emergency, please inform your counselor through the chat section below as soon as possible.
        </p>
        <p>
          • Use the chat feature to communicate any appointment-related updates or concerns with your counselor.
        </p>
      </div>

      {appointment.status !== "Cancelled" &&
        appointment.status !== "Completed" && (
          <div className="btn-group">
            <button onClick={cancelBooking} className="danger">
              Cancel Booking
            </button>
          </div>
        )}

      {!["Rejected", "Cancelled", "Completed"].includes(appointment.status) && (
        <p className="booking-lock-message">
          You cannot book another session until this booking is rejected, cancelled, or completed.
        </p>
      )}

      {appointment.status === "Reschedule Requested" && (
        <div className="reschedule-box">
          <h4>Choose New Date and Time</h4>

          <label>New Date</label>
          <input
            type="date"
            value={newDate}
            onChange={(e) => {
              setNewDate(e.target.value);
              setNewSlot("");
            }}
          />

          <label>New Time</label>
          <select value={newSlot} onChange={(e) => setNewSlot(e.target.value)}>
            <option value="">-- Select Time Slot --</option>
            {TIME_SLOTS.map((slot, index) => (
              <option
                key={index}
                value={slot}
                disabled={bookedSlots.includes(slot)}
              >
                {slot} {bookedSlots.includes(slot) ? "(Booked)" : ""}
              </option>
            ))}
          </select>

          <button onClick={submitReschedule}>Submit Reschedule</button>
        </div>
      )}

      {appointment.status === "Confirmed" && (
        <p style={{ color: "green", fontWeight: "bold" }}>
          ✅ Booking Confirmed
        </p>
      )}

      {appointment.status === "Rejected" && (
        <p style={{ color: "red", fontWeight: "bold" }}>
          ❌ Booking Rejected
        </p>
      )}

      {appointment.status === "Cancelled" && (
        <p style={{ color: "gray", fontWeight: "bold" }}>
          🚫 Booking Cancelled
        </p>
      )}

      {appointment.status === "Completed" && (
        <div
          style={{
            marginTop: "10px",
            padding: "10px",
            borderRadius: "8px",
            backgroundColor: "#f0fff4",
          }}
        >
          <p style={{ color: "green", fontWeight: "bold" }}>
            ✅ Session Completed
          </p>
          <p>
            <b>Counselor Remarks:</b>
          </p>
          <p>{appointment.remarks || "No remarks provided"}</p>
        </div>
      )}

      {/* Chat Section */}
      {!["Cancelled", "Completed"].includes(appointment.status) && (
        <div className="chat-section">
          <button
            className="floating-chat-button"
            onClick={() => setShowChat(!showChat)}
          >
            💬 {showChat ? "Close Chat" : "Chat with Counselor"}
          </button>

          {showChat && (
            <div className="chat-container">
              <div className="messages-container">
                {messages.length === 0 ? (
                  <p className="no-messages">No messages yet. Start the conversation!</p>
                ) : (
                  messages.map((msg, index) => (
                    <div
                      key={index}
                      className={`message ${
                        msg.sender === "student" ? "student-message" : "counselor-message"
                      }`}
                    >
                      <p className="message-sender">{msg.senderName}</p>
                      <p className="message-text">{msg.text}</p>
                      <p className="message-time">
                        {new Date(msg.timestamp).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit"
                        })}
                      </p>
                    </div>
                  ))
                )}
              </div>

              <div className="message-input-section">
                <textarea
                  className="message-input"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message here..."
                  rows="3"
                />
                <button className="send-btn" onClick={sendMessage}>
                  Send Message
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default BookingStatus;
