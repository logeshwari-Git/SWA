import { useEffect, useState } from "react";
import { apiJson } from "../../../utils/api";
import CategoryCard from "../components/CategoryCard";
import SelfCareList from "../components/SelfCareList";
import "../selfcare.css";

export default function SelfCareHome() {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showSaved, setShowSaved] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await apiJson("/api/categories");
        setCategories(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };

    fetchCategories();
  }, []);

  if (showSaved) {
    return (
      <SelfCareList
        fetchPath="/api/saved"
        isSavedView
        onBack={() => setShowSaved(false)}
      />
    );
  }

  if (selectedCategory) {
    return (
      <SelfCareList
        fetchPath={`/api/selfcare?category=${encodeURIComponent(selectedCategory)}`}
        onBack={() => setSelectedCategory(null)}
      />
    );
  }

  const filteredCategories = categories.filter((cat) =>
    String(cat.name || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="selfcare-page">
      <h2 className="selfcare-title">🌸 Self Care</h2>

      <div className="top-controls">
        <button className="saved-btn" onClick={() => setShowSaved(true)}>
          📌 Saved
        </button>

        <input
          type="text"
          placeholder="Search categories..."
          className="search-input"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="category-grid">
        {filteredCategories.map((cat) => (
          <CategoryCard
            key={cat._id}
            label={cat.name}
            onClick={() => setSelectedCategory(cat.name)}
          />
        ))}
      </div>
    </div>
  );
}
