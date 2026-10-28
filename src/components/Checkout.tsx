import React, { useState } from 'react';
import { useCart } from '../context/CartContext';

interface CheckoutProps {
  onClose: () => void;
  onComplete: () => void;
}

const Checkout: React.FC<CheckoutProps> = ({ onClose, onComplete }) => {
  const { items, totalPrice, clearCart } = useCart();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    city: '',
    zip: '',
    cardNumber: '',
    expiry: '',
    cvv: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Simulate order processing
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      clearCart();
      
      setTimeout(() => {
        onComplete();
      }, 3000);
    }, 2000);
  };

  if (isSuccess) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
        <div className="relative bg-white rounded-3xl p-8 max-w-md w-full text-center shadow-2xl">
          <div className="text-6xl mb-4 animate-bounce">🎉</div>
          <h2 className="text-2xl font-bold text-stone-800 mb-2">Order Confirmed!</h2>
          <p className="text-stone-600 mb-4">
            Thank you for your order. Your specialty coffee is being prepared with care.
          </p>
          <p className="text-sm text-amber-700 font-medium">
            Order #{Math.random().toString(36).substr(2, 9).toUpperCase()}
          </p>
          <div className="mt-6 text-sm text-stone-500">
            Redirecting to shop...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-2xl w-full my-8 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-800 to-amber-900 text-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold">Checkout</h2>
              <p className="text-amber-200 text-sm mt-1">
                {items.length} item{items.length !== 1 ? 's' : ''} · ${totalPrice.toFixed(2)}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Order Summary */}
        <div className="p-6 border-b border-amber-100 bg-amber-50/30">
          <h3 className="font-semibold text-stone-700 mb-3">Order Summary</h3>
          <div className="space-y-2">
            {items.map(item => (
              <div key={item.product.id} className="flex justify-between text-sm">
                <span className="text-stone-600">
                  {item.product.name} × {item.quantity}
                </span>
                <span className="font-medium text-stone-800">
                  ${(item.product.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
            <div className="border-t border-amber-200 pt-2 mt-2 flex justify-between">
              <span className="font-bold text-stone-800">Total</span>
              <span className="font-bold text-amber-900 text-lg">${totalPrice.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <h3 className="font-semibold text-stone-700 mb-3">Shipping Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-stone-600 mb-1">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 border border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all"
                  placeholder="John Doe"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-stone-600 mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 border border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all"
                  placeholder="john@example.com"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-stone-600 mb-1">Address</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 border border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all"
                  placeholder="123 Coffee Street"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-600 mb-1">City</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 border border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all"
                  placeholder="Portland"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-600 mb-1">ZIP Code</label>
                <input
                  type="text"
                  name="zip"
                  value={formData.zip}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 border border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all"
                  placeholder="97201"
                />
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-stone-700 mb-3">Payment (Demo)</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-stone-600 mb-1">Card Number</label>
                <input
                  type="text"
                  name="cardNumber"
                  value={formData.cardNumber}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 border border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all"
                  placeholder="4242 4242 4242 4242"
                  maxLength={19}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-600 mb-1">Expiry</label>
                <input
                  type="text"
                  name="expiry"
                  value={formData.expiry}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 border border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all"
                  placeholder="MM/YY"
                  maxLength={5}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-600 mb-1">CVV</label>
                <input
                  type="text"
                  name="cvv"
                  value={formData.cvv}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 border border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all"
                  placeholder="123"
                  maxLength={4}
                />
              </div>
            </div>
            <p className="text-xs text-stone-400 mt-2">
              🔒 This is a demo — no real payment will be processed.
            </p>
          </div>

          <button
            type="submit"
            disabled={isProcessing}
            className="w-full py-3.5 bg-amber-800 text-white rounded-xl font-semibold text-lg hover:bg-amber-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-amber-800/20"
          >
            {isProcessing ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Processing...
              </span>
            ) : (
              `Place Order — $${totalPrice.toFixed(2)}`
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Checkout;
