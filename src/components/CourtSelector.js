import React, { useState, useEffect } from 'react';
import './CourtSelector.css';
import { courts } from '../services/api';
import { useLocation } from 'react-router-dom';

function CourtSelector({ selectedCourt, onCourtSelect }) {
  const [courts, setCourts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const location = useLocation();

  useEffect(() => {
    if (location.state?.selectedFacility) {
      setCourts([location.state.selectedFacility]);
      onCourtSelect(location.state.selectedFacility);
      setLoading(false);
    } else {
      fetchCourts();
    }
  }, [location.state, onCourtSelect]);

  const fetchCourts = async () => {
    try {
      const response = await courts.getAllCourts();
      setCourts(response.data.courts);
    } catch (err) {
      setError('Failed to load courts');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading-courts">Loading courts...</div>;
  }

  return (
    <div className="courts-grid">
      {courts.map((court) => (
        <div
          key={court.id}
          className={`court-card ${selectedCourt?.id === court.id ? 'selected' : ''}`}
          onClick={() => onCourtSelect(court)}
        >
          <img src={court.image} alt={court.name} className="court-image" />
          <div className="court-info">
            <h3>{court.name}</h3>
            <p>{court.description}</p>
            <div className="court-details">
              <span className="court-price">₹{court.pricePerHour}/hour</span>
              <span className={`court-status ${court.status.toLowerCase()}`}>
                {court.status}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default CourtSelector; 