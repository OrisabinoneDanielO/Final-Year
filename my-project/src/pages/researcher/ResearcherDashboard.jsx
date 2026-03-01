import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { selectUser, sendOtp, verifyOtp } from '../../features/auth/authSlice';
import { Bell, X, CheckCircle } from 'lucide-react';

// ── Component ─────────────────────────────────────────────────────────────────
const ResearcherDashboard = () => {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const researcherUnreadCount = useSelector(
    (s) => (s.notifications.items ?? []).filter((n) => !n.read).length
  );

  // OTP modal state
  const [otpModalOpen, setOtpModalOpen] = useState(false);
  const [enteredOtp, setEnteredOtp] = useState(['', '', '', '', '', '']);
  const [otpError, setOtpError] = useState('');
  const [_otpSent, setOtpSent] = useState(false);
  const [successModal, setSuccessModal] = useState(false);

  // ── OTP refs for auto-advance ──────────────────────────────────────────────
  const inputRefs = Array.from({ length: 6 }, () => React.createRef());

  const handleSendOtp = () => {
    dispatch(sendOtp({ email: user.email }));
    setOtpSent(true);
    setOtpModalOpen(true);
    setEnteredOtp(['', '', '', '', '', '']);
    setOtpError('');
  };

  const handleOtpChange = (value, index) => {
    if (!/^\d?$/.test(value)) return;
    const updated = [...enteredOtp];
    updated[index] = value;
    setEnteredOtp(updated);
    setOtpError('');
    if (value && index < 5) inputRefs[index + 1].current?.focus();
  };

  const handleOtpKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !enteredOtp[index] && index > 0) {
      inputRefs[index - 1].current?.focus();
    }
  };

  const handleVerifyOtp = () => {
    const entered = enteredOtp.join('');
    if (entered.length < 6) { setOtpError('Please enter all 6 digits.'); return; }

    dispatch(verifyOtp({ email: user.email, otp: entered }))
      .unwrap()
      .then(() => {
        setOtpModalOpen(false);
        setSuccessModal(true);
      })
      .catch(() => {
        setOtpError('Incorrect OTP. Please try again.');
      });
  };

  // ── Derived stats from Redux ───────────────────────────────────────────────
  const allAssignments = useSelector((s) => s.proposals.items);
  const completedCount = allAssignments.filter((a) => a.status === 'Completed').length;
  const draftCount = allAssignments.filter((a) => a.status === 'Unaccepted').length;
  const ongoingAssignments = allAssignments.filter((a) => a.status === 'Ongoing' || a.status === 'Not Reviewed');
  const ongoingStatus = ongoingAssignments.length > 0 ? 'Under Review' : 'None';

  const displayName = (user?.name || user?.email?.split('@')[0] || 'Researcher').split(/[\s._-]/)[0];

  return (
    <div className="bg-white min-h-screen p-4 sm:p-6 lg:p-8">

      {/* ── Verification Alert (unverified only) ─────────────────────────── */}
      {!user?.isVerified && (
        <div className="bg-[#FEF9C3] border border-[#EAB308]/30 rounded-2xl px-5 py-4 flex items-start justify-between mb-6 gap-4">
          <div>
            <p className="text-[#854D0E] font-bold text-sm">Please verify your email</p>
            <p className="text-[#A16207] text-xs mt-0.5">
              You must verify your email to submit a proposal to the BUHREC
            </p>
          </div>
          <button
            onClick={handleSendOtp}
            className="shrink-0 text-[#854D0E] font-bold text-sm underline hover:text-[#6B3C0B] transition-colors"
          >
            Verify email
          </button>
        </div>
      )}

      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <header className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="w-full sm:w-auto">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 capitalize">Welcome, {displayName}</h1>
          <p className="text-gray-500 text-sm font-medium mt-0.5">Here are your stats!</p>
        </div>
        <div className="self-start sm:self-auto">
          <button
            onClick={() => navigate('/dashboard/notifications')}
            className="relative p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
          >
            <Bell size={20} />
            {researcherUnreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-[#C10000] text-white text-[9px] font-bold flex items-center justify-center">
                {researcherUnreadCount}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* ── Stats row ────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        <div className="bg-[#F3F4F6] rounded-2xl p-6">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Completed Proposals</p>
          <p className="text-3xl font-bold text-gray-900">{completedCount}</p>
        </div>
        <div className="bg-[#F3F4F6] rounded-2xl p-6">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Draft Proposals</p>
          <p className="text-3xl font-bold text-gray-900">{draftCount}</p>
        </div>
        <div className="bg-[#F3F4F6] rounded-2xl p-6">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Ongoing Proposal Status</p>
          <p className="text-3xl font-bold text-gray-900">{ongoingStatus}</p>
        </div>
      </div>

      {/* ── Ongoing Proposal Status section ──────────────────────────────────── */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">Ongoing Proposal Status</h2>
        {user?.isVerified && (
          <button
            onClick={() => navigate('/dashboard/submissions/new')}
            className="bg-[#003B95] text-white px-6 py-2.5 rounded-full font-bold text-sm hover:bg-blue-900 transition-colors"
          >
            New Submission
          </button>
        )}
      </div>

      {/* Timeline / empty state */}
      {ongoingStatus === 'None' || !user?.isVerified ? (
        <div className="text-center py-16">
          <p className="text-gray-400 font-bold text-lg">You have no ongoing proposals</p>
        </div>
      ) : (
        <div className="space-y-3 max-w-2xl">
          {(() => {
            const latest = ongoingAssignments[0];
            const dateStr = latest?.date
              ? new Date(latest.date).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })
              : '—';
            const steps = [
              { label: 'Your proposal is under review', date: dateStr, active: true },
              { label: 'Your proposal has been assigned to a reviewer', date: dateStr, active: false },
              { label: 'Your proposal has been submitted', date: dateStr, active: false },
            ];
            return steps.map((step, i) => (
            <div key={i} className="flex items-start gap-4">
              <span className={`mt-0.5 w-3 h-3 rounded-full shrink-0 ${step.active ? 'bg-[#003B95]' : 'bg-gray-300'}`} />
              <div className="flex-1 flex justify-between">
                <p className={`text-sm font-medium ${step.active ? 'text-gray-900' : 'text-gray-400'}`}>
                  {step.label}
                </p>
                <p className={`text-sm ml-4 ${step.active ? 'text-gray-700' : 'text-gray-400'}`}>{step.date}</p>
              </div>
            </div>
          ));
          })()}
        </div>
      )}

      {/* ── OTP Modal ────────────────────────────────────────────────────────── */}
      {otpModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setOtpModalOpen(false)} />
          <div className="relative bg-white rounded-3xl w-full max-w-sm p-8 text-center shadow-2xl">
            <button
              onClick={() => setOtpModalOpen(false)}
              className="absolute right-4 top-4 p-1.5 hover:bg-gray-100 rounded-full"
              aria-label="Close"
            >
              <X size={18} className="text-gray-500" />
            </button>

            <div className="w-12 h-12 rounded-full bg-[#003B95]/10 flex items-center justify-center mx-auto mb-4">
              <Bell size={22} className="text-[#003B95]" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-1">Verify your email</h3>
            <p className="text-sm text-gray-400 mb-6">
              A 6-digit code has been sent to <span className="font-semibold text-gray-700">{user?.email}</span>. Enter it below to verify your account.
            </p>

            {/* 6-box OTP input */}
            <div className="flex justify-center gap-2 mb-4">
              {enteredOtp.map((digit, i) => (
                <input
                  key={i}
                  ref={inputRefs[i]}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(e.target.value, i)}
                  onKeyDown={(e) => handleOtpKeyDown(e, i)}
                  className="w-10 h-12 text-center text-lg font-bold bg-[#F3F4F6] rounded-xl outline-none focus:ring-2 focus:ring-[#003B95] transition-all"
                />
              ))}
            </div>

            {otpError && <p className="text-red-500 text-xs mb-3">{otpError}</p>}

            <button
              onClick={handleVerifyOtp}
              className="w-full bg-[#003B95] hover:bg-blue-900 text-white py-3 rounded-full font-bold transition-colors"
            >
              Verify
            </button>

            <button
              onClick={handleSendOtp}
              className="mt-3 text-sm text-[#003B95] font-semibold hover:underline"
            >
              Resend code
            </button>
          </div>
        </div>
      )}

      {/* ── Success Modal ─────────────────────────────────────────────────────── */}
      {successModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setSuccessModal(false)} />
          <div className="relative bg-white rounded-3xl w-full max-w-sm p-8 text-center shadow-2xl">
            <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={28} className="text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-1">Email verified!</h3>
            <p className="text-sm text-gray-400 mb-6">
              Your email has been verified. You can now submit proposals to the BUHREC.
            </p>
            <button
              onClick={() => setSuccessModal(false)}
              className="w-full bg-[#003B95] hover:bg-blue-900 text-white py-3 rounded-full font-bold transition-colors"
            >
              Get started
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResearcherDashboard;