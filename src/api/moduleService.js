import api from './axios.js';

export const moduleService = {
  // --- MODULE CALLS (Container) ---

  // Get all modules with search/pagination
  getAllModules: async (params) => {
    // params = { search, page, limit, sortOrder }
    const searchParams = new URLSearchParams(params);
    const response = await api.get(`/modules?${searchParams.toString()}`);
    return response.data; 
  },

  // Get only the logged-in user's modules (if you have this endpoint)
  getMyModules: async () => {
    const response = await api.get('/modules/my-modules');
    return response.data;
  },

  // Create a new Module Container
  createModule: async (formData) => {
    const response = await api.post('/modules', formData);
    return response.data;
  },

  // Get a single Module by ID
  getModule: async (id) => {
    const response = await api.get(`/modules/${id}`);
    return response.data;
  },

  // Delete a Module
  deleteModule: async (id) => {
    const response = await api.delete(`/modules/${id}`);
    return response.data;
  },
  enrollUser: async (moduleId) => {
    // We send an empty body {} since it's a POST
    const response = await api.post(`/enrollments/${moduleId}`, {});
    return response.data;
  },

  // 2. Get Enrolled Courses
  // Backend Route: router.get('/my-courses', ...)
  getMyEnrollments: async () => {
    const response = await api.get('/enrollments/my-courses');
    return response.data;
  },

  // 3. Check Enrollment (Helper)
  // Since we don't have a specific check route, we fetch all and check locally
  checkEnrollment: async (moduleId) => {
    try {
      const response = await api.get('/enrollments/my-courses');
      // Backend likely returns { success: true, enrollments: [...] } or just the array
      const enrollments = response.data.enrollments || response.data || [];
      
      // Check if the module ID exists in the user's enrollments
      const isEnrolled = enrollments.some(e => 
        (e.module?._id === moduleId) || (e.module === moduleId) || (e._id === moduleId)
      );
      
      return { enrolled: isEnrolled };
    } catch (err) {
      return { enrolled: false };
    }
  },

  // --- CONTENT CALLS (Video, Assignment, Quiz) ---

  /**
   * Create Content inside a Module
   * @param {string} moduleId - The ID of the module
   * @param {string} type - 'video', 'assignment', or 'quiz'
   * @param {FormData} formData - Contains title, description, file
   */
  createContent: async (moduleId, type, formData) => {
    // 1. Ensure moduleId is in the body (if backend needs it there)
    // formData.append('moduleId', moduleId);

    // 2. Send request with 'type' in Query String
    // Endpoint: POST /api/v1/courses?type=video
    const response = await api.post(`/modules/${moduleId}/content?type=${type}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
};