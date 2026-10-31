import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "./BookingConfirmation.css"; // optional, for card styling

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

function BookingConfirmation() {
  const { id } = useParams();   // ✅ Get appointment ID from URL
  const [booking, setBooking] = useState(null);

  // Fetch booking details from backend
  useEffect(() => {
    if (!id) return;

    axios
      .get(`${API_BASE_URL}/api/appointments/${id}`, getAuthConfig())
      .then(res => setBooking(res.data))
      .catch(err => console.log(err));
  }, [id]);

  if (!booking) return <div>Loading booking details...</div>;

  // Cancel booking (student)
  const cancelBooking = () => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;

    axios
      .delete(`${API_BASE_URL}/api/appointments/${booking._id}`, getAuthConfig())
      .then(() => {
        alert("Booking cancelled");
        setBooking({ ...booking, status: "Cancelled" });
      })
      .catch(err => console.log(err));
  };

  // Change date/time (student reschedule)
  const changeDateTime = () => {
    const newDate = prompt("Enter new date (YYYY-MM-DD):", booking.date);
    const newSlot = prompt("Enter new time (HH:MM):", booking.slot);
    if (!newDate || !newSlot) return;

    axios
      .put(
        `${API_BASE_URL}/api/appointments/reschedule/${booking._id}`,
        {
          date: newDate,
          slot: newSlot
        },
        getAuthConfig()
      )
      .then(() => {
        alert("Reschedule requested");
        setBooking({
          ...booking,
          date: newDate,
          slot: newSlot,
          status: "Reschedule"
        });
      })
      .catch(err => console.log(err));
  };

  return (
    <div className="booking-confirmation">
      <h2>Booking Confirmation</h2>

      <p><strong>Student:</strong> {booking.studentName}</p>
      <p><strong>Email:</strong> {booking.email}</p>
      <p><strong>Phone:</strong> {booking.phone}</p>
      <p><strong>Counselor:</strong> {booking.counselorId?.name || booking.counselorName || "Not available"}</p>
      <p><strong>Date:</strong> {booking.date}</p>
      <p><strong>Time:</strong> {booking.slot}</p>
      <p><strong>Status:</strong> {booking.status}</p>

      <div className="booking-buttons">
        <button onClick={cancelBooking}>Cancel Booking</button>
        <button onClick={changeDateTime}>Change Date / Time</button>
      </div>
    </div>
  );
}

export default BookingConfirmation;
