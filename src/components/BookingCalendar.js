import React from 'react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import './BookingCalendar.css';

function BookingCalendar({ selectedDate, onDateSelect }) {
  const today = new Date();
  
  return (
    <div className="booking-calendar">
      <DayPicker
        mode="single"
        selected={selectedDate}
        onSelect={onDateSelect}
        disabled={{ before: today }}
        modifiers={{
          selected: selectedDate,
        }}
        modifiersStyles={{
          selected: {
            backgroundColor: 'var(--accent-color)',
            color: 'white'
          }
        }}
      />
    </div>
  );
}

export default BookingCalendar; 