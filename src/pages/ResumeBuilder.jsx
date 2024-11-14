import React, { useState } from 'react';
import axios from 'axios';
import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist';
import '../index.css';

GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@3.4.120/build/pdf.worker.min.js`;

const extractTextFromPDF = async (file) => {
  const pdfUrl = URL.createObjectURL(file);
  const pdf = await getDocument(pdfUrl).promise;
  let text = '';

  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const content = await page.getTextContent();
    text += content.items.map(item => item.str).join(' ') + ' ';
  }

  URL.revokeObjectURL(pdfUrl);
  return text;
};

const ResumeBuilder = () => {
  const [pdfFile, setPdfFile] = useState(null);
  const [role, setRole] = useState('');
  const [resumeContent, setResumeContent] = useState('');
  const [error, setError] = useState('');
  const [analysisGenerated, setAnalysisGenerated] = useState(false);

  const handleFileChange = (event) => {
    setPdfFile(event.target.files[0]);
  };

  const handleRoleChange = (event) => {
    setRole(event.target.value);
  };

  const handleGenerateResume = async () => {
    if (!pdfFile) {
      setError('Please upload a PDF file.');
      return;
    }

    try {
      const extractedText = await extractTextFromPDF(pdfFile);

      const inputText = `
        **Extracted Resume Text:**
        ${extractedText}
        
        **Role Looking For:**
        ${role}

        As an advanced ATS scanner with knowledge of data science and ATS functionality, assess the resume for relevance to the specified role.
        
        **Analysis Structure**:
        - **ATS Score**: A numeric percentage indicating the match between the resume and the role.
        - **Strengths**: Key strengths based on skills, experience, and achievements.
        - **Areas for Improvement**: Specific areas where the resume could be strengthened to match the role better.
        - **Recommendations**: Tailored suggestions to improve the resume's alignment with the desired role.
        - **Missing Keywords**: List of relevant keywords that were missing in the resume but are crucial for this role.
        - **Final Thoughts**: Overall assessment and any additional feedback.
        
        Format each section with bold, large headings, and use bullet points or concise sentences where necessary.
      `;

      const response = await axios.post(
        'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=YOUR_GEMINI_API_KEY',
        {
          contents: [
            {
              parts: [{ text: inputText }]
            }
          ]
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.candidates?.[0]?.content?.parts?.[0]?.text) {
        const htmlContent = markdownToHtml(response.data.candidates[0].content.parts[0].text);
        setResumeContent(htmlContent);
        setAnalysisGenerated(true);
      } else {
        setError('Unexpected API response format');
        setAnalysisGenerated(false);
      }
    } catch (error) {
      setError('Error generating resume. Please try again.');
      setAnalysisGenerated(false);
    }
  };

  const markdownToHtml = (markdown) => {
    let html = markdown
      .replace(/## (.*?)\n/g, '<h3 class="custom-h3">$1</h3>') // Format headers
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Bold formatting for strong emphasis
      .replace(/\*(.*?)\*/g, '<ul><li>$1</li></ul>') // Bullet points for each * item
      .replace(/<\/ul>\s*<ul>/g, '') // Clean up multiple bullet lists
      .replace(/\n/g, '<br>'); // Line breaks for paragraph spacing
    return html;
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center justify-center h-20 mb-6">
        <h1 className="text-4xl font-bold font-serif">Resume Analyzer</h1>
      </div>
      <form onSubmit={(e) => { e.preventDefault(); handleGenerateResume(); }} className="space-y-4">
        <div>
          <label className="text-2xl font-bold font-serif">Upload Resume (PDF):</label>
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            className="block w-full mt-1 border border-gray-300 px-3 py-2 rounded"
            required
          />
        </div>
        <div>
          <label className="text-2xl font-bold font-serif">Role Looking For:</label>
          <input
            type="text"
            value={role}
            onChange={handleRoleChange}
            className="block w-full mt-1 border border-gray-300 px-3 py-2 rounded"
            required
          />
        </div>
        <button type="submit" className="primary-btn w-full text-center">Generate Analysis</button>
      </form>
      {error && <div className="text-red-500 text-center mt-4">{error}</div>}
      {analysisGenerated && (
        <div className="mt-6">
          <h2 className="text-2xl font-bold font-serif">Analysis</h2>
          <div className="resume-content border border-gray-400 p-4 mt-2" dangerouslySetInnerHTML={{ __html: resumeContent }} />
        </div>
      )}
    </div>
  );
};

export default ResumeBuilder;
