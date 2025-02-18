import axios from 'axios';

// Check if we're in development
const isDevelopment = process.env.NODE_ENV === 'development';

const api = axios.create({
  baseURL: isDevelopment ? 'http://127.0.0.1:5000/api' : '/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  withCredentials: true
});

// Add request interceptor with error handling
api.interceptors.request.use(
  config => {
    // Log the request in development
    if (isDevelopment) {
      console.log('Making request:', {
        url: config.url,
        method: config.method,
        data: config.data
      });
    }
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor with error handling
api.interceptors.response.use(
  response => response,
  error => {
    if (error.code === 'ERR_NETWORK') {
      console.error('Network error - Is the backend server running?');
      return Promise.reject({ 
        error: 'Cannot connect to server. Please make sure the server is running.'
      });
    }
    
    if (error.response) {
      return Promise.reject(error.response.data);
    }
    
    return Promise.reject({ error: error.message });
  }
);

export const auth = {
  login: async (credentials) => {
    try {
      const response = await api.post('/login', credentials);
      console.log('Login response:', response);
      return response;
    } catch (error) {
      console.error('Login service error:', error);
      throw error.response?.data || error;
    }
  },
  signup: (userData) => api.post('/signup', userData),
  getUser: () => api.get('/user')
};

export const courts = {
  getAllCourts: () => api.get('/courts'),
};

export const bookings = {
  getAvailableSlots: (date, courtId) => 
    api.get(`/slots?date=${date}&courtId=${courtId}`),
  createBooking: (bookingData) => api.post('/bookings', bookingData),
  getUserBookings: () => api.get('/bookings')
};

export default api; 