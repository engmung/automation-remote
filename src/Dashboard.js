import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProgramCard from './ProgramCard';
import './Dashboard.css';

function Dashboard({ password, isTest = false }) {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 테스트 모드일 경우 더미 데이터 사용
        if (isTest) {
          const dummyData = [
            {
              id: 'dummy1',
              name: '배경화면 변경기',
              description: '윈도우 배경화면을 랜덤하게 변경합니다.',
              url: 'https://example.com/wallpaper'
            },
            {
              id: 'dummy2',
              name: '메모 정리 도구',
              description: '흩어진 메모를 카테고리별로 정리합니다.',
              url: 'https://example.com/memo'
            },
            {
              id: 'dummy3',
              name: '일정 알림',
              description: '등록된 일정을 알려주는 프로그램입니다.',
              url: 'https://example.com/schedule'
            },
            {
              id: 'dummy4',
              name: '파일 백업',
              description: '지정된 폴더의 파일을 자동으로 백업합니다.',
              url: 'https://example.com/backup'
            },
            {
              id: 'dummy5',
              name: '이메일 체커',
              description: '새로운 이메일을 확인하고 알려줍니다.',
              url: 'https://example.com/email'
            }
          ];
          setPrograms(dummyData);
          setLoading(false);
          return;
        }

        // 실제 API 호출 (Netlify Function 사용)
        const response = await axios.get(`/.netlify/functions/notion-api?password=${password}`);
        setPrograms(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("데이터를 불러오는데 실패했습니다.");
        setLoading(false);
      }
    };

    fetchData();
  }, [isTest, password]);

  if (loading) return <div className="loading">로딩 중...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="dashboard">
      <h1>자동화 프로그램 리모컨</h1>
      {isTest && (
        <div className="test-banner">테스트 모드 - 더미 데이터 사용 중</div>
      )}
      <div className="card-container">
        {programs.map(program => (
          <ProgramCard key={program.id} program={program} />
        ))}
      </div>
    </div>
  );
}

export default Dashboard;