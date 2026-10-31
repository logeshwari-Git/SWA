import { useEffect, useState } from "react";
import { apiForm, apiJson } from "../../../utils/api";
import "./AdminSelfCare.css";
import StepsModal from "../components/StepsModal";

export default function AdminSelfCare() {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [activeModule, setActiveModule] = useState("addCategory");
  const [form, setForm] = useState({
    title: "",
    image: null,
    category: "",
    steps: ""
  });
  const [editingId, setEditingId] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [itemData, categoryData] = await Promise.all([
        apiJson("/api/selfcare"),
        apiJson("/api/categories")
      ]);
      setItems(Array.isArray(itemData) ? itemData : []);
      setCategories(Array.isArray(categoryData) ? categoryData : []);
    } catch (error) {
      console.error(error);
    }
  };

  const addCategory = async () => {
    if (!newCategory.trim()) {
      alert("Enter category name");
      return;
    }

    await apiJson("/api/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newCategory.trim() })
    });

    setNewCategory("");
    fetchData();
  };

  const deleteCategory = async (id) => {
    if (!window.confirm("Delete this category?")) return;
    await apiJson(`/api/categories/${id}`, { method: "DELETE" });
    fetchData();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this item?")) return;
    await apiJson(`/api/selfcare/${id}`, { method: "DELETE" });
    fetchData();
  };

  const handleSave = async () => {
    if (!form.title || !form.category) {
      alert("Please fill required fields");
      return;
    }

    const steps = form.steps
      .split("\n")
      .map((step) => step.trim())
      .filter(Boolean);

    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("category", form.category);
    formData.append("steps", JSON.stringify(steps));

    if (form.image) {
      formData.append("image", form.image);
    }

    if (editingId) {
      await apiForm(`/api/selfcare/${editingId}`, formData, "PUT");
    } else {
      await apiForm("/api/selfcare", formData, "POST");
    }

    setEditingId(null);
    setForm({
      title: "",
      image: null,
      category: "",
      steps: ""
    });
    fetchData();
  };

  const handleEdit = (item) => {
    setEditingId(item._id);
    setActiveModule("addContent");
    setForm({
      title: item.title,
      image: null,
      category: item.category,
      steps: (item.steps || []).join("\n")
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm({
      title: "",
      image: null,
      category: "",
      steps: ""
    });
  };

  const filteredItems = items
    .filter((item) => String(item.title || "").toLowerCase().includes(searchTerm.toLowerCase()))
    .filter((item) => (filterCategory ? item.category === filterCategory : true));

  return (
    <div className="admin-container">
      <h1 className="admin-title">SelfCare </h1>

      <div className="admin-module-nav">
        <button
          className={activeModule === "addCategory" ? "active" : ""}
          onClick={() => setActiveModule("addCategory")}
        >
          Add Category
        </button>
        <button
          className={activeModule === "viewCategory" ? "active" : ""}
          onClick={() => setActiveModule("viewCategory")}
        >
          View Category
        </button>
        <button
          className={activeModule === "addContent" ? "active" : ""}
          onClick={() => setActiveModule("addContent")}
        >
          Add Content
        </button>
        <button
          className={activeModule === "viewContent" ? "active" : ""}
          onClick={() => setActiveModule("viewContent")}
        >
          View Content
        </button>
      </div>

      {activeModule === "addCategory" && (
        <div className="card">
          <h2>Add Category</h2>

          <div className="row">
            <input
              type="text"
              placeholder="New Category Name"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
            />

            <button className="btn-primary" onClick={addCategory}>
              Add
            </button>
          </div>
        </div>
      )}

      {activeModule === "viewCategory" && (
        <div className="card">
          <h2>Existing Categories</h2>

          {categories.map((cat) => (
            <div key={cat._id} className="list-item">
              <span>{cat.name}</span>

              <button className="btn-delete" onClick={() => deleteCategory(cat._id)}>
                Delete
              </button>
            </div>
          ))}
        </div>
      )}

      {activeModule === "addContent" && (
        <div className="card">
          <h2>{editingId ? "Edit SelfCare" : "Add New SelfCare"}</h2>

          <input
            type="text"
            placeholder="Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />

          <input
            type="file"
            accept="image/*"
            onChange={(e) => setForm({ ...form, image: e.target.files?.[0] || null })}
          />

          {form.image && (
            <img
              src={URL.createObjectURL(form.image)}
              style={{ width: "120px", marginTop: "10px", borderRadius: "12px" }}
              alt="preview"
            />
          )}

          <select
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>

          <textarea
            placeholder={"Steps (one per line)\nStep 1\nStep 2\nStep 3"}
            value={form.steps}
            onChange={(e) => setForm({ ...form, steps: e.target.value })}
          />

          <div style={{ display: "flex", gap: "10px" }}>
            <button className="btn-success" onClick={handleSave}>
              {editingId ? "Update SelfCare" : "Add SelfCare"}
            </button>

            {editingId && (
              <button className="btn-delete" onClick={cancelEdit}>
                Cancel
              </button>
            )}
          </div>
        </div>
      )}

      {activeModule === "viewContent" && (
        <div className="card">
          <h2>All SelfCare Items</h2>

          <div className="filter-bar">
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {filteredItems.map((item) => (
            <div key={item._id} className="list-item">
              <div>
                <strong>{item.title}</strong>
                <span className="category-tag">{item.category}</span>
              </div>

              <div>
                <button className="btn-view" onClick={() => setSelectedItem(item)}>
                  View
                </button>

                <button className="btn-edit" onClick={() => handleEdit(item)}>
                  Edit
                </button>

                <button className="btn-delete" onClick={() => handleDelete(item._id)}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedItem && <StepsModal data={selectedItem} onClose={() => setSelectedItem(null)} />}
    </div>
  );
}
