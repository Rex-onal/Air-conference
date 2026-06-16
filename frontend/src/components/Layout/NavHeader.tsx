import React, { useEffect, useState } from 'react';

interface NavHeaderProps {
  activeSection: string;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
}

export const NavHeader: React.FC<NavHeaderProps> = ({ 
  activeSection, 
  isMobileMenuOpen, 
  setIsMobileMenuOpen 
}) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLinkClick = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className={`nav-header ${scrolled ? 'scrolled' : ''}`}>
      <div className="max-width-wrapper nav-wrapper">
        <a href="#overview" className="nav-logo" onClick={handleLinkClick}>
          <span className="nav-logo-icon">AIR<span className="logo-accent">.</span></span>
          <span className="nav-logo-text">Africa</span>
        </a>
        
        <ul className={`nav-links ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
          <li>
            <a 
              href="#overview" 
              className={activeSection === 'overview' ? 'active' : ''} 
              onClick={handleLinkClick}
            >
              Overview
            </a>
          </li>
          <li>
            <a 
              href="#speakers" 
              className={activeSection === 'speakers' ? 'active' : ''} 
              onClick={handleLinkClick}
            >
              Speakers
            </a>
          </li>
          <li>
            <a 
              href="#schedule" 
              className={activeSection === 'schedule' ? 'active' : ''} 
              onClick={handleLinkClick}
            >
              Schedule
            </a>
          </li>
          <li>
            <a 
              href="#venue" 
              className={activeSection === 'venue' ? 'active' : ''} 
              onClick={handleLinkClick}
            >
              Venue
            </a>
          </li>
          <li>
            <a 
              href="#register" 
              className={activeSection === 'register' ? 'active' : ''} 
              onClick={handleLinkClick}
            >
              Tickets
            </a>
          </li>
          <li>
            <a 
              href="#contact" 
              className={activeSection === 'contact' ? 'active' : ''} 
              onClick={handleLinkClick}
            >
              Contact
            </a>
          </li>
        </ul>

        <button 
          className="mobile-nav-toggle" 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
          aria-label="Toggle Navigation"
          type="button"
        >
          {isMobileMenuOpen ? (
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>

        <a href="#register" className="cta-button accent active:scale-[0.98]">Register Now</a>
      </div>
    </header>
  );
};

export default NavHeader;
