
'use client';

import { useState } from 'react';
import Link from 'next/link';

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  image: string;
  rating: number;
  reviews: number;
  author: string;
  category: string;
  language: string;
}

const products: Product[] = [
  {
    id: '1',
    name: 'The Psychology of Money: Timeless Lessons on Wealth, Greed, and Happiness',
    price: 299,
    originalPrice: 399,
    image: 'https://readdy.ai/api/search-image?query=Psychology%20of%20Money%20book%20cover%20with%20professional%20finance%20theme%20design%2C%20bestselling%20personal%20finance%20book%20with%20modern%20typography%20and%20money%20symbols%2C%20clean%20book%20cover%20photography%20on%20white%20background&width=300&height=300&seq=books-1&orientation=squarish',
    rating: 4.6,
    reviews: 2847,
    author: 'Morgan Housel',
    category: 'Finance',
    language: 'English'
  },
  {
    id: '2',
    name: 'Atomic Habits: An Easy & Proven Way to Build Good Habits & Break Bad Ones',
    price: 349,
    originalPrice: 449,
    image: 'https://readdy.ai/api/search-image?query=Atomic%20Habits%20book%20cover%20with%20minimalist%20design%20and%20productivity%20theme%2C%20bestselling%20self-help%20book%20with%20modern%20clean%20typography%2C%20professional%20book%20photography%20on%20white%20background&width=300&height=300&seq=books-2&orientation=squarish',
    rating: 4.7,
    reviews: 1923,
    author: 'James Clear',
    category: 'Self Help',
    language: 'English'
  },
  {
    id: '3',
    name: 'Rich Dad Poor Dad: What the Rich Teach Their Kids About Money',
    price: 279,
    originalPrice: 379,
    image: 'https://readdy.ai/api/search-image?query=Rich%20Dad%20Poor%20Dad%20book%20cover%20with%20financial%20education%20theme%20and%20contrasting%20colors%2C%20classic%20personal%20finance%20bestseller%20with%20professional%20design%2C%20book%20cover%20photography%20on%20clean%20white%20background&width=300&height=300&seq=books-3&orientation=squarish',
    rating: 4.5,
    reviews: 3456,
    author: 'Robert T. Kiyosaki',
    category: 'Finance',
    language: 'English'
  },
  {
    id: '4',
    name: 'Think and Grow Rich: The Landmark Bestseller Now Revised and Updated',
    price: 199,
    originalPrice: 299,
    image: 'https://readdy.ai/api/search-image?query=Think%20and%20Grow%20Rich%20classic%20book%20cover%20with%20elegant%20typography%20and%20success%20theme%20design%2C%20timeless%20personal%20development%20book%20with%20golden%20accents%2C%20professional%20book%20photography%20on%20white%20background&width=300&height=300&seq=books-4&orientation=squarish',
    rating: 4.4,
    reviews: 2167,
    author: 'Napoleon Hill',
    category: 'Self Help',
    language: 'English'
  },
  {
    id: '5',
    name: 'The Alchemist: A Fable About Following Your Dream',
    price: 249,
    originalPrice: 329,
    image: 'https://readdy.ai/api/search-image?query=The%20Alchemist%20book%20cover%20with%20mystical%20and%20adventure%20theme%20design%2C%20bestselling%20fiction%20novel%20with%20desert%20and%20journey%20imagery%2C%20artistic%20book%20cover%20photography%20on%20clean%20white%20background&width=300&height=300&seq=books-5&orientation=squarish',
    rating: 4.8,
    reviews: 4521,
    author: 'Paulo Coelho',
    category: 'Fiction',
    language: 'English'
  },
  {
    id: '6',
    name: 'Sapiens: A Brief History of Humankind',
    price: 399,
    originalPrice: 499,
    image: 'https://readdy.ai/api/search-image?query=Sapiens%20book%20cover%20with%20historical%20and%20anthropological%20theme%2C%20intellectual%20non-fiction%20bestseller%20with%20modern%20design%20and%20human%20evolution%20imagery%2C%20professional%20book%20photography%20on%20white%20background&width=300&height=300&seq=books-6&orientation=squarish',
    rating: 4.6,
    reviews: 1834,
    author: 'Yuval Noah Harari',
    category: 'History',
    language: 'English'
  },
  {
    id: '7',
    name: 'The Power of Now: A Guide to Spiritual Enlightenment',
    price: 319,
    originalPrice: 419,
    image: 'https://readdy.ai/api/search-image?query=The%20Power%20of%20Now%20book%20cover%20with%20spiritual%20and%20mindfulness%20theme%20design%2C%20transformative%20self-help%20book%20with%20serene%20and%20peaceful%20imagery%2C%20clean%20book%20cover%20photography%20on%20white%20background&width=300&height=300&seq=books-7&orientation=squarish',
    rating: 4.5,
    reviews: 1267,
    author: 'Eckhart Tolle',
    category: 'Spirituality',
    language: 'English'
  },
  {
    id: '8',
    name: 'The Subtle Art of Not Giving a F*ck: A Counterintuitive Approach to Living',
    price: 289,
    originalPrice: 369,
    image: 'https://readdy.ai/api/search-image?query=The%20Subtle%20Art%20book%20cover%20with%20bold%20and%20edgy%20design%20theme%2C%20popular%20self-help%20book%20with%20modern%20typography%20and%20minimalist%20approach%2C%20striking%20book%20cover%20photography%20on%20white%20background&width=300&height=300&seq=books-8&orientation=squarish',
    rating: 4.3,
    reviews: 2891,
    author: 'Mark Manson',
    category: 'Self Help',
    language: 'English'
  }
];

const authors = ['All', 'Morgan Housel', 'James Clear', 'Robert T. Kiyosaki', 'Napoleon Hill', 'Paulo Coelho', 'Yuval Noah Harari', 'Eckhart Tolle', 'Mark Manson'];
const categories = ['All', 'Finance', 'Self Help', 'Fiction', 'History', 'Spirituality', 'Business', 'Science'];
const languages = ['All', 'English', 'Hindi', 'Tamil', 'Telugu', 'Marathi'];
const priceRanges = [
  'All',
  'Under ₹200',
  '₹200 - ₹400',
  '₹400 - ₹600',
  'Above ₹600'
];

export default function BooksPage() {
  const [selectedAuthor, setSelectedAuthor] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedLanguage, setSelectedLanguage] = useState('All');
  const [selectedPriceRange, setSelectedPriceRange] = useState('All');
  const [filteredProducts, setFilteredProducts] = useState(products);

  const filterProducts = (author: string, category: string, language: string, priceRange: string) => {
    let filtered = products;
    
    if (author !== 'All') {
      filtered = filtered.filter(product => product.author === author);
    }
    
    if (category !== 'All') {
      filtered = filtered.filter(product => product.category === category);
    }
    
    if (language !== 'All') {
      filtered = filtered.filter(product => product.language === language);
    }
    
    if (priceRange !== 'All') {
      filtered = filtered.filter(product => {
        switch (priceRange) {
          case 'Under ₹200':
            return product.price < 200;
          case '₹200 - ₹400':
            return product.price >= 200 && product.price <= 400;
          case '₹400 - ₹600':
            return product.price >= 400 && product.price <= 600;
          case 'Above ₹600':
            return product.price > 600;
          default:
            return true;
        }
      });
    }
    
    setFilteredProducts(filtered);
  };

  const handleAuthorChange = (author: string) => {
    setSelectedAuthor(author);
    filterProducts(author, selectedCategory, selectedLanguage, selectedPriceRange);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    filterProducts(selectedAuthor, category, selectedLanguage, selectedPriceRange);
  };

  const handleLanguageChange = (language: string) => {
    setSelectedLanguage(language);
    filterProducts(selectedAuthor, selectedCategory, language, selectedPriceRange);
  };

  const handlePriceRangeChange = (priceRange: string) => {
    setSelectedPriceRange(priceRange);
    filterProducts(selectedAuthor, selectedCategory, selectedLanguage, priceRange);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <i
        key={index}
        className={`ri-star-${index < Math.floor(rating) ? 'fill' : 'line'} text-[#fdd835] text-sm w-4 h-4 flex items-center justify-center`}
      />
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-purple-600 to-indigo-700 text-white py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center space-x-2 text-sm mb-4">
            <Link href="/" className="hover:underline cursor-pointer">Home</Link>
            <i className="ri-arrow-right-line w-4 h-4 flex items-center justify-center"></i>
            <span>Books</span>
          </div>
          <h1 className="text-3xl font-bold">Books Store</h1>
          <p className="mt-2 text-purple-100">Discover knowledge and stories that inspire</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-8">
          <div className="w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h3 className="font-bold text-gray-800 mb-4">Filters</h3>
              
              <div className="mb-6">
                <h4 className="font-medium text-gray-700 mb-3">Category</h4>
                <div className="space-y-2">
                  {categories.map(category => (
                    <label key={category} className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="category"
                        checked={selectedCategory === category}
                        onChange={() => handleCategoryChange(category)}
                        className="w-4 h-4 text-purple-600 cursor-pointer"
                      />
                      <span className="ml-2 text-sm text-gray-600">{category}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <h4 className="font-medium text-gray-700 mb-3">Author</h4>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {authors.map(author => (
                    <label key={author} className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="author"
                        checked={selectedAuthor === author}
                        onChange={() => handleAuthorChange(author)}
                        className="w-4 h-4 text-purple-600 cursor-pointer"
                      />
                      <span className="ml-2 text-sm text-gray-600 truncate">{author}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <h4 className="font-medium text-gray-700 mb-3">Language</h4>
                <div className="space-y-2">
                  {languages.map(language => (
                    <label key={language} className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="language"
                        checked={selectedLanguage === language}
                        onChange={() => handleLanguageChange(language)}
                        className="w-4 h-4 text-purple-600 cursor-pointer"
                      />
                      <span className="ml-2 text-sm text-gray-600">{language}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <h4 className="font-medium text-gray-700 mb-3">Price Range</h4>
                <div className="space-y-2">
                  {priceRanges.map(range => (
                    <label key={range} className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="priceRange"
                        checked={selectedPriceRange === range}
                        onChange={() => handlePriceRangeChange(range)}
                        className="w-4 h-4 text-purple-600 cursor-pointer"
                      />
                      <span className="ml-2 text-sm text-gray-600">{range}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <h4 className="font-medium text-gray-700 mb-3">Format</h4>
                <div className="space-y-2">
                  {['Paperback', 'Hardcover', 'eBook', 'Audiobook'].map(format => (
                    <label key={format} className="flex items-center cursor-pointer">
                      <input type="checkbox" className="w-4 h-4 text-purple-600 cursor-pointer" />
                      <span className="ml-2 text-sm text-gray-600">{format}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <div>
                <p className="text-gray-600">Showing {filteredProducts.length} books</p>
              </div>
              <select className="border border-gray-300 rounded-md px-4 py-2 text-sm bg-white pr-8">
                <option>Sort by: Popularity</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Rating: High to Low</option>
                <option>Publication Date</option>
                <option>Alphabetical</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
              {filteredProducts.map(product => (
                <Link key={product.id} href={`/product/${product.id}`}>
                  <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-gray-200">
                    <div className="aspect-[3/4] p-4">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover rounded-md object-top"
                      />
                    </div>
                    <div className="p-4">
                      <div className="text-xs text-purple-600 font-medium mb-1">{product.category}</div>
                      <h3 className="font-medium text-gray-800 mb-1 line-clamp-2 text-sm">
                        {product.name}
                      </h3>
                      <p className="text-xs text-gray-600 mb-2">by {product.author}</p>
                      <div className="flex items-center mb-2">
                        <div className="flex">{renderStars(product.rating)}</div>
                        <span className="text-gray-500 text-xs ml-1">({product.reviews})</span>
                      </div>
                      <div className="flex items-center space-x-2 mb-3">
                        <span className="text-lg font-bold text-gray-900">₹{product.price}</span>
                        <span className="text-sm text-gray-500 line-through">₹{product.originalPrice}</span>
                      </div>
                      <div className="text-green-600 text-xs font-medium mb-3">
                        {Math.round((1 - product.price / product.originalPrice) * 100)}% off
                      </div>
                      <button className="w-full bg-gradient-to-r from-purple-600 to-indigo-700 text-white py-2 rounded-md hover:from-purple-700 hover:to-indigo-800 transition-colors text-sm font-medium whitespace-nowrap cursor-pointer">
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
