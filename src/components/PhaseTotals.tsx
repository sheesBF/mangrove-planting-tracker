import React, { useEffect, useState } from 'react';
import { supabase } from '../services/supabaseClient';

interface PhaseTotal {
  phase_name: string;
  total_actual_trees: number;
  total_actual_hectares: number;
}

const PhaseTotals: React.FC = () => {
  const [phaseTotals, setPhaseTotals] = useState<PhaseTotal[]>([]);
  const [activeTab, setActiveTab] = useState<string>('');

  useEffect(() => {
    async function fetchPhaseTotals() {
      const { data, error } = await supabase
        .from('phase_totals')
        .select('phase_name, total_actual_trees, total_actual_hectares')
        .order('phase_name');

      if (error) {
        console.error('Error fetching phase totals:', error);
        return;
      }

      if (data && data.length > 0) {
        setPhaseTotals(data);
        setActiveTab(data[0].phase_name);
      }
    }

    fetchPhaseTotals();
  }, []);

  return (
    <div className="w-full max-w-4xl mx-auto mt-8 p-6">
      <div className="mb-6 border-b border-slate-700">
        <div className="flex space-x-2">
          {phaseTotals.map((phase) => (
            <button
              key={phase.phase_name}
              onClick={() => setActiveTab(phase.phase_name)}
              className={`px-6 py-3 text-sm font-medium rounded-t-lg transition-colors ${
                activeTab === phase.phase_name
                  ? 'bg-emerald-500 text-white'
                  : 'text-white/70 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              {phase.phase_name}
            </button>
          ))}
        </div>
      </div>

      {phaseTotals.map((phase) => (
        <div
          key={phase.phase_name}
          className={`space-y-6 ${activeTab === phase.phase_name ? 'block' : 'hidden'}`}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-800/50 rounded-xl p-6 backdrop-blur-sm">
              <h3 className="text-lg font-medium text-white/80 mb-2">Total Trees Planted</h3>
              <p className="text-4xl font-bold text-emerald-400">
                {phase.total_actual_trees.toLocaleString()}
              </p>
            </div>
            <div className="bg-slate-800/50 rounded-xl p-6 backdrop-blur-sm">
              <h3 className="text-lg font-medium text-white/80 mb-2">Total Hectares Covered</h3>
              <p className="text-4xl font-bold text-emerald-400">
                {phase.total_actual_hectares.toLocaleString()} ha
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PhaseTotals;