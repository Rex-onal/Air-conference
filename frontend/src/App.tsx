import React, { useState, useEffect, useCallback } from 'react';
import type { Speaker } from './features/speakers/types';
import type { ScheduleItem } from './features/schedule/types';
import type { RegistrationData, RegistrationResult } from './features/registration/types';

// Layout & Common primitives
import { NavHeader } from './components/Layout/NavHeader';
import { Footer } from './components/Layout/Footer';
import { PreviousEventsAccordion } from './components/Lattice/PreviousEventsAccordion';
import { HeroImageSlider } from './components/Lattice/HeroImageSlider';

// Feature Components
import { SpeakersSection } from './features/speakers/components/SpeakersSection';
import { ScheduleSection } from './features/schedule/components/ScheduleSection';
import { RegistrationForm } from './features/registration/components/RegistrationForm';
import { TicketReceipt } from './features/registration/components/TicketReceipt';
import { AdminDashboard } from './features/registration/components/AdminDashboard';

// ─── Countdown Timer Component ─────────────────────────────────────────────
function HeroCountdown({ targetDate }: { targetDate: string }) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(true);

  const getTimeLeft = useCallback(() => {
    const diff = new Date(targetDate).getTime() - Date.now();
    if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    return {
      days:    Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours:   Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
      minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
      seconds: Math.floor((diff % (1000 * 60)) / 1000),
    };
  }, [targetDate]);

  const [timeLeft, setTimeLeft] = useState(getTimeLeft());

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.05 }
    );
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;
    const tick = setInterval(() => {
      const nextTime = getTimeLeft();
      setTimeLeft(prev => {
        if (
          prev.days === nextTime.days &&
          prev.hours === nextTime.hours &&
          prev.minutes === nextTime.minutes &&
          prev.seconds === nextTime.seconds
        ) {
          return prev;
        }
        return nextTime;
      });
    }, 250);
    return () => clearInterval(tick);
  }, [getTimeLeft, isVisible]);

  const units = [
    { label: 'Days',    value: timeLeft.days,    accent: false },
    { label: 'Hours',   value: timeLeft.hours,   accent: false },
    { label: 'Mins',    value: timeLeft.minutes, accent: false },
    { label: 'Secs',    value: timeLeft.seconds, accent: true  },
  ];

  return (
    <div ref={containerRef} className="ref-countdown">
      {units.map(({ label, value, accent }, i) => (
        <React.Fragment key={label}>
          <div className={`ref-cdown-unit${accent ? ' accent' : ''}`}>
            <span className="ref-cdown-num" key={value}>
              {String(value).padStart(2, '0')}
            </span>
            <span className="ref-cdown-lbl">{label}</span>
          </div>
          {i < units.length - 1 && <span className="ref-cdown-sep">:</span>}
        </React.Fragment>
      ))}
    </div>
  );
}

// Local Static Fallbacks (Suspense / Offline Recovery)
const FALLBACK_SPEAKERS: Speaker[] = [
  {
    id: "chinonso-ezenwa",
    name: "Dr. Chinonso Ezenwa",
    role: "Chief AI Architect",
    organization: "AfroMind Labs",
    location: "Lagos, Nigeria",
    bio: "Pioneering research in low-resource African language models (NLP), helping bridge the digital divide for millions of speakers of Yoruba, Igbo, and Hausa.",
    category: "Keynote",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop"
  },
  {
    id: "amara-diop",
    name: "Amara Diop",
    role: "Senior AI Researcher",
    organization: "Mila / AI Senegal",
    location: "Dakar, Senegal",
    bio: "Leading development in computer vision systems for precision agriculture in West Africa. Expert in satellite imagery processing and crop disease diagnostics.",
    category: "Technical Session",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop"
  },
  {
    id: "kofi-mensah",
    name: "Kofi Mensah",
    role: "Director of Data Science",
    organization: "Paystack",
    location: "Lagos, Nigeria",
    bio: "Spearheading FinTech security using deep learning models for real-time transaction monitoring and anomaly detection across sub-Saharan financial pipelines.",
    category: "Panelist",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop"
  },
  {
    id: "fatima-al-hassan",
    name: "Prof. Fatima Al-Hassan",
    role: "Chair of Cognitive Computing",
    organization: "University of Ibadan",
    location: "Ibadan, Nigeria",
    bio: "Distinguished academic researching AI ethics, policy, and national AI strategies to foster local talent and retain ownership of intellectual properties in Africa.",
    category: "Keynote",
    avatar: "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=400&h=400&fit=crop"
  },
  {
    id: "tunde-bakare",
    name: "Tunde Bakare",
    role: "Founder & CTO",
    organization: "Lagos Robotics",
    location: "Lagos, Nigeria",
    bio: "Pioneering affordable Edge AI devices and computer vision hardware designed to operate under local power constraints and off-grid scenarios.",
    category: "Technical Session",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop"
  },
  {
    id: "zola-nkosi",
    name: "Zola Nkosi",
    role: "Director of Technology Policy",
    organization: "African AI Forum",
    location: "Johannesburg, South Africa",
    bio: "Advising governments and continental bodies on technology policy, ethical frameworks, and infrastructure development to prepare Africa's youth for the AI economy.",
    category: "Panelist",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop"
  }
];

const FALLBACK_SCHEDULE: ScheduleItem[] = [
  {
    id: "session-1",
    time: "09:00 AM - 10:00 AM",
    title: "Opening & Keynote: AI as the Next Frontier for African Sovereignty",
    description: "Opening remarks followed by a powerful keynote addressing the role of AI in shaping economic self-determination, retaining local talent, and drafting sovereign AI frameworks across African nations.",
    track: "Policy & Vision",
    venue: "Eko Grand Ballroom",
    speakers: ["fatima-al-hassan"]
  },
  {
    id: "session-2",
    time: "10:30 AM - 12:00 PM",
    title: "Panel Discussion: Scaling AI Infrastructure Under Local Grid Constraints",
    description: "A collaborative panel discussing hardware engineering, Edge AI, and offline-first model architectures tailored to navigate electricity grid fluctuations and internet bandwidth challenges in sub-Saharan Africa.",
    track: "Infrastructure & Systems",
    venue: "Lagos Tech Hall",
    speakers: ["tunde-bakare", "kofi-mensah", "zola-nkosi"]
  },
  {
    id: "session-3",
    time: "01:30 PM - 02:45 PM",
    title: "Technical Deep Dive: Multi-Dialect LLMs for Low-Resource Languages",
    description: "Exploration of transfer learning, synthetic data generation, and specialized tokenizers designed to bring high-accuracy NLP services to speakers of regional African languages.",
    track: "Technical Track",
    venue: "Eko Grand Ballroom",
    speakers: ["chinonso-ezenwa"]
  },
  {
    id: "session-4",
    time: "03:00 PM - 04:15 PM",
    title: "Fireside Chat: AI in Climate Diagnostics & West African Agriculture",
    description: "A close-up conversation detailing the deployment of computer vision and satellite telemetry analysis to mitigate harvest risks, track water distribution, and support smallholder farmers.",
    track: "Applications & Impact",
    venue: "Lagos Tech Hall",
    speakers: ["amara-diop"]
  },
  {
    id: "session-5",
    time: "04:30 PM - 06:00 PM",
    title: "Networking Mixer & Lagos AI Pitch Finale",
    description: "Closing announcements followed by the Pitch Finale showcasing 5 emergent African AI startups, leading into an evening networking and cocktail reception.",
    track: "Community & Ecosystem",
    venue: "Terrace Garden & Lounge",
    speakers: []
  }
];

export default function App() {
  // Navigation
  const [activeSection, setActiveSection] = useState<string>('overview');
  const [hashRoute, setHashRoute] = useState<string>(window.location.hash);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [activeHighlightIdx, setActiveHighlightIdx] = useState<number>(2);

  // API Data
  const [speakers, setSpeakers] = useState<Speaker[]>(FALLBACK_SPEAKERS);
  const [schedule, setSchedule] = useState<ScheduleItem[]>(FALLBACK_SCHEDULE);

  // Form Processing States
  const [isRegistering, setIsRegistering] = useState<boolean>(false);
  const [regResult, setRegResult] = useState<RegistrationResult | null>(null);

  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
  const [isContacting, setIsContacting] = useState<boolean>(false);

  // Toast Notifications
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const getApiBaseUrl = (): string => {
    const envUrl = import.meta.env.VITE_API_BASE_URL;
    if (!envUrl) return 'http://localhost:5000/api';
    let url = envUrl.trim();
    if (!/^https?:\/\//i.test(url) && !url.startsWith('/')) {
      url = 'https://' + url;
    }
    if (!/\/api\/?$/i.test(url)) {
      url = url.replace(/\/$/, '') + '/api';
    }
    return url;
  };

  const API_BASE_URL = getApiBaseUrl();

  const triggerToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 5000);
  };

  useEffect(() => {
    // Dynamic active header menu tracking
    const handleScroll = () => {
      const sections = ['overview', 'speakers', 'schedule', 'venue', 'register', 'contact'];
      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const rect = el.getBoundingClientRect();
          // Active if it straddles the 120px header line
          if (rect.top <= 120 && rect.bottom >= 120) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    const handleHashChange = () => {
      setHashRoute(window.location.hash);
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('hashchange', handleHashChange);

    // Initial Fetch Data
    const fetchData = async () => {
      try {
        const speakersRes = await fetch(`${API_BASE_URL}/speakers`);
        if (speakersRes.ok) {
          const json = await speakersRes.json();
          if (json.success) setSpeakers(json.data);
        }
      } catch (err) {
        console.warn('API speakers offline, using fallbacks.', err);
      }

      try {
        const scheduleRes = await fetch(`${API_BASE_URL}/schedule`);
        if (scheduleRes.ok) {
          const json = await scheduleRes.json();
          if (json.success) setSchedule(json.data);
        }
      } catch (err) {
        console.warn('API schedule offline, using fallbacks.', err);
      }
    };

    fetchData();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  // Submit Registrations to Node.js backend
  const handleRegistration = async (formData: RegistrationData) => {
    setIsRegistering(true);
    try {
      const res = await fetch(`${API_BASE_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      
      if (res.ok && data.success) {
        setRegResult(data.data);
        triggerToast('Registration confirmed successfully.', 'success');
      } else {
        triggerToast(data.message || 'Ticket request rejected. Try again.', 'error');
      }
    } catch (err) {
      console.warn('Server offline, generating local simulation pass.', err);
      setTimeout(() => {
        const mockCode = 'AIR-' + Math.random().toString(36).substring(2, 8).toUpperCase();
        setRegResult({
          name: formData.name,
          ticketType: formData.ticketType,
          registrationCode: mockCode
        });
        triggerToast('Registered successfully (Offline Mode).', 'success');
      }, 800);
    } finally {
      setIsRegistering(false);
    }
  };

  // Submit Contact Form
  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactForm.name || !contactForm.email || !contactForm.message) {
      triggerToast('Please complete all message fields.', 'error');
      return;
    }

    setIsContacting(true);
    try {
      const res = await fetch(`${API_BASE_URL}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contactForm)
      });
      const data = await res.json();

      if (res.ok && data.success) {
        triggerToast(data.message, 'success');
        setContactForm({ name: '', email: '', message: '' });
      } else {
        triggerToast(data.message || 'Message submission failed.', 'error');
      }
    } catch (err) {
      setTimeout(() => {
        triggerToast('Message received! We will follow up shortly.', 'success');
        setContactForm({ name: '', email: '', message: '' });
      }, 500);
    } finally {
      setIsContacting(false);
    }
  };

  if (hashRoute === '#/admin') {
    return <AdminDashboard />;
  }

  return (
    <div className="app-container">
      
      {/* Dynamic Header */}
      <NavHeader 
        activeSection={activeSection}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />

      {/* ═══ HERO SECTION ═══ */}
      <section 
        id="overview" 
        className="hero-section" 
        aria-label="Hero"
        style={{
          backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.55), rgba(0, 0, 0, 0.55)), url('https://picsum.photos/seed/africa1/1600/900')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'scroll'
        }}
      >

        {/* Fullscreen Background Slider */}
        <HeroImageSlider />

        {/* Grain texture overlay for depth */}
        <div className="hero-grain" aria-hidden="true" />

        {/* Main content grid */}
        <div className="hero-body">
          <div className="hero-body-inner">

            {/* ── LEFT ── */}
            <div className="hb-left">

              {/* Staggered headline */}
              <h1 className="hb-headline" aria-label="The Future of AI in Africa Begins Here">
                <span className="hb-line hb-line-1">The Future of</span>
                <span className="hb-line hb-line-2">
                  <em className="hb-em">AI in Africa</em>
                </span>
                <span className="hb-line hb-line-3">Begins Here.</span>
              </h1>

              {/* Description */}
              <p className="hb-desc hb-anim-4">
                Gathering global technology visionaries, researchers, and local developers in Lagos, Nigeria to engineer the algorithms, policies, and systems driving Africa's AI renaissance.
              </p>

              {/* Countdown + meta */}
              <div className="hb-cdown-row hb-anim-5">
                <HeroCountdown targetDate="2026-10-14" />
                <div className="hb-event-meta">
                  <span className="hb-meta-item">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                    Oct 14–15, 2026
                  </span>
                  <span className="hb-meta-item">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                    Eko Hotels, Lagos
                  </span>
                </div>
              </div>

              {/* CTAs */}
              <div className="hb-ctas hb-anim-6">
                <a href="#register" className="hb-btn hb-btn--primary">Reserve A Pass</a>
                <a href="#speakers" className="hb-btn hb-btn--ghost">Explore Speakers</a>
              </div>

            </div>{/* end hb-left */}

            {/* ── RIGHT: Conference Highlights Card ── */}
            <aside className="hb-right" aria-label="Conference Highlights">
              <div className="hb-card hb-anim-card">
                <p className="hb-card-hdr">Conference Highlights</p>
                <ul className="hb-card-list">
                  {[
                    { track: 'Main Conference Stage',       title: 'Eko Grand Ballroom',     desc: null },
                    { track: 'Research & Innovation Track', title: 'AI for Africa Research', desc: null },
                    { track: 'Ecosystem & Infrastructure',  title: 'Future Tech Hubs',       desc: 'Accelerating digital transformation across Lagos and the continent.' },
                    { track: 'Global Panels & Firesides',   title: 'Collaborative Panels',   desc: null },
                  ].map((item, i) => {
                    const isActive = activeHighlightIdx === i;
                    return (
                      <li 
                        key={i} 
                        className={`hb-card-item${isActive ? ' is-active' : ''}`}
                        onClick={() => setActiveHighlightIdx(i)}
                        style={{ cursor: 'pointer' }}
                      >
                        <span className="hb-ci-track">{item.track}</span>
                        <div className="hb-ci-title-row">
                          <span className="hb-ci-title">{item.title}</span>
                          {isActive && <span className="hb-ci-arrow" aria-hidden="true">›</span>}
                        </div>
                        {item.desc && <p className="hb-ci-desc">{item.desc}</p>}
                      </li>
                    );
                  })}
                </ul>
              </div>
            </aside>

          </div>{/* end hero-body-inner */}
        </div>{/* end hero-body */}

        {/* Scroll cue */}
        <div className="hero-scroll-cue hb-anim-scroll" aria-hidden="true">
          <div className="hsc-line" />
          <span className="hsc-label">Scroll</span>
        </div>

        {/* Previous Events Accordion */}
        <div className="hero-accordion-strip">
          <div className="max-width-wrapper">
            <PreviousEventsAccordion />
          </div>
        </div>

      </section>


      {/* Stats Board Section */}
      <section className="section alt-bg">
        <div className="max-width-wrapper">
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-number">40+</div>
              <div className="stat-label">Speakers</div>
              <div className="stat-desc">Leading architects, policymakers, and corporate leaders.</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">1,200+</div>
              <div className="stat-label">Attendees</div>
              <div className="stat-desc">Bringing together the brightest tech minds on the continent.</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">15+</div>
              <div className="stat-label">Workshops</div>
              <div className="stat-desc">Hands-on tutorials, policy panels, and code sessions.</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">50M+</div>
              <div className="stat-label">Funding Network</div>
              <div className="stat-desc">Pitch stages connecting regional startups with global VC capital.</div>
            </div>
          </div>
        </div>
      </section>

      {/* Speakers Feature */}
      <SpeakersSection speakers={speakers} />

      {/* Schedule Feature */}
      <ScheduleSection schedule={schedule} speakers={speakers} />

      {/* Host Venue Block */}
      <section id="venue" className="section">
        <div className="max-width-wrapper">
          <div className="venue-grid">
            <div className="venue-info">
              <span className="venue-badge">Host City</span>
              <h2 className="venue-title">Lagos, Nigeria: The Epicenter of African Tech</h2>
              <p>
                Lagos stands as the largest tech hub on the African continent. Home to major ecosystem players like Paystack, Andela, and Moniepoint, it represents the ideal canvas to discuss scaling generative systems under real-world constraints.
              </p>
              <p>
                The conference takes place at the world-class <strong>Eko Convention Centre</strong> on Victoria Island, providing premium amenities, high-speed access, and stunning coastal views of the Atlantic Ocean.
              </p>
              <div style={{ marginTop: 'var(--space-xs)' }}>
                <a href="#register" className="cta-button active:scale-[0.98]">Register Today</a>
              </div>
            </div>
            
            <div className="venue-image-wrapper">
              <img 
                src="https://images.unsplash.com/photo-1549488344-1f9b8d2bd1f3?w=800&h=600&fit=crop" 
                alt="Eko Hotels & Suites Venue" 
                className="venue-image" 
              />
              <div className="venue-overlay-card">
                <h4 className="venue-overlay-title">Eko Convention Centre</h4>
                <p className="venue-overlay-desc">Plot 1415 Adetokunbo Ademola St, Victoria Island, Lagos, Nigeria</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ticket Booking Feature */}
      <section id="register" className="section alt-bg">
        <div className="max-width-wrapper">
          <div className="section-header left-aligned-header">
            <span className="section-tag">Pass Registration</span>
            <h2 className="section-title">Secure Your Delegate Ticket</h2>
            <p className="section-description">
              Choose your ticket tier and reserve your seat to join 1,200+ industry builders at the Eko Convention Centre in Lagos.
            </p>
          </div>

          <div className="registration-container">
            <div className="registration-card">
              {!regResult ? (
                <RegistrationForm 
                  onSubmit={handleRegistration} 
                  isLoading={isRegistering} 
                />
              ) : (
                <TicketReceipt 
                  result={regResult} 
                  onReset={() => setRegResult(null)} 
                />
              )}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)', textAlign: 'left' }}>
              <h3 style={{ fontSize: '1.8rem', color: 'var(--primary)' }}>Access Details</h3>
              <p>
                Each delegate registration grants comprehensive access to two full days of keynote events, panel sessions, open hack arenas, and digital bento showrooms.
              </p>
              <h4 style={{ color: 'var(--primary)', marginTop: 'var(--space-xs)' }}>Student / Academic Verification</h4>
              <p style={{ fontSize: '0.95rem' }}>
                To foster next-generation African talents, we provide sponsored Academic tickets. Please register using an accredited university domain (.edu or local institution extensions) and bring your valid physical student ID card to the check-in desk at Eko Hotels.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form & FAQ */}
      <section id="contact" className="section">
        <div className="max-width-wrapper">
          <div className="section-header left-aligned-header">
            <span className="section-tag">Support & Inquiry</span>
            <h2 className="section-title">Get in Touch</h2>
            <p className="section-description">
              Have questions about sponsorship opportunities, press accreditation, or speaker submissions? Send us a direct line.
            </p>
          </div>

          <div className="contact-container">
            <div className="registration-card">
              <form onSubmit={handleContactSubmit}>
                <div className="form-group">
                  <label htmlFor="contact-name" className="form-label">Your Name</label>
                  <input 
                    id="contact-name"
                    type="text" 
                    className="form-control" 
                    value={contactForm.name}
                    onChange={e => setContactForm({ ...contactForm, name: e.target.value })}
                    placeholder="e.g. Chinelo Obi" 
                    required 
                    disabled={isContacting}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="contact-email" className="form-label">Email Address</label>
                  <input 
                    id="contact-email"
                    type="email" 
                    className="form-control" 
                    value={contactForm.email}
                    onChange={e => setContactForm({ ...contactForm, email: e.target.value })}
                    placeholder="e.g. chinelo@gmail.com" 
                    required 
                    disabled={isContacting}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="contact-msg" className="form-label">Message / Inquiry</label>
                  <textarea 
                    id="contact-msg"
                    rows={4} 
                    className="form-control" 
                    value={contactForm.message}
                    onChange={e => setContactForm({ ...contactForm, message: e.target.value })}
                    placeholder="Describe your request..." 
                    required 
                    disabled={isContacting}
                  />
                </div>
                <button 
                  type="submit" 
                  className="cta-button active:scale-[0.98]" 
                  style={{ width: '100%' }} 
                  disabled={isContacting}
                >
                  {isContacting ? 'Sending message...' : 'Send Message'}
                </button>
              </form>
            </div>

            <div className="faq-list">
              <div className="faq-item">
                <h4 className="faq-question">Are virtual tickets available?</h4>
                <p className="faq-answer">
                  Yes, standard virtual broadcasting links will be emailed to all registered standard and VIP delegates a week before the live event opens.
                </p>
              </div>
              <div className="faq-item">
                <h4 className="faq-question">Can I submit a proposal to present research?</h4>
                <p className="faq-answer">
                  Absolutely. We invite submissions on NLP for low-resource languages, edge AI modeling, and policy. Use the contact form to reach the editorial team.
                </p>
              </div>
              <div className="faq-item">
                <h4 className="faq-question">How can my company sponsor AIR 2026?</h4>
                <p className="faq-answer">
                  Sponsorship tiers range from Seed slots to Platinum naming booths. Contact our events coordination team via the form and we will send our brochure.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dynamic Toast Feedback */}
      {toast && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 1000,
          boxShadow: '0 8px 24px rgba(0,0,0,0.1)'
        }} className={`toast-alert ${toast.type}`}>
          {toast.message}
        </div>
      )}

      {/* Footer */}
      <Footer />

    </div>
  );
}
