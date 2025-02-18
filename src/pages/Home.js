import React from 'react';
import { CalendarIcon, SparklesIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline';
import './Home.css';

function Home() {
  return (
    <div className="home">
      <section className="hero">
        <div className="container">
          <h1>Book Your Perfect Sports Turf</h1>
          <p>Find and book sports facilities in your area with ease</p>
          <button className="btn-primary hero-btn">
            <CalendarIcon className="btn-icon" />
            Book Now
          </button>
        </div>
      </section>
      
      <section className="features container">
        <h2>Why Choose MatchPoint?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <CalendarIcon className="feature-icon" />
            <h3>Easy Booking</h3>
            <p>Book your preferred turf in just a few clicks</p>
          </div>
          <div className="feature-card">
            <SparklesIcon className="feature-icon" />
            <h3>Multiple Sports</h3>
            <p>Football, Cricket, Tennis and more</p>
          </div>
          <div className="feature-card">
            <CurrencyDollarIcon className="feature-icon" />
            <h3>Best Prices</h3>
            <p>Competitive rates and special offers</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home; 