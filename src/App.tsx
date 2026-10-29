import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { CartProvider, useCart } from './context/CartContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { productsApi, Product } from './services/api';
import Header from './components/Header';
import ProductCard from './components/ProductCard';
import ProductDetail from './components/ProductDetail';
import Cart from './components/Cart';
import Checkout from './components/Checkout';
import SearchFilter from './components/SearchFilter';
import AuthModal from './components/AuthModal';
import OrdersPanel from './components/OrdersPanel';

type View = 'shop' | 'detail' | 'cart' | 'checkout' | 'orders';

const AppContent: React.FC = () => {
  const { isLoggedIn } = useAuth();
  const [view, setView] = useState<View>('shop');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [notification, setNotification] = useState<string | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const { addToCart } = useCart();

  const loadProducts = useCallback(async () => {
    try {
      setProductsLoading(true);
      const data = await productsApi.list({ category: activeCategory, search: searchQuery });
      setProducts(data);
    } catch (err) {
      console.error('Failed to load products:', err);
    } finally {
      setProductsLoading(false);
    }
  }, [activeCategory, searchQuery]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const filteredProducts = useMemo(() => {
    // If API is not available, filter locally
    if (products.length === 0 && !productsLoading) return [];
    return products.filter(product => {
      const matchesSearch = searchQuery === '' ||
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.origin.toLowerCase().includes(searchQuery.toLowerCase()) ||
        JSON.parse(product.flavor_notes || '[]').some((note: string) =>
          note.toLowerCase().includes(searchQuery.toLowerCase())
        );
      return matchesSearch;
    });
  }, [products, searchQuery, productsLoading]);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 2500);
  };

  const handleViewDetails = (product: Product) => {
    setSelectedProduct(product);
    setView('detail');
  };

  const handleAddToCart = async (product: Product) => {
    if (!isLoggedIn) {
      setShowAuthModal(true);
      showNotification('Please sign in to add items to cart');
      return;
    }
    try {
      await addToCart(product);
      showNotification(`${product.name} added to cart!`);
    } catch (err) {
      showNotification('Failed to add to cart');
    }
  };

  const handleBackToShop = () => {
    setView('shop');
    setSelectedProduct(null);
  };

  const handleCheckoutComplete = () => {
    setView('orders');
    setSelectedProduct(null);
    showNotification('Thank you for your order! 🎉');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-stone-50">
      <Header
        onCartClick={() => {
          if (!isLoggedIn) {
            setShowAuthModal(true);
            return;
          }
          setView('cart');
        }}
        onLogoClick={handleBackToShop}
        onAuthClick={() => setShowAuthModal(true)}
        onOrdersClick={() => setView('orders')}
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
            {productsLoading ? (
              <div className="text-center py-16">
                <div className="animate-spin h-8 w-8 border-4 border-amber-800 border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-stone-500">Loading coffees...</p>
              </div>
            ) : filteredProducts.length > 0 ? (
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

        {view === 'orders' && (
          <OrdersPanel onBack={handleBackToShop} />
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
              <h4 className="font-semibold text-white mb-3">API Endpoints</h4>
              <ul className="space-y-1 text-xs text-amber-200 font-mono">
                <li>POST /api/auth/register</li>
                <li>POST /api/auth/login</li>
                <li>GET  /api/products</li>
                <li>GET  /api/cart</li>
                <li>POST /api/orders</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-3">Backend</h4>
              <p className="text-amber-200 text-sm">
                Python FastAPI + SQLite<br />
                JWT Authentication<br />
                Run: <code className="bg-amber-800 px-1 rounded">uvicorn main:app --reload</code>
              </p>
            </div>
          </div>
          <div className="border-t border-amber-800 mt-8 pt-8 text-center text-sm text-amber-300">
            <p>© 2024 Artisan Roast. Full-stack specialty coffee e-commerce.</p>
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

      {/* Auth Modal */}
      {showAuthModal && (
        <AuthModal onClose={() => setShowAuthModal(false)} />
      )}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <CartProvider>
        <AppContent />
      </CartProvider>
    </AuthProvider>
  );
};

export default App;
