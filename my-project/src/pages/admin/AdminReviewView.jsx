import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Search, X } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { unassignReviewer } from '../../features/assignments/assignmentsSlice';

// Reviewer logic - MOVED TO REDUX
const getInitials = (name) => name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || '??';

// ── Versioned section content ─────────────────────────────────────────────────
// Version 1 = original submission, Version 2 = after researcher revisions
const VERSIONS = [
  { id: 1, label: 'Version 1' },
  { id: 2, label: 'Version 2 (Latest)', isLatest: true },
];

const SECTION_CONTENT_V1 = {
  Information: {
    title: null, // Will be filled dynamically from assignment.title
    details: null, // Will be filled dynamically from assignment.draftData
  },
  'Chapter 1': {
    heading: 'INTRODUCTION',
    subheading: '1.1 Background of the Study',
    body: `Sleep is a fundamental biological need that supports physical health, emotional stability, and cognitive functioning. It plays a role in memory consolidation, learning, and attention, which are essential for academic performance.

Sleep deprivation refers to a condition in which an individual fails to obtain the required amount of sleep. It may be acute or chronic, resulting from prolonged inadequate sleep. Among university students, sleep deprivation is common due to academic pressures and lifestyle choices.

University life introduces new levels of independence that can affect students' daily routines, including sleep patterns. As a result, sleep is often sacrificed to meet deadlines or prepare for tests.`,
  },
  'Chapter 2': {
    heading: 'LITERATURE REVIEW',
    subheading: '2.1 Overview of Prior Research',
    body: `Previous studies suggest that REM sleep is crucial for memory consolidation. Students who averaged fewer than six hours of sleep demonstrated poorer academic outcomes.

A 2022 meta-analysis found a consistent inverse relationship between sleep duration and GPA among undergraduate students.`,
  },
  'Chapter 3': {
    heading: 'METHODOLOGY',
    subheading: '3.1 Research Design',
    body: `A cross-sectional survey was conducted among 400 students at Babcock University. Participants were selected using random sampling. The survey instrument included the Pittsburgh Sleep Quality Index (PSQI).

Data collection spanned three weeks. Ethical approval was obtained from the Babcock University Research Ethics Committee.`,
  },
  References: {
    heading: 'REFERENCES',
    subheading: null,
    body: `1. Smith, J. (2023). Sleep and the Brain. Academic Press.
2. Doe, A. (2024). Student Health Trends. University of Lagos Press.`,
  },
  Appendices: {
    heading: 'APPENDICES',
    subheading: null,
    body: `Appendix A: Survey Questionnaire\n\nAppendix B: Informed Consent Form`,
  },
};

const SECTION_CONTENT_V2 = {
  Information: SECTION_CONTENT_V1.Information, // Also dynamic — filled at render time
  'Chapter 1': {
    heading: 'INTRODUCTION',
    subheading: '1.1 Background of the Study',
    body: `Sleep is a fundamental biological need that supports physical health, emotional stability, and cognitive functioning. It plays a critical role in memory consolidation, learning, attention, and decision-making, which are all essential for effective academic performance. Adequate sleep allows the brain to process information acquired during the day and prepare for new learning tasks. When sleep is insufficient, these processes are disrupted, leading to reduced mental alertness, poor concentration, and impaired academic functioning.
Sleep deprivation refers to a condition in which an individual fails to obtain the amount or quality of sleep required for optimal functioning. It may be acute, occurring over a short period, or chronic, resulting from prolonged inadequate sleep. Among university students, sleep deprivation is often chronic due to academic pressures, social engagements, irregular schedules, excessive screen time, and lifestyle choices. Many students adopt unhealthy sleep habits such as staying awake late to study, engaging in social media activities, or watching movies, especially during examination periods.

University life introduces new levels of independence and responsibility that can affect students' daily routines, including sleep patterns. Students may experience difficulty balancing academic demands and personal and social activities. As a result, sleep is often sacrificed to meet assignment deadlines or prepare for tests. This situation has raised academic concerns about the implications for student performance and wellbeing.`,
  },
  'Chapter 2': {
    heading: 'LITERATURE REVIEW',
    subheading: '2.1 Overview of Prior Research',
    body: `Previous studies by Smith et al. (2023) suggest that REM sleep is crucial for memory consolidation. Students who averaged fewer than six hours of sleep demonstrated poorer academic outcomes across all measured disciplines.

A 2022 meta-analysis of 47 studies found a consistent inverse relationship between sleep duration and GPA among undergraduate students. Furthermore, students who reported high levels of daytime sleepiness were 2.4 times more likely to fail at least one course per semester.

Cultural and environmental factors also play a significant role. Students from urban campuses reported higher rates of sleep disruption owing to noise, artificial lighting, and access to entertainment. Intervention programs promoting sleep hygiene have shown promising results, with participants improving average sleep duration by 45 minutes per night.`,
  },
  'Chapter 3': {
    heading: 'METHODOLOGY',
    subheading: '3.1 Research Design',
    body: `A cross-sectional survey was conducted among 500 students at Babcock University across five faculties. Participants were selected using stratified random sampling to ensure proportional representation. The survey instrument included the Pittsburgh Sleep Quality Index (PSQI) and the Epworth Sleepiness Scale (ESS), alongside a self-designed academic performance questionnaire.

Data collection spanned four weeks during the second semester. Ethical approval was obtained from the Babcock University Research Ethics Committee (BUREC/2025/044). All participants provided written informed consent prior to enrolment.

Statistical analysis was performed using IBM SPSS v27. Descriptive statistics summarised demographic and sleep variables, while Pearson correlation and multiple linear regression were used to assess relationships between sleep quality and GPA.`,
  },
  References: {
    heading: 'REFERENCES',
    subheading: null,
    body: `1. Smith, J. (2023). Sleep and the Brain. Academic Press.
2. Doe, A. (2024). Student Health Trends. University of Lagos Press.
3. Okafor, C., & Balogun, F. (2022). Sleep deprivation in Nigerian undergraduates. West African Journal of Medicine, 18(3), 112–120.
4. World Health Organization. (2023). Global Status Report on Sleep. WHO Publications.
5. National Sleep Foundation. (2024). Sleep in America Poll: College Students. NSF.`,
  },
  Appendices: {
    heading: 'APPENDICES',
    subheading: null,
    body: `Appendix A: Survey Questionnaire (Pittsburgh Sleep Quality Index + Academic Performance Instrument)

Appendix B: Informed Consent Form

Appendix C: Ethics Approval Letter — BUREC/2025/044

Appendix D: Raw Data Tables`,
  },
};

const MENU_ITEMS = ['Information', 'Chapter 1', 'Chapter 2', 'Chapter 3', 'References', 'Appendices'];

// ── Component ────────────────────────────────────────────────────────────────
const AdminReviewView = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();
  const [activeSection, setActiveSection] = useState('Chapter 1');
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeVersion, setActiveVersion] = useState(2);
  const [versionsModalOpen, setVersionsModalOpen] = useState(false);
  const [showUnassignConfirm, setShowUnassignConfirm] = useState(false);

  const assignments = useSelector((s) => s.assignments.items);
  const reviewersList = useSelector((s) => s.reviewers.items);
  const allComments = useSelector((s) => s.assignments.comments);

  const assignment = assignments.find((a) => String(a.id) === String(id));
  const reduxComments = allComments.filter((c) => String(c.assignmentId) === String(id));
  const commentCount = reduxComments.length;

  const reviewer = reviewersList.find((r) => r.id === assignment?.reviewerId) ?? null;
  const REVIEWER_NAME = reviewer?.name ?? 'Reviewer';
  const REVIEWER_INITIALS = getInitials(reviewer?.name);

  // Only show V2 if researcher has made changes
  const availableVersions = assignment?.hasChanges ? VERSIONS : [{ id: 1, label: 'Version 1 (Latest)', isLatest: true }];
  const currentVersionLabel = availableVersions.find((v) => v.id === activeVersion)?.label || 'Latest';
  const sectionContent = activeVersion === 1 ? SECTION_CONTENT_V1 : SECTION_CONTENT_V2;
  // Dynamically fill the Information section from assignment data
  const infoTitle = assignment?.title || 'Untitled Proposal';
  const infoDetails = assignment?.draftData
    ? [
        ...(assignment.draftData.researcherNames || []),
        assignment.draftData.college || '',
        assignment.draftData.department ? `Department of ${assignment.draftData.department}` : '',
        assignment.draftData.institution || '',
        assignment?.date ? new Date(assignment.date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : '',
      ].filter(Boolean)
    : [
        'Researcher information not available',
        assignment?.date ? new Date(assignment.date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : '',
      ].filter(Boolean);
  const section = activeSection === 'Information'
    ? { ...sectionContent[activeSection], title: infoTitle, details: infoDetails }
    : sectionContent[activeSection];

  const assignedDate = assignment?.date
    ? new Date(assignment.date).toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric' })
    : '4/2/2026';
  const appId = assignment?.applicationCode || 'BUH-A9F3K2';

  // Review result state
  const reviewResult = assignment?.reviewResult; // 'accepted' | 'rejected' | undefined
  const isCompleted = assignment?.status === 'Completed';

  // Bottom status text under the document
  let statusLabel = 'Review not started';
  if (isCompleted) {
    if (reviewResult === 'accepted') statusLabel = 'Proposal Accepted';
    else if (reviewResult === 'rejected') statusLabel = 'Proposal Rejected';
  }

  return (
    <div className="min-h-screen bg-[#F3F4F6] flex flex-col">

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <header className="bg-[#F3F4F6] px-6 pt-6 pb-4 flex items-start justify-between">
        <button
          onClick={() => navigate(-1)}
          aria-label="Go back"
          className="mt-1 p-1 hover:bg-gray-200 rounded-full transition-colors shrink-0"
        >
          <ArrowLeft size={20} className="text-gray-800" />
        </button>

        <div className="flex-1 px-4 max-w-xl">
          <h1 className="text-base sm:text-lg font-bold text-gray-900 leading-snug">
            {assignment?.title || 'Untitled Proposal'}
          </h1>
          <div className="flex items-center gap-3 mt-1 text-xs sm:text-sm flex-wrap">
            <span className="text-gray-500">Assigned {assignedDate}</span>
            <span className="text-[#003B95] font-medium">Application ID: {appId}</span>
            {/* Clickable version label */}
            <button
              onClick={() => setVersionsModalOpen(true)}
              className="text-[#003B95] font-semibold ml-auto hover:underline"
            >
              Version: {availableVersions.find((v) => v.id === activeVersion)?.isLatest ? 'Latest' : `Version ${activeVersion}`}
            </button>
          </div>
        </div>

        <button
          onClick={() => setSearchOpen((s) => !s)}
          aria-label="Search"
          className="mt-1 p-1 hover:bg-gray-200 rounded-full transition-colors shrink-0"
        >
          <Search size={20} className="text-gray-700" />
        </button>
      </header>

      {/* Search bar */}
      {searchOpen && (
        <div className="bg-white border-y border-gray-200 px-6 py-2 flex items-center gap-3">
          <input
            autoFocus
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search in document…"
            className="flex-1 bg-gray-100 rounded-lg px-4 py-2 text-sm outline-none"
          />
          <button onClick={() => { setSearchOpen(false); setSearchQuery(''); }} className="text-xs text-gray-500 hover:text-gray-700 font-semibold">
            Cancel
          </button>
        </div>
      )}

      {/* ── Body ───────────────────────────────────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden px-2 sm:px-4 pb-6 gap-4">

        {/* Left sidebar — chapter nav + bottom status */}
        <aside className="hidden md:flex flex-col justify-between pt-4 w-32 lg:w-40 shrink-0">
          <div className="flex flex-col gap-2">
            {MENU_ITEMS.map((item) => (
              <button
                key={item}
                onClick={() => setActiveSection(item)}
                className={`w-full py-2 px-4 rounded-full text-sm font-semibold text-left transition-all ${activeSection === item
                  ? 'bg-[#003B95] text-white'
                  : 'bg-[#E5E7EB] text-gray-700 hover:bg-gray-300'
                  }`}
              >
                {item}
              </button>
            ))}
          </div>

          {/* Bottom sidebar: review result, assign, or unassign */}
          <div className="pb-2">
            {isCompleted ? (
              reviewResult === 'accepted' ? (
                <p className="text-[#003B95] font-bold text-sm">Proposal Accepted</p>
              ) : (
                <p className="text-[#C10000] font-bold text-sm">Proposal Rejected</p>
              )
            ) : assignment?.reviewerId ? (
              <button
                onClick={() => setShowUnassignConfirm(true)}
                className="w-full bg-[#C10000] hover:bg-red-800 text-white py-2.5 px-4 rounded-full font-bold text-xs transition-colors"
              >
                Unassign Assignment
              </button>
            ) : (
              <button
                onClick={() => navigate(`/dashboard/assignments/${id}/assign`)}
                className="w-full bg-[#003B95] hover:bg-blue-900 text-white py-2.5 px-4 rounded-full font-bold text-xs transition-colors"
              >
                Assign Assignment
              </button>
            )}
          </div>
        </aside>

        {/* Center — document */}
        <main className="flex-1 flex flex-col pt-4 overflow-y-auto min-w-0">
          <div className="bg-white rounded-2xl p-6 sm:p-8 flex-1">
            {activeSection === 'Information' ? (
              <div className="text-center space-y-2 py-10">
                <h2 className="text-lg font-bold text-gray-900 mb-6">{section.title}</h2>
                {section.details.map((line, i) => (
                  <p key={i} className="text-gray-700 font-medium">{line}</p>
                ))}
              </div>
            ) : (
              <div>
                <p className="font-bold text-gray-900 text-sm uppercase tracking-wide">{section.heading}</p>
                {section.subheading && (
                  <p className="font-bold text-gray-900 text-sm mt-0.5 mb-4">{section.subheading}</p>
                )}
                <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-line mt-3">
                  {searchQuery && section.body?.toLowerCase().includes(searchQuery.toLowerCase())
                    ? section.body.split(new RegExp(`(${searchQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')).map((part, i) =>
                        part.toLowerCase() === searchQuery.toLowerCase()
                          ? <mark key={i} className="bg-yellow-300">{part}</mark>
                          : part
                      )
                    : section.body
                  }
                </div>
              </div>
            )}
          </div>

          {/* Status label under document */}
          <p className="text-center text-gray-500 text-sm font-medium mt-3">{statusLabel}</p>
        </main>

        {/* Right — comments panel */}
        <aside className="hidden lg:flex flex-col pt-4 w-64 xl:w-72 shrink-0 overflow-y-auto">
          <h3 className="text-xl font-bold text-gray-900 mb-4">{commentCount} comments</h3>
          {reduxComments.length === 0 ? (
            <div className="flex flex-col items-center justify-center flex-1 py-16 text-center">
              <div className="w-14 h-14 rounded-full bg-gray-200 flex items-center justify-center mb-4">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              </div>
              <p className="font-bold text-gray-500 text-sm">No comments yet</p>
              <p className="text-gray-400 text-xs mt-1">The reviewer hasn't left any comments on this submission.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {reduxComments.map((c, i) => (
                <div key={c.id ?? i} className="bg-[#E5E7EB] rounded-2xl p-4">
                  <div className="flex items-center gap-2.5 mb-2">
                    <div className="w-8 h-8 rounded-full bg-[#003B95]/20 flex items-center justify-center text-[#003B95] font-bold text-xs shrink-0 border border-gray-300">
                      {REVIEWER_INITIALS}
                    </div>
                    <p className="font-bold text-gray-900 text-sm leading-tight">{REVIEWER_NAME}</p>
                  </div>
                  <p className="text-gray-700 text-sm leading-snug">{c.text}</p>
                </div>
              ))}
            </div>
          )}
        </aside>
      </div>

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
                  className={`w-full text-left px-2 py-1 rounded-lg transition-colors ${v.id === activeVersion
                    ? 'text-[#003B95] font-bold'
                    : 'text-gray-700 hover:text-[#003B95] font-medium'
                    }`}
                >
                  {v.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Unassign Confirmation Modal ──────────────────────────────────────── */}
      {showUnassignConfirm && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setShowUnassignConfirm(false)} />
          <div className="relative bg-white rounded-2xl px-10 py-10 w-full max-w-sm shadow-2xl text-center">
            {/* X close */}
            <button
              onClick={() => setShowUnassignConfirm(false)}
              className="absolute right-4 top-4 p-1.5 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X size={16} className="text-gray-500" />
            </button>
            <h2 className="text-lg font-bold text-gray-900 mb-2">You are about to unassign a proposal</h2>
            <p className="text-gray-400 text-sm mb-7 leading-relaxed">
              Unassigning a proposal will revert it to an unassigned assignment
            </p>
            <button
              onClick={() => {
                dispatch(unassignReviewer(assignment?.id));
                navigate('/dashboard/assignments');
              }}
              className="bg-[#C10000] text-white px-10 py-3 rounded-full font-bold text-sm hover:bg-red-700 transition-colors"
            >
              Proceed
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminReviewView;
