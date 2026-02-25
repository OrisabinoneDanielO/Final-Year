import React from 'react';

const Payments = () => {
  return (
    <div className="p-8 bg-white min-h-screen">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Payments</h1>
        <p className="text-gray-500 text-sm font-medium">Manage and track payments</p>
      </header>

      <div className="text-center py-20">
        <p className="text-gray-400 font-bold text-lg">No payment records yet</p>
      </div>
    </div>
  );
};

export default Payments;
