import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';

// Dummy reviewer data matching the design
const DUMMY_REVIEWERS = [
  { id: 1, name: 'Prof. Imisioluwa Hannah', specialization: 'Public Health & Epidemiology', institution: 'Babcock University', title: 'Prof.', yearsInPractice: 15, ongoingAssignments: 10, avatar: null },
  { id: 2, name: 'Prof. Adeyemi Samuel', specialization: 'Clinical Psychology', institution: 'Babcock University', title: 'Prof.', yearsInPractice: 12, ongoingAssignments: 8, avatar: null },
  { id: 3, name: 'Dr. Okafor Chinwe', specialization: 'Anatomy & Cell Biology', institution: 'Babcock University', title: 'Dr.', yearsInPractice: 8, ongoingAssignments: 5, avatar: null },
  { id: 4, name: 'Prof. Adetunde Adeyemo', specialization: 'Biomedical Sciences', institution: 'Babcock University', title: 'Prof.', yearsInPractice: 20, ongoingAssignments: 12, avatar: null },
  { id: 5, name: 'Dr. Balogun Fatima', specialization: 'Public Health & Epidemiology', institution: 'Babcock University', title: 'Dr.', yearsInPractice: 6, ongoingAssignments: 3, avatar: null },
];

const FILTER_OPTIONS = ['Title', 'Years in Practice', 'Specialization', 'Institution'];

const Reviewers = () => {
  const [activeFilter, setActiveFilter] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredReviewers = DUMMY_REVIEWERS.filter(r =>
    r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.specialization.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-8 bg-white min-h-screen">
      <header className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Registered Reviewers</h1>
          <p className="text-gray-500 text-sm font-medium">Here are all registered reviewers!</p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-[#003B95] text-white px-6 py-2.5 rounded-full font-bold hover:bg-blue-900 transition-colors text-sm"
        >
          Add Reviewer
        </button>
      </header>

      {/* Filter Tabs */}
      <div className="flex space-x-4 mb-8">
        {FILTER_OPTIONS.map((option) => (
          <button
            key={option}
            onClick={() => setActiveFilter(activeFilter === option ? null : option)}
            className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${
              activeFilter === option
                ? 'bg-[#003B95] text-white'
                : 'bg-transparent text-gray-600 hover:bg-gray-100'
            }`}
          >
            {option}
          </button>
        ))}
      </div>

      {/* Reviewers List */}
      <div className="space-y-3">
        {filteredReviewers.map((reviewer) => (
          <div
            key={reviewer.id}
            className="bg-[#F3F4F6] p-5 rounded-2xl flex items-center justify-between hover:shadow-sm transition-shadow"
          >
            <div className="flex items-center space-x-4">
              {/* Avatar */}
              <div className="w-12 h-12 rounded-full bg-gray-300 overflow-hidden border-2 border-gray-200 flex-shrink-0">
                {reviewer.avatar ? (
                  <img src={reviewer.avatar} alt={reviewer.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-[#003B95]/20 flex items-center justify-center text-[#003B95] font-bold text-lg">
                    {reviewer.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </div>
                )}
              </div>
              <div>
                <p className="font-bold text-gray-900">{reviewer.name}</p>
                <p className="text-gray-500 text-sm">{reviewer.specialization}</p>
              </div>
            </div>
            <div className="text-[#003B95] font-semibold text-sm">
              {reviewer.ongoingAssignments} ongoing assignments
            </div>
          </div>
        ))}
      </div>

      {filteredReviewers.length === 0 && (
        <div className="text-center py-20">
          <p className="text-gray-400 font-bold text-lg">No reviewers found</p>
        </div>
      )}

      {/* Add Reviewer Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setIsAddModalOpen(false)} />
          <div className="relative bg-white rounded-2xl p-8 w-full max-w-lg shadow-2xl">
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="absolute right-6 top-6 text-gray-400 hover:text-gray-600"
            >
              <X size={24} />
            </button>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Add a Reviewer</h2>
            <p className="text-gray-400 text-sm mb-6">Fill in the details below to register a new reviewer</p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">Full Name</label>
                <input type="text" className="w-full bg-[#F3F4F6] rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. Prof. John Smith" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">Title</label>
                <select className="w-full bg-[#F3F4F6] rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500">
                  <option>Prof.</option>
                  <option>Dr.</option>
                  <option>Mr.</option>
                  <option>Mrs.</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">Specialization</label>
                <input type="text" className="w-full bg-[#F3F4F6] rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. Public Health & Epidemiology" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">Institution</label>
                <input type="text" className="w-full bg-[#F3F4F6] rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. Babcock University" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">Years in Practice</label>
                <input type="number" className="w-full bg-[#F3F4F6] rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. 10" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">Email</label>
                <input type="email" className="w-full bg-[#F3F4F6] rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. reviewer@university.edu" />
              </div>
            </div>

            <div className="mt-8 flex justify-center">
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="bg-[#003B95] text-white px-10 py-3 rounded-full font-bold hover:bg-blue-900 transition-colors"
              >
                Add Reviewer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reviewers;
