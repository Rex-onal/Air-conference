import React, { useState } from 'react';
import type { RegistrationData } from '../types';

interface RegistrationFormProps {
  onSubmit: (data: RegistrationData) => Promise<void>;
  isLoading: boolean;
}

export const RegistrationForm: React.FC<RegistrationFormProps> = ({ onSubmit, isLoading }) => {
  const [form, setForm] = useState<RegistrationData>({
    name: '',
    email: '',
    company: '',
    role: '',
    ticketType: 'standard'
  });

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectTier = (tier: string) => {
    setForm(prev => ({ ...prev, ticketType: tier }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="registration-form animate-fade-in">
      <div className="form-group">
        <label htmlFor="reg-name" className="form-label">Full Name</label>
        <input 
          id="reg-name"
          name="name"
          type="text" 
          className="form-control" 
          placeholder="e.g. Tunde Alabi" 
          value={form.name}
          onChange={handleTextChange}
          required 
          disabled={isLoading}
        />
      </div>

      <div className="form-group">
        <label htmlFor="reg-email" className="form-label">Email Address</label>
        <input 
          id="reg-email"
          name="email"
          type="email" 
          className="form-control" 
          placeholder="e.g. tunde@company.com" 
          value={form.email}
          onChange={handleTextChange}
          required 
          disabled={isLoading}
        />
      </div>

      <div className="form-group">
        <label htmlFor="reg-company" className="form-label">Company / Institution</label>
        <input 
          id="reg-company"
          name="company"
          type="text" 
          className="form-control" 
          placeholder="e.g. Paystack or University of Lagos" 
          value={form.company}
          onChange={handleTextChange}
          disabled={isLoading}
        />
      </div>

      <div className="form-group">
        <label htmlFor="reg-role" className="form-label">Your Role / Job Title</label>
        <input 
          id="reg-role"
          name="role"
          type="text" 
          className="form-control" 
          placeholder="e.g. ML Engineer, Researcher" 
          value={form.role}
          onChange={handleTextChange}
          disabled={isLoading}
        />
      </div>

      <div className="form-group">
        <label className="form-label">Select Ticket Tier</label>
        <div className="ticket-selector">
          <button 
            type="button"
            className={`ticket-option ${form.ticketType === 'standard' ? 'active' : ''}`}
            onClick={() => handleSelectTier('standard')}
            disabled={isLoading}
          >
            <span className="ticket-name">Standard</span>
            <span className="ticket-price">₦50,000</span>
            <span className="ticket-desc">General access to main tracks</span>
          </button>
          <button 
            type="button"
            className={`ticket-option ${form.ticketType === 'vip' ? 'active' : ''}`}
            onClick={() => handleSelectTier('vip')}
            disabled={isLoading}
          >
            <span className="ticket-name">VIP Delegate</span>
            <span className="ticket-price">₦180,000</span>
            <span className="ticket-desc">VIP seating + Speaker dinner</span>
          </button>
          <button 
            type="button"
            className={`ticket-option ${form.ticketType === 'student' ? 'active' : ''}`}
            onClick={() => handleSelectTier('student')}
            disabled={isLoading}
          >
            <span className="ticket-name">Academic</span>
            <span className="ticket-price">Free</span>
            <span className="ticket-desc">Accredited university email required</span>
          </button>
        </div>
      </div>

      <button 
        type="submit" 
        className="cta-button accent active:scale-[0.98]" 
        style={{ width: '100%', padding: '1rem' }} 
        disabled={isLoading}
      >
        {isLoading ? 'Generating Secure Ticket...' : 'Confirm Ticket Reservation'}
      </button>
    </form>
  );
};

export default RegistrationForm;
