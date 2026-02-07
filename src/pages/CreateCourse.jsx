import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { moduleService } from '../api/moduleService.js';
import toast from 'react-hot-toast';

const CreateCourse = () => {
  const { moduleId } = useParams(); // Got from URL
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState('');
  const [video, setVideo] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!video) return toast.error("Video is required");

    const formData = new FormData();
    formData.append('title', title);
    formData.append('video', video);

    setLoading(true);
    try {
      // Calls the specific Course API
      await moduleService.createCourse(moduleId, formData);
      toast.success("Video Uploaded!");
      navigate(`/module/${moduleId}`); // Go back to Module Details
    } catch (err) {
      toast.error("Upload Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <Sidebar />
      <main className="main-content">
        <div className="form-container">
          <h2>Add Course Video</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Course Title</label>
              <input className="form-input" required onChange={e => setTitle(e.target.value)} />
            </div>
            
            <div className="form-group">
              <label className="form-label">Video File</label>
              <input type="file" className="form-input" accept="video/*" required
                onChange={e => setVideo(e.target.files[0])} />
            </div>

            <button disabled={loading} className="btn btn-primary" style={{width:'100%'}}>
              {loading ? 'Uploading Video...' : 'Upload Course'}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default CreateCourse;