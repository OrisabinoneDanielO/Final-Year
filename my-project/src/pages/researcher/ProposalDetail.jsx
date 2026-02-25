import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

const DUMMY_REVIEWER_COMMENT_REJECTED =
  'The proposal is not feasible as I feel that the project poses risk without any guarantee of significant findings';

const ProposalDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const assignments = useSelector((s) => s.assignments.items);
  const comments = useSelector((s) => s.assignments.comments);

  const item = assignments.find((a) => String(a.id) === String(id));

  if (!item) {
    return (
      <div className="min-h-screen bg-[#F3F4F6] flex flex-col items-center justify-center p-8">
        <p className="text-gray-500 font-bold mb-4">Proposal not found.</p>
        <button
          onClick={() => navigate('/dashboard/submissions')}
          className="bg-[#003B95] text-white px-6 py-2.5 rounded-full font-bold"
        >
          Back to proposals
        </button>
      </div>
    );
  }

  const isAccepted = item.reviewResult === 'accepted';
  const isRejected = item.reviewResult === 'rejected';

  // Get reviewer comment for this assignment (latest one)
  const reviewerComment = comments
    .filter((c) => String(c.assignmentId) === String(id))
    .sort((a, b) => new Date(b.date) - new Date(a.date))[0];

  const commentText = reviewerComment?.text || (isRejected ? DUMMY_REVIEWER_COMMENT_REJECTED : null);

  const headerColor = isAccepted ? 'text-[#003B95]' : isRejected ? 'text-[#C10000]' : 'text-gray-700';
  const headerText = isAccepted
    ? 'Your proposal was approved'
    : isRejected
    ? 'Your proposal was rejected'
    : 'Proposal details';

  const btnColor = isRejected
    ? 'bg-[#C10000] hover:bg-red-700'
    : 'bg-[#003B95] hover:bg-blue-900';

  return (
    <div className="min-h-screen bg-[#F3F4F6] flex flex-col items-center justify-center p-8">
      <div className="w-full max-w-2xl">
        {/* Status headline */}
        <p className={`text-sm font-bold mb-2 ${headerColor}`}>{headerText}</p>

        {/* Title & date */}
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 leading-snug mb-1">
          {item.title}
        </h1>
        <p className="text-sm text-gray-500 mb-10">
          Assigned {item.date ? new Date(item.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'numeric', year: 'numeric' }) : '—'}
        </p>

        {/* Comment / reviewer feedback */}
        <p className={`text-sm ${commentText ? 'text-gray-600' : 'text-gray-400'} mb-16 leading-relaxed`}>
          {commentText || 'No additional comment provided'}
        </p>

        {/* Back button */}
        <div className="flex justify-center">
          <button
            onClick={() => navigate('/dashboard/submissions')}
            className={`${btnColor} text-white px-8 py-3 rounded-full font-bold text-sm transition-colors`}
          >
            Back to proposals
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProposalDetail;
