import React from 'react';

export const LatticeBackground: React.FC = React.memo(() => {
  return (
    <div className="lattice-background">
      <div className="lattice-grid">
        <div className="lattice-cell"><div className="lattice-node"></div></div>
        <div className="lattice-cell"><div className="lattice-node accent"></div></div>
        <div className="lattice-cell"></div>
        <div className="lattice-cell"><div className="lattice-node"></div></div>
        <div className="lattice-cell"></div>
        <div className="lattice-cell"><div className="lattice-node"></div></div>
        
        <div className="lattice-cell"></div>
        <div className="lattice-cell">
          <div className="lattice-node"></div>
          <div className="lattice-line animate-pulse" style={{ width: '200px', transform: 'rotate(45deg)' }}></div>
        </div>
        <div className="lattice-cell"><div className="lattice-node accent"></div></div>
        <div className="lattice-cell"></div>
        <div className="lattice-cell"><div className="lattice-node"></div></div>
        <div className="lattice-cell"></div>

        <div className="lattice-cell"><div className="lattice-node"></div></div>
        <div className="lattice-cell"></div>
        <div className="lattice-cell">
          <div className="lattice-node"></div>
          <div className="lattice-line animate-pulse" style={{ width: '180px', transform: 'rotate(-30deg)' }}></div>
        </div>
        <div className="lattice-cell"><div className="lattice-node accent"></div></div>
        <div className="lattice-cell"></div>
        <div className="lattice-cell"><div className="lattice-node"></div></div>

        <div className="lattice-cell"></div>
        <div className="lattice-cell"><div className="lattice-node"></div></div>
        <div className="lattice-cell"></div>
        <div className="lattice-cell"><div className="lattice-node"></div></div>
        <div className="lattice-cell"><div className="lattice-node accent"></div></div>
        <div className="lattice-cell"></div>

        <div className="lattice-cell"><div className="lattice-node accent"></div></div>
        <div className="lattice-cell"></div>
        <div className="lattice-cell"><div className="lattice-node"></div></div>
        <div className="lattice-cell"></div>
        <div className="lattice-cell"><div className="lattice-node"></div></div>
        <div className="lattice-cell"><div className="lattice-node"></div></div>
      </div>
    </div>
  );
});

LatticeBackground.displayName = 'LatticeBackground';

export default LatticeBackground;
