import { useAuth } from "../contexts/AuthContext";
import PageBackButton from "../components/PageBackButton";
import SelfCareHome from "../modules/selfcare/pages/SelfCareHome";
import AdminSelfCare from "../modules/selfcare/pages/AdminSelfCare";

export default function SelfCarePage() {
  const { user } = useAuth();
  return (
    <div className="app-container">
      <PageBackButton />
      {user?.role === "admin" ? <AdminSelfCare /> : <SelfCareHome />}
    </div>
  );
}
