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
        <div className="text-center py-20 bg-gray-50 rounded-3xl border border-gray-100 border-dashed">
          <p className="text-gray-400 font-black tracking-wide text-lg">No responses at this time</p>
        </div>
      ) : (
        <div className="space-y-4">
          {responsesData.map((msg) => (
            <div key={msg.id} className="bg-[#F9FAFB] hover:bg-white rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 shadow-sm border border-gray-100 hover:shadow-md transition-all">
              <div className="flex items-start gap-4 flex-1 min-w-0">
                <div className="flex flex-col items-start min-w-0">
                  <div className="flex items-center gap-2 mb-2 bg-blue-50 w-fit px-3 py-1 rounded-full border border-blue-100">
                    <span className="w-2 h-2 rounded-full bg-[#003B95] animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#003B95]">Changes Effected</span>
                  </div>
                  <p className="text-base sm:text-lg font-black text-gray-900 leading-tight pr-2">{msg.subject}</p>
                </div>
              </div>

              <div className="flex-shrink-0 w-full sm:w-auto mt-2 sm:mt-0">
                <button
                  onClick={() => navigate(`/dashboard/review-details/${msg.assignmentId}`)}
                  className="w-full sm:w-auto bg-[#003B95] text-white px-8 py-3.5 rounded-full font-black text-[11px] uppercase tracking-widest shadow-md hover:bg-blue-900 transition-all active:scale-95"
                >
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