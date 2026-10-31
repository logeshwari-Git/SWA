import { useEffect, useState } from "react";
import SelfCareCard from "../components/SelfCareCard";

const API_BASE_URL = "http://127.0.0.1:5001";

export default function SavedContent() {
  const [saved, setSaved] = useState([]);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/saved`)
      .then(res => res.json())
      .then(setSaved);
  }, []);

  return (
    <div className="selfcare-grid">
      {saved.map(item => (
        <SelfCareCard
          key={item._id}
          {...item}
          saved={true}
        />
      ))}
    </div>
  );
}
