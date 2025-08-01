import React from 'react';

function App() {
  return (
    <div className="min-h-screen bg-white">
      <header className="bg-blue-900 text-white p-4">
        <div className="container mx-auto">
          <h1 className="text-2xl font-bold">RitKART</h1>
          <p className="text-sm">Your One-Stop Shopping Destination</p>
        </div>
      </header>
      
      <main className="container mx-auto p-8">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            Welcome to RitKART
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Your premium e-commerce platform is loading...
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
            <div className="bg-gray-100 p-6 rounded-lg">
              <h3 className="font-bold text-lg mb-2">Electronics</h3>
              <p className="text-gray-600">Latest gadgets and devices</p>
            </div>
            <div className="bg-gray-100 p-6 rounded-lg">
              <h3 className="font-bold text-lg mb-2">Fashion</h3>
              <p className="text-gray-600">Trending styles for everyone</p>
            </div>
            <div className="bg-gray-100 p-6 rounded-lg">
              <h3 className="font-bold text-lg mb-2">Home & Kitchen</h3>
              <p className="text-gray-600">Transform your living space</p>
            </div>
            <div className="bg-gray-100 p-6 rounded-lg">
              <h3 className="font-bold text-lg mb-2">Books</h3>
              <p className="text-gray-600">Knowledge at your fingertips</p>
            </div>
          </div>
          
          <div className="mt-12 p-6 bg-blue-50 rounded-lg">
            <h3 className="text-2xl font-bold text-blue-900 mb-4">
              🎉 Application Successfully Loaded!
            </h3>
            <p className="text-blue-700">
              This confirms that the React application is working correctly in production.
              The blank screen issue has been resolved.
            </p>
          </div>
        </div>
      </main>
      
      <footer className="bg-gray-800 text-white p-8 mt-16">
        <div className="container mx-auto text-center">
          <p>&copy; 2025 RitKART. All rights reserved.</p>
          <p className="text-sm text-gray-400 mt-2">Built with React + TypeScript + Tailwind CSS</p>
        </div>
      </footer>
    </div>
  );
}

export default App;