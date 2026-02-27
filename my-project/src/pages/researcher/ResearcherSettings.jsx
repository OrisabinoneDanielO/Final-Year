import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { selectUser, login, updateRegisteredResearcher } from '../../features/auth/authSlice';
import { ArrowLeft, Save, Camera, Eye, EyeOff } from 'lucide-react';

const INPUT_CLS =
  'w-full bg-[#F3F4F6] rounded-xl px-4 py-3 text-sm text-gray-800 outline-none focus:ring-2 focus:ring-[#003B95] transition-all placeholder:text-gray-400';

const MIN_PASSWORD_LEN = 6;

const ResearcherSettings = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const fileRef = useRef(null);

  const researcher = useSelector((s) =>
    s.auth.registeredResearchers.find((r) => r.email.toLowerCase() === user?.email?.toLowerCase())
  );

  const [form, setForm] = useState({
    name: researcher?.name || user?.name || '',
    institution: researcher?.institution || '',
    occupation: researcher?.occupation || '',
    phone: researcher?.phone || '',
    department: researcher?.department || '',
  });
  const [photoPreview, setPhotoPreview] = useState(researcher?.photo || user?.photo || null);
  const [saved, setSaved] = useState(false);

  // Password change state
  const [pw, setPw] = useState({ current: '', newPw: '', confirm: '' });
  const [pwError, setPwError] = useState('');
  const [pwSuccess, setPwSuccess] = useState(false);
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);

  const set = (key) => (e) => { setForm((f) => ({ ...f, [key]: e.target.value })); setSaved(false); };

  const initials = (form.name || 'U')
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  // ── Profile picture handler ─────────────────────────────────────────────
  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) return;
    if (file.size > 2 * 1024 * 1024) {
      alert('Image must be under 2 MB');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setPhotoPreview(reader.result);
    reader.readAsDataURL(file);
    setSaved(false);
  };

  // ── Save profile handler ────────────────────────────────────────────────
  const handleSave = () => {
    const updates = {
      email: user.email,
      name: form.name.trim() || user.name,
      institution: form.institution.trim(),
      occupation: form.occupation.trim(),
      phone: form.phone.trim(),
      department: form.department.trim(),
      photo: photoPreview || researcher?.photo || null,
    };
    dispatch(updateRegisteredResearcher(updates));
    dispatch(login({ ...user, name: form.name.trim() || user.name, photo: photoPreview || user.photo }));
    setSaved(true);
  };

  // ── Change password handler ─────────────────────────────────────────────
  const handlePasswordChange = () => {
    setPwError('');
    setPwSuccess(false);
    if (!pw.current || !pw.newPw || !pw.confirm) {
      setPwError('Please fill in all password fields');
      return;
    }
    if (!researcher || pw.current !== researcher.password) {
      setPwError('Current password is incorrect');
      return;
    }
    if (pw.newPw.length < MIN_PASSWORD_LEN) {
      setPwError(`New password must be at least ${MIN_PASSWORD_LEN} characters`);
      return;
    }
    if (pw.newPw !== pw.confirm) {
      setPwError('New passwords do not match');
      return;
    }
    dispatch(updateRegisteredResearcher({ email: user.email, password: pw.newPw }));
    setPw({ current: '', newPw: '', confirm: '' });
    setPwSuccess(true);
  };

  return (
    <div className="bg-white min-h-screen p-4 sm:p-8 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <ArrowLeft size={22} className="text-gray-900" />
          </button>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">My Profile</h1>
        </div>
        <button
          onClick={handleSave}
          className="flex items-center gap-2 bg-[#003B95] hover:bg-blue-900 text-white px-6 py-2.5 rounded-full font-bold text-sm transition-all active:scale-95 shadow-md"
        >
          <Save size={16} /> Save
        </button>
      </div>

      {saved && (
        <div className="mb-6 p-3 bg-green-50 text-green-700 rounded-xl text-sm font-semibold border border-green-200 text-center">
          Profile updated successfully!
        </div>
      )}

      {/* ── Avatar with camera overlay ────────────────────────────────────── */}
      <div className="flex justify-center mb-8">
        <div className="relative group">
          <div className="w-24 h-24 rounded-full bg-[#003B95]/20 flex items-center justify-center text-[#003B95] font-bold text-3xl border-4 border-gray-100 shadow-md overflow-hidden">
            {photoPreview ? (
              <img src={photoPreview} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              initials
            )}
          </div>
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="absolute bottom-0 right-0 w-8 h-8 bg-[#003B95] rounded-full flex items-center justify-center border-2 border-white shadow-md hover:bg-blue-900 transition-colors"
          >
            <Camera size={14} className="text-white" />
          </button>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
        </div>
      </div>

      <div className="mb-5">
        <label className="block text-sm font-semibold text-gray-800 mb-1.5">Email</label>
        <input className={`${INPUT_CLS} opacity-60 cursor-not-allowed`} value={user?.email || ''} disabled />
      </div>

      <div className="mb-5">
        <label className="block text-sm font-semibold text-gray-800 mb-1.5">Full Name</label>
        <input className={INPUT_CLS} value={form.name} onChange={set('name')} />
      </div>

      <div className="mb-5">
        <label className="block text-sm font-semibold text-gray-800 mb-1.5">Institution</label>
        <input className={INPUT_CLS} value={form.institution} onChange={set('institution')} />
      </div>

      <div className="flex flex-col sm:flex-row gap-5 mb-5">
        <div className="flex-1">
          <label className="block text-sm font-semibold text-gray-800 mb-1.5">Department</label>
          <input className={INPUT_CLS} value={form.department} onChange={set('department')} />
        </div>
        <div className="flex-1">
          <label className="block text-sm font-semibold text-gray-800 mb-1.5">Occupation</label>
          <input className={INPUT_CLS} value={form.occupation} onChange={set('occupation')} />
        </div>
      </div>

      <div className="mb-5">
        <label className="block text-sm font-semibold text-gray-800 mb-1.5">Phone</label>
        <input className={INPUT_CLS} value={form.phone} onChange={set('phone')} placeholder="e.g. +234 801 234 5678" />
      </div>

      {/* ── Change Password Section ───────────────────────────────────────── */}
      <div className="mt-10 pt-8 border-t border-gray-200">
        <h2 className="text-lg font-bold text-gray-900 mb-5">Change Password</h2>

        {pwError && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-xl text-sm font-semibold border border-red-200">
            {pwError}
          </div>
        )}
        {pwSuccess && (
          <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-xl text-sm font-semibold border border-green-200">
            Password changed successfully!
          </div>
        )}

        <div className="mb-5">
          <label className="block text-sm font-semibold text-gray-800 mb-1.5">Current Password</label>
          <div className="relative">
            <input
              type={showCurrentPw ? 'text' : 'password'}
              className={INPUT_CLS}
              value={pw.current}
              onChange={(e) => { setPw((p) => ({ ...p, current: e.target.value })); setPwError(''); setPwSuccess(false); }}
              placeholder="Enter current password"
            />
            <button type="button" onClick={() => setShowCurrentPw((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              {showCurrentPw ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-5 mb-5">
          <div className="flex-1">
            <label className="block text-sm font-semibold text-gray-800 mb-1.5">New Password</label>
            <div className="relative">
              <input
                type={showNewPw ? 'text' : 'password'}
                className={INPUT_CLS}
                value={pw.newPw}
                onChange={(e) => { setPw((p) => ({ ...p, newPw: e.target.value })); setPwError(''); setPwSuccess(false); }}
                placeholder="Min 6 characters"
              />
              <button type="button" onClick={() => setShowNewPw((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                {showNewPw ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          <div className="flex-1">
            <label className="block text-sm font-semibold text-gray-800 mb-1.5">Confirm New Password</label>
            <input
              type="password"
              className={INPUT_CLS}
              value={pw.confirm}
              onChange={(e) => { setPw((p) => ({ ...p, confirm: e.target.value })); setPwError(''); setPwSuccess(false); }}
              placeholder="Re-enter new password"
            />
          </div>
        </div>

        <button
          onClick={handlePasswordChange}
          className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-2.5 rounded-full font-bold text-sm transition-all active:scale-95"
        >
          Update Password
        </button>
      </div>
    </div>
  );
};

export default ResearcherSettings;
