import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useAssignments } from '../context/AssignmentsContext.jsx';

const ApplicationView = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { assignments } = useAssignments();
  const assignment = assignments.find(a => String(a.id) === String(id));
  const applicationId = assignment?.applicationCode || `BUH-${id}`;

  return (
    <div className="min-h-screen bg-[#F3F4F6] flex flex-col">
      <header className="bg-white px-4 sm:px-6 py-4 flex items-center justify-between border-b border-gray-200 sticky top-0 z-30">
        <div className="flex items-center space-x-3 sm:space-x-6 overflow-hidden">
          <button 
            onClick={() => navigate(-1)} 
            aria-label="Go back"
            className="p-2 hover:bg-gray-100 rounded-full transition-colors shrink-0"
          >
            <ArrowLeft size={24} className="text-black" />
          </button>
          <div className="overflow-hidden">
            <h1 className="text-lg sm:text-xl font-bold text-gray-900 leading-tight truncate">Application Details</h1>
            <div className="mt-1 text-[10px] sm:text-sm text-gray-600">
              <span className="font-medium">Application ID: </span>
              <span className="text-blue-600 font-medium">{applicationId}</span>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 p-6 sm:p-12 overflow-y-auto">
        <div className="bg-white rounded-2xl p-8 max-w-4xl mx-auto shadow-md text-center">
          <h2 className="text-2xl font-bold mb-6">The impact of sleep deprivation on academic performance among university students</h2>

          <div className="space-y-4 text-gray-800 font-medium mb-8">
            <p>Ademide Sharon 22/0889</p>
            <p>Amaka Hadiyat 22/8787</p>
            <p>Babcock University</p>
            <p>School of Computing — Computer Science</p>
            <p>Category: UG</p>
            <p>Supervisor: Dr Falala David</p>
          </div>

          <div className="mt-6">
            <a href="/ethical-clearance-sample.pdf" download className="text-blue-600 font-bold">Application letter for ethical clearance</a>
            <p className="text-sm text-gray-500 mt-2">(Your download will continue in the background)</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ApplicationView;
