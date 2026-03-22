import React, { createContext, useState, useContext, useCallback, useEffect } from 'react';

const CartContext  = createContext();
const API_BASE     = 'http://localhost:8080/api/v1';

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {

  const [cart, setCart]         = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [syncing, setSyncing]   = useState(false);


  const getUser = () => {
    try {
      const saved = localStorage.getItem('quickart_user');
      return saved ? JSON.parse(saved) : null;
    } catch { return null; }
  };

  const authHeader = () => {
    const user = getUser();
    return user?.token ? { Authorization: `Bearer ${user.token}` } : {};
  };

 
  const loadCart = useCallback(async () => {
    const user = getUser();

    if (user?.id && user?.token) {
 
      try {
        setSyncing(true);
        const res  = await fetch(`${API_BASE}/cart/${user.id}`, {
          headers: { ...authHeader(), 'Content-Type': 'application/json' }
        });
        if (res.ok) {
          const data = await res.json();
   
          const mapped = (Array.isArray(data) ? data : []).map(item => ({
            id:        item.productId,
            productId: item.productId,
            name:      item.name,
            price:     item.price,
            qty:       item.qty,
            emoji:     '📦',
            imgs:      item.imageUrl ? [item.imageUrl] : [],
            imageUrl:  item.imageUrl,
          }));
          setCart(mapped);

          localStorage.setItem('quickart_cart', JSON.stringify(mapped));
        }
      } catch {

        loadFromLocalStorage();
      } finally {
        setSyncing(false);
      }
    } else {

      loadFromLocalStorage();
    }
  }, []);

  const loadFromLocalStorage = () => {
    try {
      const saved = localStorage.getItem('quickart_cart');
      setCart(saved ? JSON.parse(saved) : []);
    } catch {
      setCart([]);
    }
  };

  useEffect(() => {
    loadCart();
  }, [loadCart]);

  const addToCart = useCallback(async (product) => {
    const user = getUser();

    setCart(prev => {
      const existing = prev.find(i => i.id === product.id);
      const updated  = existing
        ? prev.map(i => i.id === product.id ? { ...i, qty: i.qty + 1 } : i)
        : [...prev, { ...product, qty: 1 }];
      localStorage.setItem('quickart_cart', JSON.stringify(updated));
      return updated;
    });

    if (user?.id && user?.token) {
      try {
        await fetch(`${API_BASE}/cart`, {
          method:  'POST',
          headers: { ...authHeader(), 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId:      user.id,
            productId:   String(product.id),
            name:        product.name,
            description: product.specs?.join(', ') || '',
            imageUrl:    product.imgs?.[0] || product.imageUrl || '',
            price:       product.price,
            qty:         1,
          }),
        });
      } catch { /* silent — optimistic update already done */ }
    }
  }, []);

  const updateQty = useCallback(async (productId, delta) => {
    const user = getUser();

    setCart(prev => {
      const updated = prev.map(item =>
        item.id === productId
          ? { ...item, qty: Math.max(1, item.qty + delta) }
          : item
      );
      localStorage.setItem('quickart_cart', JSON.stringify(updated));
      return updated;
    });

    if (user?.id && user?.token) {
      const item = cart.find(i => i.id === productId);
      if (item) {
        const newQty = Math.max(1, item.qty + delta);
        try {
          await fetch(`${API_BASE}/cart/${user.id}/${productId}`, {
            method:  'PUT',
            headers: { ...authHeader(), 'Content-Type': 'application/json' },
            body: JSON.stringify({ qty: newQty }),
          });
        } catch { /* silent */ }
      }
    }
  }, [cart]);

  const removeItem = useCallback(async (productId) => {
    const user = getUser();

    setCart(prev => {
      const updated = prev.filter(i => i.id !== productId);
      localStorage.setItem('quickart_cart', JSON.stringify(updated));
      return updated;
    });

    if (user?.id && user?.token) {
      try {
        await fetch(`${API_BASE}/cart/${user.id}/${productId}`, {
          method:  'DELETE',
          headers: authHeader(),
        });
      } catch { /* silent */ }
    }
  }, []);

  const clearCart = useCallback(async () => {
    const user = getUser();
    setCart([]);
    localStorage.removeItem('quickart_cart');

    if (user?.id && user?.token) {
      try {
        const items = cart;
        await Promise.all(items.map(item =>
          fetch(`${API_BASE}/cart/${user.id}/${item.id}`, {
            method:  'DELETE',
            headers: authHeader(),
          })
        ));
      } catch { /* silent */ }
    }
  }, [cart]);

  const toggleCart = useCallback(() => setIsCartOpen(prev => !prev), []);
  const closeCart  = useCallback(() => setIsCartOpen(false), []);

  const cartTotal = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);
  const cartCount = cart.reduce((acc, item) => acc + item.qty, 0);

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      updateQty,
      removeItem,
      clearCart,
      loadCart,
      cartTotal,
      cartCount,
      isCartOpen,
      toggleCart,
      closeCart,
      syncing,
    }}>
      {children}
    </CartContext.Provider>
  );
};