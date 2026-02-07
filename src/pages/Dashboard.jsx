import { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import { moduleService } from '../api/moduleService.js';
import { Search, Trash2, Box, Edit, ChevronLeft, ChevronRight, ArrowUpDown } from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate, Link } from 'react-router-dom';

const Dashboard = () => {
  const [modules, setModules] = useState([]);
  
  // 1. STATE FOR ALL FEATURES
  const [pagination, setPagination] = useState({ page: 1, pages: 1 });
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [sortOrder, setSortOrder] = useState('asc'); // 'asc' or 'desc'
  
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const navigate = useNavigate();
  const isInstructor = user.role === 'instructor';

  // 2. RELOAD WHEN ANY STATE CHANGES
  useEffect(() => {
    loadModules();
  }, [page, searchTerm, sortOrder]); 

  const loadModules = async () => {
    try {
      // 3. SEND ALL PARAMS TO API
      const data = await moduleService.getAllModules({
        search: searchTerm,
        page: page,
        limit: 30, // Fixed limit for now
        sortOrder: sortOrder
      });
      console.log(data)
      
      if (data.data && data.data.modules) {
        setModules(data.data.modules);
        setPagination(data.data.pagination);
      }
    } catch (error) {
      console.error("Failed to load modules");
    }
  };

  const handleDelete = async (id) => {
    if(!window.confirm("Are you sure?")) return;
    try {
      await moduleService.deleteModule(id);
      toast.success("Deleted");
      loadModules(); 
    } catch (err) {
      toast.error("Failed");
    }
  };

  return (
    <div className="app-container">
      <Sidebar />
      
      <main className="main-content">
        <div className="top-bar">
          <div className="search-box">
            <Search size={20} color="#888" />
            <input 
              type="text" 
              placeholder="Search..." 
              className="search-input"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1); // Reset to page 1 on search
              }}
            />
          </div>
          <div className="user-info">{user.name} ({user.role})</div>
        </div>

        {/* CONTROLS BAR (Sort + Create) */}
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'20px'}}>
          <div style={{display:'flex', alignItems:'center', gap:'15px'}}>
            <h2>Modules</h2>
            
            {/* SORT BUTTON */}
            <button 
              className="btn btn-outline" 
              style={{display:'flex', alignItems:'center', gap:'5px', fontSize:'0.9rem'}}
              onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
            >
              <ArrowUpDown size={16} />
              Price: {sortOrder === 'asc' ? 'Low to High' : 'High to Low'}
            </button>
          </div>

          {isInstructor && (
            <Link to="/create" className="btn btn-primary" style={{display:'flex', alignItems:'center', gap:'8px'}}>
               <Box size={18}/> New Module
            </Link>
          )}
        </div>
        
        <div className="grid">
          {modules.map((mod) => (
            <div key={mod._id} className="card">
              <div className="card-thumb"><Box size={50} /></div>
              <div className="card-body">
                <h3 className="card-title">{mod.title}</h3>
                <p className="card-desc">
                  {mod.description ? mod.description.substring(0, 60) + '...' : 'No desc'}
                </p>
                <div style={{color: '#888', marginBottom: '10px'}}>Price: ${mod.price}</div>

                <div className="card-footer">
                  {isInstructor && mod.instructor === user._id ? (
                    <>
                      <button className="btn btn-outline" style={{flex:1}}><Edit size={16} /></button>
                      <button className="btn btn-danger" onClick={() => handleDelete(mod._id)}><Trash2 size={16} /></button>
                    </>
                  ) : (
                    <button className="btn btn-primary" style={{width:'100%'}} onClick={() => navigate(`/module/${mod._id}`)}>View</button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* PAGINATION CONTROLS */}
        {pagination.pages > 1 && (
          <div style={{display:'flex', justifyContent:'center', gap:'10px', marginTop:'30px'}}>
             <button 
               disabled={page === 1} 
               onClick={() => setPage(p => p - 1)}
               className="btn btn-outline"
             >
               <ChevronLeft size={16} /> Prev
             </button>
             
             <span style={{padding:'8px', fontWeight:'bold'}}>
               Page {page} of {pagination.pages}
             </span>
             
             <button 
               disabled={page === pagination.pages} 
               onClick={() => setPage(p => p + 1)}
               className="btn btn-outline"
             >
               Next <ChevronRight size={16} />
             </button>
          </div>
        )}

      </main>
    </div>
  );
};

export default Dashboard;