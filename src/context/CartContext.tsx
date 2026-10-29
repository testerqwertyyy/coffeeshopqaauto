import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import { cartApi, CartItem, Product } from '../services/api';
import { useAuth } from './AuthContext';

interface CartContextType {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  loading: boolean;
  addToCart: (product: Product) => Promise<void>;
  removeFromCart: (itemId: number) => Promise<void>;
  updateQuantity: (itemId: number, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { isLoggedIn } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);

  const refreshCart = useCallback(async () => {
    if (!isLoggedIn) {
      setItems([]);
      return;
    }
    try {
      setLoading(true);
      const cart = await cartApi.get();
      setItems(cart.items);
    } catch (err) {
      console.error('Failed to load cart:', err);
    } finally {
      setLoading(false);
    }
  }, [isLoggedIn]);

  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  const addToCart = async (product: Product) => {
    if (!isLoggedIn) throw new Error('Please sign in first');
    try {
      const cart = await cartApi.add(product.id, 1);
      setItems(cart.items);
    } catch (err) {
      console.error('Failed to add to cart:', err);
      throw err;
    }
  };

  const removeFromCart = async (itemId: number) => {
    try {
      const cart = await cartApi.remove(itemId);
      setItems(cart.items);
    } catch (err) {
      console.error('Failed to remove from cart:', err);
    }
  };

  const updateQuantity = async (itemId: number, quantity: number) => {
    try {
      const cart = await cartApi.update(itemId, quantity);
      setItems(cart.items);
    } catch (err) {
      console.error('Failed to update cart:', err);
    }
  };

  const clearCart = async () => {
    try {
      await cartApi.clear();
      setItems([]);
    } catch (err) {
      console.error('Failed to clear cart:', err);
    }
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{ items, totalItems, totalPrice, loading, addToCart, removeFromCart, updateQuantity, clearCart, refreshCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
