import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPinIcon, ClockIcon, CurrencyRupeeIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import { courts } from '../services/api';
import './Facilities.css';

function Facilities() {
  const navigate = useNavigate();
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedSport, setSelectedSport] = useState('all');

  const sports = [
    { id: 'all', name: 'All' },
    { id: 'football', name: 'Football' },
    { id: 'cricket', name: 'Cricket' },
    { id: 'badminton', name: 'Badminton' },
    { id: 'tennis', name: 'Tennis' },
    { id: 'basketball', name: 'Basketball' },
    { id: 'volleyball', name: 'Volleyball' },
    { id: 'table tennis', name: 'Table Tennis' },
    { id: 'swimming', name: 'Swimming' },
    { id: 'squash', name: 'Squash' },
    { id: 'yoga', name: 'Yoga' },
    { id: 'boxing', name: 'Boxing' },
    { id: 'gym', name: 'Gym' }
  ];

  useEffect(() => {
    fetchFacilities();
  }, []);

  const fetchFacilities = async () => {
    try {
      const response = await courts.getAllCourts();
      console.log('Fetched facilities:', response.data.courts); // Debug log
      setFacilities(response.data.courts);
    } catch (err) {
      console.error('Error fetching facilities:', err); // Debug log
      setError('Failed to load facilities');
    } finally {
      setLoading(false);
    }
  };

  const filteredFacilities = selectedSport === 'all'
    ? facilities
    : facilities.filter(facility => 
        facility.sport.toLowerCase() === selectedSport.toLowerCase()
      );

  const handleBooking = (facility) => {
    const isAuthenticated = !!localStorage.getItem('token');
    if (isAuthenticated) {
      navigate('/book', { 
        state: { selectedFacility: facility }
      });
    } else {
      navigate('/login', { 
        state: { 
          from: '/book',
          selectedFacility: facility 
        } 
      });
    }
  };

  if (loading) {
    return <div className="facilities-loading">Loading facilities...</div>;
  }

  if (error) {
    return <div className="facilities-error">{error}</div>;
  }

  return (
    <div className="facilities-page">
      <div className="facilities-header">
        <h1>Our Facilities</h1>
        <p>Explore our world-class sports facilities</p>
      </div>

      <div className="sports-filter">
        {sports.map(sport => (
          <button
            key={sport.id}
            className={`filter-btn ${selectedSport === sport.id ? 'active' : ''}`}
            onClick={() => setSelectedSport(sport.id)}
          >
            {sport.name}
          </button>
        ))}
      </div>

      <div className="facilities-grid">
        {filteredFacilities.length === 0 ? (
          <div className="no-facilities">
            No facilities available for {selectedSport}
          </div>
        ) : (
          filteredFacilities.map((facility) => (
            <div key={facility._id} className="facility-card">
              <div className="facility-image">
                <img src={facility.image} alt={facility.name} />
                <div className="facility-badge">{facility.sport}</div>
              </div>
              <div className="facility-content">
                <h2>{facility.name}</h2>
                <p className="facility-description">{facility.description}</p>
                
                <div className="facility-details">
                  <div className="detail-item">
                    <MapPinIcon className="detail-icon" />
                    <span>{facility.type || 'Indoor'} Facility</span>
                  </div>
                  <div className="detail-item">
                    <ClockIcon className="detail-icon" />
                    <span>{facility.timing || '6 AM - 10 PM'}</span>
                  </div>
                  <div className="detail-item">
                    <UserGroupIcon className="detail-icon" />
                    <span>Max {facility.maxPlayers || 10} players</span>
                  </div>
                  <div className="detail-item">
                    <CurrencyRupeeIcon className="detail-icon" />
                    <span>₹{facility.pricePerHour}/hour</span>
                  </div>
                </div>

                <div className="facility-features">
                  <h3>Amenities</h3>
                  <ul>
                    {(facility.amenities || []).map((amenity, index) => (
                      <li key={index}>{amenity}</li>
                    ))}
                  </ul>
                </div>

                <button 
                  className="btn-primary book-btn"
                  onClick={() => handleBooking(facility)}
                >
                  Book Now
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Facilities; 