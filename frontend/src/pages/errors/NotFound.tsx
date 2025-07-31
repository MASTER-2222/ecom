import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Home, ArrowLeft, Search, ShoppingBag, Compass } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const NotFound: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = React.useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const popularCategories = [
    { name: 'Electronics', link: '/electronics', icon: '📱' },
    { name: 'Fashion', link: '/fashion', icon: '👕' },
    { name: 'Home & Kitchen', link: '/home-kitchen', icon: '🏠' },
    { name: 'Books', link: '/books', icon: '📚' },
    { name: 'Sports', link: '/sports', icon: '⚽' },
    { name: 'Beauty', link: '/beauty', icon: '💄' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full text-center">
        {/* 404 Illustration */}
        <div className="mb-8">
          <div className="relative inline-block">
            {/* Large 404 Text */}
            <h1 className="text-9xl md:text-[12rem] font-bold text-gray-200 select-none">
              404
            </h1>
            
            {/* Shopping bag icon overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="p-8 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full shadow-xl transform -rotate-12">
                <ShoppingBag className="w-16 h-16 md:w-20 md:h-20 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-6 mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
            Oops! Page Not Found
          </h2>
          
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            The page you're looking for seems to have wandered off into the digital wilderness. 
            Don't worry though - we've got plenty of amazing products waiting for you!
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-12 max-w-md mx-auto">
          <form onSubmit={handleSearch} className="relative">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search for products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-4 py-3 text-lg border-2 border-gray-200 focus:border-orange-400 rounded-xl shadow-sm"
              />
            </div>
            <Button 
              type="submit" 
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg"
            >
              Search
            </Button>
          </form>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <Button 
            onClick={() => navigate(-1)}
            variant="outline"
            className="border-2 border-gray-300 hover:border-gray-400 px-6 py-3 text-lg"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Go Back
          </Button>
          
          <Link to="/">
            <Button className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-8 py-3 text-lg shadow-lg">
              <Home className="w-5 h-5 mr-2" />
              Back to Home
            </Button>
          </Link>
          
          <Link to="/products">
            <Button 
              variant="outline"
              className="border-2 border-blue-300 hover:border-blue-400 text-blue-600 hover:text-blue-700 px-6 py-3 text-lg"
            >
              <Compass className="w-5 h-5 mr-2" />
              Browse Products
            </Button>
          </Link>
        </div>

        {/* Popular Categories */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
          <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center justify-center gap-2">
            <Compass className="w-5 h-5" />
            Popular Categories
          </h3>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {popularCategories.map((category, index) => (
              <Link
                key={index}
                to={category.link}
                className="group p-4 rounded-xl border border-gray-200 hover:border-orange-300 hover:shadow-md transition-all duration-200 bg-gray-50 hover:bg-orange-50"
              >
                <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">
                  {category.icon}
                </div>
                <p className="text-sm font-medium text-gray-700 group-hover:text-orange-600">
                  {category.name}
                </p>
              </Link>
            ))}
          </div>
        </div>

        {/* Footer Message */}
        <div className="mt-12 text-gray-500">
          <p className="text-sm">
            Need help? Contact our{' '}
            <Link to="/support" className="text-orange-600 hover:text-orange-700 font-medium">
              customer support
            </Link>
            {' '}team.
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;