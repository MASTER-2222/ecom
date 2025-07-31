import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { Search, Filter, SlidersHorizontal, Grid3X3, List, Star, Heart, ShoppingCart, ChevronDown, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import ProductCard from '@/components/ProductCard';
import { Product, Category } from '@/types';
import { productsAPI, categoriesAPI } from '@/backend/api';
import { useCart } from '@/hooks/useCart';
import toast from 'react-hot-toast';

interface FilterState {
  categories: string[];
  brands: string[];
  priceRange: [number, number];
  rating: number;
  inStock: boolean;
}

const ProductListing: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { addItem } = useCart();

  // State management
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('featured');
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [showFilters, setShowFilters] = useState(false);

  // Filter state
  const [filters, setFilters] = useState<FilterState>({
    categories: searchParams.get('category') ? [searchParams.get('category')!] : [],
    brands: [],
    priceRange: [0, 2000],
    rating: 0,
    inStock: false,
  });

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  // Available brands (will be populated from products)
  const [availableBrands, setAvailableBrands] = useState<string[]>([]);

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [productsResponse, categoriesResponse] = await Promise.all([
          productsAPI.getAllProducts({ page: 0, size: 100 }),
          categoriesAPI.getAllCategories(),
        ]);

        if (productsResponse.success) {
          setProducts(productsResponse.data.content || []);
          // Extract unique brands
          const brands = Array.from(new Set(
            productsResponse.data.content?.map((p: Product) => p.brand).filter(Boolean) || []
          ));
          setAvailableBrands(brands);
        }

        if (categoriesResponse.success) {
          setCategories(categoriesResponse.data || []);
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
        toast.error('Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter and sort products
  const processedProducts = useMemo(() => {
    let result = [...products];

    // Search filter
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      result = result.filter(product =>
        product.title.toLowerCase().includes(search) ||
        product.description.toLowerCase().includes(search) ||
        product.brand.toLowerCase().includes(search)
      );
    }

    // Category filter
    if (filters.categories.length > 0) {
      result = result.filter(product =>
        filters.categories.includes(product.category.id)
      );
    }

    // Brand filter
    if (filters.brands.length > 0) {
      result = result.filter(product =>
        filters.brands.includes(product.brand)
      );
    }

    // Price filter
    result = result.filter(product =>
      product.price >= filters.priceRange[0] && product.price <= filters.priceRange[1]
    );

    // Rating filter
    if (filters.rating > 0) {
      result = result.filter(product => product.rating >= filters.rating);
    }

    // Stock filter
    if (filters.inStock) {
      result = result.filter(product => product.stock > 0);
    }

    // Sorting
    switch (sortBy) {
      case 'price-low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'name':
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
      default: // featured
        result.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
    }

    return result;
  }, [products, searchTerm, filters, sortBy]);

  // Pagination
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return processedProducts.slice(start, start + itemsPerPage);
  }, [processedProducts, currentPage]);

  const totalPages = Math.ceil(processedProducts.length / itemsPerPage);

  // Update URL params
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchTerm) params.set('search', searchTerm);
    if (filters.categories.length > 0) params.set('category', filters.categories[0]);
    if (sortBy !== 'featured') params.set('sort', sortBy);
    setSearchParams(params);
  }, [searchTerm, filters.categories, sortBy, setSearchParams]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setFilters({
      categories: [],
      brands: [],
      priceRange: [0, 2000],
      rating: 0,
      inStock: false,
    });
    setSearchTerm('');
    setCurrentPage(1);
  };

  const handleAddToCart = async (product: Product) => {
    try {
      await addItem(product.id, 1);
      toast.success(`${product.title} added to cart`);
    } catch (error) {
      toast.error('Failed to add item to cart');
    }
  };

  // Filter component
  const FilterSidebar = () => (
    <div className="space-y-6">
      {/* Price Range */}
      <div>
        <h3 className="font-semibold mb-3">Price Range</h3>
        <div className="px-3">
          <Slider
            value={filters.priceRange}
            onValueChange={(value) => setFilters(prev => ({ ...prev, priceRange: value as [number, number] }))}
            max={2000}
            step={10}
            className="mb-2"
          />
          <div className="flex justify-between text-sm text-gray-600">
            <span>${filters.priceRange[0]}</span>
            <span>${filters.priceRange[1]}</span>
          </div>
        </div>
      </div>

      <Separator />

      {/* Categories */}
      <div>
        <h3 className="font-semibold mb-3">Categories</h3>
        <div className="space-y-2">
          {categories.map((category) => (
            <div key={category.id} className="flex items-center space-x-2">
              <Checkbox
                id={`category-${category.id}`}
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
                      categories: prev.categories.filter(id => id !== category.id)
                    }));
                  }
                }}
              />
              <label htmlFor={`category-${category.id}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                {category.name}
              </label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Brands */}
      <div>
        <h3 className="font-semibold mb-3">Brands</h3>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {availableBrands.map((brand) => (
            <div key={brand} className="flex items-center space-x-2">
              <Checkbox
                id={`brand-${brand}`}
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
                }}
              />
              <label htmlFor={`brand-${brand}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                {brand}
              </label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Rating */}
      <div>
        <h3 className="font-semibold mb-3">Customer Rating</h3>
        <div className="space-y-2">
          {[4, 3, 2, 1].map((rating) => (
            <div key={rating} className="flex items-center space-x-2">
              <Checkbox
                id={`rating-${rating}`}
                checked={filters.rating === rating}
                onCheckedChange={(checked) => {
                  setFilters(prev => ({
                    ...prev,
                    rating: checked ? rating : 0
                  }));
                }}
              />
              <label htmlFor={`rating-${rating}`} className="flex items-center text-sm">
                <div className="flex items-center mr-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${i < rating ? 'text-orange-400 fill-current' : 'text-gray-300'}`}
                    />
                  ))}
                </div>
                & Up
              </label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Availability */}
      <div>
        <h3 className="font-semibold mb-3">Availability</h3>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="in-stock"
            checked={filters.inStock}
            onCheckedChange={(checked) => {
              setFilters(prev => ({ ...prev, inStock: checked as boolean }));
            }}
          />
          <label htmlFor="in-stock" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            In Stock Only
          </label>
        </div>
      </div>

      {/* Clear Filters */}
      <Button
        variant="outline"
        onClick={clearFilters}
        className="w-full"
      >
        Clear All Filters
      </Button>
    </div>
  );

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="hidden lg:block">
            <div className="animate-pulse space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-24 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(9)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-square bg-gray-200 rounded-lg mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Search Bar */}
        <div className="mb-8">
          <form onSubmit={handleSearch} className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-12"
              />
            </div>
            <Button type="submit" className="h-12 px-6 amazon-button">
              Search
            </Button>
          </form>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar - Desktop */}
          <div className="hidden lg:block">
            <Card className="sticky top-4">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold">Filters</h2>
                  <SlidersHorizontal className="w-5 h-5" />
                </div>
                <FilterSidebar />
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Header Controls */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {searchTerm ? `Search results for "${searchTerm}"` : 'All Products'}
                </h1>
                <p className="text-gray-600">
                  {processedProducts.length} product{processedProducts.length !== 1 ? 's' : ''} found
                </p>
              </div>

              <div className="flex items-center gap-4">
                {/* Mobile Filter Button */}
                <Sheet open={showFilters} onOpenChange={setShowFilters}>
                  <SheetTrigger asChild>
                    <Button variant="outline" className="lg:hidden">
                      <Filter className="w-4 h-4 mr-2" />
                      Filters
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-80">
                    <SheetHeader>
                      <SheetTitle>Filters</SheetTitle>
                      <SheetDescription>
                        Filter products by your preferences
                      </SheetDescription>
                    </SheetHeader>
                    <div className="mt-6">
                      <FilterSidebar />
                    </div>
                  </SheetContent>
                </Sheet>

                {/* View Mode Toggle */}
                <div className="flex border rounded-lg">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                    className="rounded-r-none"
                  >
                    <Grid3X3 className="w-4 h-4" />
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

                {/* Sort Dropdown */}
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="featured">Featured</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="rating">Customer Rating</SelectItem>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="name">Name A-Z</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Active Filters */}
            {(filters.categories.length > 0 || filters.brands.length > 0 || filters.rating > 0 || filters.inStock) && (
              <div className="flex flex-wrap gap-2 mb-6">
                {filters.categories.map(categoryId => {
                  const category = categories.find(c => c.id === categoryId);
                  return category ? (
                    <Badge key={categoryId} variant="secondary" className="flex items-center gap-1">
                      {category.name}
                      <X
                        className="w-3 h-3 cursor-pointer"
                        onClick={() => setFilters(prev => ({
                          ...prev,
                          categories: prev.categories.filter(id => id !== categoryId)
                        }))}
                      />
                    </Badge>
                  ) : null;
                })}
                {filters.brands.map(brand => (
                  <Badge key={brand} variant="secondary" className="flex items-center gap-1">
                    {brand}
                    <X
                      className="w-3 h-3 cursor-pointer"
                      onClick={() => setFilters(prev => ({
                        ...prev,
                        brands: prev.brands.filter(b => b !== brand)
                      }))}
                    />
                  </Badge>
                ))}
                {filters.rating > 0 && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    {filters.rating}+ Stars
                    <X
                      className="w-3 h-3 cursor-pointer"
                      onClick={() => setFilters(prev => ({ ...prev, rating: 0 }))}
                    />
                  </Badge>
                )}
                {filters.inStock && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    In Stock
                    <X
                      className="w-3 h-3 cursor-pointer"
                      onClick={() => setFilters(prev => ({ ...prev, inStock: false }))}
                    />
                  </Badge>
                )}
              </div>
            )}

            {/* Products Grid/List */}
            {paginatedProducts.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <Search className="w-12 h-12 mx-auto" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-600 mb-4">
                  Try adjusting your search or filter criteria
                </p>
                <Button onClick={clearFilters} variant="outline">
                  Clear all filters
                </Button>
              </div>
            ) : (
              <>
                {viewMode === 'grid' ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {paginatedProducts.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {paginatedProducts.map((product) => (
                      <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                        <CardContent className="p-0">
                          <div className="flex">
                            <div className="w-48 h-48 bg-gray-100 flex-shrink-0">
                              <img
                                src={product.thumbnail || '/api/placeholder/200/200'}
                                alt={product.title}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="flex-1 p-6">
                              <div className="flex justify-between items-start">
                                <div className="flex-1">
                                  <Link to={`/product/${product.id}`}>
                                    <h3 className="text-lg font-semibold text-gray-900 hover:text-orange-600 transition-colors mb-2">
                                      {product.title}
                                    </h3>
                                  </Link>
                                  <p className="text-gray-600 mb-3 line-clamp-2">
                                    {product.description}
                                  </p>
                                  <div className="flex items-center gap-2 mb-3">
                                    <div className="flex items-center">
                                      {[...Array(5)].map((_, i) => (
                                        <Star
                                          key={i}
                                          className={`w-4 h-4 ${
                                            i < Math.floor(product.rating)
                                              ? 'text-orange-400 fill-current'
                                              : 'text-gray-300'
                                          }`}
                                        />
                                      ))}
                                    </div>
                                    <span className="text-sm text-gray-600">
                                      ({product.reviewCount})
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-3">
                                    <span className="text-2xl font-bold text-gray-900">
                                      ${product.price}
                                    </span>
                                    {product.originalPrice && product.originalPrice > product.price && (
                                      <>
                                        <span className="text-lg text-gray-500 line-through">
                                          ${product.originalPrice}
                                        </span>
                                        <Badge variant="destructive">
                                          {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% off
                                        </Badge>
                                      </>
                                    )}
                                  </div>
                                </div>
                                <div className="flex flex-col gap-2 ml-4">
                                  <Button
                                    onClick={() => handleAddToCart(product)}
                                    className="amazon-button"
                                  >
                                    <ShoppingCart className="w-4 h-4 mr-2" />
                                    Add to Cart
                                  </Button>
                                  <Button variant="outline" size="sm">
                                    <Heart className="w-4 h-4" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-2 mt-8">
                    <Button
                      variant="outline"
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </Button>
                    
                    <div className="flex gap-1">
                      {[...Array(Math.min(5, totalPages))].map((_, i) => {
                        const pageNum = currentPage <= 3 ? i + 1 : currentPage - 2 + i;
                        if (pageNum > totalPages) return null;
                        
                        return (
                          <Button
                            key={pageNum}
                            variant={currentPage === pageNum ? "default" : "outline"}
                            size="sm"
                            onClick={() => setCurrentPage(pageNum)}
                          >
                            {pageNum}
                          </Button>
                        );
                      })}
                    </div>

                    <Button
                      variant="outline"
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductListing;