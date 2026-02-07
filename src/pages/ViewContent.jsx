import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { moduleService } from '../api/moduleService.js';
import { ArrowLeft, FileText, ExternalLink, HelpCircle, Download, Award } from 'lucide-react'; // Added Award icon

const ViewContent = () => {
  const { moduleId, contentId } = useParams();
  const navigate = useNavigate();
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const res = await moduleService.getModule(moduleId);
        const moduleData = res.data?.module || res.data || res;
        const courses = moduleData.courses || moduleData.content || [];
        const foundItem = courses.find(item => item._id === contentId);
        setContent(foundItem);
      } catch (err) {
        console.error("Error loading content:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchContent();
  }, [moduleId, contentId]);

  if (loading) return <div className="app-container"><Sidebar /><main className="main-content"><p>Loading...</p></main></div>;
  if (!content) return <div className="app-container"><Sidebar /><main className="main-content"><h2>Content Not Found</h2></main></div>;

  // --- RENDER HELPERS ---

  const renderVideo = () => (
    <div style={{background: 'black', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.2)'}}>
      <video controls autoPlay style={{width: '100%', aspectRatio: '16/9', display: 'block'}} src={content.videoUrl}>
        Your browser does not support the video tag.
      </video>
      {content.description && (
        <div style={{marginTop:'20px', padding:'20px', background:'white'}}>
          <h3>Description</h3>
          <p style={{color:'#666'}}>{content.description}</p>
        </div>
      )}
    </div>
  );

  const renderAssignment = () => (
    <div style={{background: 'white', padding: '40px', borderRadius: '10px', border:'1px solid #eee', maxWidth:'800px', margin:'0 auto'}}>
      
      {/* Header with Max Score */}
      <div style={{textAlign:'center', marginBottom:'30px'}}>
        <div style={{width:'80px', height:'80px', background:'#fff7ed', color:'#ea580c', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 20px'}}>
           <FileText size={40} />
        </div>
        <h2 style={{fontSize:'2rem', marginBottom:'10px'}}>Assignment Task</h2>
        
        {/* Max Score Badge */}
        <div style={{display:'inline-flex', alignItems:'center', gap:'5px', background:'#fff1f2', color:'#e11d48', padding:'5px 15px', borderRadius:'20px', fontWeight:'bold', fontSize:'0.9rem'}}>
           <Award size={16} /> Max Score: {content.maxScore || 100}
        </div>
      </div>

      {/* Instructions Body */}
      <div style={{marginBottom:'30px'}}>
        <h3 style={{fontSize:'1.2rem', marginBottom:'10px', borderBottom:'1px solid #eee', paddingBottom:'10px'}}>Instructions:</h3>
        <div style={{background:'#f9fafb', padding:'20px', borderRadius:'8px', lineHeight:'1.6', color:'#374151', whiteSpace:'pre-wrap'}}>
          {content.instruction || "No specific instructions provided."}
        </div>
      </div>

      {/* Download Button */}
      <div style={{textAlign:'center', paddingTop:'20px', borderTop:'1px solid #eee'}}>
        {content.instructionPdfUrl ? (
          <a 
            href={content.instructionPdfUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="btn btn-primary"
            style={{display:'inline-flex', alignItems:'center', gap:'10px', padding:'15px 30px', fontSize:'1.1rem'}}
          >
            <Download size={20} /> Download Assignment PDF
          </a>
        ) : (
          <p style={{color:'red'}}>Error: Assignment file missing.</p>
        )}
      </div>
    </div>
  );

  const renderQuiz = () => {
    const quizLink = content.quizUrl || content.description;
    return (
      <div style={{background: 'white', padding: '40px', borderRadius: '10px', border:'1px solid #eee', maxWidth:'800px', margin:'0 auto', textAlign:'center'}}>
        <div style={{width:'80px', height:'80px', background:'#f0fdf4', color:'#16a34a', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 20px'}}>
           <HelpCircle size={40} />
        </div>
        <h2 style={{fontSize:'2rem', marginBottom:'10px'}}>Ready for the Quiz?</h2>
        <p style={{color:'#666', marginBottom:'30px'}}>You will be redirected to Google Forms to complete this assessment.</p>
        
        {quizLink ? (
          <a 
            href={quizLink} 
            target="_blank" 
            rel="noopener noreferrer"
            className="btn btn-primary"
            style={{display:'inline-flex', alignItems:'center', gap:'10px', padding:'15px 30px', fontSize:'1.1rem', background:'#16a34a', border:'none'}}
          >
            Start Quiz <ExternalLink size={20} />
          </a>
        ) : (
           <p style={{color:'red'}}>Error: Quiz link missing.</p>
        )}
      </div>
    );
  };

  return (
    <div className="app-container">
      <Sidebar />
      <main className="main-content">
        <button onClick={() => navigate(`/module/${moduleId}`)} style={{display: 'flex', alignItems: 'center', gap: '5px', background: 'transparent', marginBottom: '20px', color: '#666'}}>
          <ArrowLeft size={20} /> Back to Module
        </button>

        <div style={{maxWidth: '1000px', margin: '0 auto'}}>
          <div style={{marginBottom:'30px', textAlign:'center'}}>
            <h1 style={{marginBottom: '10px'}}>{content.title}</h1>
            {content.isFree && <span style={{background:'#dcfce7', color:'#166534', padding:'4px 10px', borderRadius:'4px', fontSize:'0.8rem'}}>Free Preview</span>}
          </div>

          {content.type === 'video' && renderVideo()}
          {content.type === 'assignment' && renderAssignment()}
          {content.type === 'quiz' && renderQuiz()}
        </div>
      </main>
    </div>
  );
};

export default ViewContent;