import React, { useEffect, useState } from 'react';

function News() {
  const [news, setNews] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5001/api/news')
      .then(response => response.json())
      .then(data => setNews(data))
      .catch(error => console.error('Error:', error));
  }, []);

  return (
    <div>
      <h1>Actualités</h1>
      <ul>
        {news.map((item, index) => (
          <li key={index}>{item.title}</li>
        ))}
      </ul>
    </div>
  );
}

export default News;
