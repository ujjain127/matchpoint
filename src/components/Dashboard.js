import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  CalendarIcon, 
  ClockIcon, 
  MapPinIcon, 
  StarIcon,
  ChartBarIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';

const Dashboard = () => {
  const { user } = useAuth();

  // Updated mock data with images
  const upcomingBookings = [
    { 
      id: 1, 
      facility: 'Tennis Court A', 
      date: '2024-03-25', 
      time: '14:00', 
      status: 'confirmed',
      image: 'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?q=80&w=1000&auto=format&fit=crop'
    },
    { 
      id: 2, 
      facility: 'Football Ground', 
      date: '2024-03-27', 
      time: '16:00', 
      status: 'pending',
      image: 'https://images.unsplash.com/photo-1459865264687-595d652de67e?q=80&w=1000&auto=format&fit=crop'
    }
  ];

  const popularFacilities = [
    { 
      id: 1, 
      name: 'Tennis Court A', 
      rating: 4.8, 
      bookings: 120,
      image: 'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?q=80&w=1000&auto=format&fit=crop',
      price: '₹500/hour'
    },
    { 
      id: 2, 
      name: 'Football Ground', 
      rating: 4.6, 
      bookings: 98,
      image: 'https://images.unsplash.com/photo-1459865264687-595d652de67e?q=80&w=1000&auto=format&fit=crop',
      price: '₹800/hour'
    },
    { 
      id: 3, 
      name: 'Basketball Court', 
      rating: 4.7, 
      bookings: 85,
      image: 'https://images.unsplash.com/photo-1544919982-b61976f0ba43?q=80&w=1000&auto=format&fit=crop',
      price: '₹400/hour'
    }
  ];

  return (
    <div className="dashboard">
      {/* Welcome Section */}
      <div className="dashboard-welcome">
        <div className="welcome-content">
          <h1>Welcome back, {user?.name || 'Player'}!</h1>
          <p>Ready for your next game? Book your favorite sports facility now.</p>
        </div>
        <div className="quick-stats">
          <div className="stat-card">
            <ChartBarIcon className="stat-icon" />
            <div className="stat-info">
              <h3>5</h3>
              <p>Total Bookings</p>
            </div>
          </div>
          <div className="stat-card">
            <UserGroupIcon className="stat-icon" />
            <div className="stat-info">
              <h3>3</h3>
              <p>Favorite Venues</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="dashboard-grid">
        {/* Quick Actions Section */}
        <div className="dashboard-section quick-actions">
          <h2>Quick Actions</h2>
          <div className="action-cards">
            <Link to="/book" className="action-card">
              <CalendarIcon className="card-icon" />
              <h3>Book Facility</h3>
              <p>Reserve your next session</p>
            </Link>
            
            <Link to="/profile/bookings" className="action-card">
              <ClockIcon className="card-icon" />
              <h3>My Bookings</h3>
              <p>View & manage bookings</p>
            </Link>
            
            <Link to="/facilities" className="action-card">
              <MapPinIcon className="card-icon" />
              <h3>Facilities</h3>
              <p>Explore available venues</p>
            </Link>
          </div>
        </div>

        {/* Updated Upcoming Bookings Section */}
        <div className="dashboard-section upcoming-bookings">
          <h2>Upcoming Bookings</h2>
          <div className="booking-list">
            {upcomingBookings.map(booking => (
              <div key={booking.id} className="booking-card">
                <div className="booking-image">
                  <img src={booking.image} alt={booking.facility} />
                </div>
                <div className="booking-info">
                  <h4>{booking.facility}</h4>
                  <div className="booking-details">
                    <span><CalendarIcon className="icon-small" /> {booking.date}</span>
                    <span><ClockIcon className="icon-small" /> {booking.time}</span>
                  </div>
                </div>
                <span className={`booking-status ${booking.status}`}>
                  {booking.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Updated Popular Facilities Section */}
        <div className="dashboard-section popular-facilities">
          <h2>Popular Facilities</h2>
          <div className="facilities-grid">
            {popularFacilities.map(facility => (
              <div key={facility.id} className="facility-card">
                <div className="facility-image">
                  <img src={facility.image} alt={facility.name} />
                  <div className="facility-price">{facility.price}</div>
                </div>
                <div className="facility-content">
                  <div className="facility-info">
                    <h4>{facility.name}</h4>
                    <div className="facility-stats">
                      <span className="rating">
                        <StarIcon className="icon-small" /> {facility.rating}
                      </span>
                      <span className="bookings">
                        {facility.bookings} bookings
                      </span>
                    </div>
                  </div>
                  <Link to="/book" className="book-now-btn">Book Now</Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 