// netlify/functions/notion-api.js
const axios = require('axios');

exports.handler = async function(event, context) {
  // 환경 변수에서 설정값 가져오기
  const VALID_PASSWORD = process.env.APP_PASSWORD;
  const NOTION_API_KEY = process.env.NOTION_API_KEY;
  const DATABASE_ID = process.env.NOTION_DATABASE_ID;
  
  // 간단한 비밀번호 체크 (URL에서 비밀번호 파라미터 확인)
  const password = event.queryStringParameters.password;
  
  if (password !== VALID_PASSWORD) {
    return {
      statusCode: 403,
      body: JSON.stringify({ error: "접근 권한이 없습니다." })
    };
  }
  
  try {
    const response = await axios.post(
      `https://api.notion.com/v1/databases/${DATABASE_ID}/query`,
      {},
      {
        headers: {
          'Authorization': `Bearer ${NOTION_API_KEY}`,
          'Notion-Version': '2022-06-28',
          'Content-Type': 'application/json'
        }
      }
    );
    
    // 노션 응답 데이터 파싱
    const results = response.data.results.map(item => {
      return {
        id: item.id,
        name: item.properties.이름?.title[0]?.plain_text || "이름 없음",
        description: item.properties.기능설명?.rich_text[0]?.plain_text || "설명 없음", 
        url: item.properties.URL?.url || "#"
      };
    });
    
    return {
      statusCode: 200,
      body: JSON.stringify(results)
    };
  } catch (error) {
    console.log("Error fetching data from Notion:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "데이터를 불러오는데 실패했습니다." })
    };
  }
};