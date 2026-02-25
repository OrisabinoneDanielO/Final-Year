import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Responses = () => {
  const navigate = useNavigate();
  const assignments = useSelector(s => s.assignments.items);

  // Show assignments that have researcher changes
  const responsesData = assignments
    .filter(a => a.hasChanges && (a.status === 'Ongoing' || a.status === 'Not Reviewed'))
    .map(a => ({
      id: a.id,
      assignmentId: a.id,
      subject: a.title,
      applicationCode: a.applicationCode,
    }));

  return (
    <div className="flex flex-col min-h-full">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Your Responses</h1>
        <p className="text-gray-500 font-medium">The following proposals have changes effected by the researchers</p>
      </header>

      {responsesData.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-400 font-bold text-lg">No responses at this time</p>
        </div>
      ) : (
        <div className="space-y-6">
          {responsesData.map((msg) => (
            <div key={msg.id} className="bg-[#E5E7EB] rounded-2xl p-6 flex items-center justify-between gap-4 shadow-sm border border-gray-100">
              <div className="flex items-start gap-4">
                <div className="flex flex-col items-start">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#003B95]" />
                    <span className="text-sm font-bold text-[#003B95]">Changes Effected By Researcher</span>
                  </div>
                  <p className="text-lg font-bold text-gray-900 max-w-3xl">{msg.subject}</p>
                </div>
              </div>

              <div className="flex-shrink-0">
                <button onClick={() => navigate(`/dashboard/review-details/${msg.assignmentId}`)} className="bg-[#003B95] text-white px-5 py-2.5 rounded-full font-semibold hover:bg-[#002b76] transition">
                  Continue Review
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Responses;