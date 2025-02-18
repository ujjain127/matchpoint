import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { HomeIcon, CalendarIcon, MapIcon, PhoneIcon } from '@heroicons/react/24/outline';
import './Navbar.css';

function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="container navbar-content">
        <Link to="/" className="logo">
          <svg className="logo-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
              d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          MatchPoint
        </Link>
        <div className="nav-links">
          <Link to="/"><HomeIcon className="nav-icon" />Home</Link>
          <Link to="/book"><CalendarIcon className="nav-icon" />Book Turf</Link>
          <Link to="/facilities"><MapIcon className="nav-icon" />Facilities</Link>
          <Link to="/contact"><PhoneIcon className="nav-icon" />Contact</Link>
          {user && (
            <Link to="/profile/bookings" className="nav-link">
              My Bookings
            </Link>
          )}
        </div>
        <div className="auth-buttons">
          {user ? (
            <>
              <span className="user-name">Hi, {user.name}</span>
              <button className="btn-secondary" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-secondary">Login</Link>
              <Link to="/signup" className="btn-primary">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar; 