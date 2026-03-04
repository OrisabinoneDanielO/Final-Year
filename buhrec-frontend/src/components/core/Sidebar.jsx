import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Briefcase,
  MessageSquare,
  LogOut,
  Users,
  FileText,
  CreditCard,
  FlaskConical,
} from 'lucide-react';
import { selectUser, logout } from '../../features/auth/authSlice';

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


  // Researcher sidebar: Proposals only
  { label: 'Proposals', path: '/dashboard/submissions', roles: ['researcher'], icon: <FileText size={20} /> },
];

const Sidebar = () => {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    const role = user?.role || 'reviewer';
    dispatch(logout());
    navigate(`/login/${role}`);
  };

  const getDisplayName = (user) => {
    const namePart = user?.name || user?.email?.split('@')[0];
    if (!namePart) return 'User';
    // Split by space, dot, underscore, or hyphen to get the "first name"
    return namePart.split(/[\s._-]/)[0];
  };

  const getInitials = (name) => {
    if (!name) return '??';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const displayName = getDisplayName(user);
  const initials = getInitials(user?.name || displayName);

  const userLinks = ALL_NAV_LINKS.filter(link => link.roles.includes(user?.role));

  return (
    <div className="sticky top-0 flex flex-col justify-between h-screen bg-[#003B95] py-6 w-20 md:w-72 text-white transition-all duration-300 ease-in-out z-40 shrink-0 overflow-y-auto overflow-x-hidden border-r border-[#ffffff10]">
      <div>
        <div className="mb-12 mt-4 px-4 flex justify-center md:justify-start">
          <h1 className="text-xl md:text-2xl font-bold tracking-tight hidden md:block">BUHREC</h1>
          <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center md:hidden">
            <span className="font-bold text-lg">B</span>
          </div>
        </div>

        <nav className="px-3">
          <ul className="space-y-2">
            {userLinks.map((link) => (
              <li key={link.path}>
                <NavLink
                  to={link.path}
                  end={link.path === '/dashboard'}
                  title={link.label}
                  className={({ isActive }) =>
                    `flex items-center justify-center md:justify-start md:space-x-4 py-3 px-0 md:px-6 rounded-xl transition-all duration-200 ${isActive
                      ? 'bg-[#001F4D] text-white shadow-lg'
                      : 'text-blue-100 hover:bg-white/10'
                    }`
                  }
                >
                  <div className="flex-shrink-0">{link.icon}</div>
                  <span className="font-medium hidden md:block truncate">{link.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="space-y-6 px-3">
        {/* User Profile Snippet — clickable for reviewer/researcher */}
        <button
          onClick={() => {
            if (user?.role === 'reviewer' || user?.role === 'researcher') {
              navigate('/dashboard/settings');
            }
          }}
          className={`flex items-center justify-center md:justify-start md:space-x-3 px-0 md:px-4 w-full ${
            user?.role === 'reviewer' || user?.role === 'researcher'
              ? 'cursor-pointer hover:bg-white/10 rounded-xl py-2 transition-colors'
              : ''
          }`}
          title={user?.role === 'reviewer' || user?.role === 'researcher' ? 'Edit profile' : ''}
        >
          <div className="w-10 h-10 rounded-full bg-[#001F4D] flex items-center justify-center border-2 border-white/20 flex-shrink-0 text-xs font-bold">
            {user?.photo ? (
              <img src={user.photo} alt="Profile" className="w-full h-full object-cover rounded-full" />
            ) : (
              <span>{initials}</span>
            )}
          </div>
          <div className="text-sm hidden md:block min-w-0 text-left">
            <p className="font-semibold leading-none truncate">{displayName}</p>
            <p className="text-blue-200 text-xs capitalize mt-1">{user?.role}</p>
          </div>
        </button>

        <button
          onClick={handleLogout}
          title="Log out"
          className="flex items-center justify-center md:space-x-2 w-full bg-[#B91C1C] hover:bg-red-800 text-white py-3 px-0 md:px-4 rounded-xl font-bold transition-all active:scale-95 shadow-md"
        >
          <LogOut size={20} className="flex-shrink-0" />
          <span className="hidden md:block">Log out</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;