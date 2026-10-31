import { useEffect, useState } from "react";
import "./CategoryGrid.css";

const API_BASE_URL = "http://127.0.0.1:5001";

export default function CategoryGrid({ onSelect }) {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/categories`)
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched categories:", data);
        setCategories(data);
      })
      .catch((err) => console.error("Fetch error:", err));
  }, []);

  return (
    <div className="category-grid">
      {categories.map((cat) => (
        <div
          key={cat._id}
          className="category-card"
          onClick={() => onSelect(cat.name)}
        >
          {cat.image && (
            <img
              src={`${API_BASE_URL}${cat.image}`}
              alt={cat.name}
              className="category-image"
            />
          )}
          <p>{cat.name}</p>
        </div>
      ))}
    </div>
  );
}
