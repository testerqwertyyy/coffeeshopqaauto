import React from 'react';
import { Product } from '../types';

interface ProductDetailProps {
  product: Product;
  onBack: () => void;
  onAddToCart: (product: Product) => void;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ product, onBack, onAddToCart }) => {
  const roastLabels = {
    light: 'Light Roast',
    medium: 'Medium Roast',
    dark: 'Dark Roast'
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-amber-800 hover:text-amber-600 mb-6 font-medium transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Shop
      </button>

      <div className="bg-white rounded-3xl shadow-lg overflow-hidden border border-amber-50">
        <div className="grid md:grid-cols-2 gap-0">
          <div className="relative">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-72 md:h-full object-cover"
            />
            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-4 py-1.5 rounded-full">
              <span className="text-sm font-semibold text-amber-800">{roastLabels[product.roastLevel]}</span>
            </div>
          </div>

          <div className="p-6 md:p-8 flex flex-col">
            <div className="flex-1">
              <p className="text-sm text-amber-600 font-medium mb-1">📍 {product.origin}</p>
              <h1 className="text-2xl md:text-3xl font-bold text-stone-800 mb-4">{product.name}</h1>
              
              <p className="text-stone-600 leading-relaxed mb-6">{product.description}</p>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-amber-50 rounded-xl p-3">
                  <p className="text-xs text-stone-500 uppercase tracking-wide">Altitude</p>
                  <p className="font-semibold text-stone-800 text-sm">{product.altitude}</p>
                </div>
                <div className="bg-amber-50 rounded-xl p-3">
                  <p className="text-xs text-stone-500 uppercase tracking-wide">Process</p>
                  <p className="font-semibold text-stone-800 text-sm">{product.process}</p>
                </div>
                <div className="bg-amber-50 rounded-xl p-3">
                  <p className="text-xs text-stone-500 uppercase tracking-wide">Weight</p>
                  <p className="font-semibold text-stone-800 text-sm">{product.weight}</p>
                </div>
                <div className="bg-amber-50 rounded-xl p-3">
                  <p className="text-xs text-stone-500 uppercase tracking-wide">Roast Level</p>
                  <p className="font-semibold text-stone-800 text-sm">{roastLabels[product.roastLevel]}</p>
                </div>
              </div>

              <div className="mb-6">
                <p className="text-sm font-semibold text-stone-700 mb-2">Flavor Notes</p>
                <div className="flex flex-wrap gap-2">
                  {product.flavorNotes.map(note => (
                    <span
                      key={note}
                      className="bg-amber-100 text-amber-800 px-3 py-1.5 rounded-full text-sm font-medium"
                    >
                      {note}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="border-t border-amber-100 pt-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-3xl font-bold text-amber-900">${product.price.toFixed(2)}</span>
                <span className="text-sm text-stone-500">per {product.weight}</span>
              </div>
              <button
                onClick={() => onAddToCart(product)}
                className="w-full py-3.5 bg-amber-800 text-white rounded-xl font-semibold text-lg hover:bg-amber-700 transition-colors shadow-lg shadow-amber-800/20"
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
