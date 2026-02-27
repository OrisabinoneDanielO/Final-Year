import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Camera } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { addReviewer } from '../../features/reviewers/reviewersSlice';

const SPECIALIZATIONS = [
    'Public Health & Epidemiology',
    'Clinical Psychology',
    'Anatomy & Cell Biology',
    'Biomedical Sciences',
    'Nursing & Midwifery',
    'Pharmacology',
    'Epidemiology',
    'Medical Biochemistry',
    'Other',
];

const FIELD = ({ label, children }) => (
    <div className="mb-5">
        <label className="block text-sm font-semibold text-gray-800 mb-1.5">{label}</label>
        {children}
    </div>
);

const INPUT_CLS =
    'w-full bg-[#E5E7EB] rounded-xl px-4 py-3 text-sm text-gray-800 outline-none focus:ring-2 focus:ring-[#003B95] transition-all placeholder:text-gray-400';

const AddReviewer = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const fileRef = useRef(null);

    const [photo, setPhoto] = useState(null);
    const [form, setForm] = useState({
        name: '',
        institution: '',
        email: '',
        password: '',
        title: '',
        specialization: '',
        yearsOfExperience: '',
    });
    const [error, setError] = useState('');

    const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Revoke the previous objectURL to prevent memory leaks
            if (photo) URL.revokeObjectURL(photo);
            setPhoto(URL.createObjectURL(file));
        }
    };

    const handleCreate = () => {
        if (!form.name.trim() || !form.institution.trim() || !form.email.trim()) {
            setError('Name, Institution, and Email are required.');
            return;
        }
        if (!form.password || form.password.length < 6) {
            setError('Please set a password (at least 6 characters) for the reviewer.');
            return;
        }

        dispatch(addReviewer({
            id: Date.now(),
            name: form.name.trim(),
            title: form.title,
            specialization: form.specialization.trim(),
            institution: form.institution.trim(),
            email: form.email.trim(),
            password: form.password,
            yearsOfExperience: parseInt(form.yearsOfExperience) || 0,
            ongoingAssignments: 0,
            avatar: photo,
            stats: { accepted: 0, completed: 0, incomplete: 0, pendingFeedback: 0 },
        }));

        navigate('/dashboard/reviewers');
    };

    return (
        <div className="min-h-screen bg-[#F3F4F6]">
            {/* ── Header ─────────────────────────────────────────────────────────── */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 pt-6 pb-2">
                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-1.5 hover:bg-gray-200 rounded-full transition-colors"
                        aria-label="Go back"
                    >
                        <ArrowLeft size={22} className="text-gray-800" />
                    </button>
                    <h1 className="text-xl font-bold text-gray-900">Add Reviewer</h1>
                </div>
                <button
                    onClick={handleCreate}
                    className="w-full sm:w-auto bg-[#003B95] hover:bg-blue-900 text-white px-8 py-3 rounded-full font-black text-xs uppercase tracking-widest transition-all shadow-md active:scale-95"
                >
                    Create Reviewer
                </button>
            </div>

            {/* ── Form ─────────────────────────────────────────────────────────────── */}
            <div className="max-w-2xl mx-auto px-6 pb-16 pt-6">
                {/* Photo upload */}
                <div className="flex justify-center mb-8">
                    <button
                        onClick={() => fileRef.current?.click()}
                        className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden hover:bg-gray-300 transition-colors relative border-4 border-white shadow-sm"
                        aria-label="Upload photo"
                    >
                        {photo ? (
                            <img src={photo} alt="Reviewer" className="w-full h-full object-cover" />
                        ) : (
                            <Camera size={28} className="text-gray-600" />
                        )}
                    </button>
                    <input
                        ref={fileRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handlePhotoChange}
                    />
                </div>

                {/* Error */}
                {error && (
                    <p className="text-sm text-[#C10000] font-semibold mb-4 text-center bg-red-50 p-3 rounded-xl">{error}</p>
                )}

                {/* Full-width fields */}
                <FIELD label="Reviewer Name">
                    <input
                        className={INPUT_CLS}
                        value={form.name}
                        onChange={set('name')}
                        placeholder=""
                    />
                </FIELD>

                <FIELD label="Institution">
                    <input
                        className={INPUT_CLS}
                        value={form.institution}
                        onChange={set('institution')}
                        placeholder=""
                    />
                </FIELD>

                <FIELD label="Email">
                    <input
                        type="email"
                        className={INPUT_CLS}
                        value={form.email}
                        onChange={set('email')}
                        placeholder=""
                    />
                </FIELD>

                <FIELD label="Initial Password">
                    <input
                        type="text"
                        className={INPUT_CLS}
                        value={form.password}
                        onChange={set('password')}
                        placeholder="Min 6 characters — share with the reviewer"
                    />
                </FIELD>

                {/* Two-column row: Title + Specialization - Stacks on mobile */}
                <div className="flex flex-col sm:flex-row gap-5 mb-5">
                    <div className="flex-1">
                        <label className="block text-sm font-semibold text-gray-800 mb-1.5">Reviewer Title</label>
                        <input
                            className={INPUT_CLS}
                            value={form.title}
                            onChange={set('title')}
                            placeholder="e.g. Prof., Dr."
                        />
                    </div>
                    <div className="flex-1">
                        <label className="block text-sm font-semibold text-gray-800 mb-1.5">Specialization</label>
                        <div className="relative">
                            <select
                                value={form.specialization}
                                onChange={set('specialization')}
                                className={`${INPUT_CLS} appearance-none pr-8`}
                            >
                                <option value=""></option>
                                {SPECIALIZATIONS.map((s) => (
                                    <option key={s} value={s}>{s}</option>
                                ))}
                            </select>
                            <svg className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6" /></svg>
                        </div>
                    </div>
                </div>

                {/* Years of Experience — half width on tablet/desktop, full on mobile */}
                <div className="w-full sm:w-1/2 sm:pr-2">
                    <label className="block text-sm font-semibold text-gray-800 mb-1.5">Years of Experience</label>
                    <input
                        type="number"
                        min="0"
                        className={INPUT_CLS}
                        value={form.yearsOfExperience}
                        onChange={set('yearsOfExperience')}
                        placeholder=""
                    />
                </div>
            </div>
        </div>
    );
};

export default AddReviewer;
