import { useEffect, useState } from "react";
import { apiJson } from "../../../utils/api";
import SelfCareCard from "./SelfCareCard";
import StepsModal from "./StepsModal";

export default function SelfCareList({ fetchPath, onBack, isSavedView = false }) {
  const [items, setItems] = useState([]);
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");
  const [savedIds, setSavedIds] = useState([]);

  useEffect(() => {
    if (!fetchPath) return;

    const loadData = async () => {
      try {
        const data = await apiJson(fetchPath);
        setItems(Array.isArray(data) ? data : []);

        if (!isSavedView) {
          const saved = await apiJson("/api/saved");
          setSavedIds(saved.map((item) => String(item.selfCareId)));
        }
      } catch (err) {
        console.error(err);
      }
    };

    loadData();
  }, [fetchPath, isSavedView]);

  const filteredItems = items.filter((item) =>
    String(item.title || "").toLowerCase().includes(search.toLowerCase())
  );

  const handleSavedChange = (item, saved) => {
    const selfCareId = String(item.selfCareId || item._id);

    if (isSavedView && !saved) {
      setItems((current) => current.filter((entry) => String(entry._id) !== String(item._id)));
      return;
    }

    setSavedIds((current) => {
      const next = new Set(current);
      if (saved) {
        next.add(selfCareId);
      } else {
        next.delete(selfCareId);
      }
      return Array.from(next);
    });
  };

  return (
    <div className="selfcare-page">
      <div className="selfcare-toolbar">
        <button className="back-btn" onClick={onBack}>
          ← Back
        </button>

        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />
      </div>

      {filteredItems.length === 0 && <p style={{ marginTop: "20px" }}>No items found</p>}

      <div className="selfcare-grid">
        {filteredItems.map((item) => (
          <SelfCareCard
            key={item._id}
            item={item}
            isSavedView={isSavedView}
            isSaved={!isSavedView && savedIds.includes(String(item._id))}
            onSavedChange={handleSavedChange}
            onClick={() => setSelected(item)}
          />
        ))}
      </div>

      {selected && <StepsModal data={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
