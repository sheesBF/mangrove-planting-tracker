import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Hero from './components/Hero';
import testConnection from './services/testConnection';

function App() {
  useEffect(() => {
    testConnection();
  }, []);

  return (
    <Router>
      <Header />
      <Hero />
    </Router>
  );
}

export default App;