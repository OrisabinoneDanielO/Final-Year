import React, { useState } from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';

// ── Dummy payment data ────────────────────────────────────────────────────────
const ALL_PAYMENTS = [
  // Successful
  { id: 1,  date: '1-22-26', transactionId: '9F3A8C2B71', applicationId: 'BUH-A9F3K2',  name: 'Adebola Ogunsiwaju', level: 'UG', amount: 'N7000',  status: 'Successful', method: 'Bank Transfer' },
  { id: 2,  date: '1-22-26', transactionId: 'C82F9A1D7E', applicationId: 'BUH-7XQ82M',  name: 'Funke Adebayo',      level: 'UG', amount: 'N7000',  status: 'Successful', method: 'Card Payment' },
  { id: 3,  date: '1-22-26', transactionId: 'F5A39C7D21', applicationId: 'BUH-3LZ91R',  name: 'Funke Adebayo',      level: 'PG', amount: 'N20500', status: 'Successful', method: 'Bank Transfer' },
  { id: 4,  date: '1-22-26', transactionId: '9F3A8C2B71', applicationId: 'BUH-A9F3K2',  name: 'Adebola Ogunsiwaju', level: 'UG', amount: 'N7000',  status: 'Successful', method: 'Bank Transfer' },
  { id: 5,  date: '1-22-26', transactionId: 'C82F9A1D7E', applicationId: 'BUH-7XQ82M',  name: 'Funke Adebayo',      level: 'UG', amount: 'N7000',  status: 'Successful', method: 'Card Payment' },
  { id: 6,  date: '1-22-26', transactionId: 'F5A39C7D21', applicationId: 'BUH-3LZ91R',  name: 'Funke Adebayo',      level: 'PG', amount: 'N20500', status: 'Successful', method: 'Bank Transfer' },
  // Pending
  { id: 7,  date: '1-22-26', transactionId: '9F3A8C2B71', applicationId: 'BUH-A9F3K2',  name: 'Adebola Ogunsiwaju', level: 'UG', amount: 'N7000',  status: 'Pending', method: '' },
  { id: 8,  date: '1-22-26', transactionId: 'C82F9A1D7E', applicationId: 'BUH-7XQ82M',  name: 'Funke Adebayo',      level: 'UG', amount: 'N7000',  status: 'Pending', method: '' },
  { id: 9,  date: '1-22-26', transactionId: 'F5A39C7D21', applicationId: 'BUH-3LZ91R',  name: 'Funke Adebayo',      level: 'PG', amount: 'N20500', status: 'Pending', method: '' },
  { id: 10, date: '1-22-26', transactionId: '9F3A8C2B71', applicationId: 'BUH-A9F3K2',  name: 'Adebola Ogunsiwaju', level: 'UG', amount: 'N7000',  status: 'Pending', method: '' },
];

const TABS = ['Successful', 'Pending'];

const Payments = () => {
  const [activeTab, setActiveTab] = useState('Successful');
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = ALL_PAYMENTS.filter((p) => {
    if (p.status !== activeTab) return false;
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      p.name.toLowerCase().includes(q) ||
      p.transactionId.toLowerCase().includes(q) ||
      p.applicationId.toLowerCase().includes(q)
    );
  });

  return (
    <div className="bg-white min-h-screen p-8">
      {/* Title */}
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Applicant Payments</h1>

      {/* Tabs + icons row */}
      <div className="flex items-center justify-between mb-4">
        {/* Status tabs */}
        <div className="flex items-center gap-2">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => { setActiveTab(tab); setSearchQuery(''); }}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${
                activeTab === tab
                  ? 'bg-[#003B95] text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {tab === 'Successful' ? 'Succesful' : tab}
            </button>
          ))}
        </div>

        {/* Search + filter icons */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => { setSearchOpen((s) => !s); setSearchQuery(''); }}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Toggle search"
          >
            <Search size={18} className="text-gray-600" />
          </button>
          <button
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Filter"
          >
            <SlidersHorizontal size={18} className="text-gray-600" />
          </button>
        </div>
      </div>

      {/* Search bar */}
      {searchOpen && (
        <div className="relative mb-4">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            autoFocus
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for a payment"
            className="w-full bg-[#F3F4F6] rounded-xl pl-10 pr-10 py-3 text-sm outline-none border border-transparent focus:border-[#003B95] transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X size={16} />
            </button>
          )}
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto rounded-xl">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-[#003B95] text-white">
              <th className="text-left px-4 py-3 font-semibold rounded-tl-xl">Date</th>
              <th className="text-left px-4 py-3 font-semibold">Transaction ID</th>
              <th className="text-left px-4 py-3 font-semibold">Application ID</th>
              <th className="text-left px-4 py-3 font-semibold">Name</th>
              <th className="text-left px-4 py-3 font-semibold">Level</th>
              <th className="text-left px-4 py-3 font-semibold">Amount</th>
              <th className="text-left px-4 py-3 font-semibold">Payment Status</th>
              <th className="text-left px-4 py-3 font-semibold rounded-tr-xl">Payment Method</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center py-16 text-gray-400 font-bold">
                  No {activeTab.toLowerCase()} payments found
                </td>
              </tr>
            ) : (
              filtered.map((payment, idx) => (
                <tr
                  key={payment.id}
                  className={`border-b border-gray-100 ${idx % 2 === 0 ? 'bg-white' : 'bg-[#F9FAFB]'} hover:bg-blue-50 transition-colors`}
                >
                  <td className="px-4 py-3 text-gray-700">{payment.date}</td>
                  <td className="px-4 py-3 text-gray-700 font-mono">{payment.transactionId}</td>
                  <td className="px-4 py-3 text-gray-700">{payment.applicationId}</td>
                  <td className="px-4 py-3 text-gray-900 font-medium">{payment.name}</td>
                  <td className="px-4 py-3 text-gray-700">{payment.level}</td>
                  <td className="px-4 py-3 text-gray-900 font-medium">{payment.amount}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-bold text-white ${
                        payment.status === 'Successful' ? 'bg-green-500' : 'bg-yellow-500'
                      }`}
                    >
                      {payment.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-700">{payment.method || '—'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Payments;
