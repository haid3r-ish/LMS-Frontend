import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../api/authService.js';
import toast from 'react-hot-toast';
import { User, Mail, Lock, Briefcase, GraduationCap, ArrowRight } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  
  // Toggle State: true = Login, false = Signup
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student' 
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        // --- LOGIN ---
        await authService.login(formData.email, formData.password);
        toast.success("Login Successful");
        
        // Force reload to Dashboard to ensure token is read
        window.location.href = '/'; 

      } else {
        // --- SIGNUP ---
        await authService.signup(formData);
        toast.success("Account Created");
        
        // Force reload to Dashboard
        window.location.href = '/'; 
      }
      
    } catch (err) {
      console.error(err);
      const errorMsg = err.response?.data?.message || "Authentication failed";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      background: '#f3f4f6',
      padding: '20px'
    }}>
      
      <div style={{
        background: 'white', 
        padding: '40px', 
        borderRadius: '16px', 
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)', 
        width: '100%', 
        maxWidth: '450px'
      }}>
        
        {/* HEADER */}
        <div style={{textAlign: 'center', marginBottom: '30px'}}>
          <h1 style={{fontSize: '2rem', fontWeight: 'bold', marginBottom: '10px'}}>
            {isLogin ? 'LMS Login' : 'Create Account'}
          </h1>
          <p style={{color: '#666'}}>
            {isLogin ? 'Enter your credentials to access your account' : 'Join us to start learning today'}
          </p>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} style={{display: 'flex', flexDirection: 'column', gap: '15px'}}>
          
          {/* NAME (Signup Only) */}
          {!isLogin && (
            <div style={{position: 'relative'}}>
              <User size={20} color="#9ca3af" style={{position: 'absolute', top: '12px', left: '12px'}} />
              <input 
                name="name"
                type="text" 
                placeholder="Full Name" 
                required 
                value={formData.name}
                onChange={handleChange}
                style={{width: '100%', padding: '12px 12px 12px 40px', borderRadius: '8px', border: '1px solid #e5e7eb', outline: 'none'}} 
              />
            </div>
          )}

          {/* EMAIL */}
          <div style={{position: 'relative'}}>
            <Mail size={20} color="#9ca3af" style={{position: 'absolute', top: '12px', left: '12px'}} />
            <input 
              name="email"
              type="email" 
              placeholder="Email Address" 
              required 
              value={formData.email}
              onChange={handleChange}
              style={{width: '100%', padding: '12px 12px 12px 40px', borderRadius: '8px', border: '1px solid #e5e7eb', outline: 'none'}} 
            />
          </div>

          {/* PASSWORD */}
          <div style={{position: 'relative'}}>
            <Lock size={20} color="#9ca3af" style={{position: 'absolute', top: '12px', left: '12px'}} />
            <input 
              name="password"
              type="password" 
              placeholder="Password" 
              required 
              value={formData.password}
              onChange={handleChange}
              style={{width: '100%', padding: '12px 12px 12px 40px', borderRadius: '8px', border: '1px solid #e5e7eb', outline: 'none'}} 
            />
          </div>

          {/* ROLE (Signup Only) */}
          {!isLogin && (
            <div style={{display: 'flex', gap: '10px', marginTop: '5px'}}>
              <label style={{flex: 1, cursor: 'pointer', padding: '10px', border: formData.role === 'student' ? '2px solid black' : '1px solid #e5e7eb', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '8px', background: formData.role === 'student' ? '#f9fafb' : 'white'}}>
                <input type="radio" name="role" value="student" checked={formData.role === 'student'} onChange={handleChange} style={{display: 'none'}} />
                <GraduationCap size={18} /> Student
              </label>
              
              <label style={{flex: 1, cursor: 'pointer', padding: '10px', border: formData.role === 'instructor' ? '2px solid black' : '1px solid #e5e7eb', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '8px', background: formData.role === 'instructor' ? '#f9fafb' : 'white'}}>
                <input type="radio" name="role" value="instructor" checked={formData.role === 'instructor'} onChange={handleChange} style={{display: 'none'}} />
                <Briefcase size={18} /> Instructor
              </label>
            </div>
          )}

          {/* SUBMIT */}
          <button 
            type="submit" 
            disabled={loading}
            style={{marginTop: '10px', padding: '12px', background: 'black', color: 'white', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', opacity: loading ? 0.7 : 1}}
          >
            {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
            {!loading && <ArrowRight size={18} />}
          </button>
        </form>

        {/* TOGGLE */}
        <div style={{marginTop: '20px', textAlign: 'center', fontSize: '0.9rem'}}>
          <span style={{color: '#666'}}>
            {isLogin ? "Don't have an account? " : "Already have an account? "}
          </span>
          <button 
            onClick={() => {
              setIsLogin(!isLogin);
              setFormData({ name: '', email: '', password: '', role: 'student' });
            }}
            style={{background: 'transparent', border: 'none', color: '#2563eb', fontWeight: 'bold', cursor: 'pointer', textDecoration: 'underline'}}
          >
            {isLogin ? 'Sign up' : 'Log in'}
          </button>
        </div>

      </div>
    </div>
  );
};

export default Login;