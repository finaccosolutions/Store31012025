import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, Heart, ShoppingCart, Share2, Truck, Package, Shield } from 'lucide-react';
import { useShop } from '../context/ShopContext';

// Export products data
export const products = {
  '1': {
    id: '1',
    name: 'Wireless Headphones',
    price: 199.99,
    category: 'Electronics',
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1487215078519-e21cc028cb29?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1524678606370-a47ad25cb82a?auto=format&fit=crop&q=80&w=600',
    ],
    rating: 4.5,
    reviews: 128,
    description: 'High-quality wireless headphones with noise-canceling technology.',
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
  '2': {
    id: '2',
    name: 'Smart Watch',
    price: 299.99,
    category: 'Electronics',
    images: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?auto=format&fit=crop&q=80&w=600',
    ],
    rating: 4.8,
    reviews: 256,
    description: 'Feature-rich smartwatch with advanced health tracking capabilities.',
    specs: {
      'Display': '1.4" AMOLED',
      'Battery Life': '7 days',
      'Water Resistance': '5 ATM',
      'Sensors': 'Heart Rate, SpO2, GPS',
      'Compatibility': 'iOS and Android',
      'Storage': '4GB',
      'Weight': '45g'
    }
  },
  '3': {
    id: '3',
    name: 'Premium Backpack',
    price: 79.99,
    category: 'Fashion',
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1581605405669-fcdf81165afa?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1622560480654-d96214fdc887?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1491637639811-60e2756cc1c7?auto=format&fit=crop&q=80&w=600'
    ],
    rating: 4.2,
    reviews: 89,
    description: 'Durable and stylish backpack for everyday use.',
    specs: {
      'Material': 'Water-resistant polyester',
      'Capacity': '25L',
      'Laptop Compartment': 'Up to 15.6"',
      'Weight': '0.9kg',
      'Dimensions': '45 x 30 x 15 cm',
      'Pockets': '5 external, 3 internal',
      'Color': 'Black'
    }
  },
  '4': {
    id: '4',
    name: 'Smartphone',
    price: 899.99,
    category: 'Phones',
    images: [
      'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?auto=format&fit=crop&q=80&w=600'
    ],
    rating: 4.9,
    reviews: 512,
    description: 'Latest smartphone with advanced camera features.',
    specs: {
      'Display': '6.7" AMOLED',
      'Processor': 'Octa-core',
      'RAM': '8GB',
      'Storage': '256GB',
      'Camera': '108MP + 12MP + 12MP',
      'Battery': '4500mAh',
      'OS': 'Android 13'
    }
  },
  '5': {
    id: '5',
    name: 'Sunglasses',
    price: 159.99,
    category: 'Accessories',
    images: [
      'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1577803645773-f96470509666?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?auto=format&fit=crop&q=80&w=600'
    ],
    rating: 4.4,
    reviews: 167,
    description: 'Stylish and protective sunglasses with UV protection.',
    specs: {
      'Frame Material': 'Acetate',
      'Lens Material': 'Polarized Glass',
      'UV Protection': '100% UVA/UVB',
      'Frame Size': 'Medium',
      'Weight': '28g',
      'Style': 'Aviator',
      'Color': 'Gold/Green'
    }
  },
  '6': {
    id: '6',
    name: 'Laptop',
    price: 1299.99,
    category: 'Electronics',
    images: [
      'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1504707748692-419802cf939d?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1527434171365-3d9f55f5fb78?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1629131726692-1accd0c53ce0?auto=format&fit=crop&q=80&w=600'
    ],
    rating: 4.7,
    reviews: 342,
    description: 'Powerful laptop for work and entertainment.',
    specs: {
      'Processor': 'Intel Core i7',
      'RAM': '16GB DDR4',
      'Storage': '512GB SSD',
      'Display': '15.6" 4K',
      'Graphics': 'NVIDIA RTX 3060',
      'Battery': '8 hours',
      'Weight': '1.8kg'
    }
  },
  '7': {
    id: '7',
    name: 'Camera',
    price: 799.99,
    category: 'Electronics',
    images: [
      'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1500634245200-e5245c7574ef?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1581591524425-c7e0978865fc?auto=format&fit=crop&q=80&w=600'
    ],
    rating: 4.6,
    reviews: 215,
    description: 'Professional mirrorless camera for stunning photos.',
    specs: {
      'Sensor': '24.2MP Full-Frame',
      'ISO Range': '100-51200',
      'Video': '4K/60fps',
      'Autofocus Points': '693',
      'Screen': '3" Touchscreen',
      'Battery Life': '700 shots',
      'Weight': '650g'
    }
  },
  '8': {
    id: '8',
    name: 'Sneakers',
    price: 129.99,
    category: 'Fashion',
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&q=80&w=600'
    ],
    rating: 4.3,
    reviews: 178,
    description: 'Comfortable and stylish sneakers for everyday wear.',
    specs: {
      'Upper Material': 'Knit Mesh',
      'Sole': 'Rubber',
      'Cushioning': 'EVA Foam',
      'Closure': 'Lace-up',
      'Style': 'Athletic',
      'Available Sizes': '7-13',
      'Weight': '280g'
    }
  },
  '9': {
    id: '9',
    name: 'Fitness Tracker',
    price: 99.99,
    category: 'Gadgets',
    images: [
      'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1557861537-76492a0b6e76?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1576243345690-4e4b79b63288?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1589311741184-1f9f0dbdd27c?auto=format&fit=crop&q=80&w=600'
    ],
    rating: 4.1,
    reviews: 143,
    description: 'Track your fitness goals with this smart band.',
    specs: {
      'Display': '0.96" AMOLED',
      'Battery Life': '14 days',
      'Water Resistance': 'IP68',
      'Sensors': 'Heart Rate, SpO2',
      'Connectivity': 'Bluetooth 5.0',
      'Compatibility': 'iOS/Android',
      'Weight': '24g'
    }
  },
  '10': {
    id: '10',
    name: 'Wireless Speaker',
    price: 149.99,
    category: 'Electronics',
    images: [
      'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1589256469067-ea99122bbdc4?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1563330232-57114bb0823c?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=600'
    ],
    rating: 4.5,
    reviews: 198,
    description: 'Premium wireless speaker with immersive sound.',
    specs: {
      'Power Output': '30W',
      'Battery Life': '12 hours',
      'Connectivity': 'Bluetooth 5.0',
      'Drivers': '2x 40mm',
      'Water Resistance': 'IPX7',
      'Features': 'Voice Assistant',
      'Weight': '780g'
    }
  }
};

export default function ProductPage() {
  const { id } = useParams();
  const product = products[id as keyof typeof products];
  const [selectedImage, setSelectedImage] = useState(0);
  const [zoomLens, setZoomLens] = useState({ x: 0, y: 0, show: false });
  const [zoomLevel] = useState(2.5);
  const [quantity, setQuantity] = useState(1);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [showShareMenu, setShowShareMenu] = useState(false);
  const { addToCart, toggleWishlist, wishlist } = useShop();

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    
    // Calculate lens position
    const lensWidth = width / zoomLevel;
    const lensHeight = height / zoomLevel;
    
    let x = e.clientX - left - lensWidth / 2;
    let y = e.clientY - top - lensHeight / 2;
    
    // Keep lens within bounds
    x = Math.max(0, Math.min(x, width - lensWidth));
    y = Math.max(0, Math.min(y, height - lensHeight));
    
    setZoomLens({
      x,
      y,
      show: true
    });
  };

  const handleAddToCart = () => {
    addToCart(product);
    showToast(`${product.name} added to cart`);
  };

  const showToast = (message: string) => {
    setNotificationMessage(message);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 2000);
  };

  const handleShare = (platform: string) => {
    const url = window.location.href;
    const title = `Check out ${product.name}!`;
    
    const shareUrls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
      linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`,
      whatsapp: `https://api.whatsapp.com/send?text=${encodeURIComponent(title + ' ' + url)}`
    };

    window.open(shareUrls[platform as keyof typeof shareUrls], '_blank');
    setShowShareMenu(false);
  };

  return product && (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 relative">
        <div className="space-y-4 relative">
          {/* Main Image */}
          <div className="relative bg-gray-200 rounded-lg overflow-hidden">
            <button
              onClick={() => toggleWishlist(product.id)}
              className="absolute top-4 right-4 p-2 rounded-full bg-white dark:bg-gray-800 
                       shadow-md hover:scale-110 transition-transform duration-200 z-10"
            >
              <Heart
                className={`w-5 h-5 ${
                  wishlist.includes(product.id)
                    ? 'text-red-500 fill-current'
                    : 'text-gray-400'
                }`}
              />
            </button>
            <div 
              className="relative w-full h-[400px]"
              onMouseMove={handleMouseMove}
              onMouseEnter={() => setZoomLens(prev => ({ ...prev, show: true }))}
              onMouseLeave={() => setZoomLens(prev => ({ ...prev, show: false }))}
            >
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="absolute w-full h-full object-cover"
              />
              {/* Zoom Lens */}
              {zoomLens.show && (
                <div
                  className="absolute border-2 border-indigo-500 bg-black/10 pointer-events-none"
                  style={{
                    width: `${100 / zoomLevel}%`,
                    height: `${100 / zoomLevel}%`,
                    transform: `translate(${zoomLens.x}px, ${zoomLens.y}px)`,
                    transition: 'transform 0.1s ease-out'
                  }}
                />
              )}
            </div>
          </div>

          {/* Zoom Preview */}
          {zoomLens.show && (
            <div 
              className="absolute top-0 -right-[720px] w-[700px] h-[700px] bg-white 
                       dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden border-2 
                       border-gray-200 dark:border-gray-700 hidden lg:block"
              style={{ zIndex: 1000 }}
            >
              <div 
                className="w-full h-full bg-no-repeat"
                style={{
                  backgroundImage: `url(${product.images[selectedImage]})`,
                  backgroundSize: `${zoomLevel * 100}%`,
                  backgroundPosition: `${-(zoomLens.x * zoomLevel * 1.4)}px ${-(zoomLens.y * zoomLevel * 1.4)}px`
                }}
              />
            </div>
          )}

          {/* Thumbnail Images */}
          <div className="grid grid-cols-6 gap-2">
            {product.images.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`w-14 h-14 rounded-lg overflow-hidden group relative ${
                  selectedImage === index ? 'ring-2 ring-indigo-500' : ''
                }`}
              >
                <img
                  src={image}
                  alt={`Product ${index + 1}`}
                  className="object-cover w-full h-full transform transition-transform duration-300 
                           group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 
                             transition-opacity duration-300" />
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          {/* Product Title & Category */}
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{product.name}</h1>
            <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">Category: {product.category}</div>
            
            <div className="flex items-center mt-4">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-5 h-5 ${
                    i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              <span className="font-semibold text-indigo-600 dark:text-indigo-400">{product.reviews}</span> verified reviews
            </span>
          </div>

          {/* Price & Add to Cart */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg space-y-4">
            <div className="text-3xl font-bold text-gray-900 dark:text-white">${product.price}</div>
            <div className="flex items-center space-x-4">
              <label htmlFor="quantity" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Quantity
              </label>
              <select
                id="quantity"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value))}
                className="rounded-lg border-gray-300 py-2 px-4 focus:ring-indigo-500 focus:border-indigo-500"
              >
                {[1, 2, 3, 4, 5].map((num) => (
                  <option key={num} value={num}>
                    {num}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex space-x-4">
              <button
                onClick={handleAddToCart}
                className="w-full bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 
                       flex items-center justify-center space-x-2"
              >
                <ShoppingCart className="h-5 w-5" />
                <span>Add to Cart</span>
              </button>
              <button
                onClick={handleAddToCart}
                className="w-full font-semibold bg-indigo-600 text-white text-bold px-4 py-2 rounded-lg hover:bg-indigo-700 
                       flex items-center justify-center space-x-2"
              >
                <span>Buy </span>
              </button>
              <div className="relative">
                <button
                  onClick={() => setShowShareMenu(!showShareMenu)}
                  className="p-2 rounded-lg border border-gray-300 dark:border-gray-700 
                           hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <Share2 className="h-5 w-5 text-gray-400" />
                </button>
                
                {showShareMenu && (
                  <div className="absolute right-0 mt-2 w-48 rounded-lg shadow-lg bg-white 
                               dark:bg-gray-800 ring-1 ring-black ring-opacity-5 z-50">
                    <div className="py-1">
                      {['facebook', 'twitter', 'linkedin', 'whatsapp'].map((platform) => (
                        <button
                          key={platform}
                          onClick={() => handleShare(platform)}
                          className="block w-full px-4 py-2 text-sm text-gray-700 
                                   dark:text-gray-200 hover:bg-gray-100 
                                   dark:hover:bg-gray-700 text-left capitalize"
                        >
                          Share on {platform}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg prose dark:prose-invert">
            <h3 className="text-lg font-semibold">Description</h3>
            <p>
              High-quality wireless headphones with noise-canceling technology, providing crystal-clear 
              sound and exceptional comfort for extended listening sessions.
            </p>
            
            <h3 className="text-lg font-semibold mt-6">Features</h3>
            <ul>
              <li>Active noise cancellation</li>
              <li>40-hour battery life</li>
              <li>Bluetooth 5.0 connectivity</li>
              <li>Built-in microphone for calls</li>
            </ul>
          </div>

          {/* Delivery Info */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg space-y-4">
            <h3 className="text-lg font-semibold">Delivery Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center space-x-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <Truck className="w-8 h-8 text-indigo-600" />
                <div>
                  <p className="font-medium">Free Delivery</p>
                  <p className="text-sm text-gray-500">Expected by {
                    new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString()
                  }</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <Package className="w-8 h-8 text-indigo-600" />
                <div>
                  <p className="font-medium">Easy Returns</p>
                  <p className="text-sm text-gray-500">30 Day Return Policy</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <Shield className="w-8 h-8 text-indigo-600" />
                <div>
                  <p className="font-medium">Warranty</p>
                  <p className="text-sm text-gray-500">1 Year Warranty</p>
                </div>
              </div>
            </div>
          </div>

          {/* Specifications */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
            <h3 className="text-lg font-semibold mb-4">Specifications</h3>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg overflow-hidden">
              {Object.entries(product.specs).map(([key, value], index) => (
                <div 
                  key={key}
                  className={`flex items-center justify-between p-4 ${
                    index % 2 === 0 ? 'bg-white dark:bg-gray-700' : ''
                  }`}
                >
                  <span className="text-gray-600 dark:text-gray-400">{key}</span>
                  <span className="font-medium">{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Reviews Section */}
        </div>

        {/* Reviews Section */}
        <div className="mt-12 border-t pt-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold">Customer Reviews</h3>
            <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 
                             transition-colors duration-200">
              Write a Review
            </button>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 mb-8">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold">4.5</div>
                <div className="flex items-center mt-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${i < 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                    />
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                {[5, 4, 3, 2, 1].map((rating) => (
                  <div key={rating} className="flex items-center">
                    <span className="w-12">{rating} stars</span>
                    <div className="w-48 h-2 bg-gray-200 rounded-full mx-2">
                      <div 
                        className="h-2 bg-yellow-400 rounded-full"
                        style={{ width: `${Math.random() * 100}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-500">{Math.floor(Math.random() * 100)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="space-y-6">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="ml-2 text-sm text-gray-500">1 month ago</span>
                </div>
                <h4 className="font-semibold mb-2">Great Product!</h4>
                <p className="text-gray-600 dark:text-gray-400">
                  This product exceeded my expectations. The quality is excellent and it works perfectly.
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Toast Notification */}
      <div
        className={`fixed bottom-4 right-4 bg-gray-900 text-white px-6 py-3 rounded-lg 
                   shadow-lg transform transition-transform duration-300 ${
                     showNotification ? 'translate-y-0' : 'translate-y-24'
                   }`}
      >
        {notificationMessage}
        {notificationMessage.includes('cart') && (
          <Link
            to="/cart"
            className="ml-4 text-indigo-400 hover:text-indigo-300 font-medium"
          >
            View Cart
          </Link>
        )}
      </div>
    </div>
  );
}