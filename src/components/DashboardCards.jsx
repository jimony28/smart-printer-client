import React from 'react';

const DashboardCards = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-2">Total Orders</h2>
        <p className="text-3xl font-bold">0</p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-2">Pending Orders</h2>
        <p className="text-3xl font-bold">0</p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-2">Completed Orders</h2>
        <p className="text-3xl font-bold">0</p>
      </div>
    </div>
  );
};

export default DashboardCards;
