import React from 'react';
import './Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-content">
        <div className="footer-section">
          <h3>MatchPoint</h3>
          <p>Book your perfect sports turf anytime, anywhere.</p>
        </div>
        
        <div className="footer-section">
          <h3>Quick Links</h3>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/book">Book Turf</a></li>
            <li><a href="/facilities">Facilities</a></li>
            <li><a href="/contact">Contact</a></li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h3>Contact Us</h3>
          <p>Email: info@matchpoint.com</p>
          <p>Phone: +1 234 567 890</p>
        </div>
      </div>
      
      <div className="footer-bottom">
        <div className="container">
          <p>&copy; 2024 MatchPoint. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer; 