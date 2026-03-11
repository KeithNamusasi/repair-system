import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile menu button */}
      <div className="lg:hidden">
        <div className="flex items-center justify-between bg-gray-800 p-4">
          <h1 className="text-xl font-bold text-white">Repair POS</h1>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-gray-300 hover:text-white"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {sidebarOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      <div className="flex">
        <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
        
        {/* Main content */}
        <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default Layout;