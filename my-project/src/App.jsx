import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Assignments from './components/Assignments';
import ReviewDetails from './components/ReviewDetails';
import CommentsPage from './components/CommentsPage';
import ApplicationView from './components/ApplicationView';
import Responses from './components/Responses';
import Notifications from './components/Notifications';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/assignments" element={<Assignments />} />
        <Route path="/responses" element={<Responses />} />
        <Route path="/review-details/:id" element={<ReviewDetails />} />
        <Route path="/assignments/:id/comments" element={<CommentsPage />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/application/:id" element={<ApplicationView />} />
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;