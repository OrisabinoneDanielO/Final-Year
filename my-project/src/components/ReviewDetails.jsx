import React, { useState, useRef } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { ArrowLeft, Search, Plus, ChevronDown, X } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux'
import { completeReview, addComment } from '../store/assignmentsSlice'

const ReviewDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const dispatch = useDispatch()
  const assignments = useSelector(s => s.assignments.items)
  const comments = useSelector(s => s.assignments.comments)

  const [isSendModalOpen, setIsSendModalOpen] = useState(false);
  const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("Information");
  const [isSectionMenuOpen, setIsSectionMenuOpen] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [sendModalAction, setSendModalAction] = useState('accept');
  const [resultModalOpen, setResultModalOpen] = useState(false);
  const [resultType, setResultType] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchError, setSearchError] = useState('');
  const [highlightedHtml, setHighlightedHtml] = useState('');
  const contentRef = useRef(null);
  const searchInputRef = useRef(null);
  const [matchIndex, setMatchIndex] = useState(0);
  const [lastSearch, setLastSearch] = useState('');
  const location = useLocation();

  // If we navigated here with state.openSendModal, automatically open the send-comments modal
  React.useEffect(() => {
    if (location && location.state && location.state.openSendModal) {
      setIsSendModalOpen(true);
    }
  }, [location]);

  // derive assignment data and comment count from context
  const assignment = assignments.find(a => String(a.id) === String(id));
  const baseCommentCount = comments.filter(c => String(c.assignmentId) === String(id)).length;
  const commentCount = baseCommentCount + ((isSendModalOpen && sendModalAction === 'comment' && commentText && commentText.trim()) ? 1 : 0);

  const sectionContent = {
    "Information": {
      title: "The impact of sleep deprivation on academic performance among university students",
      details: [
        "Agu Joshua Minton 22/0188",
        "Ben Carson School Of Medicine",
        "Department of Anatomy",
        "Babcock University",
        "February 2026"
      ]
    },
    "Chapter 1": {
      title: "Chapter 1: Introduction",
      body: "Sleep deprivation is a common issue among university students, often leading to significant impacts on their cognitive functions and academic success..."
    },
    "Chapter 2": {
      title: "Chapter 2: Literature Review",
      body: "Previous studies by Smith et al. (2023) suggest that REM sleep is crucial for memory consolidation..."
    },
    "Chapter 3": {
      title: "Chapter 3: Methodology",
      body: "A cross-sectional survey was conducted among 500 students at Babcock University..."
    },
    "References": {
      title: "References",
      body: "1. Smith, J. (2023). Sleep and the Brain. Academic Press.\n2. Doe, A. (2024). Student Health Trends."
    },
    "Appendices": {
      title: "Appendices",
      body: "Appendix A: Survey Questionnaire\nAppendix B: Informed Consent Forms"
    }
  };

  const menuItems = ["Information", "Chapter 1", "Chapter 2", "Chapter 3", "References", "Appendices"];

  const handleSectionChange = (item) => {
    setActiveSection(item);
    setIsSectionMenuOpen(false);
  };

  // Reset search when switching sections or when leaving the current section
  React.useEffect(() => {
    setSearchQuery('');
    setHighlightedHtml('');
    setSearchOpen(false);
    setSearchError('');
    setLastSearch('');
  }, [activeSection]);

  // handle find / cycle matches
  const handleFindClick = () => {
    const body = sectionContent[activeSection]?.body || '';
    if (!searchQuery || !body) return;
    const safe = searchQuery.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\\\$&');
    const regex = new RegExp(safe, 'gi');

    // If we already searched this query and have marks, advance to next
    if (lastSearch === searchQuery && contentRef.current) {
      const marks = contentRef.current.querySelectorAll('mark');
      if (marks && marks.length > 0) {
        const next = (matchIndex + 1) % marks.length;
        setMatchIndex(next);
        marks[next].scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
      }
    }

    if (!regex.test(body)) {
      setHighlightedHtml('');
      setSearchError('Word or phrase not found');
      return;
    }

    const replaced = body.replace(regex, (m) => `<mark class=\\"bg-yellow-300\\">${m}</mark>`);
    setHighlightedHtml(replaced.replace(/\\n/g, '<br/>'));
    setLastSearch(searchQuery);
    setMatchIndex(0);
    // scroll to first match shortly after render
    setTimeout(() => {
      const el = contentRef.current?.querySelectorAll('mark')[0];
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 50);
  };

  // autofocus search input when opened (only for sections with body)
  React.useEffect(() => {
    if (searchOpen && activeSection !== 'Information') {
      setTimeout(() => searchInputRef.current?.focus(), 50);
    }
  }, [searchOpen, activeSection]);

  // reset matchIndex when highlightedHtml changes
  React.useEffect(() => {
    setMatchIndex(0);
  }, [highlightedHtml]);

  return (
    <div className="min-h-screen bg-[#F3F4F6] flex flex-col">
      {/* Header Bar */}
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
            <h1 className="text-lg sm:text-xl font-bold text-gray-900 leading-tight truncate">
              {sectionContent[activeSection].title}
            </h1>
              <div className="flex items-center space-x-2 sm:space-x-4 mt-1 text-[10px] sm:text-sm whitespace-nowrap overflow-x-auto scrollbar-hide">
              <span className="text-gray-500">Assigned {assignment?.date || '4/2/2026'}</span>
              <button onClick={() => navigate(`/application/${id}`)} className="text-blue-600 font-medium underline">Application ID: {assignment?.applicationCode || id}</button>
              <span className="text-blue-600 font-medium">Version: Latest</span>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {activeSection !== 'Information' && (
            <>
              <button aria-label="Toggle search" onClick={() => setSearchOpen(s => !s)}>
                <Search className={`cursor-pointer shrink-0 ml-2 text-gray-900`} size={24} />
              </button>
              {searchOpen && (
                <div className="flex items-center space-x-2 bg-gray-100 px-3 py-1 rounded-md">
                  <input
                    ref={searchInputRef}
                    value={searchQuery}
                    onChange={(e) => { setSearchQuery(e.target.value); setSearchError(''); }}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleFindClick(); } }}
                    placeholder="Search in chapter"
                    className="bg-transparent outline-none text-sm"
                  />
                  <button onClick={() => handleFindClick()} className="text-sm bg-white px-3 py-1 rounded-md font-semibold">Find</button>
                </div>
              )}
            </>
          )}
          {searchError && <div className="text-red-600 text-xs mt-1">{searchError}</div>}
        </div>
      </header>

      {/* Mobile Section Dropdown */}
      <div className="md:hidden bg-white border-b border-gray-200 px-4 py-2 sticky top-[73px] z-20">
        <button 
          onClick={() => setIsSectionMenuOpen(!isSectionMenuOpen)}
          aria-expanded={isSectionMenuOpen}
          className="w-full flex justify-between items-center py-2 px-4 bg-gray-100 rounded-lg text-sm font-bold text-gray-700"
        >
          {activeSection}
          <ChevronDown size={20} className={`transition-transform duration-200 ${isSectionMenuOpen ? 'rotate-180' : ''}`} />
        </button>
        
        {isSectionMenuOpen && (
          <>
            {/* Click-away overlay */}
            <div 
              className="fixed inset-0 z-40" 
              onClick={() => setIsSectionMenuOpen(false)} 
            />
            <div className="absolute left-4 right-4 mt-2 bg-white rounded-xl shadow-xl border border-gray-200 p-2 space-y-1 z-50">
              {menuItems.map((item) => (
                <button
                  key={item}
                  onClick={() => handleSectionChange(item)}
                  className={`w-full text-left py-3 px-4 rounded-lg text-sm font-semibold transition-all ${
                    activeSection === item ? "bg-[#003B95] text-white" : "hover:bg-gray-50 text-gray-700"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Desktop Sidebar */}
        <aside className="hidden md:flex w-52 bg-transparent p-6 flex-col space-y-3 shrink-0">
          {menuItems.map((item) => (
            <button
              key={item}
              onClick={() => handleSectionChange(item)}
              className={`w-full py-2 px-4 rounded-full text-sm font-semibold transition-all text-left truncate ${
                activeSection === item 
                ? "bg-[#003B95] text-white shadow-md" 
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
              title={item}
            >
              {item}
            </button>
          ))}
        </aside>

        {/* Main Document Viewer */}
        <main className="flex-1 p-4 sm:p-6 lg:p-10 flex justify-center items-start overflow-y-auto relative">
          <div className="bg-[#E5E7EB] w-full max-w-4xl min-h-[75vh] rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-12 flex flex-col items-center justify-center text-center shadow-inner relative">
            <h2 className="text-xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8 leading-tight">
              {sectionContent[activeSection].title}
            </h2>
            
            {activeSection === "Information" ? (
              <div className="space-y-1 sm:space-y-2 text-base sm:text-xl font-medium text-gray-800">
                {sectionContent["Information"].details.map((line, idx) => (
                  <p key={idx}>{line}</p>
                ))}
              </div>
            ) : (
              <div ref={contentRef} className="text-sm sm:text-lg text-gray-700 text-left w-full leading-relaxed">
                {highlightedHtml ? (
                  <div dangerouslySetInnerHTML={{ __html: highlightedHtml }} />
                ) : (
                  <div className="whitespace-pre-line">{sectionContent[activeSection].body}</div>
                )}
              </div>
            )}

            {/* Floating Action Button - Absolute within the document container */}
            <button 
              aria-label="Add comment or feedback"
              className="absolute -right-4 sm:-right-6 top-1/2 -translate-y-1/2 bg-gray-300 p-3 sm:p-4 rounded-full hover:bg-gray-400 transition-all shadow-lg active:scale-95 z-10"
            >
              <Plus size={24} className="sm:w-8 sm:h-8 text-gray-700" />
            </button>
          </div>
          
          <button onClick={() => navigate(`/assignments/${id}/comments`)} className="absolute bottom-6 right-10 text-[10px] sm:text-sm font-bold text-gray-600 underline hover:text-blue-700">
            {commentCount} comments
          </button>

          {/* Action Buttons (Send Comments / Complete Review) */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-6">
            <button onClick={() => { setSendModalAction('comment'); setIsSendModalOpen(true); }} className="bg-white shadow-md px-8 py-3 rounded-full font-bold">Send Comments</button>
            <button onClick={() => setIsCompleteModalOpen(true)} className="bg-[#003B95] text-white px-8 py-3 rounded-full font-bold">Complete Review</button>
          </div>
        </main>
      </div>

      {/* Send Comments Modal */}
      {isSendModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setIsSendModalOpen(false)} />
          <div className="relative bg-white rounded-lg w-full max-w-3xl p-6">
            <button onClick={() => setIsSendModalOpen(false)} className="absolute right-4 top-4 text-gray-400 hover:text-gray-600">
              <X size={20} />
            </button>
            {sendModalAction === 'accept' ? (
              <div>
                <div className="text-gray-700 text-sm mb-2">You are about to approve:</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">{sectionContent[activeSection].title}</h3>
                <div className="text-gray-500 text-sm mb-6">Assigned {assignment?.date || '4/2/2026'}</div>

                <textarea value={commentText} onChange={(e) => setCommentText(e.target.value)} rows={10} className="w-full bg-gray-100 p-6 rounded-lg resize-none text-gray-700" placeholder="Add Comment (Optional)" />

                <div className="mt-8 flex justify-center">
                  <button onClick={() => {
                    dispatch(completeReview({ id: Number(id), accepted: true }))
                    setIsSendModalOpen(false);
                    setCommentText('');
                    setResultType('accepted');
                    setResultModalOpen(true);
                  }} className="bg-[#003B95] text-white px-8 py-3 rounded-full font-semibold">Approve Proposal</button>
                </div>
              </div>
            ) : sendModalAction === 'comment' ? (
              <div>
                <div className="mb-4 text-gray-700 font-medium">Add Comment</div>
                <textarea value={commentText} onChange={(e) => setCommentText(e.target.value)} rows={8} className="w-full bg-gray-100 p-4 rounded-md resize-none" placeholder="Write your comment here" />
                <div className="mt-6 text-center">
                  <button onClick={() => {
                    if (commentText && commentText.trim()) {
                      dispatch(addComment({ assignmentId: Number(id), text: commentText.trim() }))
                    }
                    setIsSendModalOpen(false);
                    setCommentText('');
                  }} className={`px-6 py-2.5 rounded-full font-semibold bg-[#003B95] text-white`}>
                    Send Comment
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div className="mb-4 text-gray-700 font-medium">Add Comment (Optional)</div>
                <textarea value={commentText} onChange={(e) => setCommentText(e.target.value)} rows={10} className="w-full bg-gray-100 p-4 rounded-md resize-none" />
                <div className="mt-6 text-center">
                  <button onClick={() => {
                    const accepted = false;
                    dispatch(completeReview({ id: Number(id), accepted }))
                    setIsSendModalOpen(false);
                    setCommentText('');
                    setResultType('rejected');
                    setResultModalOpen(true);
                  }} className={`px-6 py-2.5 rounded-full font-semibold bg-[#C10000] text-white`}>
                    Reject Proposal
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Complete Review Modal */}
      {isCompleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setIsCompleteModalOpen(false)} />
          <div className="relative bg-white rounded-lg w-full max-w-md p-8 text-center">
            <button onClick={() => setIsCompleteModalOpen(false)} className="absolute right-4 top-4 text-gray-400 hover:text-gray-600">
              <X size={20} />
            </button>
            <h3 className="text-xl font-semibold mb-2">You are about to complete your review.</h3>
            <p className="text-gray-400 mb-6">Select an option below</p>
            <div className="flex items-center justify-center gap-6">
              <button onClick={() => { setSendModalAction('reject'); setIsCompleteModalOpen(false); setIsSendModalOpen(true); }} className="bg-[#C10000] text-white px-6 py-2.5 rounded-full font-semibold">Reject Proposal</button>
              <button onClick={() => { setSendModalAction('accept'); setIsCompleteModalOpen(false); setIsSendModalOpen(true); }} className="bg-[#003B95] text-white px-6 py-2.5 rounded-full font-semibold">Accept Proposal</button>
            </div>
          </div>
        </div>
      )}

      {/* Result Modal (Review accepted / rejected) */}
      {resultModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setResultModalOpen(false)} />
          <div className="relative bg-white rounded-lg w-full max-w-md p-8 text-center">
            <h3 className="text-xl font-semibold mb-2">{resultType === 'accepted' ? 'Approval Successful' : 'Rejection Successful'}</h3>
            <p className="text-gray-500 mb-6">Your decision has been recorded.</p>
            <div className="flex items-center justify-center">
              <button onClick={() => { setResultModalOpen(false); navigate('/assignments', { state: { activeTab: 'Completed' } }); }} className="bg-[#003B95] text-white px-6 py-2.5 rounded-full font-semibold">Done</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewDetails;