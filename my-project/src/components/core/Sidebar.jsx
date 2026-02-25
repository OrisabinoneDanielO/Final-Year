import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { NavLink, useNavigate } from 'react-router-dom';
import { selectUser, logout } from '../../features/auth/authSlice';
import {
  LayoutDashboard,
  Briefcase,
  MessageSquare,
  LogOut,
  Bell,
  Users,
  FileText,
  CreditCard,
  FlaskConical,
} from 'lucide-react';

const ALL_NAV_LINKS = [
  // All roles
  { label: 'Dashboard', path: '/dashboard', roles: ['reviewer', 'researcher', 'admin'], icon: <LayoutDashboard size={20} /> },

  // Admin sidebar: Reviewers, Researchers, Assignments, Payments
  { label: 'Reviewers', path: '/dashboard/reviewers', roles: ['admin'], icon: <Users size={20} /> },
  { label: 'Researchers', path: '/dashboard/researchers', roles: ['admin'], icon: <FlaskConical size={20} /> },
  { label: 'Assignments', path: '/dashboard/assignments', roles: ['reviewer', 'admin'], icon: <Briefcase size={20} /> },
  { label: 'Payments', path: '/dashboard/payments', roles: ['admin'], icon: <CreditCard size={20} /> },

  // Reviewer sidebar: Assignments, Responses, Notifications
  { label: 'Responses', path: '/dashboard/responses', roles: ['reviewer'], icon: <MessageSquare size={20} /> },
  { label: 'Notifications', path: '/dashboard/notifications', roles: ['reviewer'], icon: <Bell size={20} /> },

  // Researcher sidebar: Proposals
  { label: 'Proposals', path: '/dashboard/submissions', roles: ['researcher'], icon: <FileText size={20} /> },
];

const Sidebar = () => {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate(`/login/reviewer`);
  };

  const userLinks = ALL_NAV_LINKS.filter(link => link.roles.includes(user?.role));

  return (
    <div className="flex flex-col justify-between h-screen bg-[#003B95] p-6 w-72 text-white">
      <div>
        <div className="mb-12 mt-4 px-4">
          <h1 className="text-2xl font-bold tracking-tight">BUHREC</h1>
        </div>
        
        <nav>
          <ul className="space-y-2">
            {userLinks.map((link) => (
              <li key={link.path}>
                <NavLink
                  to={link.path}
                  end={link.path === '/dashboard'}
                  className={({ isActive }) =>
                    `flex items-center space-x-4 py-3 px-6 rounded-lg transition-all duration-200 ${
                      isActive
                        ? 'bg-[#001F4D] text-white shadow-inner'
                        : 'text-blue-100 hover:bg-blue-800'
                    }`
                  }
                >
                  {link.icon}
                  <span className="font-medium">{link.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="space-y-6">
        {/* User Profile Snippet */}
        <div className="flex items-center space-x-3 px-4">
          <div className="w-10 h-10 rounded-full bg-gray-300 overflow-hidden border-2 border-white/20">
            <img src="/avatar-placeholder.png" alt="Profile" className="w-full h-full object-cover" />
          </div>
          <div className="text-sm">
            <p className="font-semibold leading-none">{user?.name || user?.email || 'User'}</p>
            <p className="text-blue-200 text-xs capitalize mt-1">{user?.role}</p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center justify-center space-x-2 w-full bg-[#B91C1C] hover:bg-red-800 text-white py-3 px-4 rounded-lg font-bold transition-all active:scale-95"
        >
          <LogOut size={20} />
          <span>Log out</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;