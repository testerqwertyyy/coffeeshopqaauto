import React from 'react';
import { Product } from '../services/api';

interface ProductCardProps {
  product: Product;
  onViewDetails: (product: Product) => void;
  onAddToCart: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onViewDetails, onAddToCart }) => {
  const roastColors: Record<string, string> = {
    light: 'bg-amber-100 text-amber-800',
    medium: 'bg-orange-100 text-orange-800',
    dark: 'bg-stone-200 text-stone-800'
  };

  const roastLabels: Record<string, string> = {
    light: 'Light Roast',
    medium: 'Medium Roast',
    dark: 'Dark Roast'
  };

  let flavorNotes: string[] = [];
  try {
    flavorNotes = JSON.parse(product.flavor_notes || '[]');
  } catch {
    flavorNotes = [];
  }

  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group border border-amber-50">
      <div className="relative overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${roastColors[product.roast_level] || roastColors.light}`}>
            {roastLabels[product.roast_level] || product.roast_level}
          </span>
        </div>
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
          <span className="text-sm font-bold text-amber-900">${product.price.toFixed(2)}</span>
        </div>
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-bold text-stone-800 group-hover:text-amber-800 transition-colors">
            {product.name}
          </h3>
        </div>

        <p className="text-sm text-stone-500 mb-3 flex items-center gap-1">
          <span>📍</span> {product.origin} · {product.weight}
        </p>

        <div className="flex flex-wrap gap-1.5 mb-4">
          {flavorNotes.slice(0, 3).map(note => (
            <span
              key={note}
              className="text-xs bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full border border-amber-100"
            >
              {note}
            </span>
          ))}
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => onViewDetails(product)}
            className="flex-1 px-4 py-2.5 border-2 border-amber-800 text-amber-800 rounded-xl font-medium text-sm hover:bg-amber-50 transition-colors"
          >
            Details
          </button>
          <button
            onClick={() => onAddToCart(product)}
            className="flex-1 px-4 py-2.5 bg-amber-800 text-white rounded-xl font-medium text-sm hover:bg-amber-700 transition-colors"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
