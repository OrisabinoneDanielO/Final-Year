import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

// States: 'awaiting' → 'paid' → 'submitted'

const ProposalPayment = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState('awaiting'); // 'awaiting' | 'paid' | 'submitted'

    const handleMakePayment = () => {
        // TODO (backend): POST /api/payments/initiate  { amount: 7000 }
        // Integrate Paystack / Flutterwave here
        setStep('paid');
    };

    const handleSubmitProposal = () => {
        // TODO (backend): POST /api/submissions/confirm  { paymentRef }
        setStep('submitted');
    };

    /* ── Submitted screen ────────────────────────────────────────────────────── */
    if (step === 'submitted') {
        return (
            <div className="min-h-screen bg-[#F3F4F6]">
                {/* Top bar — no back arrow, Go to Dashboard right */}
                <div className="flex items-center justify-between px-4 sm:px-6 lg:px-10 pt-6 lg:pt-8 pb-4 lg:pb-6">
                    <h1 className="text-xl font-bold text-gray-900">Submit a proposal</h1>
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="bg-[#003B95] hover:bg-blue-900 text-white px-6 py-2.5 rounded-full font-bold text-sm transition-colors"
                    >
                        Go to Dashboard
                    </button>
                </div>

                {/* Blue checkmark */}
                <div className="flex flex-col items-center justify-center mt-16 text-center px-6">
                    <div className="w-28 h-28 rounded-full border-[3px] border-[#003B95] flex items-center justify-center mb-8">
                        <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
                            <path d="M10 26L21 37L42 15" stroke="#003B95" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 mb-2">Your proposal has been submitted</h2>
                    <p className="text-sm text-gray-400 max-w-xs">
                        Updates on your application status will be shared via your dashboard
                    </p>
                </div>
            </div>
        );
    }

    /* ── Payment + paid screens (same layout, different content) ─────────────── */
    return (
        <div className="min-h-screen bg-[#F3F4F6]">
            {/* Top bar */}
            <div className="flex items-center justify-between px-4 sm:px-6 lg:px-10 pt-6 lg:pt-8 pb-4 lg:pb-6">
                <div className="flex items-center gap-3 sm:gap-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                        aria-label="Go back"
                    >
                        <ArrowLeft size={18} className="text-gray-700" />
                    </button>
                    <h1 className="text-xl font-bold text-gray-900">Submit a proposal</h1>
                </div>

                {/* Submit Proposal — gray until paid */}
                <button
                    onClick={step === 'paid' ? handleSubmitProposal : undefined}
                    disabled={step !== 'paid'}
                    className={`px-6 py-2.5 rounded-full font-bold text-sm transition-colors ${step === 'paid'
                            ? 'bg-[#003B95] hover:bg-blue-900 text-white cursor-pointer'
                            : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        }`}
                >
                    Submit Proposal
                </button>
            </div>

            {/* Body */}
            <div className="flex flex-col items-center justify-center mt-16 text-center px-6">
                {step === 'awaiting' ? (
                    /* ── Payment total ── */
                    <>
                        <p className="text-sm text-gray-500 mb-2">Your total is</p>
                        <p className="text-5xl font-bold text-gray-900 mb-3">N7000</p>
                        <p className="text-sm text-gray-400 max-w-xs mb-10">
                            Once payment is made, your application cannot be edited
                        </p>
                        <button
                            onClick={handleMakePayment}
                            className="bg-[#003B95] hover:bg-blue-900 text-white px-8 py-3 rounded-full font-bold text-sm transition-colors"
                        >
                            Make Payment
                        </button>
                    </>
                ) : (
                    /* ── Payment successful ── */
                    <>
                        <div className="w-28 h-28 rounded-full border-[3px] border-green-500 flex items-center justify-center mb-8">
                            <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
                                <path d="M10 26L21 37L42 15" stroke="#22c55e" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                        <h2 className="text-xl font-bold text-gray-900 mb-2">Your payment was successful</h2>
                        <p className="text-sm text-gray-400">Your can proceed to submit your application.</p>
                    </>
                )}
            </div>
        </div>
    );
};

export default ProposalPayment;
