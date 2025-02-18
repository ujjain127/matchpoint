import React from 'react';
import './PaymentSummary.css';

function PaymentSummary({ court, timeSlot, date }) {
  if (!court || !timeSlot || !date) {
    return (
      <div className="payment-summary empty">
        <p>Select a court and time slot to see payment details</p>
      </div>
    );
  }

  const subtotal = court.pricePerHour;
  const gst = subtotal * 0.18;
  const total = subtotal + gst;

  return (
    <div className="payment-summary">
      <div className="booking-details">
        <h3>Booking Details</h3>
        <p>
          <strong>Date:</strong> {date.toLocaleDateString()}
        </p>
        <p>
          <strong>Time:</strong> {timeSlot.time}
        </p>
        <p>
          <strong>Facility:</strong> {court.name}
        </p>
        <p>
          <strong>Sport:</strong> {court.sport}
        </p>
      </div>

      <div className="price-breakdown">
        <h3>Price Breakdown</h3>
        <div className="summary-item">
          <span>Court Charges</span>
          <span>₹{subtotal}</span>
        </div>
        <div className="summary-item">
          <span>GST (18%)</span>
          <span>₹{gst.toFixed(2)}</span>
        </div>
        <div className="summary-total">
          <span>Total Amount</span>
          <span>₹{total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}

export default PaymentSummary; 