import React, { useState } from 'react';
import axios from 'axios';
import './ProgramCard.css';

function ProgramCard({ program }) {
  const [status, setStatus] = useState(null); // 'success', 'error', 'loading'
  const [message, setMessage] = useState('');

  const handleExecute = async (e) => {
    // 기본 이벤트 동작 방지 (중요: 이것이 새 창 열림을 방지합니다)
    e.preventDefault();
    
    try {
      setStatus('loading');
      setMessage('실행 중...');
      
      // API 호출 (POST 메서드 사용)
      const response = await axios.post(program.url, {});
      console.log('API 응답:', response.data);
      
      // 성공 시
      setStatus('success');
      setMessage('성공적으로 실행되었습니다!');
      
      // 3초 후 메시지 초기화
      setTimeout(() => {
        setStatus(null);
        setMessage('');
      }, 3000);
      
    } catch (error) {
      // 실패 시
      setStatus('error');
      setMessage('실행 중 오류가 발생했습니다');
      console.error('API 오류:', error);
      
      // 5초 후 메시지 초기화
      setTimeout(() => {
        setStatus(null);
        setMessage('');
      }, 5000);
    }
  };

  return (
    <div className="program-card">
      <h2>{program.name}</h2>
      <p>{program.description}</p>
      <div className="button-container">
        <button 
          onClick={handleExecute}
          disabled={status === 'loading'}
          className={status === 'loading' ? 'loading-button' : ''}
        >
          {status === 'loading' ? '실행 중...' : '실행'}
        </button>
        
        {status && (
          <div className={`status-message ${status}`}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
}

export default ProgramCard;