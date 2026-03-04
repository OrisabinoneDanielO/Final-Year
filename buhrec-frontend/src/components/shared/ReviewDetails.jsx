import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { ArrowLeft, Search, Plus, ChevronDown, X } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux'
import { completeReview } from '../../features/reviews/reviewsSlice'
import { addComment, fetchComments, selectComments } from '../../features/comments/commentsSlice'
import { selectProposals } from '../../features/proposals/proposalsSlice'

// ── Versioned section content ─────────────────────────────────────────────────
const VERSIONS = [
  { id: 1, label: 'Version 1' },
  { id: 2, label: 'Version 2 (Latest)', isLatest: true },
];

const SECTION_CONTENT_V1 = {
  Information: { title: null, details: null },
  'Chapter 1': {
    heading: 'INTRODUCTION', subheading: '1.1 Background of the Study',
    body: `Sleep is a fundamental biological need that supports physical health, emotional stability, and cognitive functioning. It plays a role in memory consolidation, learning, and attention, which are essential for academic performance.\n\nSleep deprivation refers to a condition in which an individual fails to obtain the required amount of sleep. It may be acute or chronic, resulting from prolonged inadequate sleep. Among university students, sleep deprivation is common due to academic pressures and lifestyle choices.\n\nUniversity life introduces new levels of independence that can affect students' daily routines, including sleep patterns. As a result, sleep is often sacrificed to meet deadlines or prepare for tests.`,
  },
  'Chapter 2': {
    heading: 'LITERATURE REVIEW', subheading: '2.1 Overview of Prior Research',
    body: `Previous studies suggest that REM sleep is crucial for memory consolidation. Students who averaged fewer than six hours of sleep demonstrated poorer academic outcomes.\n\nA 2022 meta-analysis found a consistent inverse relationship between sleep duration and GPA among undergraduate students.`,
  },
  'Chapter 3': {
    heading: 'METHODOLOGY', subheading: '3.1 Research Design',
    body: `A cross-sectional survey was conducted among 400 students at Babcock University. Participants were selected using random sampling. The survey instrument included the Pittsburgh Sleep Quality Index (PSQI).\n\nData collection spanned three weeks. Ethical approval was obtained from the Babcock University Research Ethics Committee.`,
  },
  References: {
    heading: 'REFERENCES', subheading: null,
    body: `1. Smith, J. (2023). Sleep and the Brain. Academic Press.\n2. Doe, A. (2024). Student Health Trends. University of Lagos Press.`,
  },
  Appendices: {
    heading: 'APPENDICES', subheading: null,
    body: `Appendix A: Survey Questionnaire\n\nAppendix B: Informed Consent Form`,
  },
};

const SECTION_CONTENT_V2 = {
  Information: SECTION_CONTENT_V1.Information,
  'Chapter 1': {
    heading: 'INTRODUCTION', subheading: '1.1 Background of the Study',
    body: `Sleep is a fundamental biological need that supports physical health, emotional stability, and cognitive functioning. It plays a critical role in memory consolidation, learning, attention, and decision-making, which are all essential for effective academic performance. Adequate sleep allows the brain to process information acquired during the day and prepare for new learning tasks. When sleep is insufficient, these processes are disrupted, leading to reduced mental alertness, poor concentration, and impaired academic functioning.\nSleep deprivation refers to a condition in which an individual fails to obtain the amount or quality of sleep required for optimal functioning. It may be acute, occurring over a short period, or chronic, resulting from prolonged inadequate sleep. Among university students, sleep deprivation is often chronic due to academic pressures, social engagements, irregular schedules, excessive screen time, and lifestyle choices. Many students adopt unhealthy sleep habits such as staying awake late to study, engaging in social media activities, or watching movies, especially during examination periods.\n\nUniversity life introduces new levels of independence and responsibility that can affect students' daily routines, including sleep patterns. Students may experience difficulty balancing academic demands and personal and social activities. As a result, sleep is often sacrificed to meet assignment deadlines or prepare for tests. This situation has raised academic concerns about the implications for student performance and wellbeing.`,
  },
  'Chapter 2': {
    heading: 'LITERATURE REVIEW', subheading: '2.1 Overview of Prior Research',
    body: `Previous studies by Smith et al. (2023) suggest that REM sleep is crucial for memory consolidation. Students who averaged fewer than six hours of sleep demonstrated poorer academic outcomes across all measured disciplines.\n\nA 2022 meta-analysis of 47 studies found a consistent inverse relationship between sleep duration and GPA among undergraduate students. Furthermore, students who reported high levels of daytime sleepiness were 2.4 times more likely to fail at least one course per semester.\n\nCultural and environmental factors also play a significant role. Students from urban campuses reported higher rates of sleep disruption owing to noise, artificial lighting, and access to entertainment. Intervention programs promoting sleep hygiene have shown promising results, with participants improving average sleep duration by 45 minutes per night.`,
  },
  'Chapter 3': {
    heading: 'METHODOLOGY', subheading: '3.1 Research Design',
    body: `A cross-sectional survey was conducted among 500 students at Babcock University across five faculties. Participants were selected using stratified random sampling to ensure proportional representation. The survey instrument included the Pittsburgh Sleep Quality Index (PSQI) and the Epworth Sleepiness Scale (ESS), alongside a self-designed academic performance questionnaire.\n\nData collection spanned four weeks during the second semester. Ethical approval was obtained from the Babcock University Research Ethics Committee (BUREC/2025/044). All participants provided written informed consent prior to enrolment.\n\nStatistical analysis was performed using IBM SPSS v27. Descriptive statistics summarised demographic and sleep variables, while Pearson correlation and multiple linear regression were used to assess relationships between sleep quality and GPA.`,
  },
  References: {
    heading: 'REFERENCES', subheading: null,
    body: `1. Smith, J. (2023). Sleep and the Brain. Academic Press.\n2. Doe, A. (2024). Student Health Trends. University of Lagos Press.\n3. Okafor, C., & Balogun, F. (2022). Sleep deprivation in Nigerian undergraduates. West African Journal of Medicine, 18(3), 112–120.\n4. World Health Organization. (2023). Global Status Report on Sleep. WHO Publications.\n5. National Sleep Foundation. (2024). Sleep in America Poll: College Students. NSF.`,
  },
  Appendices: {
    heading: 'APPENDICES', subheading: null,
    body: `Appendix A: Survey Questionnaire (Pittsburgh Sleep Quality Index + Academic Performance Instrument)\n\nAppendix B: Informed Consent Form\n\nAppendix C: Ethics Approval Letter — BUREC/2025/044\n\nAppendix D: Raw Data Tables`,
  },
};

const MENU_ITEMS = ["Information", "Chapter 1", "Chapter 2", "Chapter 3", "References", "Appendices"];

const ReviewDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const dispatch = useDispatch()
  const assignments = useSelector(selectProposals)
  const comments = useSelector(selectComments)
  const user = useSelector(s => s.auth.user)

  useEffect(() => {
    if (id) dispatch(fetchComments(id));
  }, [dispatch, id]);

  const [isSendModalOpen, setIsSendModalOpen] = useState(false);
  const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);
  const [declineConfirmOpen, setDeclineConfirmOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("Information");
  const [isSectionMenuOpen, setIsSectionMenuOpen] = useState(false);
  const [activeVersion, setActiveVersion] = useState(2);
  const [versionsModalOpen, setVersionsModalOpen] = useState(false);
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

  // Only show V2 if researcher has made changes
  const availableVersions = assignment?.hasChanges ? VERSIONS : [{ id: 1, label: 'Version 1 (Latest)', isLatest: true }];
  const currentVersionLabel = availableVersions.find((v) => v.id === activeVersion)?.label || 'Latest';
  const currentSectionContent = activeVersion === 1 ? SECTION_CONTENT_V1 : SECTION_CONTENT_V2;

  const infoTitle = assignment?.title || "Untitled Proposal";
  const infoDetails = assignment?.draftData
    ? [
      ...(assignment.draftData.researcherNames || []),
      assignment.draftData.college || '',
      assignment.draftData.department ? `Department of ${assignment.draftData.department}` : '',
      assignment.draftData.institution || '',
      assignment.date ? new Date(assignment.date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : '',
    ].filter(Boolean)
    : [
      "Researcher information not available",
      assignment?.date ? new Date(assignment.date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : '',
    ].filter(Boolean);

  const section = activeSection === 'Information'
    ? { ...currentSectionContent[activeSection], title: infoTitle, details: infoDetails }
    : currentSectionContent[activeSection];

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
    const body = section.body || '';
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
      <header className="bg-white px-3 sm:px-6 py-3 sm:py-4 flex items-center justify-between border-b border-gray-200 sticky top-0 z-30">
        <div className="flex items-center space-x-2 sm:space-x-4 lg:space-x-6 overflow-hidden min-w-0">
          <button
            onClick={() => navigate(-1)}
            aria-label="Go back"
            className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-full transition-colors shrink-0"
          >
            <ArrowLeft size={20} className="sm:w-6 sm:h-6 text-black" />
          </button>
          <div className="overflow-hidden min-w-0">
            <h1 className="text-sm sm:text-lg lg:text-xl font-bold text-gray-900 leading-tight truncate">
              {section.title || section.heading}
            </h1>
            <div className="flex items-center space-x-1 sm:space-x-2 lg:space-x-4 mt-0.5 sm:mt-1 text-[9px] sm:text-xs lg:text-sm flex-wrap">
              <span className="text-gray-500 hidden sm:inline">Assigned {assignment?.date || '4/2/2026'}</span>
              <button onClick={() => navigate(`/dashboard/application/${id}`)} className="text-blue-600 font-medium underline hover:no-underline hidden sm:inline">ID: {assignment?.applicationCode || id}</button>
              <button
                onClick={() => setVersionsModalOpen(true)}
                className="text-[#003B95] font-semibold hover:underline"
              >
                Version: {availableVersions.find((v) => v.id === activeVersion)?.isLatest ? 'Latest' : `Version ${activeVersion}`}
              </button>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-1 sm:space-x-2 shrink-0">
          {activeSection !== 'Information' && (
            <>
              <button aria-label="Toggle search" onClick={() => setSearchOpen(s => !s)}>
                <Search className={`cursor-pointer shrink-0 text-gray-900`} size={20} />
              </button>
              {searchOpen && (
                <div className="hidden sm:flex items-center space-x-2 bg-gray-100 px-3 py-1 rounded-md">
                  <input
                    ref={searchInputRef}
                    value={searchQuery}
                    onChange={(e) => { setSearchQuery(e.target.value); setSearchError(''); }}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleFindClick(); } }}
                    placeholder="Search in chapter"
                    className="bg-transparent outline-none text-sm w-32"
                  />
                  <button onClick={() => handleFindClick()} className="text-sm bg-white px-3 py-1 rounded-md font-semibold">Find</button>
                </div>
              )}
              {searchOpen && (
                <div className="sm:hidden fixed top-16 left-3 right-3 bg-gray-100 px-3 py-2 rounded-md z-40 flex items-center gap-2">
                  <input
                    ref={searchInputRef}
                    value={searchQuery}
                    onChange={(e) => { setSearchQuery(e.target.value); setSearchError(''); }}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleFindClick(); } }}
                    placeholder="Search"
                    className="bg-transparent outline-none text-xs flex-1"
                  />
                  <button onClick={() => handleFindClick()} className="text-xs bg-white px-2 py-1 rounded font-semibold whitespace-nowrap">Find</button>
                </div>
              )}
            </>
          )}
          {searchError && <div className="hidden sm:block text-red-600 text-xs">{searchError}</div>}
        </div>
      </header>

      {/* Mobile Section Dropdown */}
      <div className="md:hidden bg-white border-b border-gray-200 px-3 sm:px-4 py-2 sticky top-[63px] sm:top-[73px] z-20">
        <button
          onClick={() => setIsSectionMenuOpen(!isSectionMenuOpen)}
          aria-expanded={isSectionMenuOpen}
          className="w-full flex justify-between items-center py-2 px-3 sm:px-4 bg-gray-100 rounded-lg text-xs sm:text-sm font-bold text-gray-700"
        >
          {activeSection}
          <ChevronDown size={18} className={`transition-transform duration-200 shrink-0 ${isSectionMenuOpen ? 'rotate-180' : ''}`} />
        </button>

        {isSectionMenuOpen && (
          <>
            {/* Click-away overlay */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsSectionMenuOpen(false)}
            />
            <div className="absolute left-3 right-3 sm:left-4 sm:right-4 mt-2 bg-white rounded-xl shadow-xl border border-gray-200 p-2 space-y-1 z-50 max-h-64 overflow-y-auto">
              {menuItems.map((item) => (
                <button
                  key={item}
                  onClick={() => handleSectionChange(item)}
                  className={`w-full text-left py-2 sm:py-3 px-3 sm:px-4 rounded-lg text-xs sm:text-sm font-semibold transition-all ${activeSection === item ? "bg-[#003B95] text-white" : "hover:bg-gray-50 text-gray-700"
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
        <aside className="hidden md:flex w-40 lg:w-52 bg-transparent p-4 lg:p-6 flex-col space-y-2 lg:space-y-3 shrink-0 overflow-y-auto">
          {menuItems.map((item) => (
            <button
              key={item}
              onClick={() => handleSectionChange(item)}
              className={`w-full py-2 px-3 lg:px-4 rounded-full text-xs lg:text-sm font-semibold transition-all text-left truncate ${activeSection === item
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
        <main className="flex-1 p-2 sm:p-4 lg:p-6 flex flex-col justify-start items-center overflow-y-auto">
          <div className="bg-[#E5E7EB] w-full max-w-4xl rounded-xl sm:rounded-2xl lg:rounded-[2.5rem] p-4 sm:p-8 lg:p-12 flex flex-col items-center justify-start text-center shadow-inner relative mb-6">
            {activeSection === "Information" ? (
              <div className="space-y-1 sm:space-y-2 text-sm sm:text-lg lg:text-xl font-medium text-gray-800 w-full text-center py-4">
                <h2 className="text-lg sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-4 sm:mb-6 lg:mb-8 leading-tight">
                  {section.title}
                </h2>
                {section.details.map((line, idx) => (
                  <p key={idx}>{line}</p>
                ))}
              </div>
            ) : (
              <div ref={contentRef} className="text-xs sm:text-base lg:text-lg text-gray-700 text-left w-full leading-relaxed">
                <p className="font-bold text-gray-900 text-sm sm:text-lg uppercase tracking-wide">{section.heading}</p>
                {section.subheading && (
                  <p className="font-bold text-gray-900 text-sm sm:text-base mt-2 mb-6">{section.subheading}</p>
                )}
                {highlightedHtml ? (
                  <div dangerouslySetInnerHTML={{ __html: highlightedHtml }} className="whitespace-pre-line mt-4" />
                ) : (
                  <div className="whitespace-pre-line mt-4">{section.body}</div>
                )}
              </div>
            )}

            {/* Floating Action Button — opens add-comment modal */}
            {!isCompleted && (
              <button
                aria-label="Add comment or feedback"
                onClick={() => { setSendModalAction('comment'); setIsSendModalOpen(true); }}
                className="hidden sm:flex absolute -right-3 lg:-right-6 top-1/2 -translate-y-1/2 bg-gray-300 p-2.5 sm:p-3 lg:p-4 rounded-full hover:bg-gray-400 transition-all shadow-lg active:scale-95 z-10"
              >
                <Plus size={20} className="lg:w-6 lg:h-6 text-gray-700" />
              </button>
            )}
          </div>

          {/* Bottom Action Area - Responsive stacking on mobile */}
          <div className="w-full max-w-4xl flex flex-col sm:flex-row items-center justify-between gap-4 px-2 sm:px-0">
            {isCompleted ? (
              <button
                onClick={() => navigate(`/dashboard/assignments/${id}/comments`)}
                className="w-full sm:w-auto bg-white shadow-md px-6 sm:px-8 py-2.5 sm:py-3 rounded-full font-bold text-sm sm:text-base hover:shadow-lg transition-shadow border border-gray-200"
              >
                Already sent comments
              </button>
            ) : (
              <>
                <button
                  onClick={() => navigate(`/dashboard/assignments/${id}/comments`)}
                  className="text-xs sm:text-sm font-bold text-gray-600 underline hover:text-blue-700 order-2 sm:order-1"
                >
                  {commentCount} comments
                </button>

                {/* Action Buttons (Send Comments / Complete Review) */}
                <div className="flex flex-col sm:flex-row w-full sm:w-auto items-center gap-3 sm:gap-4 order-1 sm:order-2">
                  <button
                    onClick={() => { setSendModalAction('comment'); setIsSendModalOpen(true); }}
                    className="w-full sm:w-auto bg-white shadow-md px-6 sm:px-8 py-2.5 sm:py-3 rounded-full font-bold text-sm sm:text-base hover:shadow-lg transition-shadow"
                  >
                    Send Comments
                  </button>
                  <button
                    onClick={() => setIsCompleteModalOpen(true)}
                    className="w-full sm:w-auto bg-[#003B95] text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-full font-bold text-sm sm:text-base hover:bg-blue-900 transition-colors"
                  >
                    Complete Review
                  </button>
                </div>
              </>
            )}
          </div>
        </main>
      </div>

      {/* Send Comments Modal */}
      {isSendModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setIsSendModalOpen(false)} />
          <div className="relative bg-white rounded-t-2xl sm:rounded-lg w-full sm:max-w-2xl lg:max-w-3xl p-4 sm:p-6 max-h-[90vh] overflow-y-auto">
            <button onClick={() => setIsSendModalOpen(false)} className="absolute right-3 sm:right-4 top-3 sm:top-4 text-gray-400 hover:text-gray-600">
              <X size={20} />
            </button>
            {sendModalAction === 'accept' ? (
              <div>
                <div className="text-gray-700 text-xs sm:text-sm mb-2">You are about to approve:</div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">{assignment?.title || 'Untitled Proposal'}</h3>
                <div className="text-gray-500 text-xs sm:text-sm mb-4 sm:mb-6">Assigned {assignment?.date || '4/2/2026'}</div>

                <textarea value={commentText} onChange={(e) => setCommentText(e.target.value)} rows={8} className="w-full bg-gray-100 p-3 sm:p-4 rounded-lg resize-none text-sm sm:text-base text-gray-700" placeholder="Add Comment (Optional)" />

                <div className="mt-6 sm:mt-8 flex justify-center">
                  <button onClick={() => {
                    dispatch(completeReview({ id: Number(id), accepted: true }))
                    setIsSendModalOpen(false);
                    setCommentText('');
                    setResultType('accepted');
                    setResultModalOpen(true);
                  }} className="bg-[#003B95] text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-full font-semibold text-sm sm:text-base hover:bg-blue-900 transition-colors">Approve Proposal</button>
                </div>
              </div>
            ) : sendModalAction === 'comment' ? (
              <div>
                <div className="mb-3 sm:mb-4 text-gray-700 font-medium text-sm sm:text-base">Add Comment</div>
                <textarea value={commentText} onChange={(e) => setCommentText(e.target.value)} rows={6} className="w-full bg-gray-100 p-3 sm:p-4 rounded-md resize-none text-sm sm:text-base" placeholder="Write your comment here" />
                <div className="mt-4 sm:mt-6 text-center">
                  <button onClick={() => {
                    if (commentText && commentText.trim()) {
                      dispatch(addComment({ assignmentId: Number(id), text: commentText.trim(), section: activeSection, authorEmail: user?.email }))
                    }
                    setIsSendModalOpen(false);
                    setCommentText('');
                    navigate(`/dashboard/assignments/${id}/comments`);
                  }} className={`px-6 sm:px-8 py-2.5 sm:py-3 rounded-full font-semibold bg-[#003B95] text-white text-sm sm:text-base hover:bg-blue-900 transition-colors`}>
                    Send Comment
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div className="mb-3 sm:mb-4 text-gray-700 font-medium text-sm sm:text-base">Add Comment (Optional)</div>
                <textarea value={commentText} onChange={(e) => setCommentText(e.target.value)} rows={8} className="w-full bg-gray-100 p-3 sm:p-4 rounded-md resize-none text-sm sm:text-base" />
                <div className="mt-4 sm:mt-6 text-center">
                  <button onClick={() => {
                    const accepted = false;
                    dispatch(completeReview({ id: Number(id), accepted }))
                    setIsSendModalOpen(false);
                    setCommentText('');
                    setResultType('rejected');
                    setResultModalOpen(true);
                  }} className={`px-6 sm:px-8 py-2.5 sm:py-3 rounded-full font-semibold bg-[#C10000] text-white text-sm sm:text-base hover:bg-red-700 transition-colors`}>
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
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setIsCompleteModalOpen(false)} />
          <div className="relative bg-white rounded-t-2xl sm:rounded-lg w-full sm:max-w-md p-6 sm:p-8">
            <button onClick={() => setIsCompleteModalOpen(false)} className="absolute right-3 sm:right-4 top-3 sm:top-4 text-gray-400 hover:text-gray-600">
              <X size={20} />
            </button>
            <h3 className="text-lg sm:text-xl font-semibold mb-2">You are about to complete your review.</h3>
            <p className="text-gray-400 mb-6 text-sm sm:text-base">Select an option below</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
              <button onClick={() => { setIsCompleteModalOpen(false); setDeclineConfirmOpen(true); }} className="w-full sm:w-auto bg-[#C10000] text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-full font-semibold text-sm sm:text-base hover:bg-red-700 transition-colors">Reject Proposal</button>
              <button onClick={() => { setSendModalAction('accept'); setIsCompleteModalOpen(false); setIsSendModalOpen(true); }} className="w-full sm:w-auto bg-[#003B95] text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-full font-semibold text-sm sm:text-base hover:bg-blue-900 transition-colors">Accept Proposal</button>
            </div>
          </div>
        </div>
      )}

      {/* Decline Confirmation Modal */}
      {declineConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setDeclineConfirmOpen(false)} />
          <div className="relative bg-white rounded-3xl w-full max-w-sm p-8 text-center shadow-2xl">
            <button onClick={() => setDeclineConfirmOpen(false)} className="absolute right-4 top-4 p-1.5 hover:bg-gray-100 rounded-full">
              <X size={18} className="text-gray-500" />
            </button>
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
              <X size={22} className="text-red-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">Reject this proposal?</h3>
            <p className="text-sm text-gray-400 mb-6">This decision will be recorded and cannot be undone. You may optionally add a comment explaining your decision.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeclineConfirmOpen(false)}
                className="flex-1 py-2.5 rounded-full bg-[#E5E7EB] text-gray-700 font-semibold text-sm hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => { setDeclineConfirmOpen(false); setSendModalAction('reject'); setIsSendModalOpen(true); }}
                className="flex-1 py-2.5 rounded-full bg-[#C10000] text-white font-semibold text-sm hover:bg-red-700 transition-colors"
              >
                Yes, Reject
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Result Modal (Review accepted / rejected) */}
      {resultModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setResultModalOpen(false)} />
          <div className="relative bg-white rounded-t-2xl sm:rounded-lg w-full sm:max-w-md p-6 sm:p-8">
            <h3 className="text-lg sm:text-xl font-semibold mb-2">{resultType === 'accepted' ? 'Approval Successful' : 'Rejection Successful'}</h3>
            <p className="text-gray-500 mb-6 text-sm sm:text-base">Your decision has been recorded.</p>
            <div className="flex items-center justify-center">
              <button onClick={() => { setResultModalOpen(false); navigate('/dashboard/assignments', { state: { activeTab: 'Completed' } }); }} className="w-full sm:w-auto bg-[#003B95] text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-full font-semibold text-sm sm:text-base hover:bg-blue-900 transition-colors">Done</button>
            </div>
          </div>
        </div>
      )}
      {/* ── Versions Modal ──────────────────────────────────────────────────── */}
      {versionsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setVersionsModalOpen(false)} />
          <div className="relative bg-white rounded-3xl p-8 w-full max-w-sm shadow-2xl text-center">
            <button
              onClick={() => setVersionsModalOpen(false)}
              className="absolute right-5 top-5 p-1.5 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X size={18} className="text-gray-500" />
            </button>

            <h2 className="text-xl font-bold text-gray-900 mb-1">All versions</h2>
            <p className="text-gray-400 text-sm mb-6">Here are all the versions of this assignment</p>

            <div className="space-y-3 text-left">
              {availableVersions.map((v) => (
                <button
                  key={v.id}
                  onClick={() => {
                    setActiveVersion(v.id);
                    setVersionsModalOpen(false);
                  }}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-colors border ${v.id === activeVersion
                    ? 'border-[#003B95] bg-blue-50 text-[#003B95] font-bold'
                    : 'border-transparent text-gray-700 hover:bg-gray-100 font-medium'
                    }`}
                >
                  {v.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewDetails;
