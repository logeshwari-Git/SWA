import { Navigate, Route, Routes, useParams } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import AssessmentPage from "./pages/AssessmentPage";
import MoodPage from "./pages/MoodPage";
import JournalPage from "./pages/JournalPage";
import SelfCarePage from "./pages/SelfCarePage";
import ForumPage from "./pages/ForumPage";
import AppointmentPage from "./pages/AppointmentPage";
import CrisisPage from "./pages/CrisisPage";
import CounselorPage from "./pages/CounselorPage";
import AdminPage from "./pages/AdminPage";
import BookingStatus from "./modules/appointments/BookingStatus";
import BookingConfirmation from "./modules/appointments/BookingConfirmation";
import AppointmentCounselorDashboard from "./modules/appointments/CounselorDashboard";
import MoodTracker from "./modules/mood-journal/MoodTracker";
import MoodHistory from "./modules/mood-journal/MoodHistory";
import CalendarView from "./modules/mood-journal/CalendarView";
import MoodGraph from "./modules/mood-journal/MoodGraph";
import JournalHistory from "./modules/mood-journal/JournalHistory";
import JournalEdit from "./modules/mood-journal/JournalEdit";
import "./modules/student-core/styles.css";

function ProtectedRoute({ children, allowedRoles }) {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}

function BookingConfirmationWrapper() {
  const { id } = useParams();
  return <BookingConfirmation bookingId={id} />;
}

export default function App() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route
        path="/login"
        element={user ? <Navigate to="/" replace /> : <LoginPage />}
      />
      <Route path="/" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
      <Route path="/assessment" element={<ProtectedRoute allowedRoles={["student"]}><AssessmentPage /></ProtectedRoute>} />
      <Route path="/mood" element={<ProtectedRoute allowedRoles={["student"]}><MoodPage /></ProtectedRoute>} />
      <Route path="/mood-entry" element={<ProtectedRoute allowedRoles={["student"]}><MoodTracker /></ProtectedRoute>} />
      <Route path="/mood-history" element={<ProtectedRoute allowedRoles={["student"]}><MoodHistory /></ProtectedRoute>} />
      <Route path="/calendar" element={<ProtectedRoute allowedRoles={["student"]}><CalendarView /></ProtectedRoute>} />
      <Route path="/graph" element={<ProtectedRoute allowedRoles={["student"]}><MoodGraph /></ProtectedRoute>} />
      <Route path="/journal" element={<ProtectedRoute allowedRoles={["student"]}><JournalPage /></ProtectedRoute>} />
      <Route path="/journal-history" element={<ProtectedRoute allowedRoles={["student"]}><JournalHistory /></ProtectedRoute>} />
      <Route path="/journal-edit" element={<ProtectedRoute allowedRoles={["student"]}><JournalEdit /></ProtectedRoute>} />
      <Route path="/selfcare" element={<ProtectedRoute allowedRoles={["student","admin"]}><SelfCarePage /></ProtectedRoute>} />
      <Route path="/forum" element={<ProtectedRoute allowedRoles={["student","admin"]}><ForumPage /></ProtectedRoute>} />
      <Route path="/appointments" element={<ProtectedRoute allowedRoles={["student","counselor"]}><AppointmentPage /></ProtectedRoute>} />
      <Route path="/crisis" element={<ProtectedRoute allowedRoles={["student"]}><CrisisPage /></ProtectedRoute>} />
      <Route path="/status/:id" element={<ProtectedRoute allowedRoles={["student","counselor"]}><BookingStatus /></ProtectedRoute>} />
      <Route path="/confirmation/:id" element={<ProtectedRoute allowedRoles={["student","counselor"]}><BookingConfirmationWrapper /></ProtectedRoute>} />
      <Route path="/counselor-dashboard/:id" element={<ProtectedRoute allowedRoles={["counselor","admin"]}><AppointmentCounselorDashboard /></ProtectedRoute>} />
      <Route path="/counselor" element={<ProtectedRoute allowedRoles={["counselor","admin"]}><CounselorPage /></ProtectedRoute>} />
      <Route path="/admin" element={<ProtectedRoute allowedRoles={["admin"]}><AdminPage /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to={user ? "/" : "/login"} replace />} />
    </Routes>
  );
}
