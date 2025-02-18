import React, { useState, useEffect } from 'react';
import { CalendarDaysIcon, ClockIcon, CurrencyRupeeIcon } from '@heroicons/react/24/outline';
import { useLocation, useNavigate } from 'react-router-dom';
import './BookingPage.css';
import { bookings } from '../services/api';
import BookingCalendar from '../components/BookingCalendar';
import TimeSlotPicker from '../components/TimeSlotPicker';
import PaymentSummary from '../components/PaymentSummary';

function BookingPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedCourt, setSelectedCourt] = useState(location.state?.selectedFacility || null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [confirmationStep, setConfirmationStep] = useState(false);

  useEffect(() => {
    if (!selectedCourt && !location.state?.selectedFacility) {
      navigate('/facilities');
    }
  }, [selectedCourt, location.state, navigate]);

  useEffect(() => {
    if (selectedCourt && selectedDate) {
      fetchAvailableSlots();
    }
  }, [selectedDate, selectedCourt]);

  const fetchAvailableSlots = async () => {
    if (!selectedDate || !selectedCourt) return;
    
    try {
      setLoading(true);
      setError('');
      const formattedDate = selectedDate.toISOString().split('T')[0];
      const response = await bookings.getAvailableSlots(formattedDate, selectedCourt._id);
      
      if (response.data.slots) {
        setAvailableSlots(response.data.slots);
      } else {
        setError('No slots available for selected date');
      }
    } catch (err) {
      console.error('Error fetching slots:', err);
      setError('Failed to fetch available slots. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = async () => {
    if (!selectedCourt || !selectedDate || !selectedSlot) {
      setError('Please select all booking details');
      return;
    }

    try {
      setLoading(true);
      const bookingData = {
        courtId: selectedCourt._id,
        date: selectedDate.toISOString().split('T')[0],
        timeSlot: selectedSlot,
      };

      const response = await bookings.createBooking(bookingData);
      navigate('/profile/bookings', { 
        state: { message: 'Booking successful!' } 
      });
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create booking');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmation = () => {
    if (!selectedSlot) {
      setError('Please select a time slot');
      return;
    }
    setConfirmationStep(true);
  };

  return (
    <div className="booking-page">
      <div className="booking-container">
        <div className="booking-header">
          <h1>Book {selectedCourt?.name}</h1>
          <p>{selectedCourt?.description}</p>
        </div>

        {error && <div className="booking-error">{error}</div>}

        {!confirmationStep ? (
          <div className="booking-grid">
            <div className="booking-section">
              <h2>
                <CalendarDaysIcon className="section-icon" />
                Select Date
              </h2>
              <BookingCalendar
                selectedDate={selectedDate}
                onDateSelect={setSelectedDate}
              />
            </div>

            <div className="booking-section">
              <h2>
                <ClockIcon className="section-icon" />
                Select Time Slot
              </h2>
              <TimeSlotPicker
                availableSlots={availableSlots}
                selectedSlot={selectedSlot}
                onSlotSelect={setSelectedSlot}
                loading={loading}
              />
            </div>

            <button
              className="btn-primary booking-next"
              onClick={handleConfirmation}
              disabled={!selectedSlot}
            >
              Continue to Confirmation
            </button>
          </div>
        ) : (
          <div className="confirmation-section">
            <h2>
              <CurrencyRupeeIcon className="section-icon" />
              Confirm Booking
            </h2>
            
            <PaymentSummary
              court={selectedCourt}
              timeSlot={selectedSlot}
              date={selectedDate}
            />

            <div className="booking-actions">
              <button
                className="btn-secondary"
                onClick={() => setConfirmationStep(false)}
              >
                Back
              </button>
              <button
                className="btn-primary"
                onClick={handleBooking}
                disabled={loading}
              >
                {loading ? 'Processing...' : 'Confirm & Pay'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default BookingPage; 