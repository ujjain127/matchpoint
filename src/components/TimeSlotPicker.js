import React from 'react';
import { ClockIcon } from '@heroicons/react/24/outline';
import './TimeSlotPicker.css';

function TimeSlotPicker({ availableSlots, selectedSlot, onSlotSelect, loading }) {
  if (loading) {
    return <div className="loading-slots">Loading available slots...</div>;
  }

  if (!availableSlots || availableSlots.length === 0) {
    return <div className="no-slots">No available slots for selected date</div>;
  }

  return (
    <div className="time-slot-grid">
      {availableSlots.map((slot) => (
        <button
          key={slot.id}
          className={`time-slot ${selectedSlot?.id === slot.id ? 'selected' : ''} ${
            !slot.available ? 'booked' : ''
          }`}
          onClick={() => slot.available && onSlotSelect(slot)}
          disabled={!slot.available}
        >
          <ClockIcon className="slot-icon" />
          <span className="slot-time">{slot.time}</span>
          <span className="slot-status">
            {slot.available ? 'Available' : 'Booked'}
          </span>
        </button>
      ))}
    </div>
  );
}

export default TimeSlotPicker; 