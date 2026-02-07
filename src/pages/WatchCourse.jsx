import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { moduleService } from '../api/moduleService.js';
import { ArrowLeft } from 'lucide-react';

const WatchCourse = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const data = await moduleService.getModule(id);
        // Adjust this depending on if your backend returns { data: { module: ... } }
        setCourse(data.data?.module || data.data); 
      } catch (error) {
        console.error("Failed to load course", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [id]);

  if (loading) {
    return (
      <div className="app-container">
        <Sidebar />
        <main className="main-content" style={{display:'flex', alignItems:'center', justifyContent:'center'}}>
          <h2>Loading Class...</h2>
        </main>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="app-container">
        <Sidebar />
        <main className="main-content">
          <h2>Course not found.</h2>
          <button className="btn btn-primary" onClick={() => navigate('/')}>Go Back</button>
        </main>
      </div>
    );
  }

  return (
    <div className="app-container">
      <Sidebar />
      
      <main className="main-content">
        {/* Back Button */}
        <button 
          onClick={() => navigate('/')} 
          style={{display: 'flex', alignItems: 'center', gap: '5px', background: 'transparent', marginBottom: '20px', color: '#666'}}
        >
          <ArrowLeft size={20} /> Back to Dashboard
        </button>

        <div style={{maxWidth: '1000px', margin: '0 auto'}}>
          
          {/* VIDEO PLAYER SECTION */}
          <div style={{backgroundColor: 'black', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.2)'}}>
            {course.videoUrl ? (
              <video 
                controls 
                autoPlay 
                style={{width: '100%', aspectRatio: '16/9', display: 'block'}}
                src={course.videoUrl}
              >
                Your browser does not support the video tag.
              </video>
            ) : (
              <div style={{height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white'}}>
                Video unavailable
              </div>
            )}
          </div>

          {/* COURSE INFO SECTION */}
          <div style={{marginTop: '30px', background: 'white', padding: '30px', borderRadius: '10px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)'}}>
            <h1 style={{fontSize: '2rem', marginBottom: '10px'}}>{course.title}</h1>
            
            <div style={{display: 'flex', gap: '15px', marginBottom: '20px'}}>
              <span style={{background: '#e0e7ff', color: '#3730a3', padding: '5px 10px', borderRadius: '4px', fontSize: '0.9rem'}}>
                {course.category}
              </span>
              <span style={{background: '#f3f4f6', color: '#374151', padding: '5px 10px', borderRadius: '4px', fontSize: '0.9rem'}}>
                {course.difficulty}
              </span>
            </div>

            <h3 style={{fontSize: '1.2rem', marginBottom: '10px', borderBottom: '1px solid #eee', paddingBottom: '10px'}}>
              About this Course
            </h3>
            <p style={{lineHeight: '1.6', color: '#4b5563'}}>
              {course.description}
            </p>

            <div style={{marginTop: '30px', paddingTop: '20px', borderTop: '1px solid #eee'}}>
              <p style={{color: '#666'}}>
                <strong>Instructor:</strong> {course.instructor?.name || "Unknown Instructor"}
              </p>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default WatchCourse;