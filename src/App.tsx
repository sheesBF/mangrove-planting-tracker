import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Tracking from './pages/Tracking';
import ProjectDetails from './pages/ProjectDetails';
import PhaseDetails from './pages/PhaseDetails';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/tracking" element={<Tracking />} />
        <Route path="/project/1" element={<ProjectDetails />} />
        <Route path="/phase/:id" element={<PhaseDetails />} />
      </Routes>
    </Router>
  );
}

export default App;