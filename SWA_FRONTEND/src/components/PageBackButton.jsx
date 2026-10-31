import { useNavigate } from "react-router-dom";

export default function PageBackButton({ to = "/" }) {
  const navigate = useNavigate();

  return (
    <button
      className="page-back-btn"
      onClick={() => navigate(to)}
      style={{ marginBottom: "18px" }}
    >
      Back
    </button>
  );
}
