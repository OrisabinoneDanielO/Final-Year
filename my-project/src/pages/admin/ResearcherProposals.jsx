import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useSelector } from 'react-redux';

// Just grabbing the same list from Researchers.jsx for simplicity in this view
const DUMMY_RESEARCHERS = [
    { id: 1, name: 'Anaise Chem' },
    { id: 2, name: 'Ademide Sharon' },
    { id: 3, name: 'Amaka Hadiyat' },
    { id: 4, name: 'Balogun Fatima Ola' },
    { id: 5, name: 'Okafor Chinwe David' },
];

const TABS = ['Unaccepted', 'Not Reviewed', 'Ongoing', 'Completed'];

const ResearcherProposals = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [activeTab, setActiveTab] = useState('Unaccepted');

    // Find researcher name
    const researcher = DUMMY_RESEARCHERS.find(r => r.id === Number(id));
    const researcherName = researcher ? researcher.name : 'Researcher';

    // Get all assignments from Redux (simulating researcher's proposals)
    const allAssignments = useSelector(s => s.assignments.items);
    const reviewers = useSelector(s => s.reviewers.items);

    // Filter assignments based on the active tab status
    // For demo purposes, we just map the tabs roughly to the possible statuses
    const proposals = allAssignments.filter(a => {
        if (activeTab === 'Unaccepted') return a.status === 'Unaccepted';
        if (activeTab === 'Not Reviewed') return a.status === 'Not Reviewed';
        if (activeTab === 'Ongoing') return a.status === 'Ongoing';
        if (activeTab === 'Completed') return a.status === 'Completed';
        return true;
    });

    const getStatusColor = (status) => {
        switch (status) {
            case 'Unaccepted': return 'text-gray-500';
            case 'Not Reviewed': return 'text-[#C10000]';
            case 'Ongoing': return 'text-yellow-600';
            case 'Completed': return 'text-[#003B95]';
            default: return 'text-gray-500';
        }
    };

    const getStatusLabel = (status) => {
        switch (status) {
            case 'Unaccepted': return 'Unassigned';
            case 'Not Reviewed': return 'Review Rejected';
            case 'Ongoing': return 'Review Approved'; // Using 'Review Approved' (blue) based on screenshots context for ongoing/completed
            case 'Completed': return 'Completed';
            default: return status;
        }
    };

    const getButtonColor = (status) => {
        // In the screenshot: top button is blue (Unaccepted?), middle is green (Rejected review?), bottom is green (Approved review?)
        // We'll just map roughly: 'Not Reviewed'/Rejected -> green button, 'Ongoing'/Approved -> green button, Unaccepted -> blue button
        if (status === 'Unaccepted') return 'bg-[#003B95] hover:bg-blue-900';
        return 'bg-[#10B981] hover:bg-emerald-600'; // Green button for others
    };

    const statusTextColor = (status) => {
        if (status === 'Not Reviewed') return 'text-[#C10000]'; // Red "Review Rejected"
        if (status === 'Ongoing' || status === 'Completed') return 'text-[#003B95]'; // Blue "Review Approved"
        return '';
    }

    return (
        <div className="min-h-screen bg-[#F3F4F6] p-6">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                        <ArrowLeft size={20} className="text-gray-800" />
                    </button>
                    <h1 className="text-xl font-bold text-gray-900">Researcher's Proposals</h1>
                </div>

                {/* Tabs - Scrollable on mobile */}
                <div className="mb-8 overflow-x-auto pb-2 no-scrollbar">
                    <div className="flex gap-2 bg-white/50 p-1.5 rounded-full inline-flex min-w-max">
                        {TABS.map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-5 py-2 rounded-full text-sm font-semibold transition-all whitespace-nowrap ${activeTab === tab
                                    ? 'bg-white shadow-sm text-gray-900'
                                    : 'text-gray-500 hover:text-gray-700 hover:bg-white/40'
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Proposals List */}
                <div className="space-y-4">
                    {proposals.length === 0 ? (
                        <p className="text-gray-400 font-medium text-center py-10">No proposals in this category.</p>
                    ) : (
                        proposals.map(proposal => {
                            const reviewer = reviewers.find(r => r.id === proposal.reviewerId);

                            return (
                                <div key={proposal.id} className="bg-white rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 transition-all hover:shadow-md">
                                    <div className="flex-1 min-w-0">
                                        {/* Status Label (e.g. Review Rejected / Review Approved) */}
                                        {proposal.status !== 'Unaccepted' && (
                                            <p className={`text-[10px] font-black uppercase tracking-[0.2em] mb-2 ${statusTextColor(proposal.status)}`}>
                                                {getStatusLabel(proposal.status)}
                                            </p>
                                        )}

                                        <h3 className="font-bold text-gray-900 text-base leading-tight mb-3">
                                            {proposal.title}
                                        </h3>

                                        {reviewer && (
                                            <div className="flex items-center gap-2 bg-gray-50 w-fit px-3 py-1.5 rounded-full border border-gray-100">
                                                <div className="w-6 h-6 rounded-full bg-[#003B95]/10 flex items-center justify-center text-[#003B95] font-bold text-[9px] overflow-hidden">
                                                    {reviewer.avatar ? <img src={reviewer.avatar} alt="R" className="w-full h-full object-cover" /> : reviewer.name.slice(0, 2).toUpperCase()}
                                                </div>
                                                <p className="text-xs text-gray-600 font-bold">{reviewer.name}</p>
                                            </div>
                                        )}
                                    </div>

                                    <button
                                        onClick={() => navigate(`/dashboard/assignments/${proposal.id}/view`)}
                                        className={`w-full sm:w-auto px-8 py-3 rounded-full text-white text-[11px] font-black uppercase tracking-widest transition-all shrink-0 shadow-sm active:scale-95 ${getButtonColor(proposal.status)}`}
                                    >
                                        View Details
                                    </button>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
};

export default ResearcherProposals;
