import React, { useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { ArrowLeft, CheckCircle, Upload } from 'lucide-react';
import { notifyAssignmentChange } from '../../features/assignments/assignmentsSlice';

const AttachProposal = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const assignments = useSelector((s) => s.assignments.items);
    const item = assignments.find((a) => String(a.id) === String(id));

    const [selectedFile, setSelectedFile] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [dragOver, setDragOver] = useState(false);
    const fileInputRef = useRef(null);

    const handleFile = (file) => {
        if (!file) return;
        // TODO (backend): validate file type, upload file to server
        setSelectedFile(file);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDragOver(false);
        const file = e.dataTransfer.files?.[0];
        handleFile(file);
    };

    const handleSubmit = () => {
        if (!selectedFile) return;
        // TODO (backend): POST /api/proposals/:id/resubmit  { file: selectedFile }
        // Notify Redux that changes have been made — triggers a notification for reviewer
        dispatch(notifyAssignmentChange(Number(id)));
        setSubmitted(true);
    };

    if (!item) {
        return (
            <div className="min-h-screen bg-[#F3F4F6] flex items-center justify-center">
                <p className="text-gray-400 font-bold">Proposal not found.</p>
            </div>
        );
    }

    /* ── Success screen ──────────────────────────────────────────────────────── */
    if (submitted) {
        return (
            <div className="min-h-screen bg-[#F3F4F6] p-4 sm:p-8 lg:p-10">
                {/* Back */}
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-1.5 text-gray-500 hover:text-gray-800 mb-8 transition-colors"
                >
                    <ArrowLeft size={18} />
                </button>

                {/* Header */}
                <div className="mb-10">
                    <h1 className="text-xl font-bold text-gray-900 max-w-xl leading-snug">{item.title}</h1>
                    <p className="text-sm text-gray-500 mt-1">Application ID: {item.applicationCode}</p>
                </div>

                {/* Success graphic + message */}
                <div className="flex flex-col items-center text-center mt-4">
                    <div className="w-28 h-28 rounded-full border-[3px] border-[#003B95] flex items-center justify-center mb-8">
                        <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
                            <path d="M10 26L21 37L42 15" stroke="#003B95" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>

                    <h2 className="text-xl font-bold text-gray-900 mb-2">Your proposal has been submitted</h2>
                    <p className="text-sm text-gray-400 max-w-xs">
                        Updates on your application status will be shared via your dashboard
                    </p>

                    <button
                        onClick={() => navigate('/dashboard')}
                        className="mt-8 bg-[#003B95] hover:bg-blue-900 text-white px-8 py-3 rounded-full font-bold text-sm transition-colors"
                    >
                        Go to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    /* ── Upload screen ───────────────────────────────────────────────────────── */
    return (
        <div className="min-h-screen bg-[#F3F4F6] p-4 sm:p-8 lg:p-10">
            {/* Back */}
            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-1.5 text-gray-500 hover:text-gray-800 mb-8 transition-colors"
            >
                <ArrowLeft size={18} />
            </button>

            {/* Header */}
            <div className="mb-10">
                <h1 className="text-xl font-bold text-gray-900 max-w-xl leading-snug">{item.title}</h1>
                <div className="flex items-center gap-6 text-sm text-gray-500 mt-1">
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
            </div>

            {/* Upload area */}
            <div className="max-w-xl">
                <p className="text-sm font-bold text-gray-800 mb-3">Updated Proposal</p>

                {/* Dropzone */}
                <div
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={handleDrop}
                    className={`cursor-pointer rounded-2xl border-2 border-dashed transition-colors flex flex-col items-center justify-center py-10 px-6 text-center ${dragOver
                            ? 'border-[#003B95] bg-blue-50'
                            : 'border-gray-300 bg-[#E5E7EB] hover:border-[#003B95] hover:bg-gray-200'
                        }`}
                >
                    <Upload size={24} className="text-gray-400 mb-3" />
                    <p className="font-semibold text-gray-700 text-sm">
                        {selectedFile ? selectedFile.name : 'Attach your proposal'}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                        {selectedFile
                            ? `${(selectedFile.size / 1024).toFixed(1)} KB — ready to submit`
                            : 'Ensure your proposal is in .doc or .docx'}
                    </p>
                </div>

                {/* Hidden file input */}
                <input
                    ref={fileInputRef}
                    type="file"
                    accept=".doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    className="hidden"
                    onChange={(e) => handleFile(e.target.files?.[0])}
                />

                {/* Submit button */}
                <div className="flex justify-center mt-8">
                    <button
                        onClick={handleSubmit}
                        disabled={!selectedFile}
                        className={`px-8 py-3 rounded-full font-bold text-sm transition-colors ${selectedFile
                                ? 'bg-[#003B95] hover:bg-blue-900 text-white'
                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            }`}
                    >
                        Submit Proposal
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AttachProposal;
