import React, { createContext, useState, useContext, useCallback } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const addToCart = useCallback((product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...prevCart, { ...product, qty: 1 }];
    });
  }, []);

  const updateQty = useCallback((productId, delta) => {
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === productId
          ? { ...item, qty: Math.max(1, item.qty + delta) }
          : item
      )
    );
  }, []);

  const removeItem = useCallback((productId) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  }, []);

  const toggleCart = useCallback(() => setIsCartOpen(prev => !prev), []);
  const closeCart = useCallback(() => setIsCartOpen(false), []);

  const cartTotal = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);
  const cartCount = cart.reduce((acc, item) => acc + item.qty, 0);

  const value = {
    cart,
    addToCart,
    updateQty,
    removeItem,
    cartTotal,
    cartCount,
    isCartOpen,
    toggleCart,
    closeCart,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};