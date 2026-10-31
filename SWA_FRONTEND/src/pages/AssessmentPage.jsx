import { useAuth } from "../contexts/AuthContext";
import PageBackButton from "../components/PageBackButton";
import Assessment from "../modules/student-core/components/Assessment";

export default function AssessmentPage() {
  const { user } = useAuth();
  const studentKey = user?.studentId || user?.username || user?.id;

  if (user?.role !== "student") {
    return <div className="content-card">This section is available for student accounts.</div>;
  }

  return (
    <div className="app-container">
      <PageBackButton />
      <Assessment studentId={studentKey} />
    </div>
  );
}
