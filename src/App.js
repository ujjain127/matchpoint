import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import BookingPage from './pages/BookingPage';
import Footer from './components/Footer';
import Login from './pages/Login';
import Signup from './pages/Signup';
import './App.css';
import ErrorBoundary from './components/ErrorBoundary';
import Facilities from './pages/Facilities';
import MyBookings from './pages/MyBookings';

function App() {
  const isAuthenticated = !!localStorage.getItem('token');

  return (
    <ErrorBoundary>
      <Router>
        <div className="app">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/facilities" element={<Facilities />} />
            <Route 
              path="/book" 
              element={
                isAuthenticated ? (
                  <BookingPage />
                ) : (
                  <Navigate to="/login" state={{ from: '/book' }} replace />
                )
              } 
            />
            <Route 
              path="/login" 
              element={
                isAuthenticated ? (
                  <Navigate to="/book" replace />
                ) : (
                  <Login />
                )
              } 
            />
            <Route 
              path="/signup" 
              element={
                isAuthenticated ? (
                  <Navigate to="/book" replace />
                ) : (
                  <Signup />
                )
              } 
            />
            <Route 
              path="/profile/bookings" 
              element={
                isAuthenticated ? (
                  <MyBookings />
                ) : (
                  <Navigate to="/login" state={{ from: '/profile/bookings' }} replace />
                )
              } 
            />
          </Routes>
          <Footer />
        </div>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
