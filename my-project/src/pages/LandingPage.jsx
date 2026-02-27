import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, Menu, X, ArrowLeft, ChevronRight } from 'lucide-react';

const LandingPage = () => {
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isAboutOpen, setIsAboutOpen] = useState(false);
    const [currentView, setCurrentView] = useState('home');
    const [sopSubView, setSopSubView] = useState('steps'); // 'steps' or 'consent'
    const [openStep, setOpenStep] = useState(null);

    const heroImage = '/buhrec_hero_clean_hq_1772149923365.png';
    const objectiveImage = '/Screenshot 2026-02-26 231433.png';
    const nhrecLogo = '/download.jpg';
    const requirementsImage = '/Screenshot 2026-02-26 233303.png';

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [currentView, sopSubView]);

    const loginLinks = [
        { label: 'Researchers', path: '/login/researcher' },
        { label: 'Reviewers', path: '/login/reviewer' },
        { label: 'Administrator', path: '/login/admin' },
    ];

    const handleNavClick = (view) => {
        setCurrentView(view);
        setIsAboutOpen(false);
        setIsMenuOpen(false);
    };

    const renderHome = () => (
        <>
            <section className="relative h-[60vh] sm:h-[80vh] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0">
                    <img src={heroImage} alt="Research background" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/50" />
                </div>
                <div className="relative text-center px-4 max-w-4xl mx-auto">
                    <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white leading-tight uppercase tracking-tight">
                        Babcock University Health Research <br /> Ethics Committee (BUHREC)
                    </h1>
                </div>
            </section>

            <section className="py-16 sm:py-24 px-4 bg-white">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    <div className="order-2 md:order-1 rounded-2xl overflow-hidden shadow-2xl skew-y-1">
                        <img src={objectiveImage} alt="Collaboration" className="w-full h-auto" />
                    </div>
                    <div className="order-1 md:order-2 text-center md:text-left space-y-6">
                        <h2 className="text-2xl sm:text-3xl font-black text-[#003B95] uppercase tracking-widest">Our Objective</h2>
                        <p className="text-gray-700 text-sm sm:text-base leading-relaxed font-medium">
                            The main objective of Babcock University Health Research Ethics Committee is to enhance, uphold and ensure that the quality of researches which emanate from Babcock University are of utmost standards, thereby leading Babcock University to excellence and giving it visibility worldwide.
                            <br /><br />
                            This can be achieved by adopting system thinking, which is by working cooperatively.
                        </p>
                        <button
                            onClick={() => setCurrentView('objectives')}
                            className="bg-[#003B95] text-white px-8 py-3 rounded-md font-black text-xs uppercase tracking-widest hover:bg-blue-900 transition-all active:scale-95"
                        >
                            View Our Objectives
                        </button>
                    </div>
                </div>
            </section>

            <section className="py-20 bg-[#003B95] text-white px-4">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center text-center md:text-left">
                    <div className="space-y-6">
                        <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-widest">NHREC Mission</h2>
                        <p className="text-blue-100 text-sm sm:text-base font-medium max-w-xl mx-auto md:mx-0">
                            BUHREC upholds and promotes the mission of the National Health Research Ethics Committee (NHREC)
                        </p>
                        <button
                            onClick={() => setCurrentView('nhrec-mission')}
                            className="bg-white text-[#003B95] px-8 py-2.5 rounded-full font-black text-[10px] uppercase tracking-widest hover:bg-gray-100 transition-all active:scale-95"
                        >
                            View The Mission
                        </button>
                    </div>
                    <div className="flex justify-center md:justify-end">
                        <div className="w-64 h-64 bg-white p-6 rounded-2xl shadow-xl rotate-3 hover:rotate-0 transition-transform duration-500">
                            <img src={nhrecLogo} alt="NHREC Logo" className="w-full h-full object-contain" />
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-16 sm:py-24 px-4 bg-[#F8FAFC]">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    <div className="rounded-2xl overflow-hidden shadow-2xl -rotate-1">
                        <img src={requirementsImage} alt="Unity" className="w-full h-auto" />
                    </div>
                    <div className="text-center md:text-left space-y-6">
                        <h2 className="text-2xl sm:text-3xl font-black text-[#003B95] uppercase tracking-widest">Ethical Clearance Requirements</h2>
                        <p className="text-gray-700 text-sm sm:text-base leading-relaxed font-medium">
                            All BSc., MSc., M.Phil., PhD, PG Diploma, and independent research projects must obtain ethical clearance from the Babcock University Health Research Ethics Committee (BUHREC) before commencement.
                            <br /><br />
                            Submit a well-structured proposal with required sections, an endorsed application letter, plagiarism report within approved limits, and both hard and soft copies as specified.
                        </p>
                        <button
                            onClick={() => setCurrentView('sops')}
                            className="bg-[#003B95] text-white px-8 py-3 rounded-md font-black text-xs uppercase tracking-widest hover:bg-blue-900 transition-all active:scale-95"
                        >
                            View Full Guidelines
                        </button>
                    </div>
                </div>
            </section>
        </>
    );

    const renderObjectives = () => (
        <>
            <section className="relative h-[40vh] sm:h-[50vh] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0">
                    <img src={heroImage} alt="Research background" className="w-full h-full object-cover opacity-80" />
                    <div className="absolute inset-0 bg-[#003B95]/40" />
                </div>
                <div className="relative text-center px-4">
                    <h1 className="text-3xl sm:text-5xl font-black text-white uppercase tracking-[0.2em]">Our Objective</h1>
                </div>
            </section>
            <section className="py-16 sm:py-24 px-4 max-w-4xl mx-auto">
                <div className="space-y-12">
                    <div className="text-center space-y-6">
                        <p className="text-gray-800 text-lg sm:text-xl font-medium leading-relaxed">
                            The main objective of Babcock University Health Research Ethics Committee is to enhance, uphold and ensure that the quality of researches which emanate from Babcock University are of utmost standards, thereby leading Babcock University to excellence and giving it visibility worldwide.
                            <br /><br />
                            This can be achieved by adopting system thinking, which is by working cooperatively.
                        </p>
                    </div>
                    <div className="bg-gray-50 p-8 sm:p-12 rounded-3xl border border-gray-100 shadow-sm space-y-8">
                        <h3 className="text-xl font-black text-[#003B95] uppercase tracking-wider">Please take note of the following points:</h3>
                        <ul className="space-y-6">
                            {[
                                'All students are expected to submit their research proposals and requests for ethical clearance, preferably during the first semester, and always well ahead of their pre-field presentation.',
                                'Supervisors are ensure that students obtain ethical clearance certificates before being allowed to do their pre-field presentation.',
                                'Supervisors are to partner with BUHREC in monitoring the research as it goes on till completion'
                            ].map((item, idx) => (
                                <li key={idx} className="flex items-start gap-4 text-gray-700 font-semibold leading-relaxed">
                                    <span className="mt-2 w-2 h-2 shrink-0 rounded-full bg-[#003B95]" />
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="flex justify-center">
                        <button onClick={() => setCurrentView('home')} className="flex items-center gap-2 text-[#003B95] font-black uppercase text-sm tracking-widest hover:underline">
                            <ArrowLeft size={18} /> Back to Home
                        </button>
                    </div>
                </div>
            </section>
        </>
    );

    const renderNHRECMission = () => (
        <>
            <section className="relative h-[40vh] sm:h-[50vh] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0">
                    <img src={heroImage} alt="Research background" className="w-full h-full object-cover opacity-80" />
                    <div className="absolute inset-0 bg-[#003B95]/40" />
                </div>
                <div className="relative text-center px-4">
                    <h1 className="text-3xl sm:text-5xl font-black text-white uppercase tracking-[0.2em]">NHREC MISSION</h1>
                </div>
            </section>
            <section className="py-16 sm:py-24 px-4 max-w-5xl mx-auto">
                <div className="space-y-12">
                    <div className="text-center space-y-4">
                        <p className="text-gray-800 text-lg font-bold leading-relaxed max-w-3xl mx-auto">
                            BUHREC upholds and promotes the mission of the National Health Research Ethics Committee (NHREC)
                        </p>
                        <h2 className="text-xl font-black text-[#003B95] uppercase tracking-widest">NHREC Mission</h2>
                    </div>
                    <div className="space-y-8">
                        <div className="space-y-4">
                            <p className="text-gray-700 font-bold">The National Health Research Ethics Committee shall:</p>
                            <ul className="grid grid-cols-1 gap-4">
                                {[
                                    'Determine guidelines for the functioning of health research ethics committees;',
                                    'Register and audit health research ethics committees;',
                                    'Set norms and standards for conducting research on humans and animals, including norms and standards for conducting clinical trials;',
                                    'Adjudicate in complaints about the functioning of health research ethics committees and hear any complaint by a researcher who believes that he has been discriminated against by a health research ethics committee;',
                                    'Refer to the relevant statutory health professional council matters involving the violation or potential violation of an ethical or professional rule by a health care provider;',
                                    'Institute such disciplinary action as may be prescribed against any person found to be in violation of any norms and standards, or guidelines, set for the conduct of research under this Act; and',
                                    'Advise the Federal Ministry of Health and State Ministries on any ethical issues concerning research.'
                                ].map((item, idx) => (
                                    <li key={idx} className="flex items-start gap-4 text-gray-700 text-sm font-semibold leading-relaxed group">
                                        <span className="mt-1.5 w-1.5 h-1.5 shrink-0 rounded-full bg-[#003B95] group-hover:scale-125 transition-transform" />
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                    <div className="flex justify-center pt-8">
                        <button onClick={() => setCurrentView('home')} className="flex items-center gap-2 text-[#003B95] font-black uppercase text-sm tracking-widest hover:underline">
                            <ArrowLeft size={18} /> Back to Home
                        </button>
                    </div>
                </div>
            </section>
        </>
    );

    const renderSOPs = () => {
        const steps = [
            'Application Letter', 'Title', 'Introduction', 'Objective', 'Literature Review', 'Methodology', 'Study Population',
            'Study Product (where applicable)', 'Study Procedure (where applicable)', 'Assessment of Safety (where applicable)',
            'Clinical Management (where applicable)', 'Statistics, data handling and record keeping', 'Other requirements', 'Further Information'
        ];
        const consentChecklist = [
            'End of the research', 'Purpose(s) of research', 'Very brief information on the procedures of the research',
            'Compensation (available or not available)', 'Consequences of participants\' decision to withdraw from research also procedure for orderly termination of participation',
            'Modality of providing treatments and action(s) to be taken in case of injury or adverse event (where applicable)',
            'What happens to research results, participants and communities when the research has completed (where applicable)',
            'Post-research benefits to participants (where applicable)', 'Any apparent or potential conflict of interest by the researcher',
            'Contact person information including contact address, telephone, fax, e-mail and any other relevant information of researcher(s)',
            'Name and signature of researcher and date'
        ];
        return (
            <>
                <section className="relative h-[40vh] sm:h-[50vh] flex items-center justify-center overflow-hidden">
                    <div className="absolute inset-0">
                        <img src={heroImage} alt="Research background" className="w-full h-full object-cover opacity-80" />
                        <div className="absolute inset-0 bg-[#003B95]/40" />
                    </div>
                    <div className="relative text-center px-4">
                        <h1 className="text-3xl sm:text-5xl font-black text-white uppercase tracking-[0.15em]">BUHREC SOPs and Guidelines</h1>
                    </div>
                </section>
                <section className="py-16 sm:py-24 px-4 bg-white max-w-5xl mx-auto">
                    <div className="space-y-12">
                        <div className="space-y-6 text-center">
                            <h2 className="text-xl font-black text-yellow-500 uppercase tracking-widest">Submission PROCEDURE</h2>
                            <div className="bg-gray-50 border border-gray-100 p-8 rounded-3xl text-sm sm:text-base text-gray-800 font-bold leading-relaxed max-w-4xl mx-auto italic">
                                Categories of researcher: BSc., MSc., M.Phil., PhD, PG Diploma, Independent researchers.
                                <br /><br />
                                A well written protocol, which contains all the information listed below, as may be relevant to each discipline, should be submitted when requesting for Ethical clearance.
                            </div>
                        </div>
                        <div className="space-y-10">
                            <div className="flex justify-center border-b border-gray-100">
                                <div className="flex gap-12">
                                    <button onClick={() => setSopSubView('steps')} className={`pb-4 text-sm font-black uppercase tracking-widest transition-all ${sopSubView === 'steps' ? 'text-yellow-500 border-b-4 border-yellow-500' : 'text-gray-400 hover:text-gray-600'}`}>Steps</button>
                                    <button onClick={() => setSopSubView('consent')} className={`pb-4 text-sm font-black uppercase tracking-widest transition-all ${sopSubView === 'consent' ? 'text-yellow-500 border-b-4 border-yellow-500' : 'text-gray-400 hover:text-gray-600'}`}>Consent Checklist</button>
                                </div>
                            </div>
                            {sopSubView === 'steps' ? (
                                <div className="space-y-3">
                                    {steps.map((step, idx) => (
                                        <div key={idx} className="bg-[#F8FAFC] border border-gray-100 rounded-lg overflow-hidden transition-all hover:border-[#003B95]/30">
                                            <button onClick={() => setOpenStep(openStep === idx ? null : idx)} className="w-full flex justify-between items-center p-5 text-left group">
                                                <span className="text-sm font-bold text-gray-700 group-hover:text-[#003B95]">Step {idx + 1}: {step}</span>
                                                <ChevronRight size={18} className={`text-gray-400 transition-transform ${openStep === idx ? 'rotate-90 text-[#003B95]' : ''}`} />
                                            </button>
                                            {openStep === idx && <div className="px-5 pb-5 pt-2 text-sm text-gray-600 font-medium border-t border-white">{
                                                ({
                                                    'Application Letter': 'A formal letter addressed to the Chair of BUHREC requesting ethical clearance. Must include the title of research, names and affiliations of all researchers, and the expected duration of the study.',
                                                    'Title': 'The full title of the research project. Should be clear, concise, and accurately reflect the scope of the study.',
                                                    'Introduction': 'Provide the background and context of the research, including the problem statement, justification, and relevance of the study.',
                                                    'Objective': 'State the general and specific objectives of the research clearly and precisely.',
                                                    'Literature Review': 'Summarize relevant previous studies and identify gaps in knowledge that the proposed research intends to address.',
                                                    'Methodology': 'Describe the research design, sampling technique, data collection methods, instruments to be used, and data analysis plan.',
                                                    'Study Population': 'Define the target population, inclusion and exclusion criteria, and the sample size with justification.',
                                                    'Study Product (where applicable)': 'If applicable, describe the product being studied, including dosage, formulation, administration route, and storage requirements.',
                                                    'Study Procedure (where applicable)': 'Outline the step-by-step procedure for the study, including the sequence of events and timelines for each phase.',
                                                    'Assessment of Safety (where applicable)': 'Describe the safety monitoring plan, adverse event reporting procedures, and any stopping rules for the study.',
                                                    'Clinical Management (where applicable)': 'Describe the clinical management plan, including how participants will be monitored and managed during and after the study.',
                                                    'Statistics, data handling and record keeping': 'Explain the statistical methods to be used, data management procedures, confidentiality measures, and record-keeping protocols.',
                                                    'Other requirements': 'Include any additional documents such as informed consent forms, questionnaires, data collection tools, and CVs of researchers.',
                                                    'Further Information': 'Any additional information relevant to the ethical review, including funding sources, potential conflicts of interest, and institutional approvals.',
                                                })[step] || `Details for ${step} are being prepared.`
                                            }</div>}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="bg-[#F8FAFC] p-8 sm:p-12 rounded-3xl border border-gray-100 shadow-sm space-y-8 max-w-4xl mx-auto">
                                    <h3 className="text-lg font-black text-[#003B95] uppercase tracking-wider">Informed Consent Checklist</h3>
                                    <ul className="space-y-6">
                                        {consentChecklist.map((item, idx) => (
                                            <li key={idx} className="flex items-start gap-4 text-gray-800 font-bold text-sm leading-relaxed"><span className="mt-1.5 w-1.5 h-1.5 shrink-0 rounded-full bg-[#003B95]" /><span>{item}</span></li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                        <div className="flex justify-center">
                            <button onClick={() => setCurrentView('home')} className="flex items-center gap-2 text-[#003B95] font-black uppercase text-sm tracking-widest hover:underline">
                                <ArrowLeft size={18} /> Back to Home
                            </button>
                        </div>
                    </div>
                </section>
            </>
        );
    };

    const renderContact = () => (
        <>
            <section className="relative h-[40vh] sm:h-[50vh] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0">
                    <img src={heroImage} alt="Research background" className="w-full h-full object-cover opacity-80" />
                    <div className="absolute inset-0 bg-[#003B95]/40" />
                </div>
                <div className="relative text-center px-4">
                    <h1 className="text-3xl sm:text-5xl font-black text-white uppercase tracking-[0.2em]">Contact Us</h1>
                </div>
            </section>
            <section className="py-20 px-4 bg-white">
                <div className="max-w-4xl mx-auto text-center space-y-12">
                    <div className="p-10 bg-[#F8FAFC] rounded-3xl shadow-sm border border-gray-100 space-y-8">
                        <div className="space-y-2">
                            <p className="text-lg font-bold text-gray-800">Babcock University, Ilishan-Remo, Ogun State, Nigeria</p>
                            <p className="text-gray-600 font-semibold">Office: Room 109, 1st floor SAT Building.</p>
                        </div>
                        <div className="pt-4 space-y-4">
                            <p className="text-sm font-black text-[#003B95] uppercase tracking-widest">Phone: 09058096760</p>
                            <p className="text-sm font-black text-[#003B95] uppercase tracking-widest">
                                Email: <a href="mailto:buhrec@gmail.com" className="underline hover:text-blue-700">buhrec@gmail.com</a>
                            </p>
                        </div>
                    </div>
                    <button onClick={() => setCurrentView('home')} className="flex items-center gap-2 mx-auto text-[#003B95] font-black uppercase text-sm tracking-widest hover:underline">
                        <ArrowLeft size={18} /> Back to Home
                    </button>
                </div>
            </section>
        </>
    );

    const renderAboutUs = () => (
        <>
            <section className="relative h-[40vh] sm:h-[50vh] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0">
                    <img src={heroImage} alt="Research background" className="w-full h-full object-cover opacity-80" />
                    <div className="absolute inset-0 bg-[#003B95]/40" />
                </div>
                <div className="relative text-center px-4">
                    <h1 className="text-3xl sm:text-5xl font-black text-white uppercase tracking-[0.2em]">About Us</h1>
                </div>
            </section>
            <section className="py-20 px-4 bg-white">
                <div className="max-w-4xl mx-auto space-y-12">
                    <div className="bg-[#F8FAFC] p-10 sm:p-16 rounded-3xl border border-gray-100 shadow-sm leading-loose">
                        <p className="text-gray-800 text-lg font-bold">
                            The BUHREC reviews all proposals having focus on human health in line with the definition of 'Health' by the WHO.
                        </p>
                        <ul className="mt-8 space-y-4 text-gray-800 font-bold">
                            {['Undergraduate students', 'Postgraduate students', 'Staff and Faculty', 'Community applicants'].map((item, idx) => (
                                <li key={idx} className="flex items-center gap-4"><span className="w-2 h-2 rounded-full bg-yellow-500" />{item}</li>
                            ))}
                        </ul>
                    </div>
                    <div className="flex justify-center pt-8">
                        <button onClick={() => setCurrentView('home')} className="flex items-center gap-2 text-[#003B95] font-black uppercase text-sm tracking-widest hover:underline">
                            <ArrowLeft size={18} /> Back to Home
                        </button>
                    </div>
                </div>
            </section>
        </>
    );

    return (
        <div className="min-h-screen bg-white font-sans text-gray-900">
            <nav className="fixed top-0 left-0 right-0 bg-[#003B95] text-white z-50 shadow-md">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16 sm:h-20">
                        <div className="flex-shrink-0 flex items-center cursor-pointer" onClick={() => setCurrentView('home')}>
                            <span className="text-xl sm:text-2xl font-black tracking-tighter">BUHREC</span>
                        </div>
                        <div className="hidden md:flex items-center space-x-8">
                            {loginLinks.map((link) => (
                                <button key={link.label} onClick={() => navigate(link.path)} className="text-sm font-bold hover:text-blue-200 transition-colors uppercase tracking-wider">{link.label}</button>
                            ))}
                            <div className="relative">
                                <button onClick={() => setIsAboutOpen(!isAboutOpen)} className={`flex items-center space-x-1 text-sm font-bold transition-colors uppercase tracking-wider ${currentView !== 'home' ? 'text-blue-200 underline underline-offset-8' : 'hover:text-blue-200'}`}>
                                    <span>About</span> <ChevronDown size={14} className={`transition-transform ${isAboutOpen ? 'rotate-180' : ''}`} />
                                </button>
                                {isAboutOpen && (
                                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl py-2 text-gray-800 z-50 border border-gray-100 overflow-hidden">
                                        {[
                                            { label: 'About Us', view: 'about-us' },
                                            { label: 'Our Objective', view: 'objectives' },
                                            { label: 'NHREC Mission', view: 'nhrec-mission' },
                                            { label: 'Contact Us', view: 'contact' },
                                            { label: 'SOPs and Guidelines', view: 'sops' }
                                        ].map((item) => (
                                            <button key={item.label} onClick={() => handleNavClick(item.view)} className={`w-full text-left px-6 py-4 text-xs font-black uppercase tracking-widest transition-colors ${currentView === item.view ? 'bg-blue-50 text-[#003B95]' : 'hover:bg-gray-50'}`}>{item.label}</button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="md:hidden flex items-center">
                            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2">{isMenuOpen ? <X size={24} /> : <Menu size={24} />}</button>
                        </div>
                    </div>
                </div>
                {isMenuOpen && (
                    <div className="md:hidden bg-[#002D72] border-t border-white/10 px-4 pt-2 pb-6 space-y-2">
                        {loginLinks.map((link) => (
                            <button key={link.label} onClick={() => { navigate(link.path); setIsMenuOpen(false); }} className="block w-full text-left py-3 text-sm font-bold uppercase tracking-wider">{link.label}</button>
                        ))}
                        <div className="pt-2 border-t border-white/10">
                            {[{ label: 'About Us', view: 'about-us' }, { label: 'Our Objective', view: 'objectives' }, { label: 'NHREC Mission', view: 'nhrec-mission' }, { label: 'Contact Us', view: 'contact' }, { label: 'SOPs and Guidelines', view: 'sops' }].map((item) => (
                                <button key={item.label} onClick={() => handleNavClick(item.view)} className={`block w-full text-left px-4 py-3 text-sm font-semibold uppercase tracking-widest ${currentView === item.view ? 'text-yellow-400' : ''}`}>{item.label}</button>
                            ))}
                        </div>
                    </div>
                )}
            </nav>
            <main className="mt-16 sm:mt-20 min-h-[60vh]">
                {currentView === 'home' && renderHome()}
                {currentView === 'objectives' && renderObjectives()}
                {currentView === 'nhrec-mission' && renderNHRECMission()}
                {currentView === 'about-us' && renderAboutUs()}
                {currentView === 'sops' && renderSOPs()}
                {currentView === 'contact' && renderContact()}
            </main>
            <footer className="bg-[#1A1A1A] text-white py-12 sm:py-20 px-4">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 sm:gap-24 text-center md:text-left">
                    <div className="space-y-6">
                        <h3 className="text-2xl font-black tracking-tighter">BUHREC</h3>
                        <p className="text-gray-400 text-sm font-medium max-w-md mx-auto md:mx-0">
                            Babcock University, Ilishan-Remo, Ogun State, Nigeria
                            <br /> Office: Room 109, 1st floor SAT Building,
                            <br /> Phone: 09058096760
                            <br /> Email: <a href="mailto:buhrec@gmail.com" className="underline hover:text-white transition-colors">buhrec@gmail.com</a>
                        </p>
                    </div>
                    <div className="flex flex-col justify-end items-center md:items-end space-y-6">
                        <div className="flex flex-wrap justify-center md:justify-end gap-6">
                            {['About', 'Objectives', 'Guidelines', 'Contact'].map((item, idx) => (
                                <button key={idx} onClick={() => setCurrentView(['about-us', 'objectives', 'sops', 'contact'][idx])} className="text-xs font-black text-gray-500 hover:text-white uppercase tracking-widest transition-colors">{item}</button>
                            ))}
                        </div>
                        <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest opacity-60">© 2026 Babcock University BUHREC</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
