import React from 'react';
import { Link } from 'react-router-dom';
import { Globe, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#232F3E] text-white">
      {/* Back to Top */}
      <div 
        className="bg-[#37475A] hover:bg-[#485769] cursor-pointer py-4 transition-colors"
        onClick={scrollToTop}
      >
        <div className="container mx-auto px-4 text-center">
          <span className="text-sm font-medium">Back to top</span>
          <ChevronUp className="w-4 h-4 inline-block ml-2" />
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Get to Know Us */}
          <div>
            <h3 className="font-bold text-white mb-4">Get to Know Us</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><Link to="/about" className="hover:underline">About RitKART</Link></li>
              <li><Link to="/careers" className="hover:underline">Careers</Link></li>
              <li><Link to="/press" className="hover:underline">Press Releases</Link></li>
              <li><Link to="/investor-relations" className="hover:underline">Investor Relations</Link></li>
              <li><Link to="/devices" className="hover:underline">RitKART Devices</Link></li>
              <li><Link to="/science" className="hover:underline">RitKART Science</Link></li>
            </ul>
          </div>

          {/* Make Money with Us */}
          <div>
            <h3 className="font-bold text-white mb-4">Make Money with Us</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><Link to="/sell" className="hover:underline">Sell products on RitKART</Link></li>
              <li><Link to="/sell-apps" className="hover:underline">Sell on RitKART Business</Link></li>
              <li><Link to="/associates" className="hover:underline">Become an Associate</Link></li>
              <li><Link to="/advertise" className="hover:underline">Advertise Your Products</Link></li>
              <li><Link to="/self-publish" className="hover:underline">Self-Publish with Us</Link></li>
              <li><Link to="/host-hub" className="hover:underline">Host an RitKART Hub</Link></li>
            </ul>
          </div>

          {/* RitKART Payment Products */}
          <div>
            <h3 className="font-bold text-white mb-4">RitKART Payment Products</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><Link to="/business-card" className="hover:underline">RitKART Business Card</Link></li>
              <li><Link to="/rewards-visa" className="hover:underline">Shop with Points</Link></li>
              <li><Link to="/credit-cards" className="hover:underline">Reload Your Balance</Link></li>
              <li><Link to="/currency-converter" className="hover:underline">RitKART Currency Converter</Link></li>
            </ul>
          </div>

          {/* Let Us Help You */}
          <div>
            <h3 className="font-bold text-white mb-4">Let Us Help You</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><Link to="/covid" className="hover:underline">RitKART and COVID-19</Link></li>
              <li><Link to="/account" className="hover:underline">Your Account</Link></li>
              <li><Link to="/orders" className="hover:underline">Your Orders</Link></li>
              <li><Link to="/shipping" className="hover:underline">Shipping Rates & Policies</Link></li>
              <li><Link to="/returns" className="hover:underline">Returns & Replacements</Link></li>
              <li><Link to="/content-devices" className="hover:underline">Manage Your Content and Devices</Link></li>
              <li><Link to="/help" className="hover:underline">Help</Link></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Separator */}
      <div className="border-t border-gray-600"></div>

      {/* Language and Country */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-center gap-6">
          <Link to="/" className="flex items-center gap-2 text-white">
            <div className="text-xl font-bold">RitKART</div>
          </Link>
          
          <div className="flex items-center gap-4">
            <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-600">
              <Globe className="w-4 h-4 mr-2" />
              English
            </Button>
            
            <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-600">
              $ USD - U.S. Dollar
            </Button>
            
            <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-600">
              🇺🇸 United States
            </Button>
          </div>
        </div>
      </div>

      {/* Separator */}
      <div className="border-t border-gray-600"></div>

      {/* Bottom Links */}
      <div className="bg-[#131A22] py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-4 text-xs text-gray-400">
            <div>
              <h4 className="font-semibold text-white mb-2">RitKART Music</h4>
              <ul className="space-y-1">
                <li><Link to="/music" className="hover:underline">Stream Music</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-2">RitKART Video</h4>
              <ul className="space-y-1">
                <li><Link to="/primevideo" className="hover:underline">Watch Movies & TV</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-2">RitKART Drive</h4>
              <ul className="space-y-1">
                <li><Link to="/clouddrive" className="hover:underline">Cloud Storage</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-2">RitKART Fresh</h4>
              <ul className="space-y-1">
                <li><Link to="/fresh" className="hover:underline">Groceries & More</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-2">Whole Foods</h4>
              <ul className="space-y-1">
                <li><Link to="/wholefoods" className="hover:underline">Premium Organic</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-2">RitKART Web Services</h4>
              <ul className="space-y-1">
                <li><Link to="/aws" className="hover:underline">Cloud Computing</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-2">Audible</h4>
              <ul className="space-y-1">
                <li><Link to="/audible" className="hover:underline">Listen to Books</Link></li>
              </ul>
            </div>
          </div>
          
          {/* Copyright and Legal */}
          <div className="mt-8 pt-8 border-t border-gray-700 text-center">
            <div className="flex flex-wrap justify-center gap-4 text-xs text-gray-400 mb-4">
              <Link to="/conditions" className="hover:underline">Conditions of Use</Link>
              <Link to="/privacy" className="hover:underline">Privacy Notice</Link>
              <Link to="/interest-ads" className="hover:underline">Your Ads Privacy Choices</Link>
            </div>
            <p className="text-xs text-gray-400">
              © 1996-2025, RitKART.com, Inc. or its affiliates
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;