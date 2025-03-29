import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useParams } from 'react-router-dom';
import Dashboard from './Dashboard';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/:password" element={<PasswordProtect />} />
        <Route path="/test" element={<Dashboard isTest={true} />} />
        <Route path="/" element={<Navigate to="/wrong" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

// 비밀번호 확인 컴포넌트
function PasswordProtect() {
  const { password } = useParams();
  
  if (password === 'test') {
    return <Dashboard isTest={true} />;
  }
  
  return <Dashboard password={password} />;
}

export default App;