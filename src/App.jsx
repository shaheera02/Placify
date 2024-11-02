// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./HomePage";
import About from "./pages/About";
// import Services from "./pages/Services";
import Chatbot from "./pages/Chatbot";
import ResumeBuilder from "./pages/ResumeBuilder";
import JobTrends from "./pages/JobTrends";
// import Contact from "./pages/Contact";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<About />} />
        {/* <Route path="/services" element={<Services />} /> */}
        <Route path="/chatbot" element={<Chatbot />} />
        <Route path="/resume" element={<ResumeBuilder />} />
        <Route path="/job" element={<JobTrends />} />
        {/* <Route path="/contact" element={<Contact />} /> */}
      </Routes>
    </Router>
  );
};

export default App;
