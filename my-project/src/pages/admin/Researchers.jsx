import React from 'react';

const DUMMY_RESEARCHERS = [
  { id: 1, name: 'Agu Joshua Minton', matric: '22/0188', department: 'Anatomy', school: 'Ben Carson School of Medicine', submissions: 2 },
  { id: 2, name: 'Ademide Sharon', matric: '22/0889', department: 'Computer Science', school: 'School of Computing', submissions: 1 },
  { id: 3, name: 'Amaka Hadiyat', matric: '22/8787', department: 'Computer Science', school: 'School of Computing', submissions: 3 },
  { id: 4, name: 'Balogun Fatima Ola', matric: '22/1234', department: 'Public Health', school: 'School of Public Health', submissions: 0 },
  { id: 5, name: 'Okafor Chinwe David', matric: '22/5678', department: 'Biochemistry', school: 'School of Basic Sciences', submissions: 1 },
];

const Researchers = () => {
  return (
    <div className="p-8 bg-white min-h-screen">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Registered Researchers</h1>
        <p className="text-gray-500 text-sm font-medium">Here are all registered researchers!</p>
      </header>

      {/* Researchers List */}
      <div className="space-y-3">
        {DUMMY_RESEARCHERS.map((researcher) => (
          <div
            key={researcher.id}
            className="bg-[#F3F4F6] p-5 rounded-2xl flex items-center justify-between hover:shadow-sm transition-shadow"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-full bg-[#003B95]/20 flex items-center justify-center text-[#003B95] font-bold text-lg flex-shrink-0">
                {researcher.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </div>
              <div>
                <p className="font-bold text-gray-900">{researcher.name}</p>
                <p className="text-gray-500 text-sm">{researcher.department} — {researcher.school}</p>
              </div>
            </div>
            <div className="text-[#003B95] font-semibold text-sm">
              {researcher.submissions} submissions
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Researchers;
