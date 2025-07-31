import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShoppingCart,
  User,
  MapPin,
  Menu,
  Heart,
  ChevronDown,
  Globe
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import SearchBar from '@/components/SearchBar';
import { useCart } from '@/hooks/useCart';
import { useWishlist } from '@/hooks/useWishlist';
import { useAuth } from '@/hooks/useAuth';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { cart } = useCart();
  const { getWishlistItemCount } = useWishlist();
  const { user, logout } = useAuth();

  const cartItemCount = cart?.totalItems || 0;
  const wishlistItemCount = getWishlistItemCount();

  return (
    <header className="w-full">
      {/* Main Header */}
      <div className="amazon-header py-2">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between gap-4">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 text-white hover:opacity-80 transition-opacity">
              <div className="text-2xl font-bold">
                RitKART
              </div>
              <div className="text-xs">.com</div>
            </Link>

            {/* Delivery Location */}
            <div className="hidden lg:flex items-center gap-1 text-white hover:border border-white px-2 py-1 rounded cursor-pointer">
              <MapPin className="w-4 h-4" />
              <div className="text-xs">
                <div className="text-gray-300">Deliver to</div>
                <div className="font-bold">New York 10001</div>
              </div>
            </div>

            {/* Enhanced Search Bar */}
            <SearchBar className="flex-1 max-w-2xl" />

            {/* Language & Country */}
            <div className="hidden md:flex items-center text-white hover:border border-white px-2 py-1 rounded cursor-pointer">
              <Globe className="w-4 h-4 mr-1" />
              <span className="text-sm font-bold">EN</span>
            </div>

            {/* Account */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="flex items-center text-white hover:border border-white px-2 py-1 rounded cursor-pointer">
                  <User className="w-4 h-4 mr-1" />
                  <div className="text-xs hidden md:block">
                    <div className="text-gray-300">Hello, {user ? user.firstName : 'Sign in'}</div>
                    <div className="font-bold">Account & Lists</div>
                  </div>
                  <ChevronDown className="w-3 h-3 ml-1" />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-64">
                {!user ? (
                  <>
                    <div className="p-4">
                      <Link to="/login">
                        <Button className="w-full amazon-secondary-button">
                          Sign In
                        </Button>
                      </Link>
                      <p className="text-xs text-center mt-2">
                        New customer? <Link to="/register" className="text-blue-600 hover:underline">Start here.</Link>
                      </p>
                    </div>
                    <DropdownMenuSeparator />
                  </>
                ) : (
                  <>
                    <DropdownMenuItem asChild>
                      <Link to="/account">Your Account</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/orders">Your Orders</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/wishlist">Your Wish List</Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={logout}>
                      Sign Out
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Returns & Orders */}
            <Link 
              to={user ? "/orders" : "/login"} 
              className="hidden lg:flex items-center text-white hover:border border-white px-2 py-1 rounded"
            >
              <div className="text-xs">
                <div className="text-gray-300">Returns</div>
                <div className="font-bold">& Orders</div>
              </div>
            </Link>

            {/* Wishlist */}
            {user && (
              <Link 
                to="/wishlist" 
                className="flex items-center text-white hover:border border-white px-2 py-1 rounded relative"
              >
                <div className="relative">
                  <Heart className="w-6 h-6" />
                  {wishlistItemCount > 0 && (
                    <Badge 
                      className="absolute -top-2 -right-2 bg-red-500 text-white text-xs min-w-[20px] h-5 flex items-center justify-center rounded-full"
                    >
                      {wishlistItemCount > 99 ? '99+' : wishlistItemCount}
                    </Badge>
                  )}
                </div>
                <span className="text-sm font-bold ml-1 hidden md:inline">Wishlist</span>
              </Link>
            )}

            {/* Cart */}
            <Link 
              to="/cart" 
              className="flex items-center text-white hover:border border-white px-2 py-1 rounded relative"
            >
              <div className="relative">
                <ShoppingCart className="w-6 h-6" />
                {cartItemCount > 0 && (
                  <Badge 
                    className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs min-w-[20px] h-5 flex items-center justify-center rounded-full"
                  >
                    {cartItemCount > 99 ? '99+' : cartItemCount}
                  </Badge>
                )}
              </div>
              <span className="text-sm font-bold ml-1 hidden md:inline">Cart</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Navigation Bar */}
      <div className="bg-[#37475A] text-white py-2">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-6">
            {/* All Menu */}
            <Button
              variant="ghost"
              className="text-white hover:bg-white/10 gap-2 px-3 py-1"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Menu className="w-4 h-4" />
              All
            </Button>

            {/* Navigation Links */}
            <nav className="hidden md:flex items-center gap-6 text-sm">
              <Link to="/deals" className="hover:underline">Today's Deals</Link>
              <Link to="/customer-service" className="hover:underline">Customer Service</Link>
              <Link to="/registry" className="hover:underline">Registry</Link>
              <Link to="/gift-cards" className="hover:underline">Gift Cards</Link>
              <Link to="/sell" className="hover:underline">Sell</Link>
            </nav>

            {/* Mobile Navigation Toggle */}
            <div className="md:hidden ml-auto">
              <Button
                variant="ghost"
                className="text-white hover:bg-white/10"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                <Menu className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-b shadow-lg">
          <div className="container mx-auto px-4 py-4">
            <nav className="flex flex-col gap-4">
              <Link to="/deals" className="text-gray-700 hover:text-orange-600">Today's Deals</Link>
              <Link to="/customer-service" className="text-gray-700 hover:text-orange-600">Customer Service</Link>
              <Link to="/registry" className="text-gray-700 hover:text-orange-600">Registry</Link>
              <Link to="/gift-cards" className="text-gray-700 hover:text-orange-600">Gift Cards</Link>
              <Link to="/sell" className="text-gray-700 hover:text-orange-600">Sell</Link>
              <hr className="my-2" />
              <Link to="/electronics" className="text-gray-700 hover:text-orange-600">Electronics</Link>
              <Link to="/fashion" className="text-gray-700 hover:text-orange-600">Fashion</Link>
              <Link to="/home-garden" className="text-gray-700 hover:text-orange-600">Home & Garden</Link>
              <Link to="/books" className="text-gray-700 hover:text-orange-600">Books</Link>
              <Link to="/sports" className="text-gray-700 hover:text-orange-600">Sports & Outdoors</Link>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;