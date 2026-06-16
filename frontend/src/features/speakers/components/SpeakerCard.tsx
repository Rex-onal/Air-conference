import React from 'react';
import type { Speaker } from '../types';

interface SpeakerCardProps {
  speaker: Speaker;
}

export const SpeakerCard: React.FC<SpeakerCardProps> = ({ speaker }) => {
  return (
    <div className="speaker-card">
      <div className="speaker-image-container">
        <span className="speaker-tag">{speaker.category}</span>
        <img 
          src={speaker.avatar} 
          alt={speaker.name} 
          className="speaker-image" 
          loading="lazy" 
        />
      </div>
      <div className="speaker-info">
        <h3 className="speaker-name">{speaker.name}</h3>
        <div className="speaker-role">
          {speaker.role} <span className="role-at">at</span> {speaker.organization}
        </div>
        <div className="speaker-location">{speaker.location}</div>
        <p className="speaker-bio">{speaker.bio}</p>
        
        <div className="speaker-socials">
          {speaker.linkedin && (
            <a 
              href={speaker.linkedin} 
              className="speaker-social-link" 
              target="_blank" 
              rel="noopener noreferrer"
              aria-label={`${speaker.name} LinkedIn`}
            >
              <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
              </svg>
            </a>
          )}
          {speaker.twitter && (
            <a 
              href={speaker.twitter} 
              className="speaker-social-link" 
              target="_blank" 
              rel="noopener noreferrer"
              aria-label={`${speaker.name} Twitter`}
            >
              <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
              </svg>
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default SpeakerCard;
