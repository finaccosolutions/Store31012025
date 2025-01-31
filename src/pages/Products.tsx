import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Heart, ChevronRight } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  description: string;
}

// Sample data - replace with actual data from your backend
const categories = [
  {
    id: '1',
    name: 'Electronics',
    image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&q=80&w=600',
    count: 120
  },
  {
    id: '2',
    name: 'Fashion',
    image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&q=80&w=600',
    count: 350
  },
  {
    id: '3',
    name: 'Home & Living',
    image: 'https://images.unsplash.com/photo-1484101403633-562f891dc89a?auto=format&fit=crop&q=80&w=600',
    count: 200
  },
  {
    id: '4',
    name: 'Gadgets',
    image: 'https://images.unsplash.com/photo-1519558260268-cde7e03a0152?auto=format&fit=crop&q=80&w=600',
    count: 180
  }
];

// Import products data
import { products } from './ProductPage';

export default function Products() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [cart, setCart] = useState<string[]>([]);
  const [showQuickView, setShowQuickView] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const [selectedImage, setSelectedImage] = useState(0);
  const [showZoom, setShowZoom] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const productDetails = {
    '1': {
      images: [
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=600',
        'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&q=80&w=600',
        'https://images.unsplash.com/photo-1487215078519-e21cc028cb29?auto=format&fit=crop&q=80&w=600',
        'https://images.unsplash.com/photo-1524678606370-a47ad25cb82a?auto=format&fit=crop&q=80&w=600',
      ],
      specs: {
        'Bluetooth Version': '5.0',
        'Battery Life': '40 hours',
        'Charging Time': '2 hours',
        'Driver Size': '40mm',
        'Frequency Response': '20Hz - 20kHz',
        'Impedance': '32 Ohm',
        'Weight': '250g'
      }
    },
    // Add similar details for other products
  };

  const showToast = (message: string) => {
    setNotificationMessage(message);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!selectedProduct) return;
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPosition({ x, y });
  };

  const addToCart = (product: Product) => {
    setCart([...cart, product.id]);
    showToast('Item Added to Cart');
  };

  const toggleWishlist = (product: Product) => {
    if (wishlist.includes(product.id)) {
      setWishlist(wishlist.filter(id => id !== product.id));
      showToast('Item Removed from Wishlist');
    } else {
      setWishlist([...wishlist, product.id]);
      showToast('Item Added to Wishlist');
    }
  };

  const openQuickView = (product: Product) => {
    setSelectedProduct(product);
    setShowQuickView(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Categories Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Shop by Category</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Link
              key={category.id}
              to={`/category/${category.name.toLowerCase()}`}
              className="group relative overflow-hidden rounded-lg shadow-md hover:shadow-xl 
                       transition-transform duration-300 hover:-translate-y-1"
            >
              <div className="aspect-w-16 aspect-h-9">
                <img
                  src={category.image}
                  alt={category.name}
                  className="object-cover w-full h-full transform transition-transform duration-300 
                           group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                <h3 className="text-xl font-semibold mb-1">{category.name}</h3>
                <p className="text-sm opacity-90">{category.count}+ items</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Products Grid */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Featured Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden"
            >
              <Link to={`/product/${product.id}`} className="block">
                <div className="relative">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-48 object-cover transition-transform duration-300 hover:scale-105"
                  /></div>
              </Link>
                <button
                  onClick={() => toggleWishlist(product)}
                  className="absolute top-4 right-4 p-2 rounded-full bg-white dark:bg-gray-800 
                           shadow-md hover:scale-110 transition-transform duration-200"
                >
                  <Heart
                    className={`w-5 h-5 ${
                      wishlist.includes(product.id)
                        ? 'text-red-500 fill-current'
                        : 'text-gray-400'
                    }`}
                  />
                </button>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {product.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                  {product.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xl font-bold text-gray-900 dark:text-white">
                    ${product.price}
                  </span>
                  <button
                    onClick={() => addToCart(product)}
                    className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-lg 
                             hover:bg-indigo-700 transition-colors duration-200"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    <span>Add to Cart</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Quick View Modal */}
      {showQuickView && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-6xl w-full mx-4 my-8 relative">
            <div className="p-6">
              <div className="flex justify-end">
                <button
                  onClick={() => {
                    setShowQuickView(false);
                    setSelectedImage(0);
                    setQuantity(1);
                  }}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
                >
                  ×
                </button>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Product Images */}
                <div className="space-y-4">
                  <div className="relative bg-gray-100 rounded-lg overflow-hidden">
                    <div
                      className="relative w-full h-[400px]"
                      onMouseMove={handleMouseMove}
                      onMouseEnter={() => setShowZoom(true)}
                      onMouseLeave={() => setShowZoom(false)}
                    >
                      <img
                        src={productDetails[selectedProduct.id as keyof typeof productDetails]?.images[selectedImage] || selectedProduct.image}
                        alt={selectedProduct.name}
                        className="absolute w-full h-full object-cover"
                      />
                    </div>
                  </div>

                  {/* Thumbnail Images */}
                  <div className="grid grid-cols-4 gap-2">
                    {productDetails[selectedProduct.id as keyof typeof productDetails]?.images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImage(index)}
                        className={`aspect-square rounded-lg overflow-hidden ${
                          selectedImage === index ? 'ring-2 ring-indigo-500' : ''
                        }`}
                      >
                        <img
                          src={image}
                          alt={`${selectedProduct.name} ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>

                  {/* Zoom Preview */}
                  {showZoom && (
                    <div className="absolute top-0 -right-[450px] w-[400px] h-[400px] bg-white 
                                 rounded-lg shadow-xl overflow-hidden border-2 border-gray-200 
                                 hidden lg:block">
                      <div
                        className="w-full h-full bg-cover"
                        style={{
                          backgroundImage: `url(${productDetails[selectedProduct.id as keyof typeof productDetails]?.images[selectedImage] || selectedProduct.image})`,
                          backgroundPosition: `${zoomPosition.x}% ${zoomPosition.y}%`,
                          transform: 'scale(2.5)'
                        }}
                      />
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                      {selectedProduct.name}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">
                      {selectedProduct.description}
                    </p>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      ${selectedProduct.price}
                    </div>
                    <div className="flex items-center">
                      <label htmlFor="quantity" className="mr-2">Quantity:</label>
                      <select
                        id="quantity"
                        value={quantity}
                        onChange={(e) => setQuantity(parseInt(e.target.value))}
                        className="rounded-lg border-gray-300"
                      >
                        {[1, 2, 3, 4, 5].map((num) => (
                          <option key={num} value={num}>{num}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="flex space-x-4">
                    <button
                      onClick={() => {
                        addToCart(selectedProduct);
                        showToast(`${selectedProduct.name} added to cart`);
                      }}
                      className="flex-1 bg-indigo-600 text-white px-6 py-3 rounded-lg 
                               hover:bg-indigo-700 transition-colors duration-200"
                    >
                      Add to Cart
                    </button>
                    
                    <button
                      onClick={() => toggleWishlist(selectedProduct)}
                      className="p-3 rounded-lg border border-gray-300"
                    >
                      <Heart
                        className={`w-6 h-6 ${
                          wishlist.includes(selectedProduct.id)
                            ? 'text-red-500 fill-current'
                            : 'text-gray-400'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Specifications */}
                  {productDetails[selectedProduct.id as keyof typeof productDetails]?.specs && (
                    <div className="border-t pt-6">
                      <h3 className="text-lg font-semibold mb-4">Specifications</h3>
                      <div className="grid grid-cols-2 gap-4">
                        {Object.entries(productDetails[selectedProduct.id as keyof typeof productDetails].specs).map(([key, value]) => (
                          <div key={key} className="flex justify-between">
                            <span className="text-gray-600">{key}:</span>
                            <span className="font-medium">{value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Delivery Info */}
                  <div className="border-t pt-6">
                    <h3 className="text-lg font-semibold mb-4">Delivery Information</h3>
                    <div className="space-y-2">
                      <p>Free delivery on orders over $100</p>
                      <p>Expected delivery: {
                        new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString()
                      }</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      <div
        className={`fixed bottom-4 right-4 bg-gray-900 text-white px-6 py-3 rounded-lg shadow-lg 
                   transform transition-transform duration-300 ${
                     showNotification ? 'translate-y-0' : 'translate-y-24'
                   }`}
      >
        {notificationMessage}
        {notificationMessage.includes('Cart') && (
          <Link
            to="/cart"
            className="ml-4 text-indigo-400 hover:text-indigo-300 font-medium"
          >
            Go to Cart
          </Link>
        )}
      </div>
    </div>
  );
}