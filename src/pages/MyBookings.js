import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { bookings } from '../services/api';
import './MyBookings.css';

function MyBookings() {
  const [userBookings, setUserBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const location = useLocation();

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await bookings.getUserBookings();
      setUserBookings(response.data.bookings);
    } catch (err) {
      setError('Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="bookings-loading">Loading bookings...</div>;
  if (error) return <div className="bookings-error">{error}</div>;

  return (
    <div className="my-bookings-page">
      <div className="bookings-header">
        <h1>My Bookings</h1>
        {location.state?.message && (
          <div className="success-message">{location.state.message}</div>
        )}
      </div>

      {userBookings.length === 0 ? (
        <div className="no-bookings">
          <p>You haven't made any bookings yet.</p>
        </div>
      ) : (
        <div className="bookings-grid">
          {userBookings.map((booking) => (
            <div key={booking._id} className="booking-card">
              <div className="booking-image">
                <img src={booking.court.image} alt={booking.court.name} />
                <div className="booking-status">{booking.status}</div>
              </div>
              <div className="booking-content">
                <h2>{booking.court.name}</h2>
                <div className="booking-details">
                  <p>
                    <strong>Date:</strong>{' '}
                    {new Date(booking.date).toLocaleDateString()}
                  </p>
                  <p>
                    <strong>Time:</strong> {booking.timeSlot.time}
                  </p>
                  <p>
                    <strong>Sport:</strong> {booking.court.sport}
                  </p>
                  <p>
                    <strong>Price:</strong> ₹{booking.court.pricePerHour}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyBookings; 