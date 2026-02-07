import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { moduleService } from '../api/moduleService.js';
import toast from 'react-hot-toast';
import { Video, FileText, HelpCircle, Upload, ArrowLeft, Unlock } from 'lucide-react';

const AddContent = () => {
  const { moduleId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  const [type, setType] = useState('video'); 

  // Combined State
  const [form, setForm] = useState({
    title: '',
    description: '', // Used for Video description & Quiz URL
    instruction: '', // NEW: Specific for Assignment
    maxScore: 100,   // NEW: Specific for Assignment (Default 100)
    file: null,
    isFree: false
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // --- VALIDATION ---
    if (!form.title) return toast.error("Title is required");

    if (type === 'video' && !form.file) return toast.error("Video file is required");
    if (type === 'assignment' && !form.file) return toast.error("Assignment PDF is required");

    // Google Form Validation
    if (type === 'quiz') {
      const googleFormPattern = /^https?:\/\/(docs\.google\.com\/forms|forms\.gle)/;
      // We use 'description' to store the Quiz URL
      if (!googleFormPattern.test(form.description)) {
        return toast.error("Please enter a valid Google Form URL");
      }
    }

    // --- BUILD FORM DATA ---
    const formData = new FormData();
    formData.append('title', form.title);
    formData.append('isFree', form.isFree);

    // 1. VIDEO LOGIC
    if (type === 'video') {
      if (form.description) formData.append('description', form.description);
      formData.append('video', form.file); // Backend expects field 'video'
    } 

    // 2. ASSIGNMENT LOGIC (Strictly matching your Schema)
    else if (type === 'assignment') {
      // Schema fields: instruction, maxScore, instructionPdfUrl (via file)
      formData.append('instruction', form.instruction); 
      formData.append('maxScore', form.maxScore);
      formData.append('assignment', form.file); // Backend expects field 'assignment'
    }

    // 3. QUIZ LOGIC
    else if (type === 'quiz') {
      // Schema: quizUrl
      formData.append('quizUrl', form.description); // Mapping description input to quizUrl
      formData.append('description', "External Google Form Quiz"); 
    }

    setLoading(true);
    try {
      await moduleService.createContent(moduleId, type, formData);
      toast.success("Content Added Successfully!");
      navigate(`/module/${moduleId}`);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Upload Failed");
    } finally {
      setLoading(false);
    }
  };

  // Helper for switching tabs
  const TypeBtn = ({ id, icon: Icon, label }) => (
    <button 
      type="button"
      onClick={() => {
        setType(id);
        // Reset specific fields on switch, preserve title
        setForm(prev => ({ ...prev, file: null, description: '', instruction: '' }));
      }}
      style={{
        flex: 1, padding: '15px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
        border: type === id ? '2px solid black' : '1px solid #ddd',
        background: type === id ? 'black' : 'white',
        color: type === id ? 'white' : '#666',
        cursor: 'pointer', borderRadius: '8px', transition: 'all 0.2s'
      }}
    >
      <Icon size={24} />
      <span style={{fontWeight: '500', fontSize:'0.9rem'}}>{label}</span>
    </button>
  );

  return (
    <div className="app-container">
      <Sidebar />
      <main className="main-content">
        <button onClick={() => navigate(`/module/${moduleId}`)} style={{display: 'flex', alignItems: 'center', gap: '5px', background: 'transparent', marginBottom: '20px', color: '#666'}}>
          <ArrowLeft size={20} /> Back to Module
        </button>

        <div className="form-container" style={{maxWidth: '700px', margin:'0 auto'}}>
          <h2 style={{marginBottom: '20px'}}>Add Content</h2>

          <div style={{display: 'flex', gap: '15px', marginBottom: '30px'}}>
            <TypeBtn id="video" icon={Video} label="Video Lesson" />
            <TypeBtn id="assignment" icon={FileText} label="Assignment" />
            <TypeBtn id="quiz" icon={HelpCircle} label="Quiz Link" />
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Title</label>
              <input 
                className="form-input" 
                placeholder="Content Title"
                required 
                value={form.title}
                onChange={e => setForm({...form, title: e.target.value})} 
              />
            </div>

            <div className="form-group" style={{background:'#f0fdf4', padding:'15px', borderRadius:'8px', border:'1px solid #bbf7d0'}}>
               <label style={{display:'flex', alignItems:'center', gap:'10px', cursor:'pointer', color:'#166534', fontWeight:'500'}}>
                 <input 
                   type="checkbox" 
                   style={{width:'20px', height:'20px'}}
                   checked={form.isFree} 
                   onChange={e => setForm({...form, isFree: e.target.checked})} 
                 />
                 <Unlock size={18} />
                 Mark as Free Preview
               </label>
            </div>

            {/* VIDEO INPUTS */}
            {type === 'video' && (
              <>
                <div className="form-group">
                  <label className="form-label">Video Description (Optional)</label>
                  <textarea className="form-input" rows="2" value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
                </div>
                <div className="form-group">
                  <label className="form-label">Upload Video (MP4)</label>
                  <input type="file" className="form-input" accept="video/*" onChange={e => setForm({...form, file: e.target.files[0]})} />
                </div>
              </>
            )}

            {/* ASSIGNMENT INPUTS (Updated) */}
            {type === 'assignment' && (
              <>
                <div className="form-group">
                  <label className="form-label">Instructions</label>
                  <textarea 
                    className="form-input" 
                    rows="4" 
                    placeholder="Specific instructions for this assignment..."
                    required
                    value={form.instruction} // Maps to schema 'instruction'
                    onChange={e => setForm({...form, instruction: e.target.value})}
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label">Max Score</label>
                  <input 
                    type="number" 
                    className="form-input" 
                    min="1"
                    value={form.maxScore} // Maps to schema 'maxScore'
                    onChange={e => setForm({...form, maxScore: e.target.value})} 
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Assignment File (PDF)</label>
                  <input 
                    type="file" 
                    className="form-input" 
                    accept=".pdf,.doc,.docx"
                    onChange={e => setForm({...form, file: e.target.files[0]})} 
                  />
                </div>
              </>
            )}

            {/* QUIZ INPUTS */}
            {type === 'quiz' && (
              <div className="form-group">
                <label className="form-label">Google Form Link</label>
                <input 
                  type="url"
                  className="form-input" 
                  placeholder="https://docs.google.com/forms/..."
                  required
                  value={form.description} // Maps to 'quizUrl'
                  onChange={e => setForm({...form, description: e.target.value})}
                />
              </div>
            )}

            <button disabled={loading} className="btn btn-primary" style={{width: '100%', marginTop: '20px', padding:'12px'}}>
              {loading ? 'Uploading...' : 'Add Content'}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default AddContent;