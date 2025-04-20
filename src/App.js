import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import BookingPage from './pages/BookingPage';
import Footer from './components/Footer';
import Login from './pages/Login';
import Signup from './pages/Signup';
import './App.css';
import ErrorBoundary from './components/ErrorBoundary';
import Facilities from './pages/Facilities';
import MyBookings from './pages/MyBookings';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Dashboard from './components/Dashboard';
import './styles/Dashboard.css';

// Create a component to handle the home route
const HomeRoute = () => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Dashboard /> : <Navigate to="/login" replace />;
};

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <div className="app">
            <Navbar />
            <Routes>
              {/* Make Dashboard the home page */}
              <Route path="/" element={<HomeRoute />} />
              
              <Route path="/facilities" element={<Facilities />} />
              <Route 
                path="/book" 
                element={
                  <ProtectedRoute>
                    <BookingPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/login" 
                element={<PublicRoute><Login /></PublicRoute>} 
              />
              <Route 
                path="/signup" 
                element={<PublicRoute><Signup /></PublicRoute>} 
              />
              <Route 
                path="/profile/bookings" 
                element={
                  <ProtectedRoute>
                    <MyBookings />
                  </ProtectedRoute>
                } 
              />
            </Routes>
            <Footer />
          </div>
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
}

// PublicRoute component to prevent authenticated users from accessing login/signup
const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default App;
