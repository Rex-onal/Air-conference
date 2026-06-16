import React, { useState, useMemo, useCallback } from 'react';
import type { Speaker } from '../types';
import { SpeakerCard } from './SpeakerCard';

interface SpeakersSectionProps {
  speakers: Speaker[];
}

export const SpeakersSection: React.FC<SpeakersSectionProps> = ({ speakers }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  
  const categories = useMemo(() => ['All', 'Keynote', 'Technical Session', 'Panelist'], []);

  const handleCategorySelect = useCallback((cat: string) => {
    setSelectedCategory(cat);
  }, []);

  const filteredSpeakers = useMemo(() => {
    return speakers.filter(s => 
      selectedCategory === 'All' ? true : s.category === selectedCategory
    );
  }, [speakers, selectedCategory]);

  return (
    <section id="speakers" className="section speakers-section">
      <div className="max-width-wrapper">
        <div className="section-header left-aligned-header">
          <span className="section-tag">Keynote & Panelists</span>
          <h2 className="section-title">The Voices of African Intelligence</h2>
          <p className="section-description">
            Meet the researchers, tech architects, and public planners shaping language modeling, infrastructure frameworks, and AI ethics for Africa's digital expansion.
          </p>
        </div>

        <div className="filter-tabs-container">
          <div className="filter-tabs">
            {categories.map(cat => (
              <button 
                key={cat} 
                className={`filter-tab ${selectedCategory === cat ? 'active' : ''}`}
                onClick={() => handleCategorySelect(cat)}
                type="button"
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {filteredSpeakers.length > 0 ? (
          <div className="speakers-asymmetric-grid">
            {filteredSpeakers.map((speaker, index) => (
              <div 
                key={speaker.id} 
                className={`speaker-grid-item ${index % 2 === 1 ? 'offset-down' : ''}`}
                style={{ '--index': index } as React.CSSProperties}
              >
                <SpeakerCard speaker={speaker} />
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <p>No speakers found in this category.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default SpeakersSection;
