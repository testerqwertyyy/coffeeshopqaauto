import React from 'react';
import { useCart } from '../context/CartContext';

interface CartProps {
  onClose: () => void;
  onCheckout: () => void;
}

const Cart: React.FC<CartProps> = ({ onClose, onCheckout }) => {
  const { items, removeFromCart, updateQuantity, totalPrice } = useCart();

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Cart Panel */}
      <div className="relative ml-auto w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-slide-in">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-amber-100">
          <h2 className="text-xl font-bold text-stone-800 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
            </svg>
            Your Cart
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-amber-50 rounded-full transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-stone-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <span className="text-5xl mb-4">🛒</span>
              <p className="text-stone-500 text-lg">Your cart is empty</p>
              <p className="text-stone-400 text-sm mt-1">Add some amazing coffee!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map(item => (
                <div
                  key={item.id}
                  className="flex gap-4 bg-amber-50/50 rounded-xl p-3 border border-amber-100"
                >
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-stone-800 text-sm truncate">
                      {item.product.name}
                    </h4>
                    <p className="text-xs text-stone-500">{item.product.weight}</p>
                    <p className="text-amber-800 font-bold text-sm mt-1">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                  <div className="flex flex-col items-end justify-between">
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-stone-400 hover:text-red-500 transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-7 h-7 flex items-center justify-center rounded-md bg-white border border-amber-200 text-amber-800 hover:bg-amber-100 transition-colors text-sm font-bold"
                      >
                        −
                      </button>
                      <span className="w-8 text-center text-sm font-semibold text-stone-800">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-7 h-7 flex items-center justify-center rounded-md bg-white border border-amber-200 text-amber-800 hover:bg-amber-100 transition-colors text-sm font-bold"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-amber-100 p-6 bg-amber-50/30">
            <div className="flex justify-between items-center mb-4">
              <span className="text-stone-600 font-medium">Total</span>
              <span className="text-2xl font-bold text-amber-900">${totalPrice.toFixed(2)}</span>
            </div>
            <button
              onClick={onCheckout}
              className="w-full py-3.5 bg-amber-800 text-white rounded-xl font-semibold hover:bg-amber-700 transition-colors shadow-lg shadow-amber-800/20"
            >
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
