import React from 'react';
import type { ScheduleItem } from '../types';
import type { Speaker } from '../../speakers/types';

interface ScheduleCardProps {
  session: ScheduleItem;
  sessionSpeakers: Speaker[];
}

export const ScheduleCard: React.FC<ScheduleCardProps> = ({ session, sessionSpeakers }) => {
  return (
    <div className="schedule-row">
      <div className="schedule-time-pane">
        <span className="schedule-time-text">{session.time}</span>
        <span className="schedule-track-badge">{session.track}</span>
      </div>
      <div className="schedule-details-pane">
        <div>
          <h3 className="schedule-row-title">{session.title}</h3>
          <p className="schedule-row-desc">{session.description}</p>
        </div>
        <div className="schedule-row-footer">
          <span className="schedule-row-venue">
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {session.venue}
          </span>
          
          {sessionSpeakers.length > 0 && (
            <div className="schedule-speaker-list">
              {sessionSpeakers.map(sp => (
                <img 
                  key={sp.id}
                  src={sp.avatar} 
                  alt={sp.name} 
                  title={`${sp.name} (${sp.role})`}
                  className="schedule-speaker-img" 
                  loading="lazy"
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ScheduleCard;
