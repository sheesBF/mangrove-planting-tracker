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
        <main>
          <Hero />
          <div className="container mx-auto px-4 py-12">
            <PhaseTotals />
          </div>
        </main>
      </div>
    </Router>
  );
}

export default App;