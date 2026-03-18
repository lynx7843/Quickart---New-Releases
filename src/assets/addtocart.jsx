import React from 'react';
import { useCart } from '../pages/CartContext';
import { useNavigate } from 'react-router-dom';
import { Plus, Minus, Trash2, ShoppingCart, ArrowLeft } from 'lucide-react';
import Footer from './Footer.jsx';

const CartPage = () => {
  const { cart, updateQty, removeItem, cartTotal, cartCount } = useCart();
  const navigate = useNavigate();

  if (cart.length === 0) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '16px', fontFamily: "'Sora', sans-serif" }}>
        <ShoppingCart size={80} color="#d1d5db" style={{ marginBottom: '16px' }} />
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#374151', marginBottom: '8px' }}>Your Cart is Empty</h2>
        <p style={{ color: '#6b7280', marginBottom: '24px' }}>Looks like you haven't added anything to your cart yet.</p>
        <button
          onClick={() => navigate('/quickart')} // Assuming quickart is the main shop page
          style={{ backgroundColor: '#2563eb', color: 'white', fontWeight: 'bold', padding: '12px 24px', borderRadius: '8px', border: 'none', cursor: 'pointer', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-6">
          <button onClick={() => navigate(-1)} className="text-gray-600 hover:text-gray-900">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-3xl font-bold text-gray-800 ml-4">Your Shopping Cart ({cartCount} items)</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-6">
            {cart.map(item => (
              <div key={item.id} className="flex items-center border-b border-gray-200 py-4 last:border-b-0">
                <div className="w-24 h-24 bg-gray-100 rounded-md flex items-center justify-center text-4xl mr-6">
                  {item.emoji || '📦'}
                </div>
                <div className="flex-grow">
                  <h3 className="font-bold text-lg text-gray-800">{item.name}</h3>
                  <p className="text-sm text-gray-500">{item.description || item.spec || 'No description available.'}</p>
                  <p className="font-semibold text-blue-600 mt-1">LKR {item.price.toLocaleString()}</p>
                </div>
                <div className="flex items-center mx-6">
                  <button onClick={() => updateQty(item.id, -1)} className="p-2 rounded-full bg-gray-200 hover:bg-gray-300">
                    <Minus size={16} />
                  </button>
                  <span className="px-4 font-bold">{item.qty}</span>
                  <button onClick={() => updateQty(item.id, 1)} className="p-2 rounded-full bg-gray-200 hover:bg-gray-300">
                    <Plus size={16} />
                  </button>
                </div>
                <div className="text-right w-32">
                    <p className="font-bold text-lg">LKR {(item.price * item.qty).toLocaleString()}</p>
                </div>
                <button onClick={() => removeItem(item.id)} className="ml-6 text-gray-400 hover:text-red-500">
                  <Trash2 size={20} />
                </button>
              </div>
            ))}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-28">
              <h2 className="text-2xl font-bold border-b pb-4 mb-4">Order Summary</h2>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-semibold">LKR {cartTotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Shipping</span>
                <span className="font-semibold">LKR 500.00</span>
              </div>
              <div className="flex justify-between mb-6">
                <span className="text-gray-600">Taxes</span>
                <span className="font-semibold">LKR 0.00</span>
              </div>
              <div className="flex justify-between font-bold text-xl border-t pt-4">
                <span>Total</span>
                <span>LKR {(cartTotal + 500).toLocaleString()}</span>
              </div>
              <button
                onClick={() => navigate('/checkout')} // Assuming you have a checkout page route
                className="w-full mt-6 bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Proceed to Checkout
              </button>
            </div>
        </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CartPage;