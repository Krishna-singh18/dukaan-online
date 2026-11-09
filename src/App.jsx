import React, { useState, useEffect } from 'react';
import { StoreProvider } from './context/StoreContext';
import { CartProvider } from './context/CartContext';
import { useStore } from './hooks/useStore';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { MobileBottomNav } from './components/layout/MobileBottomNav';
import { CartDrawer } from './components/cart/CartDrawer';
import { FloatingCartBar } from './components/cart/FloatingCartBar';
import { WhatsAppButton } from './components/common/WhatsAppButton';
import { PwaInstallPrompt } from './components/common/PwaInstallPrompt';
import { Home } from './pages/Home';
import { Products } from './pages/Products';
import { Cart } from './pages/Cart';
import { About } from './pages/About';
import { Contact } from './pages/Contact';
import { Admin } from './pages/Admin';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('App Caught Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[70vh] flex items-center justify-center p-6 bg-background">
          <div className="max-w-md w-full bg-surface p-6 rounded-3xl border border-red-200 shadow-xl text-center">
            <div className="w-16 h-16 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-4 font-bold text-2xl">
              ⚠️
            </div>
            <h2 className="text-lg font-bold text-mainText mb-2">Something unexpected happened</h2>
            <p className="text-xs text-secondaryText mb-4">
              {this.state.error?.message || 'A temporary rendering error occurred.'}
            </p>
            <div className="flex gap-2 justify-center">
              <button
                onClick={() => {
                  this.setState({ hasError: false, error: null });
                  window.location.reload();
                }}
                className="px-4 py-2 bg-primary text-white rounded-xl text-xs font-bold shadow"
              >
                Reload Store
              </button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

function MainApp() {
  const { storeConfig } = useStore();
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [cartInitialStep, setCartInitialStep] = useState('cart');

  useEffect(() => {
    if (storeConfig?.name) {
      document.title = `${storeConfig.name} - Taaza Grocery & Daily Essentials`;
    }
  }, [storeConfig?.name]);

  const handleNavigate = (pageId, step = 'cart') => {
    setCurrentPage(pageId);
    if (pageId === 'cart') {
      setCartInitialStep(step);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectCategory = (categoryId) => {
    setSelectedCategory(categoryId);
  };

  const handleProceedToCheckout = () => {
    handleNavigate('cart', 'checkout');
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-mainText antialiased selection:bg-secondary selection:text-primary">
      {/* Top Header Navigation */}
      <Navbar activePage={currentPage} onNavigate={handleNavigate} />

      {/* Main Pages Content with Mobile Bottom Padding */}
      <main className="flex-1 pb-16 md:pb-0">
        <ErrorBoundary>
          {currentPage === 'home' && (
            <Home
              onNavigate={handleNavigate}
              onSelectCategory={handleSelectCategory}
            />
          )}

          {currentPage === 'shop' && (
            <Products
              selectedCategory={selectedCategory}
              onSelectCategory={handleSelectCategory}
              offersOnly={false}
            />
          )}

          {currentPage === 'offers' && (
            <Products
              selectedCategory="all"
              onSelectCategory={handleSelectCategory}
              offersOnly={true}
            />
          )}

          {currentPage === 'cart' && (
            <Cart
              onNavigate={handleNavigate}
              initialStep={cartInitialStep}
            />
          )}

          {currentPage === 'about' && (
            <About onNavigate={handleNavigate} />
          )}

          {currentPage === 'contact' && (
            <Contact />
          )}

          {currentPage === 'admin' && (
            <Admin onNavigate={handleNavigate} />
          )}
        </ErrorBoundary>
      </main>

      {/* Global Slide-Over Cart Drawer */}
      <CartDrawer
        onCheckout={handleProceedToCheckout}
        onNavigate={handleNavigate}
      />

      {/* Floating Bottom Cart Bar */}
      <FloatingCartBar
        currentPage={currentPage}
        onNavigate={handleNavigate}
      />

      {/* Floating WhatsApp Action Button */}
      <WhatsAppButton mode="floating" label="Chat with Shop" />

      {/* PWA 1-Click Install Prompt */}
      <PwaInstallPrompt />

      {/* Footer (includes its own padding for bottom navigation on mobile) */}
      <Footer onNavigate={handleNavigate} />

      {/* Mobile Sticky Bottom Navigation */}
      <MobileBottomNav activePage={currentPage} onNavigate={handleNavigate} />
    </div>
  );
}

function App() {
  return (
    <StoreProvider>
      <CartProvider>
        <ErrorBoundary>
          <MainApp />
        </ErrorBoundary>
      </CartProvider>
    </StoreProvider>
  );
}

export default App;
