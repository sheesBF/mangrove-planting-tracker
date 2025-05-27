import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Hero from './components/Hero';
import PhaseTotals from './components/PhaseTotals';
import testConnection from './services/testConnection';

function App() {
  useEffect(() => {
    testConnection();
  }, []);

  return (
    <Router>
      <div className="min-h-screen bg-slate-900 text-white">
        <Header />
        <Hero />
        <PhaseTotals />
      </div>
    </Router>
  );
}

export default App;