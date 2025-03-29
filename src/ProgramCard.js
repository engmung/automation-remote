import React, { useState } from 'react';
import axios from 'axios';
import './ProgramCard.css';

function ProgramCard({ program }) {
  const [status, setStatus] = useState(null); // 'success', 'error', 'loading'
  const [message, setMessage] = useState('');

  const handleExecute = async (e) => {
    // 기본 이벤트 동작 방지
    e.preventDefault();
    
    try {
      setStatus('loading');
      setMessage('실행 중...');
      
      // 원래 URL에서 HTTP 프로토콜을 사용하는지 확인
      const isHttp = program.url.startsWith('http:');
      
      let response;
      
      // HTTP URL이면 프록시 사용, HTTPS면 직접 요청
      if (isHttp) {
        // Netlify Function을 통해 프록시
        const encodedUrl = encodeURIComponent(program.url);
        const proxyUrl = `/.netlify/functions/proxy?target=${encodedUrl}`;
        
        if (program.url.includes('process-reports')) {
          response = await axios.post(proxyUrl, {});
        } else {
          response = await axios.get(proxyUrl);
        }
      } else {
        // HTTPS URL이면 직접 요청
        if (program.url.includes('process-reports')) {
          response = await axios.post(program.url, {});
        } else {
          response = await axios.get(program.url);
        }
      }
      
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