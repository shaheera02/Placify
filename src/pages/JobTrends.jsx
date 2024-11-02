import React, { useState } from 'react';
import axios from 'axios';
import '../index.css'; 

const JobTrends = () => {
  const [field, setField] = useState('');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFieldChange = (e) => {
    setField(e.target.value);
  };

  const fetchJobTrends = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.post(
        'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=YOUR_GEMINI_API_KEY',
        {
          contents: [
            {
              parts: [
                { text: `Provide job market trends and insights for the field: ${field}` }
              ]
            }
          ]
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      console.log(response.data.candidates[0].content.parts[0].text);
      if (response.data.candidates && response.data.candidates[0] && response.data.candidates[0].content && response.data.candidates[0].content.parts && response.data.candidates[0].content.parts[0]) {
        const htmlContent = markdownToHtml(response.data.candidates[0].content.parts[0].text);
        setData(htmlContent);
      } else {
        setError('Unexpected API response format');
      }
    } catch (err) {
      setError('Failed to fetch data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const markdownToHtml = (markdown) => {
    let html = markdown
      .replace(/## (.*?)\n/g, '<h3 class="custom-h3">$1</h3>') // Add custom class for <h3>
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Convert **bold** to <strong>
      .replace(/\*(.*?)\*/g, '<ul><li>$1</li></ul>') // Convert *bullet* to <ul><li>
      .replace(/<\/ul>\s*<ul>/g, '') // Remove duplicate <ul> tags caused by multiple * bullets
      .replace(/\n/g, '<br>'); // Convert newlines to <br> for formatting
    return html;
  };

  return (
    <div className="job-trends">
      <div className="text-4xl font-bold font-serif"><h1>Job Market Trends and Insights</h1></div>
      
      <input
        type="text"
        value={field}
        onChange={handleFieldChange}
        placeholder="Enter field of interest"
      />
      
      <button 
        onClick={fetchJobTrends} 
        disabled={loading} 
        className="primary-btn w-full text-center"
      >
        {loading ? 'Loading...' : 'Get Insights'}
      </button>

      {error && <div className="error">{error}</div>}

      {/* Display the insight-content only when there is data */}
      {data && (
        <div className="results">
          <div 
            className="insight-content" 
            dangerouslySetInnerHTML={{ __html: data }}
          />
        </div>
      )}
    </div>
  );
};

export default JobTrends;
