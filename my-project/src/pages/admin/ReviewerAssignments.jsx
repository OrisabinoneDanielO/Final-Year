import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useSelector } from 'react-redux';

// Same reviewer data as ReviewerProfile
const REVIEWERS_DATA = [
  { id: 1, name: 'Prof. Imisioluwa Hannah' },
  { id: 2, name: 'Prof. Adeyemi Samuel' },
  { id: 3, name: 'Dr. Okafor Chinwe' },
  { id: 4, name: 'Prof. Adetunde Adeyemo' },
  { id: 5, name: 'Dr. Balogun Fatima' },
];

const STATUS_TABS = ['Unaccepted', 'Not Reviewed', 'Ongoing', 'Completed'];

const ReviewerAssignments = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('Ongoing');

  const reviewer = REVIEWERS_DATA.find(r => String(r.id) === String(id));

  // Pull assignments from Redux store
  const allAssignments = useSelector(s => s.assignments.items);

  // Filter by the active status tab
  const filteredAssignments = allAssignments.filter(a => a.status === activeTab);

  return (
    <div className="min-h-screen bg-[#F3F4F6] p-6 sm:p-10">
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="p-2 hover:bg-gray-200 rounded-full transition-colors mb-6"
      >
        <ArrowLeft size={24} className="text-gray-900" />
      </button>

      {/* Title */}
      <h1 className="text-2xl font-bold text-gray-900 mb-1">
        {reviewer ? `${reviewer.name.split(' ').slice(-1)[0]}'s` : "Reviewer's"} Assignments
      </h1>

      {/* Status Filter Tabs */}
      <div className="flex space-x-3 mt-6 mb-8 overflow-x-auto pb-2">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-2 rounded-full text-sm font-semibold transition-all whitespace-nowrap ${
              activeTab === tab
                ? 'bg-[#003B95] text-white'
                : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-100'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Assignments List */}
      <div className="space-y-4">
        {filteredAssignments.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-400 font-bold text-lg">No {activeTab.toLowerCase()} assignments</p>
          </div>
        ) : (
          filteredAssignments.map((assignment) => (
            <div
              key={assignment.id}
              className="bg-white p-6 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-sm"
            >
              <div className="flex-1">
                {/* Changes indicator */}
                {assignment.hasChanges && (
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#003B95]" />
                    <span className="text-sm font-bold text-[#003B95]">Changes Effected By Researcher</span>
                  </div>
                )}

                {/* Completed result indicator */}
                {activeTab === 'Completed' && assignment.reviewResult && (
                  <p className={`text-xs font-bold mb-1 ${
                    assignment.reviewResult === 'accepted' ? 'text-[#003B95]' : 'text-[#C10000]'
                  }`}>
                    {assignment.reviewResult === 'accepted' ? 'Review Accepted' : 'Review Rejected'}
                  </p>
                )}

                <p className="text-base font-bold text-gray-900 leading-snug">{assignment.title}</p>
              </div>

              <button
                onClick={() => navigate(`/dashboard/review-details/${assignment.id}`)}
                className="bg-[#003B95] text-white px-6 py-2.5 rounded-full font-bold text-sm hover:bg-blue-900 transition-colors flex-shrink-0"
              >
                View Details
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ReviewerAssignments;
