import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function AdminProducts() {
  const { products, setProducts, categories, notify, fetchData } = useOutletContext();
  const { user } = useAuth();

  // Product Form state
  const [newProduct, setNewProduct] = useState({ name: "", price: "", category: "", imageFile: null, imagePreview: "" });
  const [searchTerm, setSearchTerm] = useState("");

  const handleAddProduct = async () => {
    if (!newProduct.name || !newProduct.price || !newProduct.category) return;

    let imageUrl = "https://via.placeholder.com/150";
    if (newProduct.imageFile) {
      const formData = new FormData();
      formData.append('image', newProduct.imageFile);
      // Use local object URL for preview instead of backend upload
      imageUrl = URL.createObjectURL(newProduct.imageFile);
    }

    const product = {
      name: newProduct.name,
      price: Number(newProduct.price),
      category: newProduct.category,
      imgs: [imageUrl],
      orig: Number(newProduct.price) * 1.2,
      rating: 0,
      reviews: 0,
      badge: "NEW",
      colors: ["#000000", "#ffffff"],
      specs: ["New Item"],
      sub: categories.find(c => c.id === newProduct.category)?.sub?.[0] || "General",
      color: categories.find(c => c.id === newProduct.category)?.color || "#64748b",
      emoji: categories.find(c => c.id === newProduct.category)?.icon || '📦'
    };

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/products`, { //Make sure this is the correct URL
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product)
      });
      if (response.ok) {
        const savedProduct = await response.json();
        setProducts(prev => [...prev, savedProduct]);
        setNewProduct({ name: "", price: "", category: "", imageFile: null, imagePreview: "" });
        notify("Product added successfully!");
      } else {
        notify("Failed to add product.", "error");
      }
    } catch (error) {
      notify("Error connecting to backend.", "error");
    }
  };

  const handleDeleteProduct = async (id) => {
    await fetch(`${import.meta.env.VITE_API_BASE_URL}/products/${id}`, { method: 'DELETE' }); //Make sure this is the correct URL
    setProducts(products.filter(p => p.id !== id));
    notify("Product deleted successfully!");
  };

  const handleImageUpload = (e) => {
      const file = e.target.files[0];
      if (file) {
          const previewUrl = URL.createObjectURL(file);
          setNewProduct({ ...newProduct, imageFile: file, imagePreview: previewUrl });
      }
  };

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.category && p.category.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div>
      <h1 style={{ fontSize: 28, fontWeight: "bold", color: "#111827", marginBottom: 24 }}>Manage Products</h1>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 24 }}>
        {/* Add Product Form */}
        <div style={{ background: "white", padding: 24, borderRadius: 12, boxShadow: "0 1px 3px rgba(0,0,0,0.1)", alignSelf: "start" }}>
          <h3 style={{ fontSize: 18, fontWeight: "bold", marginBottom: 16, color: "#374151" }}>Add New Product</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <input
              type="text"
              placeholder="Product Name"
              value={newProduct.name}
              onChange={e => setNewProduct({ ...newProduct, name: e.target.value })}
              style={{ padding: 10, border: "1px solid #ddd", borderRadius: 6 }}
            />
            <div style={{ display: "flex", gap: 12 }}>
              <input
                type="number"
                placeholder="Price"
                value={newProduct.price}
                onChange={e => setNewProduct({ ...newProduct, price: e.target.value })}
                style={{ flex: 1, padding: 10, border: "1px solid #ddd", borderRadius: 6 }}
              />
              <select
                value={newProduct.category}
                onChange={e => setNewProduct({ ...newProduct, category: e.target.value })}
                style={{ flex: 1, padding: 10, border: "1px solid #ddd", borderRadius: 6 }}
              >
                <option value="">Select Category</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
              </select>
            </div>
            
            <div style={{ border: "2px dashed #e5e7eb", padding: 20, textAlign: "center", borderRadius: 8, color: "#6b7280", fontSize: 14 }}>
              <input type="file" id="prod-img" style={{ display: "none" }} onChange={handleImageUpload} accept="image/*" />
              <label htmlFor="prod-img" style={{ cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 24 }}>📷</span>
                <span style={{ color: "#2563eb", fontWeight: 500 }}>Click to upload image</span>
              </label>
              {newProduct.imagePreview && (
                <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
                  <img src={newProduct.imagePreview} alt="Preview" style={{ width: 40, height: 40, borderRadius: 4, objectFit: 'cover' }} />
                  <span style={{ fontSize: 12, color: "#10b981" }}>Image selected ✓</span>
                </div>
              )}
            </div>

            <button onClick={handleAddProduct} style={{ padding: 12, background: "#2563eb", color: "white", border: "none", borderRadius: 6, cursor: "pointer", fontWeight: "bold", marginTop: 8 }}>
              Add Product
            </button>
          </div>
        </div>

        {/* Product List */}
        <div style={{ background: "white", padding: 24, borderRadius: 12, boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <h3 style={{ fontSize: 18, fontWeight: "bold", color: "#374151" }}>Product List</h3>
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              style={{ padding: "8px 12px", border: "1px solid #ddd", borderRadius: 6, fontSize: 14, width: 200 }}
            />
          </div>
          
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
              <thead>
                <tr style={{ borderBottom: "2px solid #f3f4f6", textAlign: "left", color: "#6b7280", fontSize: 12, textTransform: "uppercase", letterSpacing: 0.5 }}>
                  <th style={{ padding: 12 }}>Image</th>
                  <th style={{ padding: 12 }}>Name</th>
                  <th style={{ padding: 12 }}>Category</th>
                  <th style={{ padding: 12 }}>Price</th>
                  <th style={{ padding: 12 }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map(p => (
                  <tr key={p.id} style={{ borderBottom: "1px solid #f3f4f6" }}>
                    <td style={{ padding: 12 }}><img src={p.imgs?.[0]} alt={p.name} style={{ width: 48, height: 48, objectFit: "cover", borderRadius: 8, border: "1px solid #eee" }} /></td>
                    <td style={{ padding: 12, fontWeight: 600, color: "#111827" }}>{p.name}</td>
                    <td style={{ padding: 12 }}><span style={{ background: "#f3f4f6", padding: "4px 10px", borderRadius: 12, fontSize: 12, color: "#4b5563" }}>{categories.find(c => c.id === p.category)?.label || p.category}</span></td>
                    <td style={{ padding: 12, fontWeight: 600, color: "#059669" }}>Rs. {p.price.toLocaleString()}</td>
                    <td style={{ padding: 12 }}><button onClick={() => handleDeleteProduct(p.id)} style={{ padding: "6px 12px", background: "#fee2e2", color: "#ef4444", border: "none", borderRadius: 6, cursor: "pointer", fontSize: 12, fontWeight: 500 }}>Delete</button></td>
                  </tr>
                ))}
                {filteredProducts.length === 0 && (
                  <tr><td colSpan="5" style={{ padding: 32, textAlign: "center", color: "#9ca3af" }}>No products found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}