import { useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, BookOpen, LogOut, PlusCircle } from 'lucide-react';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isInstructor = user.role === 'instructor';

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const NavItem = ({ to, icon: Icon, label }) => (
    <div 
      className={`sidebar-item ${location.pathname === to ? 'active' : ''}`}
      onClick={() => navigate(to)}
    >
      <div className="icon"><Icon size={24} /></div>
      <span>{label}</span>
    </div>
  );

  return (
    <div className="sidebar">
      {/* 1. Common Dashboard */}
      <NavItem to="/" icon={LayoutDashboard} label="Modules" />

      {/* 2. Instructor Specific */}
      {isInstructor && (
        <NavItem to="/create" icon={PlusCircle} label="Create Module" />
      )}

      {/* 3. Student Specific */}
      {!isInstructor && (
        <NavItem to="/my-enrollments" icon={BookOpen} label="My Enrollments" />
      )}

      <div style={{ marginTop: 'auto' }}></div>
      
      <div className="sidebar-item" onClick={handleLogout}>
        <div className="icon"><LogOut size={24} /></div>
        <span>Logout</span>
      </div>
    </div>
  );
};

export default Sidebar;