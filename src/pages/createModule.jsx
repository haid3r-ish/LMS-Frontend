import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar.jsx';
import { moduleService } from '../api/moduleService.js';
import toast from 'react-hot-toast';

const CreateModule = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: '', description: '', price: '', category: '', difficulty: 'Beginner'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Just sends JSON, no video file yet
      await moduleService.createModule(form);
      toast.success("Module Created! Now add courses.");
      navigate('/');
    } catch (err) {
      toast.error("Failed to create module");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <Sidebar />
      <main className="main-content">
        <div className="form-container">
          <h2>Create New Module</h2>
          <p style={{color:'#666', marginBottom:'20px'}}>Create the container first. You can add videos later.</p>
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Module Title</label>
              <input className="form-input" required onChange={e => setForm({...form, title: e.target.value})} />
            </div>
            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea className="form-input" required onChange={e => setForm({...form, description: e.target.value})} />
            </div>
            <div style={{display:'flex', gap:'15px'}}>
              <div className="form-group" style={{flex:1}}>
                <label className="form-label">Price ($)</label>
                <input type="number" className="form-input" required onChange={e => setForm({...form, price: e.target.value})} />
              </div>
              <div className="form-group" style={{flex:1}}>
                <label className="form-label">Difficulty</label>
                <select className="form-input" onChange={e => setForm({...form, difficulty: e.target.value})}>
                  <option>Beginner</option>
                  <option>Intermediate</option>
                  <option>Advanced</option>
                </select>
              </div>
            </div>
            <button disabled={loading} className="btn btn-primary" style={{width:'100%'}}>
              {loading ? 'Creating...' : 'Create Module'}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default CreateModule;