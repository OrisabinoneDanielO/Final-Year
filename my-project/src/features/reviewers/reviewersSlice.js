import { createSlice } from '@reduxjs/toolkit';

const INITIAL_REVIEWERS = [
    {
        id: 1,
        name: 'Prof. Imisioluwa Hannah',
        specialization: 'Public Health & Epidemiology',
        institution: 'Babcock University',
        title: 'Professor',
        email: 'i.hannah@babcock.edu.ng',
        password: 'reviewer123',
        yearsOfExperience: 15,
        ongoingAssignments: 10,
        avatar: null,
        stats: { accepted: 10, completed: 2, incomplete: 8, pendingFeedback: 3 },
    },
    {
        id: 2,
        name: 'Prof. Adeyemi Samuel',
        specialization: 'Clinical Psychology',
        institution: 'Babcock University',
        title: 'Professor',
        email: 'a.samuel@babcock.edu.ng',
        password: 'reviewer123',
        yearsOfExperience: 12,
        ongoingAssignments: 8,
        avatar: null,
        stats: { accepted: 8, completed: 4, incomplete: 4, pendingFeedback: 2 },
    },
    {
        id: 3,
        name: 'Dr. Okafor Chinwe',
        specialization: 'Anatomy & Cell Biology',
        institution: 'Babcock University',
        title: 'Doctor',
        email: 'c.okafor@babcock.edu.ng',
        password: 'reviewer123',
        yearsOfExperience: 8,
        ongoingAssignments: 5,
        avatar: null,
        stats: { accepted: 5, completed: 3, incomplete: 2, pendingFeedback: 1 },
    },
    {
        id: 4,
        name: 'Prof. Adetunde Adeyemo',
        specialization: 'Biomedical Sciences',
        institution: 'Babcock University',
        title: 'Professor',
        email: 'a.adeyemo@babcock.edu.ng',
        password: 'reviewer123',
        yearsOfExperience: 20,
        ongoingAssignments: 12,
        avatar: null,
        stats: { accepted: 12, completed: 6, incomplete: 6, pendingFeedback: 4 },
    },
    {
        id: 5,
        name: 'Dr. Balogun Fatima',
        specialization: 'Public Health & Epidemiology',
        institution: 'Babcock University',
        title: 'Doctor',
        email: 'f.balogun@babcock.edu.ng',
        password: 'reviewer123',
        yearsOfExperience: 6,
        ongoingAssignments: 3,
        avatar: null,
        stats: { accepted: 3, completed: 1, incomplete: 2, pendingFeedback: 0 },
    },
];

const reviewersSlice = createSlice({
    name: 'reviewers',
    initialState: { items: INITIAL_REVIEWERS },
    reducers: {
        addReviewer(state, action) {
            state.items.push(action.payload);
        },
        removeReviewer(state, action) {
            state.items = state.items.filter((r) => r.id !== action.payload);
        },
        updateReviewer(state, action) {
            const idx = state.items.findIndex((r) => r.id === action.payload.id);
            if (idx !== -1) state.items[idx] = { ...state.items[idx], ...action.payload };
        },
    },
});

export const { addReviewer, removeReviewer, updateReviewer } = reviewersSlice.actions;
export default reviewersSlice.reducer;
