import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext.jsx';

const styles = `
  * { box-sizing: border-box; margin: 0; padding: 0; }

  .sd-root {
    min-height: 100vh;
    background: #f8f8f8;
    font-family: Arial, sans-serif;
    color: #333;
  }

  /* ── Sidebar ── */
  .sd-sidebar {
    position: fixed;
    top: 0; left: 0;
    width: 220px;
    height: 100vh;
    background: #250902;
    color: #fff;
    display: flex;
    flex-direction: column;
    padding: 0;
    z-index: 100;
  }

  .sd-logo {
    padding: 20px 20px 16px;
    border-bottom: 1px solid rgba(255,255,255,0.1);
  }

  .sd-logo-title {
    font-size: 16px;
    font-weight: 700;
    letter-spacing: 1px;
  }

  .sd-logo-sub {
    font-size: 10px;
    color: rgba(255,255,255,0.5);
    letter-spacing: 1.5px;
    margin-top: 2px;
  }

  .sd-seller-info {
    padding: 16px 20px;
    border-bottom: 1px solid rgba(255,255,255,0.1);
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .sd-avatar {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: rgba(255,255,255,0.15);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    flex-shrink: 0;
  }

  .sd-seller-name {
    font-size: 13px;
    font-weight: 700;
    color: #fff;
  }

  .sd-seller-role {
    font-size: 10px;
    color: rgba(255,255,255,0.5);
    margin-top: 1px;
  }

  .sd-nav {
    flex: 1;
    padding: 12px 0;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .sd-nav-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 11px 20px;
    font-size: 13px;
    color: rgba(255,255,255,0.65);
    cursor: pointer;
    transition: background 0.15s, color 0.15s;
    border-left: 3px solid transparent;
  }

  .sd-nav-item:hover {
    background: rgba(255,255,255,0.07);
    color: #fff;
  }

  .sd-nav-item.active {
    background: rgba(255,255,255,0.1);
    color: #fff;
    border-left-color: #fff;
    font-weight: 700;
  }

  .sd-nav-icon { font-size: 16px; }

  .sd-logout {
    padding: 16px 20px;
    border-top: 1px solid rgba(255,255,255,0.1);
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 13px;
    color: rgba(255,255,255,0.5);
    cursor: pointer;
    transition: color 0.2s;
  }
  .sd-logout:hover { color: #fff; }

  /* ── Main content ── */
  .sd-main {
    margin-left: 220px;
    padding: 28px 28px;
    min-height: 100vh;
  }

  .sd-topbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 24px;
  }

  .sd-page-title {
    font-size: 20px;
    font-weight: 700;
    color: #250902;
  }

  .sd-topbar-right {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .sd-btn {
    padding: 9px 18px;
    background: #250902;
    color: #fff;
    border: none;
    border-radius: 8px;
    font-family: Arial, sans-serif;
    font-size: 13px;
    font-weight: 700;
    cursor: pointer;
    transition: background 0.2s;
  }
  .sd-btn:hover { background: #3d1005; }

  .sd-btn-outline {
    padding: 9px 18px;
    background: #fff;
    color: #250902;
    border: 1.5px solid #250902;
    border-radius: 8px;
    font-family: Arial, sans-serif;
    font-size: 13px;
    font-weight: 700;
    cursor: pointer;
    transition: background 0.2s;
  }
  .sd-btn-outline:hover { background: #fdf8f7; }

  /* ── Stats cards ── */
  .sd-stats {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;
    margin-bottom: 24px;
  }

  .sd-stat {
    background: #fff;
    border-radius: 10px;
    padding: 18px 20px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  }

  .sd-stat-icon { font-size: 24px; margin-bottom: 8px; }

  .sd-stat-value {
    font-size: 22px;
    font-weight: 700;
    color: #250902;
    margin-bottom: 2px;
  }

  .sd-stat-label {
    font-size: 12px;
    color: #888;
  }

  .sd-stat-change {
    font-size: 11px;
    margin-top: 6px;
    font-weight: 700;
  }
  .sd-stat-change.up { color: #16a34a; }
  .sd-stat-change.down { color: #dc2626; }

  /* ── Section card ── */
  .sd-section {
    background: #fff;
    border-radius: 10px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.06);
    margin-bottom: 20px;
  }

  .sd-section-header {
    padding: 16px 20px;
    border-bottom: 1px solid #f0f0f0;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .sd-section-title {
    font-size: 15px;
    font-weight: 700;
    color: #250902;
  }

  /* ── Table ── */
  .sd-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 13px;
  }

  .sd-table th {
    padding: 10px 20px;
    text-align: left;
    font-size: 11px;
    font-weight: 700;
    color: #888;
    letter-spacing: 0.5px;
    text-transform: uppercase;
    background: #fafafa;
    border-bottom: 1px solid #f0f0f0;
  }

  .sd-table td {
    padding: 13px 20px;
    border-bottom: 1px solid #f8f8f8;
    color: #333;
  }

  .sd-table tr:last-child td { border-bottom: none; }
  .sd-table tr:hover td { background: #fdf8f7; }

  .sd-badge {
    display: inline-block;
    padding: 3px 10px;
    border-radius: 20px;
    font-size: 11px;
    font-weight: 700;
  }

  .sd-badge.active   { background: #e8f5e9; color: #2e7d32; }
  .sd-badge.pending  { background: #fff3e0; color: #e65100; }
  .sd-badge.soldout  { background: #fce4ec; color: #c62828; }

  /* ── Add product form ── */
  .sd-form-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
    padding: 20px;
  }

  .sd-form-group {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .sd-form-group.full { grid-column: 1 / -1; }

  .sd-label { font-size: 12px; font-weight: 700; color: #333; }

  .sd-input {
    padding: 10px 13px;
    border: 1.5px solid #ddd;
    border-radius: 7px;
    font-family: Arial, sans-serif;
    font-size: 13px;
    color: #333;
    outline: none;
    transition: border-color 0.2s;
  }
  .sd-input:focus { border-color: #250902; box-shadow: 0 0 0 3px rgba(37,9,2,0.08); }

  .sd-form-actions {
    padding: 0 20px 20px;
    display: flex;
    gap: 10px;
  }

  /* ── Empty state ── */
  .sd-empty {
    text-align: center;
    padding: 40px 20px;
    color: #aaa;
    font-size: 14px;
  }
  .sd-empty-icon { font-size: 36px; margin-bottom: 10px; }

  /* responsive */
  @media (max-width: 900px) {
    .sd-stats { grid-template-columns: repeat(2, 1fr); }
  }

  @media (max-width: 660px) {
    .sd-sidebar { width: 60px; }
    .sd-logo-title, .sd-logo-sub, .sd-seller-info, .sd-nav-item span, .sd-logout span { display: none; }
    .sd-main { margin-left: 60px; padding: 20px 14px; }
    .sd-stats { grid-template-columns: repeat(2, 1fr); }
  }
`;

const SAMPLE_PRODUCTS = [
  { id: 1, name: "Men's Casual Shirt", category: "Fashion", price: 4500, stock: 24, status: "active" },
  { id: 2, name: "Slim Fit Chinos",    category: "Fashion", price: 3800, stock: 0,  status: "soldout" },
  { id: 3, name: "Running Shoes",      category: "Sports",  price: 8500, stock: 7,  status: "active" },
];

const SAMPLE_ORDERS = [
  { id: "#ORD-001", product: "Men's Casual Shirt", customer: "Kasun P.",  date: "2026-03-20", amount: 4500,  status: "pending" },
  { id: "#ORD-002", product: "Running Shoes",      customer: "Nimal S.",  date: "2026-03-21", amount: 8500,  status: "active" },
  { id: "#ORD-003", product: "Men's Casual Shirt", customer: "Amara D.",  date: "2026-03-22", amount: 9000,  status: "active" },
];

const NAV = [
  { id: "overview",  icon: "📊", label: "Overview"   },
  { id: "products",  icon: "📦", label: "My Products" },
  { id: "orders",    icon: "🛒", label: "Orders"      },
  { id: "add",       icon: "➕", label: "Add Product" },
];

export default function SellerDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [tab, setTab] = useState("overview");
  const [products, setProducts] = useState(SAMPLE_PRODUCTS);
  const [newProduct, setNewProduct] = useState({ name: "", category: "", price: "", stock: "", description: "" });


  if (!user || user.role !== "SELLER") {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Arial', background: '#f8f8f8' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🔒</div>
          <div style={{ fontSize: 18, fontWeight: 700, color: '#250902', marginBottom: 8 }}>Seller Access Only</div>
          <div style={{ fontSize: 14, color: '#888', marginBottom: 20 }}>You need a seller account to view this page.</div>
          <button onClick={() => navigate('/login')} style={{ padding: '10px 24px', background: '#250902', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 700, cursor: 'pointer' }}>
            Sign In as Seller
          </button>
        </div>
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleAddProduct = (e) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.price) return;
    setProducts(prev => [...prev, {
      id: prev.length + 1,
      name: newProduct.name,
      category: newProduct.category || "General",
      price: parseInt(newProduct.price),
      stock: parseInt(newProduct.stock) || 0,
      status: "active"
    }]);
    setNewProduct({ name: "", category: "", price: "", stock: "", description: "" });
    alert("Product added successfully!");
    setTab("products");
  };

  const totalRevenue = SAMPLE_ORDERS.reduce((s, o) => s + o.amount, 0);

  return (
    <div className="sd-root">
      <style>{styles}</style>

      {/* Sidebar */}
      <div className="sd-sidebar">
        <div className="sd-logo">
          <div className="sd-logo-title">⚡ QUICKART</div>
          <div className="sd-logo-sub">SELLER PORTAL</div>
        </div>

        <div className="sd-seller-info">
          <div className="sd-avatar">🏪</div>
          <div>
            <div className="sd-seller-name">{user.name}</div>
            <div className="sd-seller-role">Seller Account</div>
          </div>
        </div>

        <nav className="sd-nav">
          {NAV.map(item => (
            <div
              key={item.id}
              className={`sd-nav-item ${tab === item.id ? 'active' : ''}`}
              onClick={() => setTab(item.id)}
            >
              <span className="sd-nav-icon">{item.icon}</span>
              <span>{item.label}</span>
            </div>
          ))}
          <div className="sd-nav-item" onClick={() => navigate('/')}>
            <span className="sd-nav-icon">🏠</span>
            <span>Back to Store</span>
          </div>
        </nav>

        <div className="sd-logout" onClick={handleLogout}>
          <span>🚪</span>
          <span>Logout</span>
        </div>
      </div>

      {/* Main */}
      <div className="sd-main">

        {/* Overview */}
        {tab === "overview" && (
          <>
            <div className="sd-topbar">
              <div className="sd-page-title">👋 Welcome back, {user.name}!</div>
              <div className="sd-topbar-right">
                <button className="sd-btn" onClick={() => setTab("add")}>+ Add Product</button>
              </div>
            </div>

            <div className="sd-stats">
              <div className="sd-stat">
                <div className="sd-stat-icon">📦</div>
                <div className="sd-stat-value">{products.length}</div>
                <div className="sd-stat-label">Total Products</div>
                <div className="sd-stat-change up">↑ 2 this week</div>
              </div>
              <div className="sd-stat">
                <div className="sd-stat-icon">🛒</div>
                <div className="sd-stat-value">{SAMPLE_ORDERS.length}</div>
                <div className="sd-stat-label">Total Orders</div>
                <div className="sd-stat-change up">↑ 1 today</div>
              </div>
              <div className="sd-stat">
                <div className="sd-stat-icon">💰</div>
                <div className="sd-stat-value">Rs. {totalRevenue.toLocaleString()}</div>
                <div className="sd-stat-label">Total Revenue</div>
                <div className="sd-stat-change up">↑ 12% this month</div>
              </div>
              <div className="sd-stat">
                <div className="sd-stat-icon">⭐</div>
                <div className="sd-stat-value">4.7</div>
                <div className="sd-stat-label">Avg. Rating</div>
                <div className="sd-stat-change up">↑ 0.2 pts</div>
              </div>
            </div>

            <div className="sd-section">
              <div className="sd-section-header">
                <div className="sd-section-title">Recent Orders</div>
                <button className="sd-btn-outline" onClick={() => setTab("orders")}>View All</button>
              </div>
              <table className="sd-table">
                <thead>
                  <tr>
                    <th>Order ID</th><th>Product</th><th>Customer</th><th>Amount</th><th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {SAMPLE_ORDERS.map(o => (
                    <tr key={o.id}>
                      <td style={{ fontWeight: 700, color: '#250902' }}>{o.id}</td>
                      <td>{o.product}</td>
                      <td>{o.customer}</td>
                      <td>Rs. {o.amount.toLocaleString()}</td>
                      <td><span className={`sd-badge ${o.status}`}>{o.status === 'active' ? 'Delivered' : 'Pending'}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* Products */}
        {tab === "products" && (
          <>
            <div className="sd-topbar">
              <div className="sd-page-title">📦 My Products</div>
              <button className="sd-btn" onClick={() => setTab("add")}>+ Add Product</button>
            </div>
            <div className="sd-section">
              <table className="sd-table">
                <thead>
                  <tr><th>Product</th><th>Category</th><th>Price</th><th>Stock</th><th>Status</th></tr>
                </thead>
                <tbody>
                  {products.map(p => (
                    <tr key={p.id}>
                      <td style={{ fontWeight: 700 }}>{p.name}</td>
                      <td>{p.category}</td>
                      <td>Rs. {p.price.toLocaleString()}</td>
                      <td>{p.stock}</td>
                      <td><span className={`sd-badge ${p.status}`}>{p.status === 'active' ? 'Active' : p.status === 'soldout' ? 'Sold Out' : 'Pending'}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* Orders */}
        {tab === "orders" && (
          <>
            <div className="sd-topbar">
              <div className="sd-page-title">🛒 My Orders</div>
            </div>
            <div className="sd-section">
              <table className="sd-table">
                <thead>
                  <tr><th>Order ID</th><th>Product</th><th>Customer</th><th>Date</th><th>Amount</th><th>Status</th></tr>
                </thead>
                <tbody>
                  {SAMPLE_ORDERS.map(o => (
                    <tr key={o.id}>
                      <td style={{ fontWeight: 700, color: '#250902' }}>{o.id}</td>
                      <td>{o.product}</td>
                      <td>{o.customer}</td>
                      <td>{o.date}</td>
                      <td>Rs. {o.amount.toLocaleString()}</td>
                      <td><span className={`sd-badge ${o.status}`}>{o.status === 'active' ? 'Delivered' : 'Pending'}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* Add Product */}
        {tab === "add" && (
          <>
            <div className="sd-topbar">
              <div className="sd-page-title">➕ Add New Product</div>
            </div>
            <div className="sd-section">
              <form onSubmit={handleAddProduct}>
                <div className="sd-form-grid">
                  <div className="sd-form-group">
                    <label className="sd-label">Product Name *</label>
                    <input className="sd-input" placeholder="e.g. Men's Casual Shirt" value={newProduct.name}
                      onChange={e => setNewProduct({ ...newProduct, name: e.target.value })} required />
                  </div>
                  <div className="sd-form-group">
                    <label className="sd-label">Category</label>
                    <input className="sd-input" placeholder="e.g. Fashion" value={newProduct.category}
                      onChange={e => setNewProduct({ ...newProduct, category: e.target.value })} />
                  </div>
                  <div className="sd-form-group">
                    <label className="sd-label">Price (Rs.) *</label>
                    <input className="sd-input" type="number" placeholder="e.g. 4500" value={newProduct.price}
                      onChange={e => setNewProduct({ ...newProduct, price: e.target.value })} required />
                  </div>
                  <div className="sd-form-group">
                    <label className="sd-label">Stock Quantity</label>
                    <input className="sd-input" type="number" placeholder="e.g. 20" value={newProduct.stock}
                      onChange={e => setNewProduct({ ...newProduct, stock: e.target.value })} />
                  </div>
                  <div className="sd-form-group full">
                    <label className="sd-label">Description</label>
                    <textarea className="sd-input" rows={3} placeholder="Describe your product..." value={newProduct.description}
                      onChange={e => setNewProduct({ ...newProduct, description: e.target.value })} style={{ resize: 'vertical' }} />
                  </div>
                </div>
                <div className="sd-form-actions">
                  <button type="submit" className="sd-btn">✅ Add Product</button>
                  <button type="button" className="sd-btn-outline" onClick={() => setTab("products")}>Cancel</button>
                </div>
              </form>
            </div>
          </>
        )}

      </div>
    </div>
  );
}
