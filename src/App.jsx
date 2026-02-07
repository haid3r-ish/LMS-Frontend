import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import CreateModule from './pages/CreateModule';
import ModuleDetails from './pages/ModuleDetails';
import AddContent from './pages/AddContent';
import ViewContent from './pages/ViewContent';
import MyLearning from './pages/MyLearning'; // This is your enrollment page component

function App() {
  const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem('token');
    return token ? children : <Navigate to="/login" />;
  };

  return (
    <Router>
      <Toaster position="top-right" />
      <Routes>
        {/* Public */}
        <Route path="/login" element={<Login />} />
        
        {/* Protected */}
        <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        
        {/* --- THIS IS THE ROUTE YOUR SIDEBAR NEEDS --- */}
        <Route path="/my-enrollments" element={
          <ProtectedRoute><MyLearning /></ProtectedRoute>
        } />
        
        <Route path="/create" element={<ProtectedRoute><CreateModule /></ProtectedRoute>} />
        <Route path="/module/:id" element={<ProtectedRoute><ModuleDetails /></ProtectedRoute>} />
        <Route path="/module/:moduleId/add-content" element={<ProtectedRoute><AddContent /></ProtectedRoute>} />
        <Route path="/module/:moduleId/view/:contentId" element={<ProtectedRoute><ViewContent /></ProtectedRoute>} />
      </Routes>
    </Router>
  );
}

export default App;