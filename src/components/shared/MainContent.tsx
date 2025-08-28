import React from 'react';

interface MainContentProps {
  className?: string;
}

export default function MainContent({ className = "" }: MainContentProps) {
  return (
    <section className={`flex-1 overflow-auto px-6 py-4 bg-[#f9fafb] ${className}`}>
      <div className="text-center py-12">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Welcome to NextERP</h1>
        <p className="text-gray-600 mb-8">Your comprehensive enterprise resource planning solution</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">Human Resource</h2>
            <p className="text-gray-600 mb-4">Manage employee profiles, attendance, and HR processes</p>
            <a 
              href="/human-resource" 
              className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Go to HR
            </a>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">Coming Soon</h2>
            <p className="text-gray-600 mb-4">More modules will be available soon</p>
            <button className="px-4 py-2 bg-gray-400 text-white rounded cursor-not-allowed">
              Coming Soon
            </button>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">Support</h2>
            <p className="text-gray-600 mb-4">Get help and documentation</p>
            <button className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors">
              Contact Support
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}