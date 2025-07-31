import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  ChevronDown,
  X,
  Clock,
  TrendingUp,
  Tag,
  Package,
  Building,
  Hash
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { productsAPI, categoriesAPI } from '@/backend/api';
import { Category } from '@/types';

interface SearchBarProps {
  onSearch?: (query: string, category?: string) => void;
  placeholder?: string;
  className?: string;
}

interface AutocompleteResults {
  products: string[];
  brands: string[];
  categories: string[];
  tags: string[];
}

const SearchBar: React.FC<SearchBarProps> = ({ 
  onSearch, 
  placeholder = "Search RitKART",
  className = ""
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [categories, setCategories] = useState<Category[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [autocomplete, setAutocomplete] = useState<AutocompleteResults | null>(null);
  const [popularTerms, setPopularTerms] = useState<string[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<NodeJS.Timeout>();

  // Load categories and popular terms on mount
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const [categoriesData, popularData] = await Promise.all([
          categoriesAPI.getCategories(),
          productsAPI.getPopularSearchTerms(8)
        ]);
        setCategories(categoriesData);
        setPopularTerms(popularData);
      } catch (error) {
        console.error('Failed to load initial search data:', error);
      }
    };

    loadInitialData();

    // Load recent searches from localStorage
    const saved = localStorage.getItem('ritkart_recent_searches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  // Handle search input with debounced autocomplete
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (searchQuery.trim().length >= 2) {
      debounceRef.current = setTimeout(async () => {
        setIsLoading(true);
        try {
          const [suggestionsData, autocompleteData] = await Promise.all([
            productsAPI.getSearchSuggestions(searchQuery, 8),
            productsAPI.getSearchAutocomplete(searchQuery, 4)
          ]);
          setSuggestions(suggestionsData);
          setAutocomplete(autocompleteData);
        } catch (error) {
          console.error('Failed to fetch search suggestions:', error);
        }
        setIsLoading(false);
      }, 300);
    } else {
      setSuggestions([]);
      setAutocomplete(null);
      setIsLoading(false);
    }

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [searchQuery]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (query: string = searchQuery, category?: string) => {
    const trimmedQuery = query.trim();
    if (!trimmedQuery) return;

    // Save to recent searches
    const updatedRecent = [trimmedQuery, ...recentSearches.filter(q => q !== trimmedQuery)].slice(0, 5);
    setRecentSearches(updatedRecent);
    localStorage.setItem('ritkart_recent_searches', JSON.stringify(updatedRecent));

    // Close dropdown
    setIsDropdownOpen(false);

    // Navigate or call callback
    if (onSearch) {
      onSearch(trimmedQuery, category !== 'All' ? category : undefined);
    } else {
      const params = new URLSearchParams();
      params.set('q', trimmedQuery);
      if (category && category !== 'All') {
        params.set('category', category);
      }
      navigate(`/search?${params.toString()}`);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setSearchQuery(suggestion);
    handleSearch(suggestion);
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('ritkart_recent_searches');
  };

  const renderDropdownContent = () => {
    if (searchQuery.trim().length >= 2) {
      return (
        <div className="p-2 max-h-96 overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-500"></div>
            </div>
          ) : (
            <>
              {/* Quick Suggestions */}
              {suggestions.length > 0 && (
                <div className="mb-4">
                  <div className="flex items-center gap-2 px-2 py-1 text-xs font-medium text-gray-500 uppercase tracking-wide">
                    <Search className="w-3 h-3" />
                    Suggestions
                  </div>
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded text-sm flex items-center gap-2"
                    >
                      <Search className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-900">{suggestion}</span>
                    </button>
                  ))}
                </div>
              )}

              {/* Autocomplete Categories */}
              {autocomplete && (
                <>
                  {autocomplete.products.length > 0 && (
                    <div className="mb-4">
                      <div className="flex items-center gap-2 px-2 py-1 text-xs font-medium text-gray-500 uppercase tracking-wide">
                        <Package className="w-3 h-3" />
                        Products
                      </div>
                      {autocomplete.products.map((product, index) => (
                        <button
                          key={index}
                          onClick={() => handleSuggestionClick(product)}
                          className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded text-sm flex items-center gap-2"
                        >
                          <Package className="w-4 h-4 text-blue-400" />
                          <span className="text-gray-900">{product}</span>
                        </button>
                      ))}
                    </div>
                  )}

                  {autocomplete.brands.length > 0 && (
                    <div className="mb-4">
                      <div className="flex items-center gap-2 px-2 py-1 text-xs font-medium text-gray-500 uppercase tracking-wide">
                        <Building className="w-3 h-3" />
                        Brands
                      </div>
                      {autocomplete.brands.map((brand, index) => (
                        <button
                          key={index}
                          onClick={() => handleSuggestionClick(brand)}
                          className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded text-sm flex items-center gap-2"
                        >
                          <Building className="w-4 h-4 text-green-400" />
                          <span className="text-gray-900">{brand}</span>
                        </button>
                      ))}
                    </div>
                  )}

                  {autocomplete.categories.length > 0 && (
                    <div className="mb-4">
                      <div className="flex items-center gap-2 px-2 py-1 text-xs font-medium text-gray-500 uppercase tracking-wide">
                        <Tag className="w-3 h-3" />
                        Categories
                      </div>
                      {autocomplete.categories.map((category, index) => (
                        <button
                          key={index}
                          onClick={() => handleSuggestionClick(category)}
                          className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded text-sm flex items-center gap-2"
                        >
                          <Tag className="w-4 h-4 text-purple-400" />
                          <span className="text-gray-900">{category}</span>
                        </button>
                      ))}
                    </div>
                  )}

                  {autocomplete.tags.length > 0 && (
                    <div className="mb-4">
                      <div className="flex items-center gap-2 px-2 py-1 text-xs font-medium text-gray-500 uppercase tracking-wide">
                        <Hash className="w-3 h-3" />
                        Tags
                      </div>
                      {autocomplete.tags.map((tag, index) => (
                        <button
                          key={index}
                          onClick={() => handleSuggestionClick(tag)}
                          className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded text-sm flex items-center gap-2"
                        >
                          <Hash className="w-4 h-4 text-orange-400" />
                          <span className="text-gray-900">{tag}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </div>
      );
    } else {
      return (
        <div className="p-4 max-h-96 overflow-y-auto">
          {/* Recent Searches */}
          {recentSearches.length > 0 && (
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 text-xs font-medium text-gray-500 uppercase tracking-wide">
                  <Clock className="w-3 h-3" />
                  Recent Searches
                </div>
                <button
                  onClick={clearRecentSearches}
                  className="text-xs text-orange-600 hover:text-orange-700"
                >
                  Clear all
                </button>
              </div>
              {recentSearches.map((term, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(term)}
                  className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded text-sm flex items-center gap-2"
                >
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-900">{term}</span>
                </button>
              ))}
            </div>
          )}

          {/* Popular Searches */}
          {popularTerms.length > 0 && (
            <div>
              <div className="flex items-center gap-2 px-1 py-1 text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                <TrendingUp className="w-3 h-3" />
                Popular Searches
              </div>
              <div className="flex flex-wrap gap-2 mb-4">
                {popularTerms.map((term, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="cursor-pointer hover:bg-orange-100 hover:text-orange-700"
                    onClick={() => handleSuggestionClick(term)}
                  >
                    {term}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      );
    }
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <form onSubmit={(e) => { e.preventDefault(); handleSearch(); }} className="flex">
        {/* Category Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="outline" 
              className="bg-gray-200 text-gray-700 border-none rounded-l-md rounded-r-none px-3 py-2 h-10 min-w-[80px]"
            >
              <span className="truncate max-w-[60px]">{selectedCategory}</span>
              <ChevronDown className="w-3 h-3 ml-1 flex-shrink-0" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="max-h-64 overflow-y-auto">
            <DropdownMenuItem onClick={() => setSelectedCategory('All')}>
              All Categories
            </DropdownMenuItem>
            {categories.map((category) => (
              <DropdownMenuItem 
                key={category.id} 
                onClick={() => setSelectedCategory(category.name)}
              >
                {category.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        
        {/* Search Input */}
        <div className="relative flex-1">
          <Input
            ref={searchInputRef}
            type="text"
            placeholder={placeholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsDropdownOpen(true)}
            className="rounded-none border-none h-10 focus:ring-2 focus:ring-orange-400 pr-8"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSuggestions([]);
                setAutocomplete(null);
                searchInputRef.current?.focus();
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        
        {/* Search Button */}
        <Button 
          type="submit"
          className="amazon-orange rounded-l-none rounded-r-md px-4 h-10"
        >
          <Search className="w-4 h-4" />
        </Button>
      </form>

      {/* Dropdown Suggestions */}
      {isDropdownOpen && (
        <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-b-md shadow-lg z-50 mt-1">
          {renderDropdownContent()}
        </div>
      )}
    </div>
  );
};

export default SearchBar;