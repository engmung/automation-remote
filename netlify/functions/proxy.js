// netlify/functions/proxy.js
const axios = require('axios');

exports.handler = async function(event, context) {
  // CORS 헤더 설정
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS"
  };
  
  // OPTIONS 요청 처리 (CORS preflight)
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }
  
  try {
    // 프록시할 API URL 파라미터에서 가져오기
    const target = event.queryStringParameters.target;
    
    if (!target) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: "target 파라미터가 필요합니다." })
      };
    }
    
    // API 호출 (event.body가 있으면 POST 데이터로 전달)
    const method = event.httpMethod.toLowerCase();
    const response = await axios({
      method,
      url: target,
      data: method === 'post' ? JSON.parse(event.body || '{}') : undefined
    });
    
    // 결과 반환
    return {
      statusCode: response.status,
      headers,
      body: JSON.stringify(response.data)
    };
  } catch (error) {
    console.log("Error proxying request:", error);
    
    return {
      statusCode: error.response?.status || 500,
      headers,
      body: JSON.stringify({
        error: "프록시 요청 실패",
        details: error.message
      })
    };
  }
};