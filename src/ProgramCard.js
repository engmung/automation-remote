import React from 'react';
import './ProgramCard.css';

function ProgramCard({ program }) {
  const handleExecute = () => {
    // 새 탭에서 URL 열기
    window.open(program.url, '_blank');
  };

  return (
    <div className="program-card">
      <h2>{program.name}</h2>
      <p>{program.description}</p>
      <button onClick={handleExecute}>실행</button>
    </div>
  );
}

export default ProgramCard;