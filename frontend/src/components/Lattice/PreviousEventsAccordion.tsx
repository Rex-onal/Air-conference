import React, { useState } from 'react';

interface EventHighlight {
  year: string;
  location: string;
  theme: string;
  details: string;
  image: string;
}

const PAST_EVENTS: EventHighlight[] = [
  {
    year: "AIR 2025",
    location: "Lagos, Nigeria",
    theme: "NLP Sovereignty & Regional African Dialects",
    details: "Assembled 800+ core developers to establish local synthetic corpus engines and open-source Yoruba, Igbo, and Hausa tokenization standards.",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=600&fit=crop"
  },
  {
    year: "AIR 2024",
    location: "Nairobi, Kenya",
    theme: "Edge Computing & Off-Grid Telemetry Deployments",
    details: "Explored low-power hardware engineering, Edge AI models, and satellite telemetry integrations to empower smallholder agricultural diagnostics.",
    image: "https://images.unsplash.com/photo-1591115765373-5209768a7f41?w=800&h=600&fit=crop"
  },
  {
    year: "AIR 2023",
    location: "Cape Town, South Africa",
    theme: "Autonomous Systems & Financial Machine Learning",
    details: "Investigated quantitative market modeling, automated fraud detection, and regulatory policy structures for digital transactions in Africa.",
    image: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&h=600&fit=crop"
  }
];

export const PreviousEventsAccordion: React.FC = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number>(0);

  return (
    <div className="past-events-wrapper">
      <h3 className="past-events-header">Retrospective: Past Gatherings</h3>
      <div className="previous-events-accordion">
        {PAST_EVENTS.map((event, idx) => {
          const isActive = hoveredIndex === idx;
          return (
            <div 
              key={event.year}
              className={`accordion-panel ${isActive ? 'active' : ''}`}
              onMouseEnter={() => setHoveredIndex(idx)}
              onClick={() => setHoveredIndex(idx)}
              style={{ backgroundImage: `url(${event.image})` }}
            >
              <div className="panel-overlay"></div>
              
              <div className="panel-content">
                <div className="panel-meta">
                  <span className="panel-year">{event.year}</span>
                  <span className="panel-dot">•</span>
                  <span className="panel-location">{event.location}</span>
                </div>
                
                <div className="panel-details">
                  <h4 className="panel-theme">{event.theme}</h4>
                  <p className="panel-desc">{event.details}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PreviousEventsAccordion;
