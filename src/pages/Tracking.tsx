import React from 'react';
import { Trees as Tree, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function Tracking() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-10 bg-gradient-to-b from-slate-900/90 to-transparent">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Tree className="h-6 w-6 text-emerald-400" />
            <h1 className="text-xl font-semibold tracking-tight">Mangrove Planting Tracker</h1>
          </div>
          <button
            onClick={() => navigate('/')}
            className="flex items-center space-x-2 text-emerald-400 hover:text-emerald-300 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Home</span>
          </button>
        </div>
      </header>

      {/* Centered Phase buttons */}
      <div className="flex items-center justify-center min-h-screen pt-20">
        <div className="flex flex-col md:flex-row gap-6">
          {[1, 2, 3].map((num) => (
            <button
              key={num}
              onClick={() => navigate(`/phase/${num}`)}
              className="w-48 h-20 text-2xl font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105"
            >
              Phase {num}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Tracking;
