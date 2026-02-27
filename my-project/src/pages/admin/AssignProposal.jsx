import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, ChevronDown, Check } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { assignReviewer } from '../../features/assignments/assignmentsSlice';

const CATEGORIES = [
    'Public Health, Nursing, G...',
    'Clinical Psychology',
    'Anatomy & Cell Biology',
    'Biomedical Sciences',
    'Other',
];

const PROPOSAL_LEVELS = ['UG', 'PG', 'PhD', 'Masters'];

// Reviewer data - MOVED TO REDUX
const REVIEWERS_LIST = [];

// ── Confirmation Modal ─────────────────────────────────────────────────────────
const ConfirmModal = ({ onClose, onConfirm }) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={onClose} />
        <div className="relative bg-white rounded-2xl p-10 w-full max-w-sm shadow-2xl text-center">
            <button onClick={onClose} className="absolute right-4 top-4 p-1.5 hover:bg-gray-100 rounded-full">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M1 1l12 12M13 1L1 13" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" /></svg>
            </button>
            <p className="text-lg font-bold text-gray-900 mb-6">You are about to assign a proposal</p>
            <button
                onClick={onConfirm}
                className="bg-[#003B95] text-white px-10 py-3 rounded-full font-bold text-sm hover:bg-blue-900 transition-colors"
            >
                Proceed
            </button>
        </div>
    </div>
);

// ── Success Screen ─────────────────────────────────────────────────────────────
const SuccessScreen = ({ title, date, onBack }) => (
    <div className="min-h-screen bg-[#F3F4F6] flex flex-col">
        <button onClick={onBack} className="p-4 hover:bg-gray-200 rounded-full self-start m-4 transition-colors">
            <ArrowLeft size={22} className="text-gray-800" />
        </button>
        <div className="flex-1 flex flex-col items-center justify-center px-8 text-left max-w-xl mx-auto w-full">
            <p className="text-[#003B95] font-bold text-sm mb-2">You have successfully assigned</p>
            <h2 className="text-xl font-bold text-gray-900 leading-snug mb-2">{title}</h2>
            <p className="text-sm text-gray-500 mb-10">{date}</p>
            <button
                onClick={onBack}
                className="bg-[#003B95] text-white px-8 py-3 rounded-full font-bold text-sm hover:bg-blue-900 transition-colors"
            >
                Back to Assignments
            </button>
        </div>
    </div>
);

// ── Main Page ──────────────────────────────────────────────────────────────────
const AssignProposal = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { id } = useParams();

    const assignments = useSelector(s => s.assignments.items);
    const reviewersList = useSelector(s => s.reviewers.items);
    const assignment = assignments.find(a => String(a.id) === String(id));

    const [category, setCategory] = useState(CATEGORIES[0]);
    const [level] = useState('UG');
    const [selectedReviewerId, setSelectedReviewerId] = useState(null);
    const [showConfirm, setShowConfirm] = useState(false);
    const [done, setDone] = useState(false);

    const title = assignment?.title ?? 'Untitled Proposal';
    const date = assignment?.date
        ? new Date(assignment.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'numeric', year: 'numeric' })
        : 'No Assignment Date';

    const handleConfirm = () => {
        if (selectedReviewerId) {
            dispatch(assignReviewer({ assignmentId: Number(id), reviewerId: selectedReviewerId }));
        }
        setShowConfirm(false);
        setDone(true);
    };

    if (done) {
        return (
            <SuccessScreen
                title={title}
                date={date}
                onBack={() => navigate('/dashboard/assignments')}
            />
        );
    }

    return (
        <div className="min-h-screen bg-[#F3F4F6]">
            {/* Back button */}
            <button
                onClick={() => navigate(-1)}
                className="p-4 hover:bg-gray-200 rounded-full m-4 transition-colors inline-flex"
            >
                <ArrowLeft size={22} className="text-gray-800" />
            </button>

            <div className="max-w-2xl mx-auto px-6 pb-16">
                {/* Header */}
                <div className="mt-2 sm:mt-0">
                    <p className="text-[#003B95] font-black uppercase tracking-widest text-[10px] mb-2 sm:mb-1">You are about to assign...</p>
                    <h1 className="text-xl sm:text-2xl font-black text-gray-900 leading-tight mb-2 sm:mb-1 pr-4">{title}</h1>
                    <p className="text-xs sm:text-sm font-black text-gray-400 uppercase tracking-widest mb-8">{date}</p>
                </div>

                {/* Proposal categories + Level */}
                <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 mb-10 w-full">
                    {/* Category dropdown */}
                    <div className="flex-1 w-full">
                        <label className="block text-xs font-black uppercase tracking-widest text-gray-800 mb-2">Proposal category</label>
                        <div className="relative">
                            <select
                                value={category}
                                onChange={e => setCategory(e.target.value)}
                                className="w-full appearance-none bg-[#F3F4F6] border border-gray-200 rounded-xl px-4 py-3 sm:py-3.5 pr-10 text-sm font-bold text-gray-800 outline-none focus:ring-2 focus:ring-[#003B95] transition-all shadow-sm"
                            >
                                {CATEGORIES.map(c => (
                                    <option key={c} value={c}>{c}</option>
                                ))}
                            </select>
                            <ChevronDown size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#003B95] pointer-events-none" />
                        </div>
                    </div>

                    {/* Level (read-only) */}
                    <div className="w-full sm:w-40 shrink-0">
                        <label className="block text-xs font-black uppercase tracking-widest text-gray-800 mb-2">Proposal Level</label>
                        <div className="bg-[#F3F4F6] border border-gray-200 rounded-xl px-4 py-3 sm:py-3.5 text-sm text-gray-800 font-bold shadow-sm">
                            {level}
                        </div>
                    </div>
                </div>

                {/* Assign Reviewer */}
                <div className="mb-8">
                    <h2 className="text-base font-bold text-gray-900 mb-3">Assign Reviewer</h2>

                    {/* Select Reviewer — functional dropdown */}
                    <div className="relative mb-4">
                        <select
                            value={selectedReviewerId ?? ''}
                            onChange={e => setSelectedReviewerId(e.target.value ? Number(e.target.value) : null)}
                            className="w-full appearance-none bg-[#E5E7EB] rounded-xl px-4 py-3 pr-10 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-[#003B95] transition-all"
                        >
                            <option value="">Select Reviewer</option>
                            {reviewersList.map(r => (
                                <option key={r.id} value={r.id}>{r.name} — {r.specialization}</option>
                            ))}
                        </select>
                        <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                    </div>

                    {/* Reviewer list */}
                    <div className="space-y-px">
                        {reviewersList.map(r => (
                            <button
                                key={r.id}
                                onClick={() => setSelectedReviewerId(r.id)}
                                className={`w-full flex items-center justify-between px-4 py-4 transition-colors text-left rounded-lg ${selectedReviewerId === r.id
                                    ? 'bg-blue-50'
                                    : 'hover:bg-gray-100'
                                    }`}
                            >
                                <div>
                                    <p className="font-semibold text-gray-900 text-sm">{r.name}</p>
                                    <p className="text-xs text-[#003B95] mt-0.5">{r.ongoingAssignments || 0} assignments</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-sm font-bold text-[#003B95]">{r.specialization}</span>
                                    {selectedReviewerId === r.id && (
                                        <Check size={16} className="text-[#003B95] shrink-0" />
                                    )}
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Assign button */}
                <div className="flex justify-center mt-8">
                    <button
                        onClick={() => selectedReviewerId && setShowConfirm(true)}
                        disabled={!selectedReviewerId}
                        className={`px-10 py-3 rounded-full font-bold text-sm transition-colors ${selectedReviewerId
                            ? 'bg-[#003B95] text-white hover:bg-blue-900'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            }`}
                    >
                        Assign Assignment
                    </button>
                </div>
            </div>

            {/* Confirm modal */}
            {showConfirm && (
                <ConfirmModal
                    onClose={() => setShowConfirm(false)}
                    onConfirm={handleConfirm}
                />
            )}
        </div>
    );
};

export default AssignProposal;
