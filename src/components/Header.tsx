import React from 'react';
import { useCart } from '../context/CartContext';

interface HeaderProps {
  onCartClick: () => void;
  onLogoClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onCartClick, onLogoClick }) => {
  const { totalItems } = useCart();

  return (
    <header className="bg-gradient-to-r from-amber-900 via-amber-800 to-amber-900 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          <button
            onClick={onLogoClick}
            className="flex items-center gap-2 hover:opacity-90 transition-opacity"
          >
            <span className="text-2xl sm:text-3xl">☕</span>
            <div>
              <h1 className="text-lg sm:text-xl font-bold tracking-wide">Artisan Roast</h1>
              <p className="text-xs text-amber-200 hidden sm:block">Specialty Coffee</p>
            </div>
          </button>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <button onClick={onLogoClick} className="hover:text-amber-200 transition-colors">
              Shop
            </button>
            <span className="hover:text-amber-200 transition-colors cursor-pointer">
              About
            </span>
            <span className="hover:text-amber-200 transition-colors cursor-pointer">
              Brewing Guide
            </span>
          </nav>

          <button
            onClick={onCartClick}
            className="relative flex items-center gap-2 bg-amber-700 hover:bg-amber-600 px-4 py-2 rounded-full transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
            </svg>
            <span className="font-medium">Cart</span>
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full font-bold">
                {totalItems}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
