import React, { useState } from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';

// ── Dummy payment data ────────────────────────────────────────────────────────
const ALL_PAYMENTS = [
  // Successful
  { id: 1, date: '1-22-26', transactionId: '9F3A8C2B71', applicationId: 'BUH-A9F3K2', name: 'Adebola Ogunsiwaju', level: 'UG', amount: 'N7000', status: 'Successful', method: 'Bank Transfer' },
  { id: 2, date: '1-22-26', transactionId: 'C82F9A1D7E', applicationId: 'BUH-7XQ82M', name: 'Funke Adebayo', level: 'UG', amount: 'N7000', status: 'Successful', method: 'Card Payment' },
  { id: 3, date: '1-22-26', transactionId: 'F5A39C7D21', applicationId: 'BUH-3LZ91R', name: 'Funke Adebayo', level: 'PG', amount: 'N20500', status: 'Successful', method: 'Bank Transfer' },
  { id: 4, date: '1-22-26', transactionId: '9F3A8C2B71', applicationId: 'BUH-A9F3K2', name: 'Adebola Ogunsiwaju', level: 'UG', amount: 'N7000', status: 'Successful', method: 'Bank Transfer' },
  { id: 5, date: '1-22-26', transactionId: 'C82F9A1D7E', applicationId: 'BUH-7XQ82M', name: 'Funke Adebayo', level: 'UG', amount: 'N7000', status: 'Successful', method: 'Card Payment' },
  { id: 6, date: '1-22-26', transactionId: 'F5A39C7D21', applicationId: 'BUH-3LZ91R', name: 'Funke Adebayo', level: 'PG', amount: 'N20500', status: 'Successful', method: 'Bank Transfer' },
  // Pending
  { id: 7, date: '1-22-26', transactionId: '9F3A8C2B71', applicationId: 'BUH-A9F3K2', name: 'Adebola Ogunsiwaju', level: 'UG', amount: 'N7000', status: 'Pending', method: '' },
  { id: 8, date: '1-22-26', transactionId: 'C82F9A1D7E', applicationId: 'BUH-7XQ82M', name: 'Funke Adebayo', level: 'UG', amount: 'N7000', status: 'Pending', method: '' },
  { id: 9, date: '1-22-26', transactionId: 'F5A39C7D21', applicationId: 'BUH-3LZ91R', name: 'Funke Adebayo', level: 'PG', amount: 'N20500', status: 'Pending', method: '' },
  { id: 10, date: '1-22-26', transactionId: '9F3A8C2B71', applicationId: 'BUH-A9F3K2', name: 'Adebola Ogunsiwaju', level: 'UG', amount: 'N7000', status: 'Pending', method: '' },
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
    <div className="bg-white min-h-screen p-4 sm:p-8">
      {/* Title */}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Applicant Payments</h1>
        <p className="text-gray-500 text-sm font-medium">Keep track of all application fees</p>
      </div>

      {/* Tabs + icons row */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        {/* Status tabs - Scrollable on mobile */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 w-full sm:w-auto no-scrollbar">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => { setActiveTab(tab); setSearchQuery(''); }}
              className={`px-6 py-2 rounded-full text-sm font-semibold transition-all shrink-0 ${activeTab === tab
                ? 'bg-[#003B95] text-white shadow-md'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
            >
              {tab === 'Successful' ? 'Successful' : tab}
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
      <div className="overflow-x-auto rounded-2xl border border-gray-100 shadow-sm no-scrollbar">
        <table className="w-full text-sm border-collapse min-w-[1000px]">
          <thead>
            <tr className="bg-[#003B95] text-white">
              <th className="text-left px-6 py-4 font-black uppercase tracking-widest text-[10px] rounded-tl-2xl">Date</th>
              <th className="text-left px-6 py-4 font-black uppercase tracking-widest text-[10px]">Transaction ID</th>
              <th className="text-left px-6 py-4 font-black uppercase tracking-widest text-[10px]">Application ID</th>
              <th className="text-left px-6 py-4 font-black uppercase tracking-widest text-[10px]">Name</th>
              <th className="text-left px-6 py-4 font-black uppercase tracking-widest text-[10px]">Level</th>
              <th className="text-left px-6 py-4 font-black uppercase tracking-widest text-[10px]">Amount</th>
              <th className="text-left px-6 py-4 font-black uppercase tracking-widest text-[10px]">Status</th>
              <th className="text-left px-6 py-4 font-black uppercase tracking-widest text-[10px] rounded-tr-2xl">Method</th>
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
                  className={`border-b border-gray-50 ${idx % 2 === 0 ? 'bg-white' : 'bg-[#F9FAFB]'} hover:bg-blue-50/50 transition-colors`}
                >
                  <td className="px-6 py-4 text-gray-600 font-medium">{payment.date}</td>
                  <td className="px-6 py-4 text-gray-500 font-mono text-xs">{payment.transactionId}</td>
                  <td className="px-6 py-4 text-gray-600 font-bold">{payment.applicationId}</td>
                  <td className="px-6 py-4 text-gray-900 font-bold">{payment.name}</td>
                  <td className="px-6 py-4 text-gray-600 font-medium">{payment.level}</td>
                  <td className="px-6 py-4 text-gray-900 font-black">{payment.amount}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${payment.status === 'Successful' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                        }`}
                    >
                      {payment.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-500 text-xs font-medium">{payment.method || '—'}</td>
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
