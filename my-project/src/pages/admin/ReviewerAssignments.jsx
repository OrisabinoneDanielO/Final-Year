import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, UserMinus } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { unassignReviewer } from '../../features/assignments/assignmentsSlice';

const STATUS_TABS = ['Not Reviewed', 'Ongoing', 'Completed'];

const ReviewerAssignments = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('Not Reviewed');
  const [confirmUnassign, setConfirmUnassign] = useState(null); // assignment to unassign

  const reviewerId = Number(id);
  const reviewers = useSelector(s => s.reviewers.items);
  const reviewer = reviewers.find(r => r.id === reviewerId);

  // Filter by this reviewer AND the active status tab
  const allAssignments = useSelector(s => s.assignments.items);
  const filteredAssignments = allAssignments.filter(
    a => a.reviewerId === reviewerId && a.status === activeTab
  );

  const handleUnassign = (assignmentId) => {
    dispatch(unassignReviewer(assignmentId));
    setConfirmUnassign(null);
  };

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
        {reviewer ? `${reviewer.name}'s` : "Reviewer's"} Assignments
      </h1>
      <p className="text-sm text-gray-500 mb-6">Proposals assigned to this reviewer</p>

      {/* Status Filter Tabs */}
      <div className="flex space-x-3 mb-8 overflow-x-auto pb-2">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-2 rounded-full text-sm font-semibold transition-all whitespace-nowrap ${activeTab === tab
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
                {assignment.hasChanges && (
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#003B95]" />
                    <span className="text-sm font-bold text-[#003B95]">Changes Effected By Researcher</span>
                  </div>
                )}
                {activeTab === 'Completed' && assignment.reviewResult && (
                  <p className={`text-xs font-bold mb-1 ${assignment.reviewResult === 'accepted' ? 'text-[#003B95]' : 'text-[#C10000]'
                    }`}>
                    {assignment.reviewResult === 'accepted' ? 'Review Accepted' : 'Review Rejected'}
                  </p>
                )}
                <p className="text-base font-bold text-gray-900 leading-snug">{assignment.title}</p>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                {/* Unassign — only for non-completed */}
                {activeTab !== 'Completed' && (
                  <button
                    onClick={() => setConfirmUnassign(assignment)}
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-full border border-[#C10000] text-[#C10000] font-bold text-sm hover:bg-red-50 transition-colors"
                  >
                    <UserMinus size={14} />
                    Unassign
                  </button>
                )}
                <button
                  onClick={() => navigate(`/dashboard/reviewers/${id}/assignments/${assignment.id}/view`)}
                  className="bg-[#003B95] text-white px-6 py-2.5 rounded-full font-bold text-sm hover:bg-blue-900 transition-colors"
                >
                  View Details
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Unassign Confirm Modal */}
      {confirmUnassign && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setConfirmUnassign(null)} />
          <div className="relative bg-white rounded-2xl p-8 w-full max-w-sm shadow-2xl text-center">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Unassign Reviewer?</h2>
            <p className="text-gray-400 text-sm mb-6 leading-relaxed">
              This will remove <span className="font-semibold text-gray-700">{reviewer?.name}</span> from&nbsp;
              "<span className="font-semibold text-gray-700">{confirmUnassign.title}</span>" and return it to the unassigned pool.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmUnassign(null)}
                className="flex-1 py-3 rounded-full bg-gray-200 text-gray-800 font-bold hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleUnassign(confirmUnassign.id)}
                className="flex-1 py-3 rounded-full bg-[#C10000] text-white font-bold hover:bg-red-700 transition-colors"
              >
                Unassign
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewerAssignments;
