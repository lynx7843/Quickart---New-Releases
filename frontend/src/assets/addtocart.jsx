import React, { useState } from 'react';
import { useCart } from '../pages/CartContext';
import { useNavigate } from 'react-router-dom';
import { Plus, Minus, Trash2, ShoppingCart, ArrowLeft, Tag, ChevronRight, Package, Shield, RotateCcw, Truck } from 'lucide-react';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  .cart-page {
    min-height: 100vh;
    background: #f8f8f8;
    font-family: 'Sora', Arial, sans-serif;
    color: #1a1a1a;
  }

  /* ── Top bar ── */
  .cart-topbar {
    background: #fff;
    border-bottom: 2px solid #250902;
    padding: 14px 32px;
    display: flex;
    align-items: center;
    gap: 16px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.06);
    position: sticky;
    top: 0;
    z-index: 50;
  }

  .cart-back-btn {
    display: flex;
    align-items: center;
    gap: 6px;
    background: none;
    border: none;
    cursor: pointer;
    font-family: 'Sora', Arial, sans-serif;
    font-size: 13px;
    font-weight: 600;
    color: #888;
    padding: 6px 10px;
    border-radius: 8px;
    transition: all 0.2s;
  }
  .cart-back-btn:hover { background: #f4f4f4; color: #250902; }

  .cart-topbar-title {
    font-size: 18px;
    font-weight: 800;
    color: #250902;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .cart-count-badge {
    background: #250902;
    color: #fff;
    font-size: 11px;
    font-weight: 700;
    padding: 2px 8px;
    border-radius: 20px;
  }

  /* ── Main layout ── */
  .cart-body {
    max-width: 1200px;
    margin: 0 auto;
    padding: 28px 20px;
    display: grid;
    grid-template-columns: 1fr 360px;
    gap: 24px;
    align-items: start;
  }

  /* ── Cart items ── */
  .cart-items-card {
    background: #fff;
    border-radius: 14px;
    box-shadow: 0 2px 12px rgba(0,0,0,0.07);
    overflow: hidden;
  }

  .cart-items-header {
    padding: 18px 24px;
    border-bottom: 1px solid #f0f0f0;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .cart-items-heading {
    font-size: 15px;
    font-weight: 800;
    color: #1a1a1a;
  }

  .cart-clear-btn {
    background: none;
    border: none;
    font-family: 'Sora', Arial, sans-serif;
    font-size: 12px;
    font-weight: 600;
    color: #dc2626;
    cursor: pointer;
    padding: 4px 8px;
    border-radius: 6px;
    transition: background 0.2s;
  }
  .cart-clear-btn:hover { background: #fef2f2; }

  /* ── Single item row ── */
  .cart-item {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 18px 24px;
    border-bottom: 1px solid #f8f8f8;
    transition: background 0.15s;
    animation: itemIn 0.3s ease both;
  }
  .cart-item:last-child { border-bottom: none; }
  .cart-item:hover { background: #fdfcfc; }

  @keyframes itemIn {
    from { opacity: 0; transform: translateY(8px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .cart-item-img {
    width: 80px;
    height: 80px;
    border-radius: 12px;
    object-fit: cover;
    background: #f4f6fa;
    flex-shrink: 0;
    border: 1px solid #eee;
  }

  .cart-item-emoji {
    width: 80px;
    height: 80px;
    border-radius: 12px;
    background: #f4f6fa;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 32px;
    flex-shrink: 0;
    border: 1px solid #eee;
  }

  .cart-item-info { flex: 1; min-width: 0; }

  .cart-item-name {
    font-size: 14px;
    font-weight: 700;
    color: #1a1a1a;
    margin-bottom: 4px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .cart-item-spec {
    font-size: 11px;
    color: #888;
    margin-bottom: 8px;
  }

  .cart-item-price {
    font-size: 15px;
    font-weight: 800;
    color: #250902;
  }

  /* ── Qty controls ── */
  .cart-qty {
    display: flex;
    align-items: center;
    gap: 0;
    border: 1.5px solid #e5e5e5;
    border-radius: 10px;
    overflow: hidden;
    flex-shrink: 0;
  }

  .cart-qty-btn {
    width: 34px;
    height: 34px;
    background: #f8f8f8;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.15s;
    color: #333;
  }
  .cart-qty-btn:hover { background: #250902; color: #fff; }

  .cart-qty-num {
    width: 36px;
    text-align: center;
    font-size: 14px;
    font-weight: 700;
    color: #1a1a1a;
    border-left: 1px solid #e5e5e5;
    border-right: 1px solid #e5e5e5;
    line-height: 34px;
  }

  .cart-item-total {
    font-size: 15px;
    font-weight: 800;
    color: #1a1a1a;
    width: 100px;
    text-align: right;
    flex-shrink: 0;
  }

  .cart-remove-btn {
    width: 34px;
    height: 34px;
    border-radius: 8px;
    border: none;
    background: #fff;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #ccc;
    transition: all 0.2s;
    flex-shrink: 0;
  }
  .cart-remove-btn:hover { background: #fef2f2; color: #dc2626; }

  /* ── Promo code ── */
  .cart-promo {
    padding: 16px 24px;
    border-top: 1px solid #f0f0f0;
    display: flex;
    gap: 10px;
  }

  .cart-promo-input {
    flex: 1;
    padding: 10px 14px;
    border: 1.5px solid #e5e5e5;
    border-radius: 8px;
    font-family: 'Sora', Arial, sans-serif;
    font-size: 13px;
    outline: none;
    transition: border-color 0.2s;
  }
  .cart-promo-input:focus { border-color: #250902; }
  .cart-promo-input::placeholder { color: #bbb; }

  .cart-promo-btn {
    padding: 10px 18px;
    background: #250902;
    color: #fff;
    border: none;
    border-radius: 8px;
    font-family: 'Sora', Arial, sans-serif;
    font-size: 13px;
    font-weight: 700;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 6px;
    transition: background 0.2s;
    white-space: nowrap;
  }
  .cart-promo-btn:hover { background: #3d1005; }

  /* ── Summary card ── */
  .cart-summary {
    background: #fff;
    border-radius: 14px;
    box-shadow: 0 2px 12px rgba(0,0,0,0.07);
    overflow: hidden;
    position: sticky;
    top: 80px;
  }

  .cart-summary-header {
    padding: 18px 24px;
    border-bottom: 1px solid #f0f0f0;
    font-size: 15px;
    font-weight: 800;
    color: #1a1a1a;
  }

  .cart-summary-body { padding: 20px 24px; }

  .cart-summary-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 14px;
    font-size: 13px;
  }

  .cart-summary-label { color: #888; font-weight: 500; }
  .cart-summary-value { font-weight: 700; color: #1a1a1a; }
  .cart-summary-value.free { color: #16a34a; font-weight: 700; }

  .cart-summary-divider {
    height: 1px;
    background: #f0f0f0;
    margin: 16px 0;
  }

  .cart-summary-total {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }

  .cart-summary-total-label {
    font-size: 16px;
    font-weight: 800;
    color: #1a1a1a;
  }

  .cart-summary-total-value {
    font-size: 22px;
    font-weight: 800;
    color: #250902;
  }

  .cart-checkout-btn {
    width: 100%;
    padding: 15px;
    background: #250902;
    color: #fff;
    border: none;
    border-radius: 10px;
    font-family: 'Sora', Arial, sans-serif;
    font-size: 15px;
    font-weight: 700;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    transition: background 0.2s, transform 0.15s;
    margin-bottom: 12px;
  }
  .cart-checkout-btn:hover { background: #3d1005; transform: translateY(-1px); }

  .cart-continue-btn {
    width: 100%;
    padding: 12px;
    background: #fff;
    color: #250902;
    border: 1.5px solid #250902;
    border-radius: 10px;
    font-family: 'Sora', Arial, sans-serif;
    font-size: 13px;
    font-weight: 700;
    cursor: pointer;
    transition: background 0.2s;
  }
  .cart-continue-btn:hover { background: #fdf8f7; }

  /* ── Trust badges ── */
  .cart-trust {
    padding: 16px 24px;
    border-top: 1px solid #f0f0f0;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .cart-trust-item {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 12px;
    color: #888;
  }

  .cart-trust-icon {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    background: #f4f6fa;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  /* ── Empty state ── */
  .cart-empty {
    min-height: 70vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 40px 20px;
  }

  .cart-empty-icon {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    background: #f4f6fa;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 20px;
  }

  .cart-empty-title {
    font-size: 22px;
    font-weight: 800;
    color: #1a1a1a;
    margin-bottom: 8px;
  }

  .cart-empty-sub {
    font-size: 14px;
    color: #888;
    margin-bottom: 28px;
    max-width: 320px;
    line-height: 1.6;
  }

  .cart-empty-btn {
    padding: 14px 32px;
    background: #250902;
    color: #fff;
    border: none;
    border-radius: 10px;
    font-family: 'Sora', Arial, sans-serif;
    font-size: 14px;
    font-weight: 700;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 8px;
    transition: background 0.2s, transform 0.15s;
  }
  .cart-empty-btn:hover { background: #3d1005; transform: translateY(-2px); }

  /* ── Promo success ── */
  .cart-promo-success {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 12px;
    color: #16a34a;
    font-weight: 600;
    padding: 8px 24px;
    background: #f0fdf4;
    border-top: 1px solid #bbf7d0;
  }

  /* responsive */
  @media (max-width: 860px) {
    .cart-body { grid-template-columns: 1fr; }
    .cart-summary { position: static; }
    .cart-item-total { display: none; }
  }

  @media (max-width: 500px) {
    .cart-topbar { padding: 12px 16px; }
    .cart-body { padding: 16px 12px; }
    .cart-item { padding: 14px 16px; gap: 12px; }
    .cart-item-img, .cart-item-emoji { width: 60px; height: 60px; font-size: 24px; }
  }
`;

const DELIVERY_FEE = 500;

export default function CartPage() {
  const { cart, updateQty, removeItem, cartTotal, cartCount } = useCart();
  const navigate = useNavigate();
  const [promo, setPromo]         = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoError, setPromoError]     = useState('');
  const discount  = promoApplied ? Math.round(cartTotal * 0.1) : 0;
  const freeShip  = cartTotal >= 5000;
  const shipping  = freeShip ? 0 : DELIVERY_FEE;
  const grandTotal = cartTotal - discount + shipping;

  const applyPromo = () => {
    if (promo.toUpperCase() === 'QUICKART10') {
      setPromoApplied(true);
      setPromoError('');
    } else {
      setPromoError('Invalid promo code');
      setPromoApplied(false);
    }
  };

  // ── Empty state ──────────────────────────────────────────────────────────────
  if (cart.length === 0) {
    return (
      <div className="cart-page">
        <style>{styles}</style>
        <div className="cart-topbar">
          <button className="cart-back-btn" onClick={() => navigate('/')}>
            <ArrowLeft size={16} /> Back
          </button>
          <div className="cart-topbar-title">
            <ShoppingCart size={20} /> Shopping Cart
          </div>
        </div>
        <div className="cart-empty">
          <div className="cart-empty-icon">
            <ShoppingCart size={44} color="#c5c5c5" />
          </div>
          <div className="cart-empty-title">Your cart is empty</div>
          <div className="cart-empty-sub">
            Looks like you haven't added anything yet. Explore our products and find something you love!
          </div>
          <button className="cart-empty-btn" onClick={() => navigate('/')}>
            Continue Shopping <ChevronRight size={16} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <style>{styles}</style>

      {/* Top bar */}
      <div className="cart-topbar">
        <button className="cart-back-btn" onClick={() => navigate(-1)}>
          <ArrowLeft size={16} /> Back
        </button>
        <div className="cart-topbar-title">
          <ShoppingCart size={20} />
          Shopping Cart
          <span className="cart-count-badge">{cartCount} items</span>
        </div>
      </div>

      <div className="cart-body">

        {/* ── Left: Cart Items ── */}
        <div>
          <div className="cart-items-card">
            <div className="cart-items-header">
              <div className="cart-items-heading">Your Items ({cartCount})</div>
              <button
                className="cart-clear-btn"
                onClick={() => cart.forEach(item => removeItem(item.id))}
              >
                Clear all
              </button>
            </div>

            {cart.map((item, idx) => (
              <div key={item.id} className="cart-item" style={{ animationDelay: `${idx * 0.05}s` }}>

                {/* Image */}
                {item.imgs?.[0]
                  ? <img src={item.imgs[0]} alt={item.name} className="cart-item-img" />
                  : <div className="cart-item-emoji">{item.emoji || '📦'}</div>
                }

                {/* Info */}
                <div className="cart-item-info">
                  <div className="cart-item-name">{item.name}</div>
                  <div className="cart-item-spec">
                    {item.specs?.[0] || item.sub || item.category || ''}
                  </div>
                  <div className="cart-item-price">LKR {item.price.toLocaleString()}</div>
                </div>

                {/* Qty */}
                <div className="cart-qty">
                  <button className="cart-qty-btn" onClick={() => updateQty(item.id, -1)}>
                    <Minus size={13} />
                  </button>
                  <div className="cart-qty-num">{item.qty}</div>
                  <button className="cart-qty-btn" onClick={() => updateQty(item.id, 1)}>
                    <Plus size={13} />
                  </button>
                </div>

                {/* Line total */}
                <div className="cart-item-total">
                  LKR {(item.price * item.qty).toLocaleString()}
                </div>

                {/* Remove */}
                <button className="cart-remove-btn" onClick={() => removeItem(item.id)}>
                  <Trash2 size={15} />
                </button>
              </div>
            ))}

            {/* Promo code */}
            <div className="cart-promo">
              <Tag size={16} color="#888" style={{ marginTop: 11, flexShrink: 0 }} />
              <input
                className="cart-promo-input"
                placeholder="Promo code (try QUICKART10)"
                value={promo}
                onChange={e => { setPromo(e.target.value); setPromoError(''); }}
                onKeyDown={e => e.key === 'Enter' && applyPromo()}
              />
              <button className="cart-promo-btn" onClick={applyPromo}>Apply</button>
            </div>
            {promoError && (
              <div style={{ padding: '6px 24px 10px', fontSize: 12, color: '#dc2626' }}>
                ⚠️ {promoError}
              </div>
            )}
            {promoApplied && (
              <div className="cart-promo-success">
                ✅ Promo applied — 10% discount added!
              </div>
            )}
          </div>

          {/* Free shipping nudge */}
          {!freeShip && (
            <div style={{ marginTop: 12, background: '#fffbeb', border: '1px solid #fcd34d', borderRadius: 10, padding: '12px 16px', fontSize: 13, color: '#92400e', display: 'flex', alignItems: 'center', gap: 8 }}>
              <Truck size={16} />
              Add <strong style={{ margin: '0 4px' }}>LKR {(5000 - cartTotal).toLocaleString()}</strong> more to get free delivery!
            </div>
          )}
          {freeShip && (
            <div style={{ marginTop: 12, background: '#f0fdf4', border: '1px solid #86efac', borderRadius: 10, padding: '12px 16px', fontSize: 13, color: '#166534', display: 'flex', alignItems: 'center', gap: 8 }}>
              <Truck size={16} />
              🎉 You qualify for <strong style={{ margin: '0 4px' }}>free delivery!</strong>
            </div>
          )}
        </div>

        {/* ── Right: Summary ── */}
        <div className="cart-summary">
          <div className="cart-summary-header">Order Summary</div>
          <div className="cart-summary-body">

            <div className="cart-summary-row">
              <span className="cart-summary-label">Subtotal ({cartCount} items)</span>
              <span className="cart-summary-value">LKR {cartTotal.toLocaleString()}</span>
            </div>

            {promoApplied && (
              <div className="cart-summary-row">
                <span className="cart-summary-label">Discount (10%)</span>
                <span className="cart-summary-value" style={{ color: '#16a34a' }}>
                  − LKR {discount.toLocaleString()}
                </span>
              </div>
            )}

            <div className="cart-summary-row">
              <span className="cart-summary-label">Delivery</span>
              <span className={`cart-summary-value ${freeShip ? 'free' : ''}`}>
                {freeShip ? 'FREE' : `LKR ${shipping.toLocaleString()}`}
              </span>
            </div>

            <div className="cart-summary-row">
              <span className="cart-summary-label">Tax</span>
              <span className="cart-summary-value">LKR 0</span>
            </div>

            <div className="cart-summary-divider" />

            <div className="cart-summary-total">
              <span className="cart-summary-total-label">Total</span>
              <span className="cart-summary-total-value">LKR {grandTotal.toLocaleString()}</span>
            </div>

            <button className="cart-checkout-btn" onClick={() => navigate('/payment')}>
              Proceed to Checkout <ChevronRight size={16} />
            </button>
            <button className="cart-continue-btn" onClick={() => navigate('/')}>
              Continue Shopping
            </button>
          </div>

          {/* Trust badges */}
          <div className="cart-trust">
            <div className="cart-trust-item">
              <div className="cart-trust-icon"><Shield size={14} color="#250902" /></div>
              Secure checkout — SSL encrypted
            </div>
            <div className="cart-trust-item">
              <div className="cart-trust-icon"><RotateCcw size={14} color="#250902" /></div>
              30-day easy returns
            </div>
            <div className="cart-trust-item">
              <div className="cart-trust-icon"><Package size={14} color="#250902" /></div>
              Free delivery over LKR 5,000
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
