import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { moduleService } from '../api/moduleService.js';
import { BookOpen, PlayCircle, Layout } from 'lucide-react';

const MyLearning = () => {
  const navigate = useNavigate();
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEnrollments = async () => {
      try {
        const res = await moduleService.getMyEnrollments();
        // Handle data structure: res.data.enrollments OR res.data
        const data = res.data?.enrollments || res.data || [];
        
        console.log("Fetched Enrollments:", data); // Debug log
        setEnrollments(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching enrollments:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchEnrollments();
  }, []);

  if (loading) return (
    <div className="app-container">
      <Sidebar />
      <main className="main-content"><p>Loading your courses...</p></main>
    </div>
  );

  return (
    <div className="app-container">
      <Sidebar />
      <main className="main-content">
        
        <div style={{marginBottom: '30px', borderBottom:'1px solid #eee', paddingBottom:'20px'}}>
          <h1 style={{display:'flex', alignItems:'center', gap:'10px'}}>
            <BookOpen size={32} /> My Learning
          </h1>
          <p style={{color: '#666', marginTop:'5px'}}>
            You are enrolled in <strong>{enrollments.length}</strong> courses.
          </p>
        </div>

        <div className="grid">
          {enrollments.length > 0 ? (
            enrollments.map((item) => {
              // The enrollment object might have the module populated in 'module' field
              // Fallback to 'item' if the array is just modules
              const course = item.module || item; 
              
              if (!course) return null;

              return (
                <div key={item._id} className="card" style={{display:'flex', flexDirection:'column', justifyContent:'space-between'}}>
                  <div>
                    {/* Thumbnail Placeholder */}
                    <div style={{height:'120px', background:'#f3f4f6', borderRadius:'8px', display:'flex', alignItems:'center', justifyContent:'center', marginBottom:'15px'}}>
                       <Layout size={40} color="#9ca3af" />
                    </div>
                    
                    <h3 style={{fontSize: '1.2rem', marginBottom: '5px'}}>{course.title}</h3>
                    
                    {/* Completion Status (Optional - if backend sends progress) */}
                    <div style={{marginBottom: '15px'}}>
                        <span style={{fontSize:'0.8rem', background:'#dcfce7', color:'#166534', padding:'3px 8px', borderRadius:'4px'}}>
                            Enrolled
                        </span>
                    </div>
                  </div>

                  <div style={{marginTop: 'auto'}}>
                    <button 
                      className="btn btn-primary" 
                      style={{width: '100%', display:'flex', alignItems:'center', justifyContent:'center', gap:'8px'}}
                      onClick={() => navigate(`/module/${course._id}`)}
                    >
                      <PlayCircle size={18} /> Continue Learning
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div style={{gridColumn: '1/-1', textAlign: 'center', padding: '50px', background: 'white', borderRadius: '10px', border:'1px dashed #ccc'}}>
              <h3 style={{color: '#666', marginBottom:'15px'}}>No enrollments found.</h3>
              <button 
                className="btn btn-primary" 
                onClick={() => navigate('/')}
              >
                Browse Courses
              </button>
            </div>
          )}
        </div>

      </main>
    </div>
  );
};

export default MyLearning;