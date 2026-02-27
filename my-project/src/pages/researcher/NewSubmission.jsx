import React, { useState, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, X } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { selectUser } from '../../features/auth/authSlice';
import { saveDraft } from '../../features/assignments/assignmentsSlice';

const CATEGORIES = ['UG', 'PG', 'Independent/Masters', 'PhD', 'International'];

const FileDropzone = ({ label, file, onChange }) => {
    const inputRef = useRef(null);
    const [dragOver, setDragOver] = useState(false);

    const handleDrop = (e) => {
        e.preventDefault();
        setDragOver(false);
        onChange(e.dataTransfer.files?.[0]);
    };

    return (
        <div
            onClick={() => inputRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            className={`cursor-pointer rounded-2xl border-2 border-dashed flex flex-col items-center justify-center py-8 px-6 text-center transition-colors ${dragOver
                ? 'border-[#003B95] bg-blue-50'
                : 'border-gray-300 bg-[#E5E7EB] hover:border-[#003B95] hover:bg-gray-200'
                }`}
        >
            <p className="font-semibold text-gray-700 text-sm">
                {file ? file.name : label}
            </p>
            <p className="text-xs text-gray-400 mt-0.5">
                {file ? `${(file.size / 1024).toFixed(1)} KB` : 'Ensure your proposal is in .doc or .docx'}
            </p>
            <input
                ref={inputRef}
                type="file"
                accept=".doc,.docx"
                className="hidden"
                onChange={(e) => onChange(e.target.files?.[0])}
            />
        </div>
    );
};

const NewSubmission = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const user = useSelector(selectUser);
    const [searchParams] = useSearchParams();
    const allItems = useSelector((s) => s.assignments.items);

    // Restore from draft if ?draft=<id> is present
    const draftId = searchParams.get('draft') ? Number(searchParams.get('draft')) : null;
    const draftItem = draftId ? allItems.find((a) => a.id === draftId) : null;
    const d = draftItem?.draftData ?? {};

    const [projectName, setProjectName] = useState(
        draftItem && draftItem.title !== 'Untitled Draft' ? draftItem.title : ''
    );
    const [researcherNames, setResearcherNames] = useState(
        d.researcherNames?.length ? d.researcherNames : [user?.name || '']
    );
    const [institution, setInstitution] = useState(d.institution ?? '');
    const [college, setCollege] = useState(d.college ?? '');
    const [department, setDepartment] = useState(d.department ?? '');
    const [category, setCategory] = useState(d.category ?? '');
    const [supervisor, setSupervisor] = useState(d.supervisor ?? '');
    const [supervisorEmail, setSupervisorEmail] = useState(d.supervisorEmail ?? '');
    const [applicationLetter, setApplicationLetter] = useState(null);
    const [proposalFile, setProposalFile] = useState(null);
    const [turnItInReport, setTurnItInReport] = useState(null);
    const [showDraftModal, setShowDraftModal] = useState(false);

    const addResearcher = () => setResearcherNames((prev) => [...prev, '']);
    const updateResearcher = (idx, val) =>
        setResearcherNames((prev) => prev.map((n, i) => (i === idx ? val : n)));
    const removeResearcher = (idx) =>
        setResearcherNames((prev) => prev.filter((_, i) => i !== idx));

    const canProceed =
        projectName.trim() &&
        researcherNames.some((n) => n.trim()) &&
        institution.trim() &&
        category &&
        applicationLetter &&
        proposalFile &&
        turnItInReport;

    const handleBack = () => {
        if (projectName.trim() || researcherNames.some((n) => n.trim()) || institution.trim()) {
            setShowDraftModal(true);
        } else {
            navigate(-1);
        }
    };

    const handleSaveDraft = () => {
        dispatch(
            saveDraft({
                id: draftId ?? undefined,
                title: projectName.trim() || 'Untitled Draft',
                researcherNames,
                institution,
                college,
                department,
                category,
                supervisor,
                supervisorEmail,
                turnItInReport: turnItInReport ? { name: turnItInReport.name, size: turnItInReport.size } : d.turnItInReport,
            })
        );
        navigate('/dashboard/submissions');
    };

    const handleDiscard = () => navigate(-1);

    const handleProceedToPayment = () => {
        // Save form data to Redux before navigating so it isn't lost
        const savedId = draftId ?? Date.now();
        dispatch(
            saveDraft({
                id: savedId,
                title: projectName.trim() || 'Untitled Draft',
                researcherNames,
                institution,
                college,
                department,
                category,
                supervisor,
                supervisorEmail,
                turnItInReport: turnItInReport ? { name: turnItInReport.name, size: turnItInReport.size } : d.turnItInReport,
            })
        );
        // TODO (backend): POST /api/submissions with form data
        navigate(`/dashboard/submissions/payment?draft=${savedId}`);
    };

    return (
        <div className="min-h-screen bg-[#F3F4F6]">
            {/* ── Top bar ─────────────────────────────────────────────────────────── */}
            <div className="flex items-center justify-between px-4 sm:px-6 lg:px-10 pt-6 lg:pt-8 pb-4 lg:pb-6">
                <div className="flex items-center gap-3 sm:gap-4">
                    <button
                        onClick={handleBack}
                        className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                        aria-label="Go back"
                    >
                        <ArrowLeft size={18} className="text-gray-700" />
                    </button>
                    <h1 className="text-xl font-bold text-gray-900">
                        {draftItem ? 'Continue your proposal' : 'Submit a proposal'}
                    </h1>
                </div>
                <button
                    onClick={handleProceedToPayment}
                    disabled={!canProceed}
                    className={`px-6 py-2.5 rounded-full font-bold text-sm transition-colors ${canProceed
                        ? 'bg-[#003B95] hover:bg-blue-900 text-white'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                >
                    Proceed to Payment
                </button>
            </div>

            {/* ── Form ────────────────────────────────────────────────────────────── */}
            <div className="px-4 sm:px-6 lg:px-10 pb-12 lg:pb-16 max-w-2xl">
                {/* Project name */}
                <div className="mb-6">
                    <label className="block font-semibold text-gray-900 text-sm mb-2">Project name</label>
                    <input
                        value={projectName}
                        onChange={(e) => setProjectName(e.target.value)}
                        className="w-full bg-[#E5E7EB] rounded-xl px-4 py-3 text-sm text-gray-800 outline-none focus:ring-2 focus:ring-[#003B95] transition-all"
                    />
                </div>

                {/* Researcher names */}
                <div className="mb-6">
                    <label className="block font-semibold text-gray-900 text-sm mb-0.5">
                        Researcher name{' '}
                        <span className="font-normal text-gray-400">(Surname first, first name, middle name, matric number)</span>
                    </label>
                    <div className="space-y-2 mt-2">
                        {researcherNames.map((name, idx) => (
                            <div key={idx} className="flex items-center gap-2">
                                <input
                                    value={name}
                                    onChange={(e) => updateResearcher(idx, e.target.value)}
                                    className="flex-1 bg-[#E5E7EB] rounded-xl px-4 py-3 text-sm text-gray-800 outline-none focus:ring-2 focus:ring-[#003B95] transition-all"
                                    placeholder="Surname, First name, Middle name, Matric No."
                                />
                                {researcherNames.length > 1 && (
                                    <button onClick={() => removeResearcher(idx)} className="p-1.5 hover:bg-gray-200 rounded-full transition-colors">
                                        <X size={14} className="text-gray-500" />
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                    <button onClick={addResearcher} className="mt-2 text-sm text-[#003B95] font-semibold hover:underline">
                        Add a researcher name
                    </button>
                </div>

                {/* Institution */}
                <div className="mb-6">
                    <label className="block font-semibold text-gray-900 text-sm mb-2">Institution</label>
                    <input value={institution} onChange={(e) => setInstitution(e.target.value)}
                        className="w-full bg-[#E5E7EB] rounded-xl px-4 py-3 text-sm text-gray-800 outline-none focus:ring-2 focus:ring-[#003B95] transition-all" />
                </div>

                {/* College/School */}
                <div className="mb-6">
                    <label className="block font-semibold text-gray-900 text-sm mb-2">College/School</label>
                    <input value={college} onChange={(e) => setCollege(e.target.value)}
                        className="w-full bg-[#E5E7EB] rounded-xl px-4 py-3 text-sm text-gray-800 outline-none focus:ring-2 focus:ring-[#003B95] transition-all" />
                </div>

                {/* Department */}
                <div className="mb-6">
                    <label className="block font-semibold text-gray-900 text-sm mb-2">Department</label>
                    <input value={department} onChange={(e) => setDepartment(e.target.value)}
                        className="w-full bg-[#E5E7EB] rounded-xl px-4 py-3 text-sm text-gray-800 outline-none focus:ring-2 focus:ring-[#003B95] transition-all" />
                </div>

                {/* Category */}
                <div className="mb-6">
                    <label className="block font-semibold text-gray-900 text-sm mb-3">Category</label>
                    <div className="flex flex-wrap gap-4">
                        {CATEGORIES.map((cat) => (
                            <label key={cat} className="flex items-center gap-2 cursor-pointer" onClick={() => setCategory(cat)}>
                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${category === cat ? 'border-[#003B95] bg-[#003B95]' : 'border-gray-400 bg-white'
                                    }`}>
                                    {category === cat && <div className="w-2 h-2 rounded-full bg-white" />}
                                </div>
                                <span className="text-sm font-medium text-gray-700">{cat}</span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Supervisor */}
                <div className="mb-6">
                    <label className="block font-semibold text-gray-900 text-sm mb-2">Supervisor</label>
                    <input value={supervisor} onChange={(e) => setSupervisor(e.target.value)}
                        className="w-full bg-[#E5E7EB] rounded-xl px-4 py-3 text-sm text-gray-800 outline-none focus:ring-2 focus:ring-[#003B95] transition-all" />
                </div>

                {/* Supervisor Email */}
                <div className="mb-8">
                    <label className="block font-semibold text-gray-900 text-sm mb-2">Supervisor email</label>
                    <input value={supervisorEmail} onChange={(e) => setSupervisorEmail(e.target.value)}
                        type="email"
                        className="w-full bg-[#E5E7EB] rounded-xl px-4 py-3 text-sm text-gray-800 outline-none focus:ring-2 focus:ring-[#003B95] transition-all" />
                </div>

                {/* File uploads */}
                <div className="space-y-5">
                    <div>
                        <p className="font-semibold text-gray-900 text-sm mb-2">Application letter for ethical clearance</p>
                        <FileDropzone label="Attach your Signed Application letter" file={applicationLetter} onChange={setApplicationLetter} />
                    </div>
                    <div>
                        <p className="font-semibold text-gray-900 text-sm mb-2">Proposal</p>
                        <FileDropzone label="Attach your proposal" file={proposalFile} onChange={setProposalFile} />
                    </div>
                    <div>
                        <p className="font-semibold text-gray-900 text-sm mb-2">Turn-It-In Report</p>
                        <FileDropzone label="Attach your Turn-It-In report" file={turnItInReport} onChange={setTurnItInReport} />
                    </div>
                </div>
            </div>

            {/* ── Save Draft Modal ─────────────────────────────────────────────────── */}
            {showDraftModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" />
                    <div className="relative bg-white rounded-3xl w-full max-w-sm p-8 text-center shadow-2xl">
                        <button
                            onClick={() => setShowDraftModal(false)}
                            className="absolute right-4 top-4 p-1.5 hover:bg-gray-100 rounded-full"
                            aria-label="Close"
                        >
                            <X size={16} className="text-gray-500" />
                        </button>
                        <h3 className="text-lg font-bold text-gray-900 mb-6">Would you like to save your progress?</h3>
                        <div className="flex gap-3">
                            <button
                                onClick={handleDiscard}
                                className="flex-1 py-3 rounded-full bg-[#C10000] text-white font-bold text-sm hover:bg-red-700 transition-colors"
                            >
                                No
                            </button>
                            <button
                                onClick={handleSaveDraft}
                                className="flex-1 py-3 rounded-full bg-[#003B95] text-white font-bold text-sm hover:bg-blue-900 transition-colors"
                            >
                                Save Draft
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default NewSubmission;
