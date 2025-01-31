import React from 'react';
import { Truck } from 'lucide-react';

export default function ShippingInfo() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <Truck className="mx-auto h-12 w-12 text-indigo-600" />
        <h1 className="mt-4 text-3xl font-bold text-gray-900 dark:text-white">Shipping Information</h1>
      </div>

      <div className="max-w-3xl mx-auto space-y-8">
        <section>
          <h2 className="text-2xl font-bold mb-4">Shipping Methods</h2>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 space-y-4">
            <div>
              <h3 className="font-semibold text-lg mb-2">Standard Shipping (5-7 business days)</h3>
              <p className="text-gray-600 dark:text-gray-400">Free for orders over $100</p>
              <p className="text-gray-600 dark:text-gray-400">$10 for orders under $100</p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">Express Shipping (2-3 business days)</h3>
              <p className="text-gray-600 dark:text-gray-400">$15 flat rate</p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">Next Day Delivery</h3>
              <p className="text-gray-600 dark:text-gray-400">$25 flat rate (order before 2 PM)</p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">Delivery Areas</h2>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              We currently ship to the following locations:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-400">
              <li>United States (all 50 states)</li>
              <li>Canada</li>
              <li>United Kingdom</li>
              <li>European Union</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">Shipping Policies</h2>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 space-y-4">
            <div>
              <h3 className="font-semibold text-lg mb-2">Order Processing</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Orders are processed within 1-2 business days after payment confirmation.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">Tracking Orders</h3>
              <p className="text-gray-600 dark:text-gray-400">
                A tracking number will be provided via email once your order ships.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">International Shipping</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Additional customs fees may apply for international orders.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}