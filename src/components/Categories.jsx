import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Shirt, 
  Watch, 
  Smartphone, 
  Laptop, 
  Home, 
  ShoppingBag 
} from 'lucide-react';

const categories = [
  {
    id: '1',
    name: 'Fashion',
    icon: Shirt,
    itemCount: 520,
    image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&q=80&w=600',
  },
  {
    id: '2',
    name: 'Accessories',
    icon: Watch,
    itemCount: 230,
    image: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&q=80&w=600',
  },
  {
    id: '3',
    name: 'Phones',
    icon: Smartphone,
    itemCount: 180,
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=600',
  },
  {
    id: '4',
    name: 'Electronics',
    icon: Laptop,
    itemCount: 340,
    image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&q=80&w=600',
  },
  {
    id: '5',
    name: 'Home & Living',
    icon: Home,
    itemCount: 420,
    image: 'https://images.unsplash.com/photo-1484101403633-562f891dc89a?auto=format&fit=crop&q=80&w=600',
  },
  {
    id: '6',
    name: 'All Categories',
    icon: ShoppingBag,
    itemCount: 1800,
    image: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&q=80&w=600',
  },
];

export default function Categories() {
  return (
    <section className="py-24 bg-teal-50 dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-4">Shop by Category</h2>
          <p className="text-gray-600 dark:text-gray-400 text-tiny sm:text-lg">Explore our wide range of products</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 lg:gap-8">
          {categories.map((category) => {
            const IconComponent = category.icon;
            return (
              <div
                key={category.id}
                className="relative group overflow-hidden rounded-2xl shadow-lg transition-transform 
                         cursor-pointer duration-300 hover:-translate-y-1 hover:shadow-xl aspect-[4/5]"
              >
              <Link to={`/category/${category.name.toLowerCase()}`}>
                <div className="relative h-full">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="absolute inset-0 object-cover w-full h-full transform transition-transform 
                             duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/0" />
                </div>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-4 sm:p-6">
                  <IconComponent className="w-5 h-5 sm:w-12 sm:h-12 mb-1.5 sm:mb-4" />
                  <h3 className="text-base sm:text-2xl font-bold mb-0.5 sm:mb-2">{category.name}</h3>
                  <p className="text-tiny sm:text-sm opacity-90">{category.itemCount}+ items</p>
                  <button className="mt-4 px-6 py-2 bg-white text-gray-900 rounded-full font-medium 
                                   transform transition-all duration-500 opacity-0 translate-y-4 scale-95
                                   group-hover:opacity-100 group-hover:translate-y-0 group-hover:scale-100 
                                   hover:bg-gray-100 hover:shadow-lg">
                    View All
                  </button>
                </div>
              </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}