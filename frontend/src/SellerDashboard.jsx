import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext.jsx';
import { categoriesData } from './assets/all.jsx';

const API_BASE = 'http://localhost:8080/api/v1';

const styles = `
  * { box-sizing: border-box; margin: 0; padding: 0; }
  .sd-root { min-height: 100vh; background: #f8f8f8; font-family: Arial, sans-serif; color: #333; display: flex; }

  /* Sidebar */
  .sd-sidebar { position: fixed; top: 0; left: 0; width: 220px; height: 100vh; background: #250902; color: #fff; display: flex; flex-direction: column; z-index: 100; overflow-y: auto; }
  .sd-logo { padding: 20px; border-bottom: 1px solid rgba(255,255,255,0.1); }
  .sd-logo-title { font-size: 16px; font-weight: 700; letter-spacing: 1px; }
  .sd-logo-sub { font-size: 10px; color: rgba(255,255,255,0.5); letter-spacing: 1.5px; margin-top: 2px; }
  .sd-seller-info { padding: 14px 20px; border-bottom: 1px solid rgba(255,255,255,0.1); display: flex; align-items: center; gap: 10px; }
  .sd-avatar { width: 36px; height: 36px; border-radius: 50%; background: rgba(255,255,255,0.15); display: flex; align-items: center; justify-content: center; font-size: 16px; flex-shrink: 0; }
  .sd-seller-name { font-size: 13px; font-weight: 700; }
  .sd-seller-role { font-size: 10px; color: rgba(255,255,255,0.5); margin-top: 1px; }
  .sd-nav { flex: 1; padding: 10px 0; }
  .sd-nav-item { display: flex; align-items: center; gap: 10px; padding: 11px 20px; font-size: 13px; color: rgba(255,255,255,0.65); cursor: pointer; transition: all 0.15s; border-left: 3px solid transparent; }
  .sd-nav-item:hover { background: rgba(255,255,255,0.07); color: #fff; }
  .sd-nav-item.active { background: rgba(255,255,255,0.1); color: #fff; border-left-color: #fff; font-weight: 700; }
  .sd-nav-icon { font-size: 16px; }
  .sd-logout { padding: 16px 20px; border-top: 1px solid rgba(255,255,255,0.1); display: flex; align-items: center; gap: 10px; font-size: 13px; color: rgba(255,255,255,0.5); cursor: pointer; transition: color 0.2s; }
  .sd-logout:hover { color: #fff; }

  /* Main */
  .sd-main { margin-left: 220px; padding: 28px; min-height: 100vh; flex: 1; }
  .sd-topbar { display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px; flex-wrap: wrap; gap: 12px; }
  .sd-page-title { font-size: 20px; font-weight: 700; color: #250902; }

  /* Buttons */
  .sd-btn { padding: 9px 18px; background: #250902; color: #fff; border: none; border-radius: 8px; font-family: Arial, sans-serif; font-size: 13px; font-weight: 700; cursor: pointer; transition: background 0.2s; }
  .sd-btn:hover { background: #3d1005; }
  .sd-btn:disabled { opacity: 0.6; cursor: not-allowed; }
  .sd-btn-outline { padding: 9px 18px; background: #fff; color: #250902; border: 1.5px solid #250902; border-radius: 8px; font-family: Arial, sans-serif; font-size: 13px; font-weight: 700; cursor: pointer; transition: background 0.2s; }
  .sd-btn-outline:hover { background: #fdf8f7; }
  .sd-btn-danger { padding: 7px 14px; background: #dc2626; color: #fff; border: none; border-radius: 7px; font-family: Arial, sans-serif; font-size: 12px; font-weight: 700; cursor: pointer; }
  .sd-btn-danger:hover { background: #b91c1c; }

  /* Stats */
  .sd-stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; margin-bottom: 24px; }
  .sd-stat { background: #fff; border-radius: 10px; padding: 18px 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.06); }
  .sd-stat-icon { font-size: 24px; margin-bottom: 8px; }
  .sd-stat-value { font-size: 22px; font-weight: 700; color: #250902; margin-bottom: 2px; }
  .sd-stat-label { font-size: 12px; color: #888; }

  /* Section */
  .sd-section { background: #fff; border-radius: 10px; box-shadow: 0 2px 8px rgba(0,0,0,0.06); margin-bottom: 20px; }
  .sd-section-header { padding: 16px 20px; border-bottom: 1px solid #f0f0f0; display: flex; align-items: center; justify-content: space-between; }
  .sd-section-title { font-size: 15px; font-weight: 700; color: #250902; }

  /* Table */
  .sd-table { width: 100%; border-collapse: collapse; font-size: 13px; }
  .sd-table th { padding: 10px 20px; text-align: left; font-size: 11px; font-weight: 700; color: #888; letter-spacing: 0.5px; text-transform: uppercase; background: #fafafa; border-bottom: 1px solid #f0f0f0; }
  .sd-table td { padding: 12px 20px; border-bottom: 1px solid #f8f8f8; color: #333; vertical-align: middle; }
  .sd-table tr:last-child td { border-bottom: none; }
  .sd-table tr:hover td { background: #fdf8f7; }
  .sd-badge { display: inline-block; padding: 3px 10px; border-radius: 20px; font-size: 11px; font-weight: 700; }
  .sd-badge.active  { background: #e8f5e9; color: #2e7d32; }
  .sd-badge.soldout { background: #fce4ec; color: #c62828; }
  .sd-badge.pending { background: #fff3e0; color: #e65100; }

  /* Product thumbnail */
  .sd-thumb { width: 40px; height: 40px; border-radius: 8px; object-fit: cover; background: #f4f4f4; }

  /* Form */
  .sd-form { padding: 20px; }
  .sd-form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  .sd-form-group { display: flex; flex-direction: column; gap: 6px; }
  .sd-form-group.full { grid-column: 1 / -1; }
  .sd-label { font-size: 12px; font-weight: 700; color: #333; }
  .sd-input { padding: 10px 13px; border: 1.5px solid #ddd; border-radius: 7px; font-family: Arial, sans-serif; font-size: 13px; color: #333; outline: none; transition: border-color 0.2s; background: #fafafa; }
  .sd-input:focus { border-color: #250902; background: #fff; box-shadow: 0 0 0 3px rgba(37,9,2,0.07); }
  .sd-select { padding: 10px 13px; border: 1.5px solid #ddd; border-radius: 7px; font-family: Arial, sans-serif; font-size: 13px; color: #333; outline: none; background: #fafafa; cursor: pointer; transition: border-color 0.2s; }
  .sd-select:focus { border-color: #250902; background: #fff; }
  .sd-textarea { padding: 10px 13px; border: 1.5px solid #ddd; border-radius: 7px; font-family: Arial, sans-serif; font-size: 13px; color: #333; outline: none; resize: vertical; min-height: 80px; background: #fafafa; }
  .sd-textarea:focus { border-color: #250902; background: #fff; }
  .sd-form-actions { padding: 0 20px 20px; display: flex; gap: 10px; flex-wrap: wrap; }

  /* Image upload */
  .sd-upload-zone { border: 2px dashed #ddd; border-radius: 10px; padding: 24px; text-align: center; cursor: pointer; transition: border-color 0.2s, background 0.2s; background: #fafafa; }
  .sd-upload-zone:hover, .sd-upload-zone.drag { border-color: #250902; background: #fdf8f7; }
  .sd-upload-zone.uploading { border-color: #f59e0b; background: #fffbeb; cursor: not-allowed; }
  .sd-upload-icon { font-size: 32px; margin-bottom: 8px; }
  .sd-upload-text { font-size: 13px; color: #888; }
  .sd-upload-text strong { color: #250902; }
  .sd-img-previews { display: flex; gap: 10px; flex-wrap: wrap; margin-top: 12px; }
  .sd-img-preview { position: relative; width: 80px; height: 80px; }
  .sd-img-preview img { width: 100%; height: 100%; object-fit: cover; border-radius: 8px; border: 1px solid #eee; }
  .sd-img-remove { position: absolute; top: -6px; right: -6px; width: 20px; height: 20px; border-radius: 50%; background: #dc2626; color: #fff; border: none; cursor: pointer; font-size: 12px; font-weight: 700; display: flex; align-items: center; justify-content: center; }
  .sd-upload-progress { font-size: 12px; color: #f59e0b; font-weight: 700; margin-top: 6px; }

  /* Error */
  .sd-error { background: #fff5f5; border: 1px solid #fca5a5; color: #dc2626; padding: 10px 14px; border-radius: 8px; font-size: 13px; margin-bottom: 14px; }
  .sd-success { background: #f0fdf4; border: 1px solid #86efac; color: #16a34a; padding: 10px 14px; border-radius: 8px; font-size: 13px; margin-bottom: 14px; }

  /* Notification */
  .sd-notif { position: fixed; top: 20px; right: 20px; background: #1a1a1a; color: #fff; padding: 12px 20px; border-radius: 10px; font-size: 13px; font-weight: 600; z-index: 9999; box-shadow: 0 8px 24px rgba(0,0,0,0.2); }

  /* Empty */
  .sd-empty { text-align: center; padding: 40px 20px; color: #aaa; font-size: 14px; }
  .sd-empty-icon { font-size: 36px; margin-bottom: 10px; }

  /* Loading */
  .sd-loading { text-align: center; padding: 32px; color: #888; font-size: 14px; }

  @keyframes spin { to { transform: rotate(360deg); } }
  .sd-spinner { width: 16px; height: 16px; border: 2px solid rgba(255,255,255,0.3); border-top-color: #fff; border-radius: 50%; animation: spin 0.7s linear infinite; display: inline-block; }

  @media (max-width: 900px) {
    .sd-stats { grid-template-columns: repeat(2,1fr); }
    .sd-form-grid { grid-template-columns: 1fr; }
    .sd-form-group.full { grid-column: 1; }
  }
  @media (max-width: 660px) {
    .sd-sidebar { width: 56px; }
    .sd-logo-title, .sd-logo-sub, .sd-seller-info .sd-seller-name, .sd-seller-info .sd-seller-role, .sd-nav-item span:last-child, .sd-logout span:last-child { display: none; }
    .sd-main { margin-left: 56px; padding: 16px; }
  }
`;

const NAV = [
  { id: 'overview', icon: '📊', label: 'Overview'    },
  { id: 'products', icon: '📦', label: 'My Products'  },
  { id: 'orders',   icon: '🛒', label: 'Orders'       },
  { id: 'add',      icon: '➕', label: 'Add Product'  },
];

const BLANK_PRODUCT = {
  name: '', category: '', subCategory: '', description: '',
  price: '', originalPrice: '', stock: '', badge: '',
  specs: '', imageUrls: [],
};

export default function SellerDashboard() {
  const navigate       = useNavigate();
  const { user, logout } = useAuth();
  const fileInputRef   = useRef();

  const [tab, setTab]           = useState('overview');
  const [products, setProducts] = useState([]);
  const [orders, setOrders]     = useState([]);
  const [loading, setLoading]   = useState(false);
  const [notif, setNotif]       = useState('');
  const [formMsg, setFormMsg]   = useState({ type: '', text: '' });
  const [submitting, setSubmitting] = useState(false);

  // Add product form state
  const [form, setForm]         = useState(BLANK_PRODUCT);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [localPreviews, setLocalPreviews] = useState([]); // instant local previews before upload

  // Derived: subcategories based on selected category
  const selectedCat   = categoriesData.find(c => c.id === form.category);
  const subCategories = selectedCat ? selectedCat.subCategories : [];

  // ── Auth guard ──────────────────────────────────────────────────────────────
  if (!user || (user.role !== 'SELLER' && user.role !== 'ADMIN')) {
    return (
      <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'Arial', background:'#f8f8f8' }}>
        <div style={{ textAlign:'center' }}>
          <div style={{ fontSize:48, marginBottom:16 }}>🔒</div>
          <div style={{ fontSize:18, fontWeight:700, color:'#250902', marginBottom:8 }}>Seller Access Only</div>
          <button onClick={() => navigate('/login')} style={{ padding:'10px 24px', background:'#250902', color:'#fff', border:'none', borderRadius:8, fontWeight:700, cursor:'pointer', marginTop:8 }}>
            Sign In as Seller
          </button>
        </div>
      </div>
    );
  }

  const authHeader = () => ({ 'Content-Type': 'application/json', Authorization: `Bearer ${user.token}` });

  const notify = (msg) => { setNotif(msg); setTimeout(() => setNotif(''), 2800); };

  // ── Fetch seller's products ─────────────────────────────────────────────────
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res  = await fetch(`${API_BASE}/products/my-listings`, { headers: authHeader() });
      const data = await res.json();
      if (res.ok) setProducts(Array.isArray(data) ? data : []);
    } catch { /* silent */ }
    finally  { setLoading(false); }
  };

  // ── Fetch orders ─────────────────────────────────────────────────────────────
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res  = await fetch(`${API_BASE}/orders/seller`, { headers: authHeader() });
      const data = await res.json();
      if (res.ok) setOrders(Array.isArray(data) ? data : []);
    } catch { /* silent */ }
    finally  { setLoading(false); }
  };

  useEffect(() => {
    if (tab === 'products' || tab === 'overview') fetchProducts();
    if (tab === 'orders') fetchOrders();
  }, [tab]);

  // ── Direct Cloudinary upload from browser (signed with API key) ──────────────
  const CLOUD_NAME   = 'djntpek30';
  const UPLOAD_URL   = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

  const handleFileSelect = async (files) => {
    if (!files || files.length === 0) return;
    const allowed = Array.from(files).filter(f => f.type.startsWith('image/'));
    if (allowed.length === 0) { notify('⚠️ Please select image files only'); return; }
    if (form.imageUrls.length + allowed.length > 5) { notify('⚠️ Maximum 5 images per product'); return; }

    // Show local previews instantly
    const previews = allowed.map(file => URL.createObjectURL(file));
    setLocalPreviews(prev => [...prev, ...previews]);

    setUploading(true);
    setFormMsg({ type: '', text: '' });

    try {
      // Get upload signature from backend
      const sigRes = await fetch(`${API_BASE}/upload/signature`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      const sigText = await sigRes.text();
      if (!sigRes.ok || !sigText) throw new Error('Could not get upload signature from backend');
      const { signature, timestamp, apiKey, folder } = JSON.parse(sigText);

      // Upload each file directly to Cloudinary using the signature
      const uploadedUrls = [];
      for (const file of allowed) {
        const fd = new FormData();
        fd.append('file',      file);
        fd.append('signature', signature);
        fd.append('timestamp', timestamp);
        fd.append('api_key',   apiKey);
        fd.append('folder',    folder);

        const res  = await fetch(UPLOAD_URL, { method: 'POST', body: fd });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error?.message || 'Cloudinary upload failed');
        uploadedUrls.push(data.secure_url);
      }

      setLocalPreviews(prev => prev.filter(p => !previews.includes(p)));
      previews.forEach(p => URL.revokeObjectURL(p));
      setForm(prev => ({ ...prev, imageUrls: [...prev.imageUrls, ...uploadedUrls] }));
      notify(`✅ ${uploadedUrls.length} image(s) uploaded!`);
    } catch (err) {
      setLocalPreviews(prev => prev.filter(p => !previews.includes(p)));
      previews.forEach(p => URL.revokeObjectURL(p));
      setFormMsg({ type: 'error', text: `Upload failed: ${err.message}` });
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (idx, isLocal = false) => {
    if (isLocal) {
      setLocalPreviews(prev => {
        URL.revokeObjectURL(prev[idx]);
        return prev.filter((_, i) => i !== idx);
      });
    } else {
      setForm(prev => ({ ...prev, imageUrls: prev.imageUrls.filter((_, i) => i !== idx) }));
    }
  };

  // ── Drag & drop ─────────────────────────────────────────────────────────────
  const handleDrop = (e) => {
    e.preventDefault(); setDragOver(false);
    handleFileSelect(e.dataTransfer.files);
  };

  // ── Form field change ───────────────────────────────────────────────────────
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    // reset subcategory when category changes
    if (name === 'category') {
      setForm(prev => ({ ...prev, category: value, subCategory: '' }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  // ── Submit new product ──────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormMsg({ type: '', text: '' });

    if (!form.name)     return setFormMsg({ type: 'error', text: 'Product name is required.' });
    if (!form.category) return setFormMsg({ type: 'error', text: 'Please select a category.' });
    if (!form.price)    return setFormMsg({ type: 'error', text: 'Price is required.' });

    const payload = {
      name:          form.name,
      description:   form.description,
      category:      form.category,
      subCategory:   form.subCategory,
      price:         parseFloat(form.price),
      originalPrice: parseFloat(form.originalPrice || form.price),
      stock:         parseInt(form.stock || '0'),
      badge:         form.badge,
      imageUrls:     form.imageUrls,
      specs:         form.specs ? form.specs.split(',').map(s => s.trim()).filter(Boolean) : [],
      active:        true,
    };

    setSubmitting(true);
    try {
      const res  = await fetch(`${API_BASE}/products`, {
        method: 'POST',
        headers: authHeader(),
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok) {
        setFormMsg({ type: 'success', text: '✅ Product added successfully!' });
        setForm(BLANK_PRODUCT);
        notify('✅ Product added and live on the store!');
        setTimeout(() => { setTab('products'); setFormMsg({ type:'', text:'' }); }, 1500);
      } else {
        setFormMsg({ type: 'error', text: data.message || 'Failed to add product.' });
      }
    } catch {
      setFormMsg({ type: 'error', text: 'Network error. Check if the backend is running.' });
    } finally {
      setSubmitting(false);
    }
  };

  // ── Delete product ──────────────────────────────────────────────────────────
  const handleDelete = async (productId) => {
    if (!window.confirm('Remove this product from the store?')) return;
    try {
      const res = await fetch(`${API_BASE}/products/${productId}`, {
        method: 'DELETE', headers: authHeader(),
      });
      if (res.ok) { notify('🗑️ Product removed'); fetchProducts(); }
      else notify('⚠️ Could not remove product');
    } catch { notify('⚠️ Network error'); }
  };

  const totalRevenue = orders.reduce((s, o) => s + (o.total || 0), 0);

  return (
    <div className="sd-root">
      <style>{styles}</style>

      {notif && <div className="sd-notif">{notif}</div>}

      {/* ── Sidebar ── */}
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
            <div key={item.id} className={`sd-nav-item ${tab === item.id ? 'active' : ''}`} onClick={() => setTab(item.id)}>
              <span className="sd-nav-icon">{item.icon}</span>
              <span>{item.label}</span>
            </div>
          ))}
          <div className="sd-nav-item" onClick={() => navigate('/')}>
            <span className="sd-nav-icon">🏠</span>
            <span>Back to Store</span>
          </div>
        </nav>
        <div className="sd-logout" onClick={() => { logout(); navigate('/login'); }}>
          <span>🚪</span><span>Logout</span>
        </div>
      </div>

      {/* ── Main ── */}
      <div className="sd-main">

        {/* ── Overview ── */}
        {tab === 'overview' && (
          <>
            <div className="sd-topbar">
              <div className="sd-page-title">👋 Welcome, {user.name}!</div>
              <button className="sd-btn" onClick={() => setTab('add')}>+ Add Product</button>
            </div>
            <div className="sd-stats">
              <div className="sd-stat"><div className="sd-stat-icon">📦</div><div className="sd-stat-value">{products.length}</div><div className="sd-stat-label">My Products</div></div>
              <div className="sd-stat"><div className="sd-stat-icon">🛒</div><div className="sd-stat-value">{orders.length}</div><div className="sd-stat-label">Total Orders</div></div>
              <div className="sd-stat"><div className="sd-stat-icon">💰</div><div className="sd-stat-value">Rs. {totalRevenue.toLocaleString()}</div><div className="sd-stat-label">Total Revenue</div></div>
              <div className="sd-stat"><div className="sd-stat-icon">✅</div><div className="sd-stat-value">{products.filter(p => p.active).length}</div><div className="sd-stat-label">Active Listings</div></div>
            </div>
            <div className="sd-section">
              <div className="sd-section-header">
                <div className="sd-section-title">Recent Products</div>
                <button className="sd-btn-outline" onClick={() => setTab('products')}>View All</button>
              </div>
              {loading ? <div className="sd-loading">Loading...</div> : (
                <table className="sd-table">
                  <thead><tr><th>Image</th><th>Product</th><th>Category</th><th>Price</th><th>Stock</th><th>Status</th></tr></thead>
                  <tbody>
                    {products.slice(0, 5).map(p => (
                      <tr key={p.id}>
                        <td>{p.imageUrls?.[0] ? <img src={p.imageUrls[0]} alt={p.name} className="sd-thumb" /> : <div style={{ width:40, height:40, background:'#f4f4f4', borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center' }}>📦</div>}</td>
                        <td style={{ fontWeight:700 }}>{p.name}</td>
                        <td style={{ color:'#888' }}>{p.category}</td>
                        <td>Rs. {p.price?.toLocaleString()}</td>
                        <td>{p.stock}</td>
                        <td><span className={`sd-badge ${p.stock > 0 ? 'active' : 'soldout'}`}>{p.stock > 0 ? 'Active' : 'Sold Out'}</span></td>
                      </tr>
                    ))}
                    {products.length === 0 && <tr><td colSpan={6}><div className="sd-empty"><div className="sd-empty-icon">📦</div>No products yet. Add your first product!</div></td></tr>}
                  </tbody>
                </table>
              )}
            </div>
          </>
        )}

        {/* ── My Products ── */}
        {tab === 'products' && (
          <>
            <div className="sd-topbar">
              <div className="sd-page-title">📦 My Products</div>
              <button className="sd-btn" onClick={() => setTab('add')}>+ Add Product</button>
            </div>
            <div className="sd-section">
              {loading ? <div className="sd-loading">Loading products...</div> : (
                <table className="sd-table">
                  <thead><tr><th>Image</th><th>Product</th><th>Category</th><th>Sub-Category</th><th>Price</th><th>Stock</th><th>Status</th><th>Action</th></tr></thead>
                  <tbody>
                    {products.map(p => (
                      <tr key={p.id}>
                        <td>{p.imageUrls?.[0] ? <img src={p.imageUrls[0]} alt={p.name} className="sd-thumb" /> : <div style={{ width:40, height:40, background:'#f4f4f4', borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center' }}>📦</div>}</td>
                        <td style={{ fontWeight:700 }}>{p.name}</td>
                        <td>{p.category}</td>
                        <td style={{ color:'#888' }}>{p.subCategory || '—'}</td>
                        <td>Rs. {p.price?.toLocaleString()}</td>
                        <td>{p.stock}</td>
                        <td><span className={`sd-badge ${p.stock > 0 ? 'active' : 'soldout'}`}>{p.stock > 0 ? 'Active' : 'Sold Out'}</span></td>
                        <td><button className="sd-btn-danger" onClick={() => handleDelete(p.id)}>Remove</button></td>
                      </tr>
                    ))}
                    {products.length === 0 && <tr><td colSpan={8}><div className="sd-empty"><div className="sd-empty-icon">📦</div>No products yet.</div></td></tr>}
                  </tbody>
                </table>
              )}
            </div>
          </>
        )}

        {/* ── Orders ── */}
        {tab === 'orders' && (
          <>
            <div className="sd-topbar"><div className="sd-page-title">🛒 My Orders</div></div>
            <div className="sd-section">
              {loading ? <div className="sd-loading">Loading orders...</div> : (
                <table className="sd-table">
                  <thead><tr><th>Order ID</th><th>Date</th><th>Items</th><th>Total</th><th>Status</th></tr></thead>
                  <tbody>
                    {orders.map(o => (
                      <tr key={o.id}>
                        <td style={{ fontWeight:700, color:'#250902' }}>#{o.id?.slice(-6)}</td>
                        <td>{o.createdAt ? new Date(o.createdAt).toLocaleDateString() : '—'}</td>
                        <td>{o.items?.length || 0} items</td>
                        <td>Rs. {o.total?.toLocaleString()}</td>
                        <td><span className={`sd-badge ${o.status === 'DELIVERED' ? 'active' : 'pending'}`}>{o.status || 'Pending'}</span></td>
                      </tr>
                    ))}
                    {orders.length === 0 && <tr><td colSpan={5}><div className="sd-empty"><div className="sd-empty-icon">🛒</div>No orders yet.</div></td></tr>}
                  </tbody>
                </table>
              )}
            </div>
          </>
        )}

        {/* ── Add Product ── */}
        {tab === 'add' && (
          <>
            <div className="sd-topbar"><div className="sd-page-title">➕ Add New Product</div></div>
            <div className="sd-section">
              <form onSubmit={handleSubmit}>
                <div className="sd-form">

                  {formMsg.text && (
                    <div className={formMsg.type === 'error' ? 'sd-error' : 'sd-success'}>
                      {formMsg.text}
                    </div>
                  )}

                  <div className="sd-form-grid">

                    {/* Product Name */}
                    <div className="sd-form-group full">
                      <label className="sd-label">Product Name *</label>
                      <input className="sd-input" name="name" placeholder="e.g. Men's Casual Cotton Shirt" value={form.name} onChange={handleFormChange} required />
                    </div>

                    {/* Category */}
                    <div className="sd-form-group">
                      <label className="sd-label">Category *</label>
                      <select className="sd-select" name="category" value={form.category} onChange={handleFormChange} required>
                        <option value="">— Select Category —</option>
                        {categoriesData.map(cat => (
                          <option key={cat.id} value={cat.id}>{cat.icon} {cat.name}</option>
                        ))}
                      </select>
                    </div>

                    {/* Sub-Category */}
                    <div className="sd-form-group">
                      <label className="sd-label">Sub-Category</label>
                      <select className="sd-select" name="subCategory" value={form.subCategory} onChange={handleFormChange} disabled={!form.category}>
                        <option value="">— Select Sub-Category —</option>
                        {subCategories.map(sub => (
                          <option key={sub.name} value={sub.name}>{sub.name}</option>
                        ))}
                      </select>
                    </div>

                    {/* Price */}
                    <div className="sd-form-group">
                      <label className="sd-label">Price (Rs.) *</label>
                      <input className="sd-input" type="number" name="price" placeholder="e.g. 4500" value={form.price} onChange={handleFormChange} required min="0" />
                    </div>

                    {/* Original Price */}
                    <div className="sd-form-group">
                      <label className="sd-label">Original Price (Rs.) <span style={{ color:'#aaa', fontWeight:400 }}>(for discount display)</span></label>
                      <input className="sd-input" type="number" name="originalPrice" placeholder="e.g. 5500" value={form.originalPrice} onChange={handleFormChange} min="0" />
                    </div>

                    {/* Stock */}
                    <div className="sd-form-group">
                      <label className="sd-label">Stock Quantity</label>
                      <input className="sd-input" type="number" name="stock" placeholder="e.g. 50" value={form.stock} onChange={handleFormChange} min="0" />
                    </div>

                    {/* Badge */}
                    <div className="sd-form-group">
                      <label className="sd-label">Badge <span style={{ color:'#aaa', fontWeight:400 }}>(e.g. New, Hot, Sale)</span></label>
                      <select className="sd-select" name="badge" value={form.badge} onChange={handleFormChange}>
                        <option value="">— No Badge —</option>
                        <option>New</option>
                        <option>Hot</option>
                        <option>Sale</option>
                        <option>Top Rated</option>
                        <option>Best Seller</option>
                        <option>Limited</option>
                        <option>Organic</option>
                        <option>Premium</option>
                      </select>
                    </div>

                    {/* Specs */}
                    <div className="sd-form-group full">
                      <label className="sd-label">Specs <span style={{ color:'#aaa', fontWeight:400 }}>(comma-separated e.g. Cotton, Slim Fit, M-XXL)</span></label>
                      <input className="sd-input" name="specs" placeholder="e.g. Cotton, Slim Fit, M-XXL" value={form.specs} onChange={handleFormChange} />
                    </div>

                    {/* Description */}
                    <div className="sd-form-group full">
                      <label className="sd-label">Description</label>
                      <textarea className="sd-textarea" name="description" placeholder="Describe your product..." value={form.description} onChange={handleFormChange} />
                    </div>

                    {/* Image Upload */}
                    <div className="sd-form-group full">
                      <label className="sd-label">Product Images <span style={{ color:'#aaa', fontWeight:400 }}>(up to 5 — uploaded to Cloudinary)</span></label>

                      {/* Drop zone */}
                      <div
                        className={`sd-upload-zone ${uploading ? 'uploading' : ''} ${dragOver ? 'drag' : ''}`}
                        onClick={() => !uploading && fileInputRef.current?.click()}
                        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                        onDragLeave={() => setDragOver(false)}
                        onDrop={handleDrop}
                      >
                        <div className="sd-upload-icon">{uploading ? '⏳' : '📸'}</div>
                        <div className="sd-upload-text">
                          {uploading
                            ? <><strong>Uploading to Cloudinary...</strong></>
                            : <><strong>Click to upload</strong> or drag & drop images here</>
                          }
                        </div>
                        <div style={{ fontSize:11, color:'#bbb', marginTop:4 }}>PNG, JPG, WEBP — max 5 images</div>
                      </div>

                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        multiple
                        style={{ display:'none' }}
                        onChange={(e) => handleFileSelect(e.target.files)}
                      />

                      {/* Previews — local (instant) + uploaded (Cloudinary URLs) */}
                      {(localPreviews.length > 0 || form.imageUrls.length > 0) && (
                        <div className="sd-img-previews">
                          {/* Local previews — uploading spinner overlay */}
                          {localPreviews.map((src, i) => (
                            <div key={`local-${i}`} className="sd-img-preview">
                              <img src={src} alt={`local-preview-${i}`} />
                              {uploading && (
                                <div style={{ position:'absolute', inset:0, background:'rgba(0,0,0,0.45)', borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center' }}>
                                  <div style={{ width:20, height:20, border:'2px solid rgba(255,255,255,0.3)', borderTopColor:'#fff', borderRadius:'50%', animation:'spin 0.7s linear infinite' }} />
                                </div>
                              )}
                              {!uploading && (
                                <button type="button" className="sd-img-remove" onClick={() => removeImage(i, true)}>×</button>
                              )}
                            </div>
                          ))}
                          {/* Uploaded Cloudinary URLs */}
                          {form.imageUrls.map((url, i) => (
                            <div key={`cloud-${i}`} className="sd-img-preview">
                              <img src={url} alt={`uploaded-${i}`} />
                              <div style={{ position:'absolute', bottom:-6, left:'50%', transform:'translateX(-50%)', background:'#16a34a', borderRadius:10, padding:'1px 6px', fontSize:9, color:'#fff', fontWeight:700, whiteSpace:'nowrap' }}>✓ saved</div>
                              <button type="button" className="sd-img-remove" onClick={() => removeImage(i)}>×</button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                  </div>
                </div>

                <div className="sd-form-actions">
                  <button type="submit" className="sd-btn" disabled={submitting || uploading}>
                    {submitting ? <><span className="sd-spinner" /> &nbsp;Saving...</> : '✅ Add Product'}
                  </button>
                  <button type="button" className="sd-btn-outline" onClick={() => { setForm(BLANK_PRODUCT); setFormMsg({ type:'', text:'' }); }}>
                    Clear Form
                  </button>
                </div>
              </form>
            </div>


          </>
        )}

      </div>
    </div>
  );
}