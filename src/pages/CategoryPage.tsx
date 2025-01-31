import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Filter, SortAsc, ChevronLeft, ChevronRight, Star, Heart, ShoppingCart, ArrowUp, X } from 'lucide-react';

import { useShop } from '../context/ShopContext';

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  rating: number;
  reviews: number;
  brand: string;
  inStock: boolean;
  date: string;
}

interface Filters {
  priceRanges: string[];
  priceRange: {
    min: number;
    max: number;
  };
  brands: string[];
  ratings: string[];
  inStock: boolean;
}

interface CategoryProducts {
  [key: string]: Product[];
}

// Category-specific products
const categoryProducts: CategoryProducts = {
  'fashion': [
    {
      id: 'fashion-1',
      name: 'Designer Dress',
      price: 159.99,
      image: 'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?auto=format&fit=crop&q=80&w=600',
      rating: 4.8,
      reviews: 245,
      brand: 'Elegance',
      inStock: true,
      date: '2024-02-15'
    },
    {
      id: 'fashion-2',
      name: 'Leather Jacket',
      price: 199.99,
      image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&q=80&w=600',
      rating: 4.7,
      reviews: 189,
      brand: 'Urban Style',
      inStock: true,
      date: '2024-02-10'
    },
    {
      id: 'fashion-3',
      name: 'Denim Jeans',
      price: 89.99,
      image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&q=80&w=600',
      rating: 4.6,
      reviews: 312,
      brand: 'Denim Co',
      inStock: true,
      date: '2024-02-05'
    },
    {
      id: 'fashion-4',
      name: 'Summer Dress',
      price: 79.99,
      image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&q=80&w=600',
      rating: 4.5,
      reviews: 156,
      brand: 'Elegance',
      inStock: true,
      date: '2024-01-30'
    }
  ],
  'accessories': [
    {
      id: 'acc-1',
      name: 'Luxury Watch',
      price: 299.99,
      image: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&q=80&w=600',
      rating: 4.9,
      reviews: 245,
      brand: 'Timepiece',
      inStock: true,
      date: '2024-02-15'
    },
    {
      id: 'acc-2',
      name: 'Designer Handbag',
      price: 179.99,
      image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=80&w=600',
      rating: 4.7,
      reviews: 189,
      brand: 'Luxe',
      inStock: true,
      date: '2024-02-10'
    },
    {
      id: 'acc-3',
      name: 'Sunglasses',
      price: 159.99,
      image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&q=80&w=600',
      rating: 4.4,
      reviews: 167,
      brand: 'Luxe',
      inStock: true,
      date: '2024-02-05'
    },
    {
      id: 'acc-4',
      name: 'Leather Belt',
      price: 49.99,
      image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=600',
      rating: 4.5,
      reviews: 156,
      brand: 'Classic',
      inStock: true,
      date: '2024-01-30'
    }
  ],
  'electronics': [
    {
      id: 'elec-1',
      name: 'Gaming Laptop',
      price: 1499.99,
      image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&q=80&w=600',
      rating: 4.9,
      reviews: 342,
      brand: 'TechMax',
      inStock: true,
      date: '2024-02-15'
    },
    {
      id: 'elec-2',
      name: 'Wireless Earbuds',
      price: 199.99,
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=600',
      rating: 4.7,
      reviews: 289,
      brand: 'AudioPro',
      inStock: true,
      date: '2024-02-10'
    },
    {
      id: 'elec-3',
      name: 'Smart TV',
      price: 899.99,
      image: 'https://images.unsplash.com/photo-1593784991095-a205069470b6?auto=format&fit=crop&q=80&w=600',
      rating: 4.8,
      reviews: 245,
      brand: 'TechMax',
      inStock: true,
      date: '2024-02-05'
    },
    {
      id: 'elec-4',
      name: 'Tablet',
      price: 599.99,
      image: 'https://images.unsplash.com/photo-1561154464-82e9adf32764?auto=format&fit=crop&q=80&w=600',
      rating: 4.6,
      reviews: 178,
      brand: 'SmartTech',
      inStock: false,
      date: '2024-01-30'
    }
  ],
  'phones': [
    {
      id: 'phone-1',
      name: 'Flagship Smartphone',
      price: 999.99,
      image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=600',
      rating: 4.9,
      reviews: 512,
      brand: 'TechPro',
      inStock: true,
      date: '2024-02-15'
    },
    {
      id: 'phone-2',
      name: 'Mid-range Phone',
      price: 499.99,
      image: 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?auto=format&fit=crop&q=80&w=600',
      rating: 4.7,
      reviews: 324,
      brand: 'SmartTech',
      inStock: true,
      date: '2024-02-10'
    }
  ],
  'home-living': [
    {
      id: 'home-1',
      name: 'Modern Sofa',
      price: 999.99,
      image: 'https://images.unsplash.com/photo-1484101403633-562f891dc89a?auto=format&fit=crop&q=80&w=600',
      rating: 4.8,
      reviews: 245,
      brand: 'HomeLuxe',
      inStock: true,
      date: '2024-02-15'
    },
    {
      id: 'home-2',
      name: 'Dining Table Set',
      price: 799.99,
      image: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&q=80&w=600',
      rating: 4.7,
      reviews: 189,
      brand: 'WoodCraft',
      inStock: true,
      date: '2024-02-10'
    }
  ]
};

const CategoryPage: React.FC = () => {
  const { category } = useParams();
  const { addToCart, toggleWishlist, wishlist } = useShop();
  const [showFilters, setShowFilters] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('featured');
  const [filters, setFilters] = useState<Filters>({
    priceRanges: [],
    priceRange: {
      min: 0,
      max: 2000
    },
    brands: [],
    ratings: [],
    inStock: false
  });
  const products = category ? categoryProducts[category.toLowerCase().replace(/ & /g, '-')] || [] : [];
  const [initialPriceRange] = useState({
    min: Math.min(...products.map(p => p.price)),
    max: Math.max(...products.map(p => p.price))
  });

  const itemsPerPage = 12;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Filter and sort products
  const filteredProducts = products.filter(product => {
    if (filters.brands.length > 0 && !filters.brands.includes(product.brand)) return false;
    if (filters.inStock && !product.inStock) return false;
    if (filters.ratings.length > 0 && !filters.ratings.some(r => product.rating >= parseInt(r))) return false;
    if (product.price < filters.priceRange.min || product.price > filters.priceRange.max) return false;
    
    if (filters.priceRanges.length > 0) {
      return filters.priceRanges.some(range => {
        const [min, max] = range.split('-').map(Number);
        return max ? (product.price >= min && product.price <= max) : product.price >= min;
      });
    }
    
    return true;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'rating':
        return b.rating - a.rating;
      case 'newest':
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      default:
        return 0;
    }
  });

  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);
  const currentProducts = sortedProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const showToast = (message: string) => {
    setNotificationMessage(message);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 2000);
  };

  // Get unique brands for filter
  const brands = [...new Set(products.map(product => product.brand))];

  const handlePriceRangeChange = (range: string) => {
    setFilters(prev => ({
      ...prev,
      priceRanges: prev.priceRanges.includes(range)
        ? prev.priceRanges.filter(r => r !== range)
        : [...prev.priceRanges, range]
    }));
  };

  const handleBrandChange = (brand: string) => {
    setFilters(prev => ({
      ...prev,
      brands: prev.brands.includes(brand)
        ? prev.brands.filter(b => b !== brand)
        : [...prev.brands, brand]
    }));
  };

  const handleRatingChange = (rating: string) => {
    setFilters(prev => ({
      ...prev,
      ratings: prev.ratings.includes(rating)
        ? prev.ratings.filter(r => r !== rating)
        : [...prev.ratings, rating]
    }));
  };

  const handlePriceRangeInput = (type: 'min' | 'max', value: number) => {
    setFilters(prev => ({
      ...prev,
      priceRange: {
        ...prev.priceRange,
        [type]: value
      }
    }));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 sticky top-[64px] md:top-[80px] bg-gray-50 dark:bg-gray-900 py-4 z-20">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white capitalize">
          {category?.replace('-', ' ')}
        </h1>
        <div className="flex items-center justify-between w-full sm:w-auto gap-4">
          <div className="flex-1 sm:flex-none">
            {totalPages > 1 && (
              <PaginationControls
                currentPage={currentPage}
                totalPages={totalPages}
                setCurrentPage={setCurrentPage}
                className="scale-90 origin-right"
              />
            )}
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white
                     rounded-lg hover:bg-indigo-700 transition-colors 
                     duration-200 md:hidden shadow-md"
          >
            <Filter className="w-5 h-5" />
            <span>Filters</span>
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Filters Sidebar */}
        <div className={`fixed top-[64px] inset-y-0 right-0 z-30 transform md:relative md:inset-auto
          ${showFilters ? 'translate-x-0 mt-0' : 'translate-x-full md:translate-x-0'} 
          transition-transform duration-300 ease-in-out bg-white dark:bg-gray-800 
          md:bg-transparent md:dark:bg-transparent w-[85%] md:w-64 overflow-y-auto 
          md:overflow-visible h-full md:h-auto`}>
          {/* Mobile Filter Header */}
          <div className="sticky top-0 z-10 flex items-center justify-between p-4 bg-white dark:bg-gray-800 border-b md:hidden">
            <h2 className="text-lg font-semibold">Filters</h2>
            <button
              onClick={() => setShowFilters(false)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full 
                       transition-colors duration-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-4 space-y-4 pb-24 md:pb-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md">
              <h2 className="font-semibold mb-4 flex items-center">
                <SortAsc className="w-5 h-5 mr-2" />
                Sort By
              </h2>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full p-2 border rounded-lg"
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="newest">Newest First</option>
              </select>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md">
              <h2 className="font-semibold mb-4">Price Range</h2>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div>
                    <label className="text-xs md:text-sm text-gray-600 dark:text-gray-400">Min</label>
                    <input
                      type="number"
                      value={filters.priceRange.min}
                      onChange={(e) => handlePriceRangeInput('min', Number(e.target.value))}
                      className="w-full p-1.5 md:p-2 border rounded-lg mt-1 text-sm"
                      min={initialPriceRange.min}
                      max={filters.priceRange.max}
                    />
                  </div>
                  <div>
                    <label className="text-xs md:text-sm text-gray-600 dark:text-gray-400">Max</label>
                    <input
                      type="number"
                      value={filters.priceRange.max}
                      onChange={(e) => handlePriceRangeInput('max', Number(e.target.value))}
                      className="w-full p-1.5 md:p-2 border rounded-lg mt-1 text-sm"
                      min={filters.priceRange.min}
                      max={initialPriceRange.max}
                    />
                  </div>
                </div>
                <input
                  type="range"
                  min={initialPriceRange.min}
                  max={initialPriceRange.max}
                  value={filters.priceRange.max}
                  onChange={(e) => handlePriceRangeInput('max', Number(e.target.value))}
                  className="w-full"
                />
              </div>

              <div className="mt-4 pt-4 border-t">
                <h3 className="text-xs md:text-sm font-medium mb-2">Quick Filters</h3>
                <div className="space-y-2">
                  {[
                    { value: '0-50', label: 'Under $50' },
                    { value: '50-100', label: '$50 - $100' },
                    { value: '100-200', label: '$100 - $200' },
                    { value: '200', label: '$200 and above' }
                  ].map(range => (
                    <label key={range.value} className="flex items-center text-xs md:text-sm">
                      <input
                        type="checkbox"
                        checked={filters.priceRanges.includes(range.value)}
                        onChange={() => handlePriceRangeChange(range.value)}
                        className="rounded text-indigo-600 mr-2"
                      />
                      {range.label}
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md">
              <h2 className="font-semibold mb-4">Brand</h2>
              <div className="space-y-2">
                {brands.map(brand => (
                  <label key={brand} className="flex items-center text-xs md:text-sm">
                    <input
                      type="checkbox"
                      checked={filters.brands.includes(brand)}
                      onChange={() => handleBrandChange(brand)}
                      className="rounded text-indigo-600 mr-2"
                    />
                    {brand}
                  </label>
                ))}
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md">
              <h2 className="font-semibold mb-4">Rating</h2>
              <div className="space-y-2">
                {[
                  { value: '4', label: '4+ Stars' },
                  { value: '3', label: '3+ Stars' },
                  { value: '2', label: '2+ Stars' }
                ].map(rating => (
                  <label key={rating.value} className="flex items-center text-xs md:text-sm">
                    <input
                      type="checkbox"
                      checked={filters.ratings.includes(rating.value)}
                      onChange={() => handleRatingChange(rating.value)}
                      className="rounded text-indigo-600 mr-2"
                    />
                    {rating.label}
                  </label>
                ))}
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md">
              <label className="flex items-center space-x-2 text-xs md:text-sm">
                <input
                  type="checkbox"
                  checked={filters.inStock}
                  onChange={(e) => setFilters({ ...filters, inStock: e.target.checked })}
                  className="rounded text-indigo-600"
                />
                <span>In Stock Only</span>
              </label>
            </div>
          </div>

          {/* Mobile Apply Filters Button */}
          <div className="fixed bottom-0 left-0 right-0 p-4 bg-white dark:bg-gray-800 border-t md:hidden shadow-lg">
            <button
              onClick={() => setShowFilters(false)}
              className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg text-sm
                       hover:bg-indigo-700 transition-colors duration-200"
            >
              Apply Filters
            </button>
          </div>
        </div>

        {/* Overlay for mobile */}
        {showFilters && (
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-20 md:hidden 
                     transition-opacity duration-300"
            onClick={() => setShowFilters(false)}
          />
        )}

        {/* Product Grid */}
        <div className="flex-1">
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-6">
            {currentProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden 
                         group hover:-translate-y-1 transition-all duration-300"
              >
                <div className="relative">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-32 sm:h-48 object-cover transform transition-transform 
                             duration-300 group-hover:scale-105"
                  />
                  <button
                    onClick={() => {
                      toggleWishlist(product);
                      showToast(`${product.name} ${wishlist.includes(product.id) ? 'removed from' : 'added to'} wishlist`);
                    }}
                    className="absolute top-2 right-2 p-2 rounded-full bg-white/80 
                             hover:bg-white transition-colors duration-200"
                  >
                    <Heart
                      className={`w-5 h-5 ${
                        wishlist.includes(product.id)
                          ? 'text-red-500 fill-current'
                          : 'text-gray-600'
                      }`}
                    />
                  </button>
                  {!product.inStock && (
                    <div className="absolute bottom-2 left-2 bg-red-500 text-white px-2 py-1 
                                 text-xs rounded">
                      Out of Stock
                    </div>
                  )}
                </div>
                <div className="p-2 sm:p-4">
                  <h3 className="text-sm sm:text-lg font-semibold mb-1 text-gray-900 dark:text-white truncate">
                    {product.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm mb-1 sm:mb-2">{product.brand}</p>
                  <div className="flex items-center mb-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3 h-3 sm:w-4 sm:h-4 ${
                            i < Math.floor(product.rating)
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="ml-1 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                      ({product.reviews})
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm sm:text-xl font-bold text-gray-900 dark:text-white">
                      ${product.price}
                    </span>
                    <button
                      onClick={() => {
                        if (product.inStock) {
                          addToCart(product);
                          showToast(`${product.name} added to cart`);
                        }
                      }}
                      disabled={!product.inStock}
                      className={`p-2 rounded-full ${
                        product.inStock
                          ? 'bg-indigo-600 hover:bg-indigo-700'
                          : 'bg-gray-400 cursor-not-allowed'
                      } text-white transition-colors duration-200`}
                    >
                      <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <PaginationControls
              currentPage={currentPage}
              totalPages={totalPages}
              setCurrentPage={setCurrentPage}
              className="mt-8 pb-20 md:pb-8 sticky bottom-0 bg-gray-50 dark:bg-gray-900 py-4"
            />
          )}
        </div>
      </div>

      {/* Toast Notification */}
      <div
        className={`fixed bottom-24 right-4 md:bottom-4 bg-gray-900 text-white px-6 py-3 rounded-lg 
                   shadow-lg transform transition-transform duration-300 ${
                     showNotification ? 'translate-y-0' : 'translate-y-24'
                   }`}
      >
        {notificationMessage}
      </div>
    </div>
  );
};

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  setCurrentPage: (page: number) => void;
  className?: string;
}

const PaginationControls: React.FC<PaginationControlsProps> = ({
  currentPage,
  totalPages,
  setCurrentPage,
  className = ''
}) => {
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Smooth scroll to top on mobile
    if (window.innerWidth < 768) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const renderPageButton = (pageNum: number, active: boolean) => (
    <button
      onClick={() => handlePageChange(pageNum)}
      className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg text-sm sm:text-base font-medium 
                 transition-all duration-300 transform hover:scale-105 
                 ${active 
                   ? 'bg-indigo-600 text-white shadow-lg scale-105' 
                   : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700'
                 }`}
    >
      {pageNum}
    </button>
  );

  return (
    <div className={`flex flex-col items-center gap-2 ${className}`}>
      <div className="flex items-center gap-2 bg-white dark:bg-gray-800 p-2 rounded-lg shadow-md">
        <button
          onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
          disabled={currentPage === 1}
          className="p-2 rounded-lg border bg-white dark:bg-gray-800 hover:bg-gray-50
                   dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed 
                   transition-all duration-300 transform hover:scale-105 shadow-sm min-w-[40px]"
          aria-label="Previous page"
        >
          <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        <div className="flex items-center gap-1 sm:gap-2">
          {/* First page */}
          {renderPageButton(1, currentPage === 1)}

          {/* Left ellipsis */}
          {currentPage > 3 && (
            <span className="w-8 text-center text-gray-500">...</span>
          )}

          {/* Pages around current */}
          {[...Array(totalPages)].map((_, i) => {
            const pageNum = i + 1;
            const showPage = pageNum !== 1 && 
                           pageNum !== totalPages && 
                           Math.abs(currentPage - pageNum) <= 1;
            return showPage ? renderPageButton(pageNum, currentPage === pageNum) : null;
          })}

          {/* Right ellipsis */}
          {currentPage < totalPages - 2 && (
            <span className="w-8 text-center text-gray-500">...</span>
          )}

          {/* Last page */}
          {totalPages > 1 && renderPageButton(totalPages, currentPage === totalPages)}
        </div>

        <button
          onClick={() => handlePageChange(Math.min(currentPage + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="p-2 rounded-lg border bg-white dark:bg-gray-800 hover:bg-gray-50
                   dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed 
                   transition-all duration-300 transform hover:scale-105 shadow-sm min-w-[40px]"
          aria-label="Next page"
        >
          <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      </div>

      <div className="text-sm text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-800 px-4 py-2 rounded-lg shadow-md">
        Page {currentPage} of {totalPages}
      </div>
    </div>
  );
};

export default CategoryPage;