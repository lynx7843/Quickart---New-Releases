import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function AdminCategories() {
  const { categories, setCategories, notify, fetchData } = useOutletContext();
  const { user } = useAuth();
  const [newCategory, setNewCategory] = useState("");

  const handleAddCategory = async () => {
    if (!newCategory) return;
    const id = newCategory.toLowerCase().replace(/\s+/g, "-");
    const categoryObj = { id, label: newCategory, icon: "🏷️", color: "#64748b", sub: [] };

    setCategories(prev => [...prev, categoryObj]);
    setNewCategory("");
    notify("Category added locally!");
  };

  return (
    <div>
      <h1 style={{ fontSize: 28, fontWeight: "bold", color: "#111827", marginBottom: 24 }}>Manage Categories</h1>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 24 }}>
        {/* Add Category Form */}
        <div style={{ background: "white", padding: 24, borderRadius: 12, boxShadow: "0 1px 3px rgba(0,0,0,0.1)", alignSelf: "start" }}>
          <h3 style={{ fontSize: 18, fontWeight: "bold", marginBottom: 16, color: "#374151" }}>Add New Category</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <input
              type="text"
              placeholder="Category Name"
              value={newCategory}
              onChange={e => setNewCategory(e.target.value)}
              style={{ padding: 10, border: "1px solid #ddd", borderRadius: 6 }}
            />
            <button onClick={handleAddCategory} style={{ padding: 12, background: "#10b981", color: "white", border: "none", borderRadius: 6, cursor: "pointer", fontWeight: "bold" }}>
              Add Category
            </button>
          </div>
        </div>

        {/* Category List */}
        <div style={{ background: "white", padding: 24, borderRadius: 12, boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
          <h3 style={{ fontSize: 18, fontWeight: "bold", marginBottom: 16, color: "#374151" }}>Existing Categories</h3>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            {categories.map(c => (
              <span key={c.id} style={{ background: "#e5e7eb", padding: "8px 16px", borderRadius: 20, fontSize: 14, color: "#374151", fontWeight: 500 }}>
                {c.label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}