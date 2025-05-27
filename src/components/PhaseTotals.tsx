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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchPhaseTotals() {
      try {
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
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchPhaseTotals();
  }, []);

  if (isLoading) {
    return (
      <div className="bg-slate-800 rounded-xl p-8 shadow-lg">
        <div className="animate-pulse flex space-x-4">
          <div className="flex-1 space-y-4">
            <div className="h-4 bg-slate-700 rounded w-3/4"></div>
            <div className="space-y-3">
              <div className="h-4 bg-slate-700 rounded"></div>
              <div className="h-4 bg-slate-700 rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-800 rounded-xl shadow-lg">
      <div className="border-b border-slate-700">
        <div className="flex">
          {phaseTotals.map((phase) => (
            <button
              key={phase.phase_name}
              onClick={() => setActiveTab(phase.phase_name)}
              className={`px-8 py-4 text-sm font-medium transition-colors relative ${
                activeTab === phase.phase_name
                  ? 'text-emerald-400'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {phase.phase_name}
              {activeTab === phase.phase_name && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-400"></div>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="p-8">
        {phaseTotals.map((phase) => (
          <div
            key={phase.phase_name}
            className={`space-y-8 ${activeTab === phase.phase_name ? 'block' : 'hidden'}`}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-slate-700/30 rounded-lg p-6 backdrop-blur-sm">
                <h3 className="text-lg font-medium text-slate-300 mb-2">Total Trees Planted</h3>
                <p className="text-4xl font-bold text-emerald-400">
                  {phase.total_actual_trees.toLocaleString()}
                </p>
              </div>
              <div className="bg-slate-700/30 rounded-lg p-6 backdrop-blur-sm">
                <h3 className="text-lg font-medium text-slate-300 mb-2">Total Hectares Covered</h3>
                <p className="text-4xl font-bold text-emerald-400">
                  {phase.total_actual_hectares.toLocaleString()} ha
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PhaseTotals;