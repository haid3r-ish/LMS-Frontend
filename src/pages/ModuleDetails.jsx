import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { moduleService } from '../api/moduleService.js';
import { Plus, PlayCircle, FileText, HelpCircle, Lock, Box, ArrowLeft, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const ModuleDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [module, setModule] = useState(null);
  const [courses, setCourses] = useState([]); 
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Get Module & Content
        const res = await moduleService.getModule(id);
        const moduleData = res.data?.module || res.data || res;
        setModule(moduleData);
        
        // Extract content array (verify your DB field name: 'courses' or 'content')
        setCourses(moduleData.courses || moduleData.content || []);

        // 2. Check Enrollment (Students Only)
        if (user.role !== 'instructor') {
          try {
            const enrollRes = await moduleService.checkEnrollment(id);
            setIsEnrolled(enrollRes.enrolled || enrollRes.data?.enrolled || false);
          } catch (e) {
            console.warn("Enrollment check skipped");
          }
        }
      } catch (err) {
        console.error("Error loading module:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, user.role]);

  // --- ACCESS CONTROL ---
  const isCreator = user.role === 'instructor' && (module?.instructor?._id === user.id || module?.instructor === user.id);

  const canAccess = (item) => {
    if (isCreator) return true;
    if (isEnrolled) return true;
    if (item.isFree) return true;
    return false;
  };

  const handleEnroll = async () => {
    try {
      await moduleService.enrollUser(id);
      setIsEnrolled(true);
      toast.success("Enrolled Successfully!");
    } catch (err) {
      toast.error("Enrollment Failed");
    }
  };

  // --- CLICK HANDLER ---
  const handleItemClick = (item) => {
    if (!canAccess(item)) return;

    // Navigate to Internal View Page for ALL types (Video, Assignment, Quiz)
    // The ViewContent page will handle the specific layout/redirection
    navigate(`/module/${id}/view/${item._id}`);
  };

  // --- ICONS & STYLES ---
  const getIcon = (type) => {
    switch(type) {
      case 'assignment': return <FileText size={20} />;
      case 'quiz': return <HelpCircle size={20} />;
      default: return <PlayCircle size={20} />;
    }
  };

  if (loading) return <div className="app-container"><Sidebar /><main className="main-content"><p>Loading...</p></main></div>;
  if (!module) return <div className="app-container"><Sidebar /><main className="main-content"><h2>Module Not Found</h2></main></div>;

  return (
    <div className="app-container">
      <Sidebar />
      <main className="main-content">
        <button onClick={() => navigate('/')} style={{display: 'flex', alignItems: 'center', gap: '5px', background: 'transparent', marginBottom: '20px', color: '#666'}}>
          <ArrowLeft size={20} /> Back
        </button>

        {/* HEADER */}
        <div style={{background: 'white', padding: '30px', borderRadius: '10px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)', marginBottom: '30px'}}>
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'start'}}>
            <div style={{display:'flex', gap:'20px'}}>
               <div style={{background:'#f3f4f6', padding:'20px', borderRadius:'8px'}}><Box size={40} color="#4b5563" /></div>
               <div>
                 <h1 style={{fontSize: '2rem', margin:'0 0 10px 0'}}>{module.title}</h1>
                 <p style={{color: '#666'}}>{module.description}</p>
                 <div style={{marginTop:'15px', color:'#888'}}>Price: <strong>${module.price}</strong></div>
               </div>
            </div>

            <div style={{minWidth:'200px', display:'flex', flexDirection:'column', gap:'10px'}}>
              {isCreator && (
                <button className="btn btn-primary" onClick={() => navigate(`/module/${id}/add-content`)} style={{display:'flex', alignItems:'center', gap:'8px', justifyContent:'center'}}>
                  <Plus size={18} /> Add Content
                </button>
              )}
              {!isCreator && !isEnrolled && (
                 <button className="btn btn-primary" style={{background:'#2563eb'}} onClick={handleEnroll}>
                   Enroll Now (${module.price})
                 </button>
              )}
              {!isCreator && isEnrolled && (
                <div style={{padding:'10px', background:'#dcfce7', color:'#166534', borderRadius:'5px', textAlign:'center', display:'flex', alignItems:'center', gap:'5px', justifyContent:'center'}}>
                  <CheckCircle size={18} /> Enrolled
                </div>
              )}
            </div>
          </div>
        </div>

        {/* CONTENT LIST */}
        <h3>Module Content ({courses.length})</h3>
        <div className="grid">
          {courses.length > 0 ? courses.map((item, index) => {
             const isUnlocked = canAccess(item);
             return (
              <div key={item._id || index} className="card" style={{
                  flexDirection:'row', height:'auto', alignItems:'center', padding:'15px',
                  opacity: isUnlocked ? 1 : 0.6
              }}>
                <div style={{width:'50px', height:'50px', background: isUnlocked ? '#eff6ff' : '#f3f4f6', display:'flex', alignItems:'center', justifyContent:'center', borderRadius:'8px', marginRight:'15px'}}>
                   {getIcon(item.type)}
                </div>

                <div style={{flex: 1}}>
                  <div style={{display:'flex', alignItems:'center', gap:'8px'}}>
                    <h4 style={{margin:0}}>{index + 1}. {item.title}</h4>
                    {item.isFree && !isEnrolled && <span style={{fontSize:'0.7rem', background:'#dcfce7', color:'#166534', padding:'2px 6px', borderRadius:'4px'}}>Free</span>}
                  </div>
                  <span style={{fontSize:'0.85rem', color:'#888', textTransform:'capitalize'}}>{item.type || 'Video'}</span>
                </div>

                {isUnlocked ? (
                  <button 
                    className="btn btn-outline" 
                    style={{fontSize:'0.9rem'}} 
                    onClick={() => handleItemClick(item)}
                  >
                    {item.type === 'video' ? 'Play Video' : 'View Content'}
                  </button>
                ) : (
                  <div style={{display:'flex', alignItems:'center', gap:'5px', color:'#999'}}>
                    <Lock size={18} /> Locked
                  </div>
                )}
              </div>
            );
          }) : (
            <p style={{color:'#888'}}>No content added yet.</p>
          )}
        </div>
      </main>
    </div>
  );
};

export default ModuleDetails;