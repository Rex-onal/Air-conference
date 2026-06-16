import React from 'react';
import type { RegistrationResult } from '../types';

interface TicketReceiptProps {
  result: RegistrationResult;
  onReset: () => void;
}

export const TicketReceipt: React.FC<TicketReceiptProps> = ({ result, onReset }) => {
  return (
    <div className="ticket-receipt-card animate-fade-in">
      <div className="ticket-header">
        <span className="ticket-logo">AIR 2026 DELEGATE</span>
        <span className="ticket-code">{result.registrationCode}</span>
      </div>
      <div className="ticket-body">
        <div className="ticket-field">
          <span className="ticket-label">Delegate Name</span>
          <span className="ticket-value">{result.name}</span>
        </div>
        <div className="ticket-field">
          <span className="ticket-label">Access Level</span>
          <span className="ticket-value pass-tier-text">{result.ticketType} Pass</span>
        </div>
        <div className="ticket-field">
          <span className="ticket-label">Venue & City</span>
          <span className="ticket-value">Eko Convention Centre, Lagos, NG</span>
        </div>
        <div className="ticket-field">
          <span className="ticket-label">Status</span>
          <span className="ticket-value confirmed-status">Confirmed & Reserved</span>
        </div>
      </div>
      <div className="ticket-footer-action">
        <button 
          className="cta-button secondary" 
          onClick={onReset} 
          style={{ fontSize: '0.85rem' }}
          type="button"
        >
          Register Another Ticket
        </button>
      </div>
    </div>
  );
};

export default TicketReceipt;
