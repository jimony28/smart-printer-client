import React from "react";

const DashboardLayout = ({ children }) => {
  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 p-4 hidden md:block">
        <div className="text-xl font-bold mb-6">🖨️ Print Dashboard</div>
        <nav className="space-y-2">
          <a href="#" className="block px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700">Dashboard</a>
          <a href="#" className="block px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700">Orders</a>
          <a href="#" className="block px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700">Analytics</a>
          <a href="#" className="block px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700">Settings</a>
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 border-b border-gray-200 dark:border-gray-700 px-4 flex items-center justify-between bg-white dark:bg-gray-800">
          <div className="text-lg font-medium">Dashboard</div>
          <div className="flex items-center space-x-3">
            <span className="text-sm">Welcome, Admin</span>
            <img
              src="https://via.placeholder.com/32"
              alt="User"
              className="w-8 h-8 rounded-full"
            />
          </div>
        </header>

        {/* Scrollable content */}
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50 dark:bg-gray-900">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;