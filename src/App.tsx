import React, { useState, useMemo } from 'react';
import { CartProvider, useCart } from './context/CartContext';
import { products } from './data/products';
import { Product } from './types';
import Header from './components/Header';
import ProductCard from './components/ProductCard';
import ProductDetail from './components/ProductDetail';
import Cart from './components/Cart';
import Checkout from './components/Checkout';
import SearchFilter from './components/SearchFilter';

type View = 'shop' | 'detail' | 'cart' | 'checkout';

const AppContent: React.FC = () => {
  const [view, setView] = useState<View>('shop');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [notification, setNotification] = useState<string | null>(null);
  const { addToCart } = useCart();

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch = searchQuery === '' || 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.origin.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.flavorNotes.some(note => note.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesCategory = activeCategory === 'all' || product.category === activeCategory;
      
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, activeCategory]);

  const handleViewDetails = (product: Product) => {
    setSelectedProduct(product);
    setView('detail');
  };

  const handleAddToCart = (product: Product) => {
    addToCart(product);
    setNotification(`${product.name} added to cart!`);
    setTimeout(() => setNotification(null), 2500);
  };

  const handleBackToShop = () => {
    setView('shop');
    setSelectedProduct(null);
  };

  const handleCheckoutComplete = () => {
    setView('shop');
    setSelectedProduct(null);
    setNotification('Thank you for your order! 🎉');
    setTimeout(() => setNotification(null), 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-stone-50">
      <Header
        onCartClick={() => setView('cart')}
        onLogoClick={handleBackToShop}
      />

      {/* Notification Toast */}
      {notification && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 animate-fade-in">
          <div className="bg-amber-800 text-white px-6 py-3 rounded-xl shadow-lg flex items-center gap-2">
            <span>✓</span>
            <span className="font-medium">{notification}</span>
          </div>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {view === 'shop' && (
          <>
            {/* Hero Section */}
            <div className="text-center mb-10">
              <h2 className="text-3xl sm:text-4xl font-bold text-stone-800 mb-3">
                Discover Exceptional Coffee
              </h2>
              <p className="text-stone-600 max-w-2xl mx-auto text-lg">
                Hand-selected single-origin beans from the world's finest growing regions, 
                roasted to perfection for an unforgettable cup.
              </p>
            </div>

            {/* Search and Filters */}
            <SearchFilter
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              activeCategory={activeCategory}
              onCategoryChange={setActiveCategory}
            />

            {/* Product Grid */}
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map(product => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onViewDetails={handleViewDetails}
                    onAddToCart={handleAddToCart}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <span className="text-5xl mb-4 block">🔍</span>
                <h3 className="text-xl font-semibold text-stone-700 mb-2">No coffees found</h3>
                <p className="text-stone-500">Try adjusting your search or filters</p>
              </div>
            )}
          </>
        )}

        {view === 'detail' && selectedProduct && (
          <ProductDetail
            product={selectedProduct}
            onBack={handleBackToShop}
            onAddToCart={handleAddToCart}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-amber-900 text-amber-100 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">☕</span>
                <h3 className="text-xl font-bold text-white">Artisan Roast</h3>
              </div>
              <p className="text-amber-200 text-sm leading-relaxed">
                Dedicated to sourcing and roasting the world's finest specialty coffees. 
                Every bean tells a story of dedication, terroir, and craft.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-3">Quick Links</h4>
              <ul className="space-y-2 text-sm text-amber-200">
                <li className="hover:text-white cursor-pointer transition-colors">Our Story</li>
                <li className="hover:text-white cursor-pointer transition-colors">Brewing Guides</li>
                <li className="hover:text-white cursor-pointer transition-colors">Subscription</li>
                <li className="hover:text-white cursor-pointer transition-colors">Wholesale</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-3">Contact</h4>
              <ul className="space-y-2 text-sm text-amber-200">
                <li>📧 hello@artisanroast.com</li>
                <li>📞 (555) 123-4567</li>
                <li>📍 123 Roastery Lane, Portland, OR</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-amber-800 mt-8 pt-8 text-center text-sm text-amber-300">
            <p>© 2024 Artisan Roast. All rights reserved. Crafted with ❤️ and great coffee.</p>
          </div>
        </div>
      </footer>

      {/* Cart Modal */}
      {view === 'cart' && (
        <Cart
          onClose={handleBackToShop}
          onCheckout={() => setView('checkout')}
        />
      )}

      {/* Checkout Modal */}
      {view === 'checkout' && (
        <Checkout
          onClose={handleBackToShop}
          onComplete={handleCheckoutComplete}
        />
      )}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <CartProvider>
      <AppContent />
    </CartProvider>
  );
};

export default App;
