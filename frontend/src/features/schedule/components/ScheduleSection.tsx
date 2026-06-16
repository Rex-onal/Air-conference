import React from 'react';
import type { ScheduleItem } from '../types';
import type { Speaker } from '../../speakers/types';
import { ScheduleCard } from './ScheduleCard';

interface ScheduleSectionProps {
  schedule: ScheduleItem[];
  speakers: Speaker[];
}

export const ScheduleSection: React.FC<ScheduleSectionProps> = ({ schedule, speakers }) => {
  return (
    <section id="schedule" className="section schedule-section alt-bg">
      <div className="max-width-wrapper">
        <div className="section-header left-aligned-header">
          <span className="section-tag">Detailed Agenda</span>
          <h2 className="section-title">AIR 2026 Core Timeline</h2>
          <p className="section-description">
            Follow our interactive event tracks covering technology infrastructure, cognitive policy, financial machine learning, and ecological intelligence.
          </p>
        </div>

        <div className="schedule-editorial-list">
          {schedule.map(session => {
            // Find corresponding speakers for this session
            const sessionSpeakers = session.speakers
              .map(spId => speakers.find(s => s.id === spId))
              .filter((sp): sp is Speaker => !!sp);

            return (
              <ScheduleCard 
                key={session.id} 
                session={session} 
                sessionSpeakers={sessionSpeakers} 
              />
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ScheduleSection;
