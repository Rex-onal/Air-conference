import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="app-footer">
      <div className="max-width-wrapper">
        <div className="footer-grid">
          <div className="footer-brand">
            <span className="footer-brand-title">AIR 2026</span>
            <p className="footer-brand-desc">
              AI Conference Revolution: Engineering computational systems and governance frameworks to power Africa's tech growth.
            </p>
          </div>
          
          <div className="footer-links-col">
            <span className="footer-col-title">Navigation</span>
            <a href="#overview">Overview</a>
            <a href="#speakers">Speakers</a>
            <a href="#schedule">Schedule</a>
            <a href="#venue">Host Venue</a>
          </div>

          <div className="footer-links-col">
            <span className="footer-col-title">Legal & Logistics</span>
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Entry</a>
            <a href="#">Visa Guide (NG)</a>
            <a href="#">Hotel Bookings</a>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© 2026 AI Conference Revolution (AIR). Victoria Island, Lagos. All rights reserved.</span>
          <span className="footer-social-panel">
            <a href="#" className="footer-social-link">Twitter</a>
            <span className="social-divider">•</span>
            <a href="#" className="footer-social-link">LinkedIn</a>
            <span className="social-divider">•</span>
            <a href="#" className="footer-social-link">GitHub</a>
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
