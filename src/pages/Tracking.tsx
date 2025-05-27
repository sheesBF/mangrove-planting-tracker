import React from 'react';
import { Trees as Tree, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function Tracking() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <header className="fixed top-0 left-0 right-0 z-10 bg-gradient-to-b from-slate-900/90 to-transparent">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Tree className="h-6 w-6 text-emerald-400" />
            <h1 className="text-xl font-semibold tracking-tight">MozBlue Monitoring</h1>
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

      <div className="container mx-auto px-4 min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-12 w-full max-w-5xl">
          {/* Project 1 Button */}
          <button className="relative group overflow-hidden rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 p-6 w-64 h-48 transition-all duration-300 hover:scale-105 hover:shadow-xl">
            <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity"></div>
            <div className="relative z-10">
              <h3 className="text-2xl font-bold text-white">Project 1</h3>
              <div className="absolute bottom-6 right-6">
                <Tree className="h-8 w-8 text-white/30" />
              </div>
            </div>
          </button>

          {/* Decorative Line */}
          <div className="w-px h-12 bg-emerald-400/30"></div>

          {/* Phase Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <button className="relative group overflow-hidden rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 p-6 w-64 h-48 transition-all duration-300 hover:scale-105 hover:shadow-xl">
              <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity"></div>
              <div className="relative z-10">
                <h3 className="text-2xl font-bold text-white">Phase 1</h3>
                <div className="absolute bottom-6 right-6">
                  <Tree className="h-8 w-8 text-white/30" />
                </div>
              </div>
            </button>

            <button className="relative group overflow-hidden rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 p-6 w-64 h-48 transition-all duration-300 hover:scale-105 hover:shadow-xl">
              <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity"></div>
              <div className="relative z-10">
                <h3 className="text-2xl font-bold text-white">Phase 2</h3>
                <div className="absolute bottom-6 right-6">
                  <Tree className="h-8 w-8 text-white/30" />
                </div>
              </div>
            </button>

            <button className="relative group overflow-hidden rounded-xl bg-gradient-to-r from-purple-500 to-purple-600 p-6 w-64 h-48 transition-all duration-300 hover:scale-105 hover:shadow-xl">
              <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity"></div>
              <div className="relative z-10">
                <h3 className="text-2xl font-bold text-white">Phase 3</h3>
                <div className="absolute bottom-6 right-6">
                  <Tree className="h-8 w-8 text-white/30" />
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Tracking;