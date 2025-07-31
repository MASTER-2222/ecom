import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ComparisonDrawer from '@/components/ComparisonDrawer';
import ErrorBoundary from '@/components/ErrorBoundary';
import { ProductCardSkeleton, ProductDetailSkeleton, CartSkeleton, TableSkeleton } from '@/components/skeletons';
import { NotFound, ServerError, NetworkError, Unauthorized } from '@/pages/errors';
import { AuthProvider } from '@/providers/AuthProvider';
import { CartProvider } from '@/providers/CartProvider';
import { WishlistProvider } from '@/providers/WishlistProvider';
import { ComparisonProvider } from '@/providers/ComparisonProvider';

// Lazy load page components for better performance
const HomePage = lazy(() => import('@/pages/HomePage'));
const Login = lazy(() => import('@/pages/auth/Login'));
const Register = lazy(() => import('@/pages/auth/Register'));
const ProductListing = lazy(() => import('@/pages/ProductListing'));
const ProductDetail = lazy(() => import('@/pages/ProductDetail'));
const SearchResults = lazy(() => import('@/pages/SearchResults'));
const ComparisonPage = lazy(() => import('@/pages/ComparisonPage'));
const Cart = lazy(() => import('@/pages/Cart'));
const Checkout = lazy(() => import('@/pages/Checkout'));
const OrderSuccess = lazy(() => import('@/pages/OrderSuccess'));
const Profile = lazy(() => import('@/pages/account/Profile'));
const Wishlist = lazy(() => import('@/pages/Wishlist'));
const AdminDashboard = lazy(() => import('@/pages/admin/AdminDashboard'));

// Loading fallback components for different page types
const PageLoading = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
  </div>
);

const ProductListingLoading = () => (
  <div className="container mx-auto px-4 py-8">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {[...Array(12)].map((_, i) => (
        <ProductCardSkeleton key={i} variant="grid" />
      ))}
    </div>
  </div>
);

const ProductDetailLoading = () => (
  <div className="container mx-auto px-4 py-8">
    <ProductDetailSkeleton />
  </div>
);

const CartLoading = () => (
  <div className="container mx-auto px-4 py-8">
    <CartSkeleton variant="page" />
  </div>
);

const AdminLoading = () => (
  <div className="container mx-auto px-4 py-8">
    <TableSkeleton variant="orders" rows={10} />
  </div>
);

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <ComparisonProvider>
              <Router>
                <div className="min-h-screen flex flex-col bg-gray-50">
                  <Routes>
                    {/* Error pages that don't need layout */}
                    <Route path="/error/500" element={<ServerError />} />
                    <Route path="/error/network" element={<NetworkError />} />
                    <Route path="/error/unauthorized" element={<Unauthorized />} />
                    <Route path="/error/404" element={<NotFound />} />
                    
                    {/* Regular pages with layout */}
                    <Route path="/*" element={
                      <>
                        <Header />
                        <main className="flex-1">
                          <Suspense fallback={<PageLoading />}>
                            <Routes>
                              <Route path="/" element={<HomePage />} />
                              <Route path="/login" element={<Login />} />
                              <Route path="/register" element={<Register />} />
                              <Route path="/products" element={
                                <Suspense fallback={<ProductListingLoading />}>
                                  <ProductListing />
                                </Suspense>
                              } />
                              <Route path="/product/:id" element={
                                <Suspense fallback={<ProductDetailLoading />}>
                                  <ProductDetail />
                                </Suspense>
                              } />
                              <Route path="/search" element={
                                <Suspense fallback={<ProductListingLoading />}>
                                  <SearchResults />
                                </Suspense>
                              } />
                              <Route path="/comparison" element={<ComparisonPage />} />
                              <Route path="/cart" element={
                                <Suspense fallback={<CartLoading />}>
                                  <Cart />
                                </Suspense>
                              } />
                              <Route path="/wishlist" element={<Wishlist />} />
                              <Route path="/checkout" element={<Checkout />} />
                              <Route path="/order-success" element={<OrderSuccess />} />
                              <Route path="/account" element={<Profile />} />
                              <Route path="/account/*" element={<Profile />} />
                              <Route path="/admin" element={
                                <Suspense fallback={<AdminLoading />}>
                                  <AdminDashboard />
                                </Suspense>
                              } />
                              <Route path="/electronics" element={
                                <Suspense fallback={<ProductListingLoading />}>
                                  <ProductListing />
                                </Suspense>
                              } />
                              <Route path="/fashion" element={
                                <Suspense fallback={<ProductListingLoading />}>
                                  <ProductListing />
                                </Suspense>
                              } />
                              <Route path="/home-kitchen" element={
                                <Suspense fallback={<ProductListingLoading />}>
                                  <ProductListing />
                                </Suspense>
                              } />
                              <Route path="/books" element={
                                <Suspense fallback={<ProductListingLoading />}>
                                  <ProductListing />
                                </Suspense>
                              } />
                              <Route path="/deals" element={
                                <Suspense fallback={<ProductListingLoading />}>
                                  <ProductListing />
                                </Suspense>
                              } />
                              <Route path="/home-garden" element={
                                <Suspense fallback={<ProductListingLoading />}>
                                  <ProductListing />
                                </Suspense>
                              } />
                              <Route path="/sports" element={
                                <Suspense fallback={<ProductListingLoading />}>
                                  <ProductListing />
                                </Suspense>
                              } />
                              <Route path="/beauty" element={
                                <Suspense fallback={<ProductListingLoading />}>
                                  <ProductListing />
                                </Suspense>
                              } />
                              
                              {/* Catch all route for 404 */}
                              <Route path="*" element={<NotFound />} />
                            </Routes>
                          </Suspense>
                        </main>
                        <Footer />
                        <ComparisonDrawer />
                      </>
                    } />
                  </Routes>
                  
                  <Toaster 
                    position="top-right"
                    containerClassName="z-50"
                    toastOptions={{
                      duration: 4000,
                      style: {
                        background: '#333',
                        color: '#fff',
                        fontSize: '14px',
                        padding: '12px 16px',
                        borderRadius: '8px',
                        maxWidth: '400px',
                      },
                      success: {
                        style: {
                          background: '#22c55e',
                        },
                        iconTheme: {
                          primary: '#fff',
                          secondary: '#22c55e',
                        },
                      },
                      error: {
                        style: {
                          background: '#ef4444',
                        },
                        iconTheme: {
                          primary: '#fff',
                          secondary: '#ef4444',
                        },
                      },
                      loading: {
                        style: {
                          background: '#3b82f6',
                        },
                      },
                    }}
                  />
                </div>
              </Router>
            </ComparisonProvider>
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
