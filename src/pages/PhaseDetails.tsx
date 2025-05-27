import React from 'react';
import { Trees as Tree, ArrowLeft } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

function PhaseDetails() {
  const navigate = useNavigate();
  const { id } = useParams();

  const phaseData = {
    1: { trees: 5000, hectares: 4.2 },
    2: { trees: 6000, hectares: 5.0 },
    3: { trees: 4000, hectares: 3.3 },
  }[id as string] || { trees: 0, hectares: 0 };

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <header className="fixed top-0 left-0 right-0 z-10 bg-gradient-to-b from-slate-900/90 to-transparent">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Tree className="h-6 w-6 text-emerald-400" />
            <h1 className="text-xl font-semibold tracking-tight">Phase {id} Details</h1>
          </div>
          <button
            onClick={() => navigate('/tracking')}
            className="flex items-center space-x-2 text-emerald-400 hover:text-emerald-300 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Tracking</span>
          </button>
        </div>
      </header>

      <div className="container mx-auto px-4 pt-24">
        <div className="bg-slate-800/50 rounded-xl p-6 backdrop-blur-sm border border-slate-700/50">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-700/30 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-2">Trees Planted</h3>
              <p className="text-4xl font-bold text-emerald-400">{phaseData.trees.toLocaleString()}</p>
            </div>
            <div className="bg-slate-700/30 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-2">Hectares Covered</h3>
              <p className="text-4xl font-bold text-emerald-400">{phaseData.hectares.toLocaleString()} ha</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PhaseDetails;