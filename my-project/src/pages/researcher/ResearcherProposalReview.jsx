import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchComments } from '../../features/comments/commentsSlice';
import { ArrowLeft } from 'lucide-react';

const SECTIONS = ['Information', 'Chapter 1', 'Chapter 2', 'Chapter 3', 'References', 'Appendices'];

const DUMMY_REVIEWER = {
    name: 'Prof. Imisioluwa Hannah',
    initials: 'IH',
};

// DUMMY_COMMENTS removed - will use Redux store


const ResearcherProposalReview = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const assignments = useSelector((s) => s.proposals.items);
    const allComments = useSelector((s) => s.comments.items);
    const reviewersList = useSelector((s) => s.reviewers.items);
    const item = assignments.find((a) => String(a.id) === String(id));

    useEffect(() => {
        if (id) dispatch(fetchComments(id));
    }, [dispatch, id]);

    // Resolve the actual reviewer from Redux instead of using a hardcoded dummy
    const reviewer = reviewersList.find((r) => r.id === item?.reviewerId);
    const reviewerName = reviewer?.name ?? DUMMY_REVIEWER.name;
    const reviewerInitials = reviewer
        ? reviewer.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
        : DUMMY_REVIEWER.initials;

    const [activeSection, setActiveSection] = useState('Chapter 1');

    // Filter comments for this specific assignment and the active section
    const assignmentComments = allComments.filter((c) => String(c.assignmentId) === String(id));
    const sectionComments = assignmentComments.filter((c) => c.section === activeSection);
    const totalComments = assignmentComments.length;

    if (!item) {
        return (
            <div className="min-h-screen bg-[#F3F4F6] flex items-center justify-center">
                <p className="text-gray-400 font-bold">Proposal not found.</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F3F4F6]">
            {/* ── Header ────────────────────────────────────────────────────────── */}
            <div className="px-4 sm:px-8 lg:px-12 pt-8 lg:pt-10 pb-4 lg:pb-6">
                {/* Back button */}
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-gray-500 hover:text-gray-800 mb-4 transition-colors"
                    aria-label="Go back"
                >
                    <ArrowLeft size={18} />
                    <span className="text-sm font-semibold">Back</span>
                </button>

                <h1 className="text-xl font-bold text-gray-900 max-w-xl leading-snug">
                    {item.title}
                </h1>
                <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-6 text-sm text-gray-500">
                        <span>
                            Assigned{' '}
                            {item.date
                                ? new Date(item.date).toLocaleDateString('en-US', {
                                    month: 'numeric', day: 'numeric', year: 'numeric',
                                })
                                : '—'}
                        </span>
                        <span>Application ID: {item.applicationCode}</span>
                    </div>
                    <button className="text-sm font-semibold text-[#003B95] hover:underline">
                        Version: Latest
                    </button>
                </div>
            </div>

            {/* ── Body — sidebar + comments ──────────────────────────────────────── */}
            <div className="flex flex-col lg:flex-row px-4 sm:px-8 lg:px-12 pb-8 lg:pb-12 gap-6 lg:gap-10">
                {/* Left sidebar */}
                <div className="flex flex-row lg:flex-col justify-between w-full lg:w-44 shrink-0 gap-4 lg:gap-0">
                    <div className="flex flex-col gap-2">
                        {SECTIONS.map((sec) => (
                            <button
                                key={sec}
                                onClick={() => setActiveSection(sec)}
                                className={`px-4 sm:px-5 py-2.5 rounded-full text-sm font-semibold text-left transition-all ${activeSection === sec
                                    ? 'bg-[#003B95] text-white'
                                    : 'bg-[#E5E7EB] text-gray-700 hover:bg-gray-300'
                                    }`}
                            >
                                {sec}
                            </button>
                        ))}
                    </div>

                    {/* Attach new document button */}
                    <button
                        onClick={() => navigate(`/dashboard/submissions/${id}/attach`)}
                        className="mt-10 bg-[#003B95] hover:bg-blue-900 text-white text-sm font-bold px-4 py-3 rounded-full transition-colors text-center"
                    >
                        Attach new document
                    </button>
                </div>

                {/* Comments column */}
                <div className="flex-1 min-w-0 space-y-4">
                    {sectionComments.length === 0 ? (
                        <div className="flex items-center justify-center py-20">
                            <p className="text-gray-400 font-medium text-sm">No comments for this section</p>
                        </div>
                    ) : (
                        sectionComments.map((comment) => (
                            <div key={comment.id} className="bg-white rounded-2xl p-5 shadow-sm">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-9 h-9 rounded-full bg-[#003B95]/20 border border-gray-200 flex items-center justify-center text-[#003B95] font-bold text-xs shrink-0">
                                        {reviewerInitials}
                                    </div>
                                    <span className="font-semibold text-gray-900 text-sm">{reviewerName}</span>
                                </div>
                                <p className="text-sm text-gray-700 leading-relaxed">{comment.text}</p>
                            </div>
                        ))
                    )}
                </div>

                {/* Right — total comment count */}
                <div className="shrink-0 flex items-center">
                    <p className="text-xl font-bold text-gray-900">{totalComments} comments</p>
                </div>
            </div>
        </div>
    );
};

export default ResearcherProposalReview;
