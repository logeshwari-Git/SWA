import { apiJson } from "../../../utils/api";

const API_BASE_URL = "http://127.0.0.1:5001";

export default function SelfCareCard({ item, onClick, isSavedView, isSaved = false, onSavedChange }) {
  const saveItem = async (event) => {
    event.stopPropagation();

    const saved = await apiJson("/api/saved", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        selfCareId: item.selfCareId || item._id,
        title: item.title,
        category: item.category,
        image: item.image || "",
        steps: item.steps || []
      })
    });

    onSavedChange?.({ ...item, _id: saved._id, selfCareId: saved.selfCareId }, true);
  };

  const unsaveItem = async (event) => {
    event.stopPropagation();
    await apiJson(`/api/saved/${item.selfCareId || item._id}`, {
      method: "DELETE"
    });
    onSavedChange?.(item, false);
  };

  return (
    <div className="selfcare-card" onClick={onClick}>
      {item.image ? (
        <img
          src={`${API_BASE_URL}${item.image}`}
          alt={item.title}
          className="card-image"
        />
      ) : (
        <div className="card-image card-image--placeholder">
          <span>{item.title?.slice(0, 1) || "S"}</span>
        </div>
      )}

      <button onClick={isSavedView || isSaved ? unsaveItem : saveItem}>
        {isSavedView || isSaved ? "✖ Unsave" : "📌 Save"}
      </button>

      <h3>{item.title}</h3>
    </div>
  );
}
