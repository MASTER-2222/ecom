import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Filter,
  Grid,
  List,
  Star,
  ChevronDown,
  ChevronUp,
  X,
  SlidersHorizontal,
  TrendingUp,
  Package
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import ProductCard from '@/components/ProductCard';
import SearchBar from '@/components/SearchBar';
import { productsAPI, categoriesAPI } from '@/backend/api';
import { Product, Category } from '@/types';

interface SearchFilters {
  categories: string[];
  brands: string[];
  minPrice: number;
  maxPrice: number;
  minRating: number;
  hasDiscount: boolean;
  inStockOnly: boolean;
  freeShipping: boolean;
}

const SearchResults: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('relevance');
  const [sortDir, setSortDir] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [categories, setCategories] = useState<Category[]>([]);
  const [availableBrands, setAvailableBrands] = useState<string[]>([]);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  
  const [filters, setFilters] = useState<SearchFilters>({
    categories: [],
    brands: [],
    minPrice: 0,
    maxPrice: 10000,
    minRating: 0,
    hasDiscount: false,
    inStockOnly: true,
    freeShipping: false,
  });

  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  const query = searchParams.get('q') || '';
  const categoryFilter = searchParams.get('category') || '';

  // Load initial data
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const [categoriesData] = await Promise.all([
          categoriesAPI.getCategories(),
        ]);
        setCategories(categoriesData);
      } catch (error) {
        console.error('Failed to load initial data:', error);
      }
    };

    loadInitialData();
  }, []);

  // Search products when query or filters change
  useEffect(() => {
    searchProducts();
  }, [query, categoryFilter, filters, sortBy, sortDir, currentPage]);

  const searchProducts = async () => {
    if (!query && !categoryFilter) return;

    setIsLoading(true);
    try {
      const searchCategories = categoryFilter ? [categoryFilter] : filters.categories;
      
      const response = await productsAPI.advancedSearch({
        q: query || undefined,
        categories: searchCategories.length > 0 ? searchCategories : undefined,
        brands: filters.brands.length > 0 ? filters.brands : undefined,
        minPrice: filters.minPrice > 0 ? filters.minPrice : undefined,
        maxPrice: filters.maxPrice < 10000 ? filters.maxPrice : undefined,
        minRating: filters.minRating > 0 ? filters.minRating : undefined,
        hasDiscount: filters.hasDiscount,
        inStockOnly: filters.inStockOnly,
        freeShipping: filters.freeShipping,
        page: currentPage - 1,
        size: 20,
        sortBy,
        sortDir,
      });

      setProducts(response.content);
      setTotalProducts(response.totalElements);

      // Extract unique brands from results for filter options
      const brands = [...new Set(response.content.map(p => p.brand).filter(Boolean))];
      setAvailableBrands(brands);

    } catch (error) {
      console.error('Search failed:', error);
      setProducts([]);
      setTotalProducts(0);
    }
    setIsLoading(false);
  };

  const updateActiveFilters = () => {
    const active: string[] = [];
    
    if (filters.categories.length > 0) {
      active.push(`Categories: ${filters.categories.join(', ')}`);
    }
    if (filters.brands.length > 0) {
      active.push(`Brands: ${filters.brands.join(', ')}`);
    }
    if (filters.minPrice > 0 || filters.maxPrice < 10000) {
      active.push(`Price: $${filters.minPrice} - $${filters.maxPrice}`);
    }
    if (filters.minRating > 0) {
      active.push(`Rating: ${filters.minRating}+ stars`);
    }
    if (filters.hasDiscount) {
      active.push('On Sale');
    }
    if (!filters.inStockOnly) {
      active.push('Include Out of Stock');
    }
    if (filters.freeShipping) {
      active.push('Free Shipping');
    }

    setActiveFilters(active);
  };

  useEffect(() => {
    updateActiveFilters();
  }, [filters]);

  const clearAllFilters = () => {
    setFilters({
      categories: [],
      brands: [],
      minPrice: 0,
      maxPrice: 10000,
      minRating: 0,
      hasDiscount: false,
      inStockOnly: true,
      freeShipping: false,
    });
    setCurrentPage(1);
  };

  const removeFilter = (filterText: string) => {
    if (filterText.startsWith('Categories:')) {
      setFilters(prev => ({ ...prev, categories: [] }));
    } else if (filterText.startsWith('Brands:')) {
      setFilters(prev => ({ ...prev, brands: [] }));
    } else if (filterText.startsWith('Price:')) {
      setFilters(prev => ({ ...prev, minPrice: 0, maxPrice: 10000 }));
    } else if (filterText.startsWith('Rating:')) {
      setFilters(prev => ({ ...prev, minRating: 0 }));
    } else if (filterText === 'On Sale') {
      setFilters(prev => ({ ...prev, hasDiscount: false }));
    } else if (filterText === 'Include Out of Stock') {
      setFilters(prev => ({ ...prev, inStockOnly: true }));
    } else if (filterText === 'Free Shipping') {
      setFilters(prev => ({ ...prev, freeShipping: false }));
    }
    setCurrentPage(1);
  };

  const handleSearch = (newQuery: string) => {
    const params = new URLSearchParams(searchParams);
    if (newQuery) {
      params.set('q', newQuery);
    } else {
      params.delete('q');
    }
    setSearchParams(params);
    setCurrentPage(1);
  };

  const FiltersPanel = () => (
    <div className="space-y-6">
      {/* Categories */}
      <div>
        <h3 className="font-semibold mb-3">Categories</h3>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {categories.map((category) => (
            <label key={category.id} className="flex items-center space-x-2">
              <Checkbox
                checked={filters.categories.includes(category.id)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setFilters(prev => ({
                      ...prev,
                      categories: [...prev.categories, category.id]
                    }));
                  } else {
                    setFilters(prev => ({
                      ...prev,
                      categories: prev.categories.filter(c => c !== category.id)
                    }));
                  }
                  setCurrentPage(1);
                }}
              />
              <span className="text-sm">{category.name}</span>
            </label>
          ))}
        </div>
      </div>

      <Separator />

      {/* Brands */}
      {availableBrands.length > 0 && (
        <>
          <div>
            <h3 className="font-semibold mb-3">Brands</h3>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {availableBrands.map((brand) => (
                <label key={brand} className="flex items-center space-x-2">
                  <Checkbox
                    checked={filters.brands.includes(brand)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setFilters(prev => ({
                          ...prev,
                          brands: [...prev.brands, brand]
                        }));
                      } else {
                        setFilters(prev => ({
                          ...prev,
                          brands: prev.brands.filter(b => b !== brand)
                        }));
                      }
                      setCurrentPage(1);
                    }}
                  />
                  <span className="text-sm">{brand}</span>
                </label>
              ))}
            </div>
          </div>
          <Separator />
        </>
      )}

      {/* Price Range */}
      <div>
        <h3 className="font-semibold mb-3">Price Range</h3>
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Input
              type="number"
              placeholder="Min"
              value={filters.minPrice || ''}
              onChange={(e) => {
                setFilters(prev => ({
                  ...prev,
                  minPrice: parseInt(e.target.value) || 0
                }));
              }}
              className="w-20"
            />
            <span>to</span>
            <Input
              type="number"
              placeholder="Max"
              value={filters.maxPrice || ''}
              onChange={(e) => {
                setFilters(prev => ({
                  ...prev,
                  maxPrice: parseInt(e.target.value) || 10000
                }));
              }}
              className="w-20"
            />
          </div>
          <Slider
            value={[filters.minPrice, filters.maxPrice]}
            onValueChange={([min, max]) => {
              setFilters(prev => ({ ...prev, minPrice: min, maxPrice: max }));
            }}
            max={10000}
            step={10}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-gray-500">
            <span>${filters.minPrice}</span>
            <span>${filters.maxPrice}</span>
          </div>
        </div>
      </div>

      <Separator />

      {/* Rating */}
      <div>
        <h3 className="font-semibold mb-3">Customer Rating</h3>
        <div className="space-y-2">
          {[4, 3, 2, 1].map((rating) => (
            <label key={rating} className="flex items-center space-x-2">
              <Checkbox
                checked={filters.minRating === rating}
                onCheckedChange={(checked) => {
                  setFilters(prev => ({
                    ...prev,
                    minRating: checked ? rating : 0
                  }));
                  setCurrentPage(1);
                }}
              />
              <div className="flex items-center">
                {[...Array(rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
                <span className="ml-2 text-sm">& Up</span>
              </div>
            </label>
          ))}
        </div>
      </div>

      <Separator />

      {/* Additional Filters */}
      <div className="space-y-3">
        <label className="flex items-center space-x-2">
          <Checkbox
            checked={filters.hasDiscount}
            onCheckedChange={(checked) => {
              setFilters(prev => ({ ...prev, hasDiscount: checked as boolean }));
              setCurrentPage(1);
            }}
          />
          <span className="text-sm">On Sale</span>
        </label>
        
        <label className="flex items-center space-x-2">
          <Checkbox
            checked={filters.inStockOnly}
            onCheckedChange={(checked) => {
              setFilters(prev => ({ ...prev, inStockOnly: checked as boolean }));
              setCurrentPage(1);
            }}
          />
          <span className="text-sm">In Stock Only</span>
        </label>
        
        <label className="flex items-center space-x-2">
          <Checkbox
            checked={filters.freeShipping}
            onCheckedChange={(checked) => {
              setFilters(prev => ({ ...prev, freeShipping: checked as boolean }));
              setCurrentPage(1);
            }}
          />
          <span className="text-sm">Free Shipping</span>
        </label>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Enhanced Search Bar */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <SearchBar 
            onSearch={handleSearch}
            placeholder={`Search for "${query}"`}
          />
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Search Info & Controls */}
        <div className="mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold">Search Results</h1>
              {query && (
                <p className="text-gray-600">
                  Showing results for "<span className="font-semibold">{query}</span>"
                  {totalProducts > 0 && ` (${totalProducts.toLocaleString()} products)`}
                </p>
              )}
            </div>

            <div className="flex items-center gap-4">
              {/* View Mode Toggle */}
              <div className="flex border rounded-md">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="rounded-r-none"
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="rounded-l-none"
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>

              {/* Sort Options */}
              <Select value={`${sortBy}-${sortDir}`} onValueChange={(value) => {
                const [field, direction] = value.split('-');
                setSortBy(field);
                setSortDir(direction);
                setCurrentPage(1);
              }}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="relevance-desc">Most Relevant</SelectItem>
                  <SelectItem value="price-asc">Price: Low to High</SelectItem>
                  <SelectItem value="price-desc">Price: High to Low</SelectItem>
                  <SelectItem value="averageRating-desc">Highest Rated</SelectItem>
                  <SelectItem value="totalSales-desc">Best Selling</SelectItem>
                  <SelectItem value="createdAt-desc">Newest First</SelectItem>
                </SelectContent>
              </Select>

              {/* Mobile Filters */}
              <Sheet open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" className="md:hidden">
                    <Filter className="w-4 h-4 mr-2" />
                    Filters
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-80">
                  <SheetHeader>
                    <SheetTitle>Filters</SheetTitle>
                    <SheetDescription>
                      Refine your search results
                    </SheetDescription>
                  </SheetHeader>
                  <div className="mt-6">
                    <FiltersPanel />
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>

          {/* Active Filters */}
          {activeFilters.length > 0 && (
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="text-sm font-medium">Filters:</span>
              {activeFilters.map((filter, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="cursor-pointer hover:bg-red-100"
                  onClick={() => removeFilter(filter)}
                >
                  {filter}
                  <X className="w-3 h-3 ml-1" />
                </Badge>
              ))}
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllFilters}
                className="text-red-600 hover:text-red-700"
              >
                Clear all
              </Button>
            </div>
          )}
        </div>

        <div className="flex gap-6">
          {/* Desktop Filters Sidebar */}
          <aside className="hidden md:block w-64 flex-shrink-0">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-semibold">Filters</h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearAllFilters}
                    className="text-sm"
                  >
                    Clear all
                  </Button>
                </div>
                <FiltersPanel />
              </CardContent>
            </Card>
          </aside>

          {/* Results */}
          <main className="flex-1">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
              </div>
            ) : products.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <Package className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No products found</h3>
                  <p className="text-gray-600 mb-4">
                    Try adjusting your search terms or filters
                  </p>
                  <Button onClick={clearAllFilters}>
                    Clear filters
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <>
                {/* Products Grid/List */}
                <div className={`
                  ${viewMode === 'grid' 
                    ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' 
                    : 'space-y-4'
                  }
                `}>
                  {products.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      variant={viewMode}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {totalProducts > 20 && (
                  <div className="mt-8 flex items-center justify-center gap-2">
                    <Button
                      variant="outline"
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    >
                      Previous
                    </Button>
                    
                    <div className="flex items-center gap-1">
                      {Array.from({ length: Math.min(5, Math.ceil(totalProducts / 20)) }, (_, i) => {
                        const page = i + 1;
                        return (
                          <Button
                            key={page}
                            variant={currentPage === page ? "default" : "outline"}
                            size="sm"
                            onClick={() => setCurrentPage(page)}
                          >
                            {page}
                          </Button>
                        );
                      })}
                    </div>
                    
                    <Button
                      variant="outline"
                      disabled={currentPage >= Math.ceil(totalProducts / 20)}
                      onClick={() => setCurrentPage(prev => prev + 1)}
                    >
                      Next
                    </Button>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default SearchResults;