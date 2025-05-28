import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Hero from './components/Hero';
import Tracking from './pages/Tracking';
import Phase1MonthlyData from './pages/Phase1MonthlyData';
import Phase2MonthlyData from './pages/Phase2MonthlyData';
import Phase3MonthlyData from './pages/Phase3MonthlyData';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={
          <div className="min-h-screen bg-slate-900 text-white">
            <Header />
            <Hero />
          </div>
        } />
        <Route path="/tracking" element={<Tracking />} />
        <Route path="/phase/1" element={<Phase1MonthlyData />} />
        <Route path="/phase/2" element={<Phase2MonthlyData />} />
        <Route path="/phase/3" element={<Phase3MonthlyData />} />
      </Routes>
    </Router>
  );
}

export default App;
