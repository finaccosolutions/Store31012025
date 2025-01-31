import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Star, Heart, ShoppingCart } from 'lucide-react';
import { useShop } from '../context/ShopContext';

const products = [
  {
    id: '1',
    name: 'Wireless Headphones',
    price: 199.99,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=600',
    rating: 4.5,
    reviews: 128,
  },
  {
    id: '2',
    name: 'Smart Watch',
    price: 299.99,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=600',
    rating: 4.8,
    reviews: 256,
  },
  {
    id: '3',
    name: 'Premium Backpack',
    price: 79.99,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=600',
    rating: 4.2,
    reviews: 89,
  },
  {
    id: '4',
    name: 'Smartphone',
    price: 899.99,
    image: 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?auto=format&fit=crop&q=80&w=600',
    rating: 4.9,
    reviews: 512,
  },
  {
    id: '5',
    name: 'Sunglasses',
    price: 159.99,
    image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&q=80&w=600',
    rating: 4.4,
    reviews: 167,
  },
  {
    id: '6',
    name: 'Laptop',
    price: 1299.99,
    image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&q=80&w=600',
    rating: 4.7,
    reviews: 342,
  },
  {
    id: '7',
    name: 'Camera',
    price: 799.99,
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=600',
    rating: 4.6,
    reviews: 215,
  },
  {
    id: '8',
    name: 'Sneakers',
    price: 129.99,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=600',
    rating: 4.3,
    reviews: 178,
  },
  {
    id: '9',
    name: 'Fitness Tracker',
    price: 99.99,
    image: 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?auto=format&fit=crop&q=80&w=600',
    rating: 4.1,
    reviews: 143,
  },
  {
    id: '10',
    name: 'Wireless Speaker',
    price: 149.99,
    image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&q=80&w=600',
    rating: 4.5,
    reviews: 198,
  },
];

export default function FeaturedProducts() {
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const { toggleWishlist, addToCart, wishlist } = useShop();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const showToast = (message: string) => {
    setNotificationMessage(message);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 2000);
  };

  return (
    <section className="py-16 bg-teal-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-8">
          Top Selling Products
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-6 lg:gap-8">
          {products.map((product) => (
            <div
              key={product.id}
              className="group bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl shadow-md overflow-hidden 
                       transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
            >
              <Link to={`/product/${product.id}`} className="block relative">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full aspect-square object-cover transform transition-transform 
                           duration-500 group-hover:scale-110"
                />
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    toggleWishlist(product);
                    showToast(`${product.name} ${wishlist.some(item => item.id === product.id) ? 'removed from' : 'added to'} wishlist`);
                  }}
                  className="absolute top-2 sm:top-4 right-2 sm:right-4 p-1.5 sm:p-2 rounded-full bg-white dark:bg-gray-800 
                           shadow-md hover:scale-110 transition-all duration-200 opacity-0 group-hover:opacity-100"
                >
                  <Heart
                    className={`w-4 h-4 sm:w-5 sm:h-5 ${
                      wishlist.some(item => item.id === product.id)
                        ? 'text-red-500 fill-current'
                        : 'text-gray-400'
                    }`}
                  />
                </button>
              </Link>
              <div className="p-2 sm:p-4">
                <h3 className="text-sm sm:text-lg font-semibold text-gray-900 dark:text-white mb-1 sm:mb-2 truncate">
                  {product.name}
                </h3>
                <div className="flex items-center mb-1 sm:mb-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-2.5 h-2.5 sm:w-4 sm:h-4 ${
                          i < Math.floor(product.rating)
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="ml-1 sm:ml-2 text-xxs sm:text-sm text-gray-500 dark:text-gray-400">
                    ({product.reviews})
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm sm:text-xl font-bold text-gray-900 dark:text-white">
                    ${product.price}
                  </span>
                  <button 
                    onClick={(e) => {
                      e.preventDefault();
                      addToCart(product);
                      showToast(`${product.name} added to cart`);
                    }}
                    className="p-1.5 sm:p-2 lg:p-3 rounded-full bg-indigo-600 text-white hover:bg-indigo-700 
                             transition-colors duration-200"
                  >
                    <ShoppingCart className="w-3 h-3 sm:w-5 sm:h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Toast Notification */}
      <div
        className={`fixed bottom-4 right-4 bg-gray-900 text-white px-6 py-3 rounded-lg shadow-lg 
                   transform transition-transform duration-300 ${
                     showNotification ? 'translate-y-0' : 'translate-y-24'
                   }`}
      >
        {notificationMessage}
      </div>
    </section>
  );
}