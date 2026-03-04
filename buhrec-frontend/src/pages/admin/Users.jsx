import React, { useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Search } from 'lucide-react';

const Users = () => {
  const user = useSelector((s) => s.auth.user);
  const reviewers = useSelector((s) => s.reviewers.items);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('All');

  // Build a unified user list from all available sources
  const allUsers = useMemo(() => {
    const users = [];

    // Current logged-in user (admin)
    if (user) {
      users.push({
        id: `auth-${user.email}`,
        name: user.name || user.email?.split('@')[0] || 'Unknown',
        email: user.email || '—',
        role: user.role || 'admin',
        status: 'Active',
      });
    }

    // Reviewers from Redux
    reviewers.forEach((r) => {
      users.push({
        id: `reviewer-${r.id}`,
        name: r.name,
        email: r.email || '—',
        role: 'reviewer',
        status: 'Active',
        institution: r.institution,
      });
    });

    return users;
  }, [user, reviewers]);

  const TABS = ['All', 'Admin', 'Reviewer', 'Researcher'];

  const filteredUsers = useMemo(() => {
    let result = allUsers;
    if (activeTab !== 'All') {
      result = result.filter((u) => u.role.toLowerCase() === activeTab.toLowerCase());
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (u) =>
          u.name.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q) ||
          u.role.toLowerCase().includes(q)
      );
    }
    return result;
  }, [allUsers, activeTab, searchQuery]);

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'admin':
        return 'bg-purple-100 text-purple-700';
      case 'reviewer':
        return 'bg-blue-100 text-[#003B95]';
      case 'researcher':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getInitials = (name) =>
    name
      ?.split(' ')
      .map((n) => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase() || '??';

  return (
    <div className="bg-white min-h-screen p-4 sm:p-6 lg:p-8">
      <header className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Manage Users</h1>
        <p className="text-gray-500 text-sm font-medium mt-1">
          {allUsers.length} registered user{allUsers.length !== 1 ? 's' : ''}
        </p>
      </header>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${
              activeTab === tab
                ? 'bg-[#003B95] text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by name, email, or role..."
          className="w-full bg-[#F3F4F6] rounded-xl pl-10 pr-4 py-3 text-sm outline-none border border-transparent focus:border-[#003B95] transition-colors"
        />
      </div>

      {/* Users List */}
      <div className="space-y-3">
        {filteredUsers.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400 font-bold text-lg">No users found</p>
          </div>
        ) : (
          filteredUsers.map((u) => (
            <div
              key={u.id}
              className="bg-[#F3F4F6] rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-[#003B95]/20 flex items-center justify-center text-[#003B95] font-bold text-sm shrink-0">
                  {getInitials(u.name)}
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-sm">{u.name}</p>
                  <p className="text-gray-500 text-xs">{u.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span
                  className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${getRoleBadgeColor(
                    u.role
                  )}`}
                >
                  {u.role}
                </span>
                <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-green-50 text-green-600">
                  {u.status}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Users;
